
import { Entity, EntityType, ModifierType, ActiveSummon } from '../types';
import { evaluateFormula } from './engine';
import { STATS } from './constants';

/**
 * Génère les entités virtuelles pour les améliorations d'armes (Forge).
 * REMPLACE l'arme dans le slot, ne l'ajoute pas en doublon.
 */
export const processWeaponUpgrades = (entities: Entity[], safeContext: any, preCalcContext: any): { entities: Entity[], virtualIds: string[] } => {
    const generatedEntities: Entity[] = [];
    const virtualIds: string[] = []; // On laisse vide car on remplace les slots

    if (safeContext.weaponSlots) {
        safeContext.weaponSlots.forEach((itemId: string, idx: number) => {
            if (!itemId) return;
            const upgradeLevelDmg = Number(safeContext.weaponUpgrades?.[idx] || 0);
            const upgradeLevelVit = Number(safeContext.weaponUpgradesVit?.[idx] || 0);

            if (upgradeLevelDmg > 0 || upgradeLevelVit > 0) {
                const baseItem = entities.find(e => e.id === itemId);
                if (baseItem) {
                    const uniqueId = `${baseItem.id}_upgraded_slot_${idx}`;
                    const upgradedEntity: Entity = {
                        ...baseItem,
                        id: uniqueId,
                        name: `${baseItem.name} ${upgradeLevelDmg > 0 ? `(+${upgradeLevelDmg} DMG)` : ''} ${upgradeLevelVit > 0 ? `(+${upgradeLevelVit} VIT)` : ''}`,
                        modifiers: [...baseItem.modifiers] // Shallow copy first
                    };

                    // Helper to modify or add mod
                    const upsertMod = (targetStat: string, bonus: number) => {
                        let modFound = false;
                        upgradedEntity.modifiers = upgradedEntity.modifiers.map(m => {
                            if (!modFound && m.targetStatKey === targetStat && m.type === ModifierType.FLAT) {
                                modFound = true;
                                const multPattern = /^(\d+)\s*\*\s*([a-zA-Z_0-9]+)$/;
                                const match = m.value.match(multPattern);
                                let newValue = `(${m.value} + ${bonus})`;
                                if (match) {
                                    newValue = `(${match[1]} + ${bonus}) * ${match[2]}`;
                                }
                                return { ...m, value: newValue };
                            }
                            return m;
                        });
                        
                        if (!modFound) {
                            upgradedEntity.modifiers.push({ 
                                id: `auto_upgrade_${targetStat}_${idx}`, 
                                type: ModifierType.FLAT, 
                                targetStatKey: targetStat, 
                                value: bonus.toString() 
                            });
                        }
                    };

                    // Apply DMG Upgrade
                    if (upgradeLevelDmg > 0) {
                        let targetStat = STATS.DMG;
                        let bonus = 50 * upgradeLevelDmg;
                        if (baseItem.subCategory === 'Anneaux') { targetStat = STATS.VIT; bonus = 50 * upgradeLevelDmg; }
                        else if (baseItem.subCategory === 'Gantelets') { targetStat = STATS.ABSORPTION; bonus = 2 * upgradeLevelDmg; }
                        upsertMod(targetStat, bonus);
                    }

                    // Apply VIT Upgrade
                    if (upgradeLevelVit > 0) {
                        upsertMod(STATS.VIT, 50 * upgradeLevelVit);
                    }

                    generatedEntities.push(upgradedEntity);
                    
                    // IMPORTANT: On remplace l'ID dans le slot d'arme
                    if (safeContext.weaponSlots[idx] === itemId) {
                        safeContext.weaponSlots[idx] = uniqueId;
                    }
                    // NOTE: On ne push PAS dans virtualIds pour éviter le double compte
                }
            }
        });
    }
    return { entities: generatedEntities, virtualIds };
};

/**
 * Génère les entités virtuelles pour la spécialisation Force Naturelle.
 * AJOUTE un Buff (pas de remplacement), donc on utilise virtualIds.
 */
