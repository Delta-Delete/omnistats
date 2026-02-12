
import { Entity, EntityType, ModifierType, ActiveSummon } from '../types';
import { evaluateFormula } from './engine';
import { STATS } from './constants';

// HELPER: Retrouver la config d'un item même s'il a été renommé par le moteur (upgraded, comp, etc.)
const findConfigForItem = (currentId: string, configs: any) => {
    if (!currentId || !configs) return null;
    
    // 1. Essai direct
    if (configs[currentId]) return configs[currentId];

    // 2. Nettoyage des suffixes connus (Ordre important : le plus long d'abord)
    let baseId = currentId;
    
    // Enlever suffixe secret boost (et éventuel _comp derrière ou devant)
    if (baseId.includes('_secret_boosted')) {
        baseId = baseId.split('_secret_boosted')[0];
        if (configs[baseId]) return configs[baseId];
        
        // Si baseId contient encore _comp (ex: item_comp_secret_boosted -> item_comp), on nettoie
        if (baseId.endsWith('_comp')) {
            const noComp = baseId.slice(0, -5);
            if (configs[noComp]) return configs[noComp];
        }
    }

    // Enlever suffixe d'upgrade
    if (baseId.includes('_upgraded_slot_')) {
        baseId = baseId.split('_upgraded_slot_')[0];
        if (configs[baseId]) return configs[baseId];
    }

    // Enlever suffixe mount boost
    if (baseId.includes('_zephyr_boosted_')) {
        baseId = baseId.split('_zephyr_boosted_')[0];
        if (configs[baseId]) return configs[baseId];
    }

    // Enlever suffixe compagnon (Dernier recours)
    if (baseId.endsWith('_comp')) {
        const noCompId = baseId.slice(0, -5); // remove "_comp"
        if (configs[noCompId]) return configs[noCompId];
    }

    return null;
};

/**
 * Génère les entités virtuelles pour les améliorations d'armes (Forge).
 * REMPLACE l'arme dans le slot, ne l'ajoute pas en doublon.
 */