export const processForceNaturelle = (entities: Entity[], safeContext: any, preCalcContext: any): { entities: Entity[], virtualIds: string[] } => {
    const generatedEntities: Entity[] = [];
    const virtualIds: string[] = [];

    if (safeContext.specializationId === 'spec_force_naturelle' && safeContext.naturalStrengthAllocation) {
        safeContext.naturalStrengthAllocation.forEach((slotId: string) => {
            let itemId: string | undefined;
            if (slotId.startsWith('weapon_')) {
                const idx = parseInt(slotId.split('_')[1]);
                itemId = safeContext.weaponSlots[idx]; // Prend l'ID potentiellement déjà remplacé par processWeaponUpgrades
            } else {
                itemId = safeContext.equippedItems[slotId];
            }

            if (itemId) {
                // On cherche dans la liste complète (y compris les items générés précédemment)
                const item = entities.find(e => e.id === itemId) || generatedEntities.find(e => e.id === itemId);
                
                if (item) {
                    let spdSum = 0;
                    (item.modifiers || []).forEach(m => {
                        if (m.targetStatKey === STATS.SPD && m.type === ModifierType.FLAT) {
                            spdSum += evaluateFormula(m.value, preCalcContext as any);
                        }
                    });

                    if (spdSum < 0) {
                        const refundVal = Math.abs(spdSum);
                        const virtualId = `fn_refund_${slotId}`;
                        generatedEntities.push({
                            id: virtualId,
                            type: EntityType.BUFF,
                            name: `Force Naturelle (${item.name})`,
                            modifiers: [{
                                id: `mod_fn_${slotId}`,
                                type: ModifierType.FLAT,
                                targetStatKey: STATS.SPD,
                                value: refundVal.toString(),
                                name: 'Compensation Poids'
                            }]
                        });
                        // ICI on ajoute à virtualIds car c'est un Buff additionnel
                        virtualIds.push(virtualId);
                    }
                }
            }
        });
    }

    return { entities: generatedEntities, virtualIds };
};

/**
 * Génère des versions boostées (+50%) des Montures/Familiers si le Pendentif zéphyrien est équipé.
 * REMPLACE l'item dans le slot, ne l'ajoute pas en doublon.
 */
export const processMountBoost = (entities: Entity[], safeContext: any, preCalcContext: any): { entities: Entity[], virtualIds: string[] } => {
    const generatedEntities: Entity[] = [];
    const virtualIds: string[] = []; // On laisse vide car on remplace les slots

    // Check if Pendant is equipped (in specialItems bag)
    const hasPendant = safeContext.specialItems?.includes('pendentif_zephyrien');
    
    if (hasPendant) {
        // Slots that can contain a mount or familiar
        const slotsToCheck = ['custom_companion', 'custom_familiar_2'];

        slotsToCheck.forEach(slotKey => {
            const itemId = safeContext.equippedItems[slotKey];
            if (!itemId) return;

            const baseItem = entities.find(e => e.id === itemId);
            // Only apply to Mounts or Familiars Items
            if (baseItem && (baseItem.categoryId === 'mount' || baseItem.categoryId === 'familiar')) {
                const uniqueId = `${baseItem.id}_zephyr_boosted_${slotKey}`;
                
                // Create virtual item
                const boostedItem: Entity = {
                    ...baseItem,
                    id: uniqueId,
                    name: `${baseItem.name} (Zéphyr +50%)`,
                    modifiers: baseItem.modifiers.map(mod => {
                        // Boost FLAT stats (Vit, Spd, Dmg) by 50% (x1.5)
                        if (mod.type === ModifierType.FLAT && ['vit', 'spd', 'dmg'].includes(mod.targetStatKey)) {
                            return {
                                ...mod,
                                value: `(${mod.value}) * 1.5`
                            };
                        }
                        return mod;
                    })
                };

                generatedEntities.push(boostedItem);
                
                // Override context to use virtual item
                safeContext.equippedItems[slotKey] = uniqueId;
                
                // NOTE: On ne push PAS dans virtualIds pour éviter le double compte
            }
        });
    }

    return { entities: generatedEntities, virtualIds };
};

/**
 * Traite la configuration dynamique des invocations.
 */
export const processDynamicSummons = (entity: Entity, finalContext: any, flatBonus: number): ActiveSummon | null => {
    const config = entity.summonConfig;
    if (!config) return null;

    const count = Math.floor(evaluateFormula(config.countValue, finalContext));
    if (count <= 0) return null;

    const rawShare = evaluateFormula(config.shareValue, finalContext);
    
    let statsPerUnitMultiplier = 0;
    
    if (config.mode === 'SHARED_POOL') {
        statsPerUnitMultiplier = (rawShare / 100) / count;
    } else if (config.mode === 'FIXED_PER_UNIT') {
        statsPerUnitMultiplier = rawShare / 100;
    }

    const resultStats = {
        vit: 0,
        spd: 0,
        dmg: 0
    };

    config.stats.forEach(statKey => {
        const playerStat = finalContext[statKey] || 0;
        if (statKey === 'vit' || statKey === 'spd' || statKey === 'dmg') {
            resultStats[statKey] = Math.ceil(playerStat * statsPerUnitMultiplier) + flatBonus;
        }
    });

    return {
        sourceName: config.sourceName,
        name: config.unitName,
        count: count,
        sharePercent: rawShare,
        stats: resultStats
    };
};