export const processWeaponUpgrades = (entities: Entity[], safeContext: any, preCalcContext: any): { entities: Entity[], virtualIds: string[] } => {
    const generatedEntities: Entity[] = [];
    const virtualIds: string[] = []; 

    if (safeContext.weaponSlots) {
        safeContext.weaponSlots.forEach((itemId: string, idx: number) => {
            if (!itemId) return;
            const upgradeLevelDmg = Number(safeContext.weaponUpgrades?.[idx] || 0);
            const upgradeLevelVit = Number(safeContext.weaponUpgradesVit?.[idx] || 0);

            if (upgradeLevelDmg > 0 || upgradeLevelVit > 0) {
                // On cherche dans la liste entities fournie (qui peut contenir déjà des items virtuels venant d'autres processors)
                const baseItem = entities.find(e => e.id === itemId);
                if (baseItem) {
                    const uniqueId = `${baseItem.id}_upgraded_slot_${idx}`;
                    const upgradedEntity: Entity = {
                        ...baseItem,
                        id: uniqueId,
                        name: `${baseItem.name} ${upgradeLevelDmg > 0 ? `(+${upgradeLevelDmg} DMG)` : ''} ${upgradeLevelVit > 0 ? `(+${upgradeLevelVit} VIT)` : ''}`,
                        modifiers: baseItem.modifiers ? [...baseItem.modifiers] : []
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
                }
            }
        });
    }
    return { entities: generatedEntities, virtualIds };
};

/**
 * Traite la "Carte Secrète" (Arlequin).
 * Si équipée (seule ou fusionnée), elle booste une arme cible (définie dans configs) en ajoutant +100% à son multiplicateur d'effet interne.
 * Additif : weapon_effect_mult devient (weapon_effect_mult + 1).
 */
export const processSecretCard = (entities: Entity[], safeContext: any, preCalcContext: any): { entities: Entity[], virtualIds: string[] } => {
    const generatedEntities: Entity[] = [];
    const virtualIds: string[] = [];

    // 1. Trouver l'objet qui agit comme "Carte Secrète" (L'original ou une fusion contenant "Carte secrète")
    let providerFound = false;
    let providerId: string | null = null;
    let targetSlotIndex: number | null | undefined = null;
    let targetSubName: string | undefined = undefined;

    if (safeContext.weaponSlots) {
        // On itère par index pour pouvoir récupérer l'ID original depuis preCalcContext si nécessaire
        for (let idx = 0; idx < safeContext.weaponSlots.length; idx++) {
            const currentId = safeContext.weaponSlots[idx];
            const item = entities.find(e => e.id === currentId);
            
            if (item) {
                // Check ID ou Présence dans la description/nom (cas fusion)
                // Note : On check aussi le nom "base" sans les suffixes pour être robuste
                const isSecret = item.id.includes('carte_secrete') ||
                                 (item.description && item.description.includes('Carte secrète')) ||
                                 (item.name && item.name.includes('Carte secrète'));
                
                if (isSecret) {
                    providerId = currentId;
                    
                    // CRITIQUE : Utiliser le Helper Robuste pour trouver la config
                    const config = findConfigForItem(currentId, safeContext.itemConfigs);
                    
                    if (config) {
                        targetSlotIndex = config.targetSlotIndex;
                        targetSubName = config.targetSubName;
                        providerFound = true;
                        break; // On ne gère qu'une seule carte secrète active pour le moment
                    }
                }
            }
        }
    }

    // Si pas de carte ou pas de cible configurée
    if (!providerFound || !providerId || targetSlotIndex === undefined || targetSlotIndex === null || targetSlotIndex === -1) {
        return { entities: [], virtualIds: [] };
    }

    // Sécurité bornes
    if (targetSlotIndex < 0 || targetSlotIndex >= safeContext.weaponSlots.length) {
        return { entities: [], virtualIds: [] };
    }

    const targetItemId = safeContext.weaponSlots[targetSlotIndex];
    
    // CORRECTION : La carte ne peut pas se booster elle-même "Globalement", 
    // MAIS elle peut booster une sous-partie (ingrédient) d'une fusion dont elle fait partie.
    if (!targetItemId) return { entities: [], virtualIds: [] };
    if (targetItemId === providerId && !targetSubName) {
        // Tentative de boost "Global" sur soi-même => INTERDIT
        return { entities: [], virtualIds: [] };
    }

    // Trouver l'item cible. 
    // Grâce au fix dans engine.ts, 'entities' contient maintenant les items virtuels générés par processWeaponUpgrades
    const baseItem = entities.find(e => e.id === targetItemId);

    if (baseItem) {
        // SAFETY: Prevent double boosting (recursion loop prevention)
        if (baseItem.id.includes('_secret_boosted')) {
             return { entities: [], virtualIds: [] };
        }

        // Création de l'entité virtuelle Boostée
        const uniqueId = `${baseItem.id}_secret_boosted`;
        
        // Nom : On ajoute un indicateur visuel si un sous-élément est ciblé
        const nameSuffix = targetSubName ? ` (Boost: ${targetSubName})` : ` (Carte Secrète)`;

        // Helper pour générer un ID Unique et STABLE (Pas de Random/Date.now)
        // On utilise l'ID de l'item parent + un suffixe fixe.
        // Si besoin d'unicité par modifier, on utilise l'index ou l'ID original du modifier.
        const getStableSuffix = (modId: string) => `sb_${modId}_boosted`;

        const boostedEntity: Entity = {
            ...baseItem,
            id: uniqueId,
            name: `${baseItem.name}${nameSuffix}`,
            modifiers: baseItem.modifiers ? baseItem.modifiers.map(mod => {
                // FILTRAGE : Si un sous-nom est ciblé (dans une fusion), on ne booste QUE les modifiers taggés
                // Les modifiers fusionnés ont été taggés avec "[NomItem] ..." dans FusionForgeTab.
                if (targetSubName) {
                    if (!mod.name || !mod.name.includes(`[${targetSubName}]`)) {
                        // Ce modificateur ne vient pas de l'ingrédient ciblé, on ne le touche pas
                        return mod;
                    }
                }

                // Cas 1 : La formule contient déjà le multiplicateur -> On ajoute +1
                // Ex: "200 * (ratio + weapon_effect_mult - 1)" devient "200 * (ratio + (weapon_effect_mult + 1) - 1)"
                if (mod.value && mod.value.includes('weapon_effect_mult')) {
                    // SAFETY: Avoid double wrapping if formula is reused
                    if (mod.value.includes('(weapon_effect_mult + 1)')) return mod;

                    const newValue = mod.value.split('weapon_effect_mult').join('(weapon_effect_mult + 1)');
                    
                    // FIX CRITIQUE: Générer un NOUVEL ID UNIQUE pour le modifier boosté.
                    // On utilise un suffixe stable pour éviter le re-rendu infini.
                    const newModId = getStableSuffix(mod.id);
                    
                    return { ...mod, id: newModId, value: newValue };
                }
                
                // Même si on ne touche pas à la valeur, on DOIT changer l'ID pour éviter que ce modifier
                // soit considéré comme "déjà traité" si le joueur possède le même objet de base.
                return { ...mod, id: `${mod.id}_sb_pass` };
            }) : []
        };

        // VISUAL FEEDBACK: Update description text so the user sees the new values
        const replaceFormula = (text: string) => {
            if (!text) return '';
            return text.split('weapon_effect_mult').join('(weapon_effect_mult + 1)');
        }

        if (targetSubName) {
            // Cas Fusion ciblée : On parcourt les blocs et on update seulement si le titre contient le nom du sous-ingrédient
            if (boostedEntity.descriptionBlocks) {
                boostedEntity.descriptionBlocks = boostedEntity.descriptionBlocks.map(b => {
                    // Les blocs fusionnés ont souvent le format "NomItem (Source)" ou juste "NomItem" dans le titre
                    if (b.title && (b.title.includes(targetSubName) || b.title === targetSubName)) {
                        return {
                            ...b,
                            text: replaceFormula(b.text)
                        };
                    }
                    return b;
                });
            }
            // On ne touche PAS à la description principale si c'est une fusion (car elle liste juste les ingrédients A + B)
        } else {
            // Cas Standard (Global Boost) : On update tout
            if (boostedEntity.description) {
                boostedEntity.description = replaceFormula(boostedEntity.description);
            }
            
            if (boostedEntity.descriptionBlocks) {
                boostedEntity.descriptionBlocks = boostedEntity.descriptionBlocks.map(b => ({
                    ...b,
                    text: replaceFormula(b.text)
                }));
            }
        }

        generatedEntities.push(boostedEntity);
        
        // Remplacement du slot pour que les calculs suivants utilisent cette version
        safeContext.weaponSlots[targetSlotIndex] = uniqueId;
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
                    modifiers: baseItem.modifiers ? baseItem.modifiers.map(mod => {
                        // Boost FLAT stats (Vit, Spd, Dmg) by 50% (x1.5)
                        if (mod.type === ModifierType.FLAT && ['vit', 'spd', 'dmg'].includes(mod.targetStatKey)) {
                            return {
                                ...mod,
                                value: `(${mod.value}) * 1.5`
                            };
                        }
                        return mod;
                    }) : []
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
