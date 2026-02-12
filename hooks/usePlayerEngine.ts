
import { useMemo, useDeferredValue } from 'react';
import { Entity, EntityType, PlayerSelection, StatDefinition, CalculationResult, StatResult, ActiveSummon, ModifierType } from '../types';
import { calculateStats, checkCondition, evaluateFormula } from '../services/engine';
import { processWeaponUpgrades, processSecretCard, processForceNaturelle, processMountBoost, processDynamicSummons } from '../services/rules';
import { flattenItemConfigs, mergeCompanionConfigs, processDynamicText } from '../services/processing';

interface UsePlayerEngineProps {
    selection: PlayerSelection;
    stats: StatDefinition[];
    entities: Entity[];
    customItems: Entity[];
}

interface UsePlayerEngineResult {
    allItems: Entity[];
    activeEntities: Entity[];
    result: CalculationResult;
    contextForDisplay: any;
    activeDescriptions: any[];
    companionResult: CalculationResult | null;
    companionDescriptions: any[];
    factions: Entity[];
    eliteCompetence?: Entity;
    racialCompetence?: Entity;
    allActiveSummons: ActiveSummon[];
}

// HELPER: Deep clone a StatResult to prevent mutation of memoized sources
const cloneStatResult = (stat: StatResult): StatResult => ({
    ...stat,
    trace: [...stat.trace],
    detailedBase: [...stat.detailedBase],
    detailedFlat: [...stat.detailedFlat],
    // Primitive values (base, finalValue, etc.) are copied by spread
});

export const usePlayerEngine = ({ selection, stats, entities, customItems }: UsePlayerEngineProps): UsePlayerEngineResult => {
    
    // OPTIMIZATION: Defer the calculation triggered by selection changes (sliders, inputs)
    const deferredSelection = useDeferredValue(selection);

    // 1. COMBINE ITEMS
    const allItems: Entity[] = useMemo(() => { 
        return [...entities.filter(e => e.type === EntityType.ITEM), ...customItems]; 
    }, [entities, customItems]);

    // 2. IDENTIFY HELPERS
    const factions = useMemo(() => entities.filter(e => e.type === EntityType.FACTION), [entities]);
    const eliteCompetence = entities.find(e => e.type === EntityType.ELITE_COMPETENCE && e.parentId === selection.classId);
    const racialCompetence = entities.find(e => e.type === EntityType.RACIAL_COMPETENCE && (e.parentId === selection.raceId || e.parentId === selection.subRaceId));
    const coreRules = entities.filter(e => e.type === EntityType.GLOBAL_RULE);

    // 3. RESOLVE ACTIVE ENTITIES (Based on DEFERRED selection to avoid lag)
    const activeEntities: Entity[] = useMemo(() => {
        const getItem = (id: string | undefined) => id ? allItems.find(i => i.id === id) : undefined;
        
        const uniqueEntityMap = new Map<string, Entity>();
   
        const addEntity = (e?: Entity) => {
            if (e && !uniqueEntityMap.has(e.id)) {
                uniqueEntityMap.set(e.id, e);
            }
        };
   
        // Core & Selection
        coreRules.forEach(addEntity);
        addEntity(entities.find(e => e.id === deferredSelection.raceId));
        addEntity(entities.find(e => e.id === deferredSelection.subRaceId));
        addEntity(entities.find(e => e.id === deferredSelection.classId));
        addEntity(entities.find(e => e.id === deferredSelection.specializationId));
        addEntity(entities.find(e => e.id === deferredSelection.professionId));
        addEntity(entities.find(e => e.id === deferredSelection.careerId));
        addEntity(entities.find(e => e.id === deferredSelection.factionId));
        
        if (deferredSelection.subProfessions) {
            Object.keys(deferredSelection.subProfessions).forEach(subId => {
                addEntity(entities.find(e => e.id === subId));
            });
        }

        (deferredSelection.guildIds || []).forEach(id => {
            const guildEntity = entities.find(e => e.id === id);
            addEntity(guildEntity);
            
            if (guildEntity && guildEntity.guildRanks && deferredSelection.guildRanks && deferredSelection.guildRanks[id]) {
                const rankId = deferredSelection.guildRanks[id];
                const rankData = guildEntity.guildRanks.find(r => r.id === rankId);
                if (rankData && rankData.modifiers && rankData.modifiers.length > 0) {
                    addEntity({
                        id: `virtual_rank_${rankId}`,
                        type: EntityType.GLOBAL_RULE, 
                        name: `Rang : ${rankData.name}`,
                        modifiers: rankData.modifiers
                    });
                }
            }

            if (guildEntity && guildEntity.secondaryGuildRanks && deferredSelection.guildSecondaryRanks && deferredSelection.guildSecondaryRanks[id]) {
                const rankId = deferredSelection.guildSecondaryRanks[id];
                const rankData = guildEntity.secondaryGuildRanks.find(r => r.id === rankId);
                
                if (rankData && rankData.modifiers && rankData.modifiers.length > 0) {
                    addEntity({
                        id: `virtual_rank_sec_${rankId}`,
                        type: EntityType.GLOBAL_RULE, 
                        name: `Réputation : ${rankData.name}`,
                        modifiers: rankData.modifiers
                    });
                }
                
                if (id === 'guild_crocs_spelunca') {
                    const gemMap: Record<string, string> = {
                        'croc_rep_sympathisant': 'item_gemme_spel_std',
                        'croc_rep_allie': 'item_gemme_spel_std',
                        'croc_rep_ami': 'item_gemme_spel_std',
                        'croc_rep_fidele': 'item_gemme_spel_bound'
                    };
                    const gemId = gemMap[rankId];
                    if (gemId) {
                        const gemItem = allItems.find(i => i.id === gemId);
                        if (gemItem) addEntity(gemItem);
                    }
                }
            }
        });

        if (deferredSelection.guildIds && deferredSelection.guildIds.length > 0 && deferredSelection.guildManualBonuses) {
            const bonuses = deferredSelection.guildManualBonuses;
            const manualModifiers = [];
            
            if (bonuses.vit) manualModifiers.push({ id: 'guild_man_vit', type: 'FLAT', targetStatKey: 'vit', value: bonuses.vit.toString() });
            if (bonuses.spd) manualModifiers.push({ id: 'guild_man_spd', type: 'FLAT', targetStatKey: 'spd', value: bonuses.spd.toString() });
            if (bonuses.dmg) manualModifiers.push({ id: 'guild_man_dmg', type: 'FLAT', targetStatKey: 'dmg', value: bonuses.dmg.toString() });
            
            if (deferredSelection.classId === 'corrompu' && bonuses.absorption) {
                manualModifiers.push({ id: 'guild_man_abs', type: 'FLAT', targetStatKey: 'absorption', value: bonuses.absorption.toString() });
            }

            if (manualModifiers.length > 0) {
                addEntity({
                    id: 'guild_manual_bonus_virtual',
                    type: EntityType.GLOBAL_RULE,
                    name: 'Bonus de Guilde (Manuel)',
                    modifiers: manualModifiers as any[]
                });
            }
        }
   
        if (deferredSelection.eliteCompetenceActive && eliteCompetence) addEntity(eliteCompetence);
        if (deferredSelection.racialCompetenceActive && racialCompetence) addEntity(racialCompetence);
   
        const itemInstances = [ 
            ...Object.values(deferredSelection.equippedItems).map(getItem), 
            ...deferredSelection.weaponSlots.map(getItem), 
            ...deferredSelection.partitionSlots.map(getItem), 
            ...(deferredSelection.bonusItems || []).map(getItem), 
            ...(deferredSelection.sealItems || []).map(getItem), 
            ...(deferredSelection.specialItems || []).map(getItem) 
        ].filter(Boolean) as Entity[];
        
        itemInstances.forEach(item => { 
            if (item.factionId) {
                const faction = entities.find(e => e.id === item.factionId && (e.type === EntityType.FACTION));
                addEntity(faction);
            }
            if (item.setId) {
                const setEntity = entities.find(e => e.id === item.setId && e.type === EntityType.ITEM_SET);
                addEntity(setEntity);
            }
        });
   
        return [...Array.from(uniqueEntityMap.values()), ...itemInstances];
   
     }, [deferredSelection, entities, coreRules, allItems, eliteCompetence, racialCompetence, selection.classId, selection.raceId]); 

    // 4. MAIN CALCULATION (HEAVY - DEFERRED)
    const baseResult: CalculationResult & { finalEntities: Entity[] } = useMemo(() => { 
        // FIX: STRICT SEPARATION - PLAYER SHOULD ONLY SEE PLAYER CONFIGS
        const playerConfigsOnly = {
            ...(deferredSelection.itemConfigs || {})
        };

        const calcContext = { 
            ...deferredSelection, 
            soulCount: deferredSelection.soulCount || 0,
            itemConfigs: playerConfigsOnly 
        };
        return calculateStats(
            stats, 
            activeEntities, 
            calcContext, 
            [processWeaponUpgrades, processSecretCard, processForceNaturelle, processMountBoost],
            [processDynamicSummons] 
        ); 
    }, [stats, activeEntities, deferredSelection]);

    // 7. COMPANION ENTITIES (Must be before companion calculation)
    const companionEntities = useMemo(() => {
        if (deferredSelection.choiceSlotType !== 'companion') return [];

        const allowedTypes = [EntityType.RACE, EntityType.CLASS, EntityType.GLOBAL_RULE, EntityType.ITEM, EntityType.CAREER];
        
        const allowedItemCategories = [
            'weapon', 'armor_head', 'armor_chest', 'armor_legs', 'shield',
            'armor_option', 
            'seal', 'artifact', 'rebreather'
        ];

        return activeEntities.map(e => {
            if (!allowedTypes.includes(e.type)) return null;

            let mode = e.companionAllowed;
            if (mode === true) mode = 'full';
            if (mode === false) mode = 'none';

            if (!mode || mode === 'auto') {
                if (e.type === EntityType.ITEM) {
                    if (e.categoryId === 'enchantment') mode = 'none';
                    else if (allowedItemCategories.includes(e.categoryId || '')) mode = 'full';
                    else if (e.slotId === 'weapon_any') mode = 'full';
                    else mode = 'none';
                } else {
                    mode = 'full';
                }
            }

            if (mode === 'none') return null;

            let entityToReturn = Object.assign({}, e); 
            
            if (entityToReturn.type === EntityType.ITEM) {
                entityToReturn.id = `${entityToReturn.id}_comp`;
                
                if (entityToReturn.modifiers) {
                    entityToReturn.modifiers = entityToReturn.modifiers.map(m => Object.assign({}, m, {
                        id: `${m.id}_comp`
                    }));
                }
            }

            if (mode === 'stats_only') {
                const statsToKeep = ['vit', 'spd', 'dmg', 'res', 'aura', 'crit_primary', 'crit_secondary'];
                return Object.assign({}, entityToReturn, {
                    id: `${entityToReturn.id}_stats_only`,
                    modifiers: (e.modifiers || []).filter(m => 
                        statsToKeep.includes(m.targetStatKey) && 
                        (m.type === ModifierType.FLAT || m.type === ModifierType.PERCENT_ADD) &&
                        !m.toggleId && !m.toggleGroup
                    ),
                    summons: [], 
                    descriptionBlocks: [], 
                    description: `(Stats Uniquement) ${e.name}`
                });
            }

            return entityToReturn;

        }).filter(Boolean) as Entity[];

    }, [activeEntities, deferredSelection.choiceSlotType]);

    // 8. COMPANION CALCULATION (Base)
    const baseCompanionResult = useMemo(() => { 
        if (deferredSelection.choiceSlotType !== 'companion') return null; 
        
        const companionScale = ((baseResult.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
        const companionRatio = Number(companionScale) / 100;

        // FIX: SMART MERGE LOGIC (Using centralized processing)
        const { remappedConfigs } = mergeCompanionConfigs(deferredSelection.itemConfigs, deferredSelection.companionItemConfigs);

        const compEquipped: Record<string, string> = {};
        Object.entries(deferredSelection.equippedItems || {}).forEach(([slot, id]) => {
            if (id) compEquipped[slot] = `${id}_comp`;
        });
        
        const compWeapons = (deferredSelection.weaponSlots || []).map(id => id ? `${id}_comp` : id);
        const compPartition = (deferredSelection.partitionSlots || []).map(id => id ? `${id}_comp` : id);
        const compBonus = (deferredSelection.bonusItems || []).map(id => `${id}_comp`);
        const compSeal = (deferredSelection.sealItems || []).map(id => `${id}_comp`);
        const compSpecial = (deferredSelection.specialItems || []).map(id => `${id}_comp`);

        const companionContext = {
            ...deferredSelection,
            specializationId: undefined, 
            professionId: undefined,     
            careerId: undefined,         
            guildIds: [],                
            subProfessions: {},          
            toggles: deferredSelection.companionToggles || {},
            
            equippedItems: compEquipped,
            weaponSlots: compWeapons,
            partitionSlots: compPartition,
            bonusItems: compBonus,
            sealItems: compSeal,
            specialItems: compSpecial,
            itemConfigs: remappedConfigs, // Uses Smart Merged Configs

            unit_scale: companionRatio, 
            
            ...(Object.fromEntries(Object.entries(baseResult.stats).map(([k, v]) => [k, (v as StatResult).finalValue])) as Record<string, number>), 
            ...(Object.fromEntries(Object.entries(baseResult.stats).map(([k, v]) => [`player_${k}`, (v as StatResult).finalValue])) as Record<string, number>), 
        };

        return calculateStats(
            stats, 
            companionEntities, 
            companionContext,
            [processWeaponUpgrades, processSecretCard, processForceNaturelle, processMountBoost],
            [processDynamicSummons]
        ); 
    }, [stats, companionEntities, deferredSelection, baseResult.stats]);

    // 9. CROSS POLLINATION (MUTUAL BOOSTS)
    const { finalPlayerStats, finalCompanionStats } = useMemo(() => {
        const pStats = Object.fromEntries(
            Object.entries(baseResult.stats).map(([k, v]) => [k, cloneStatResult(v as StatResult)])
        );
        const cStats = baseCompanionResult 
            ? Object.fromEntries(
                Object.entries(baseCompanionResult.stats).map(([k, v]) => [k, cloneStatResult(v as StatResult)])
              )
            : null;

        if (cStats) {
            const companionScaleVal = ((pStats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
            const companionRatio = Number(companionScaleVal) / 100;
            const safeRatio = companionRatio < 0.01 ? 0.01 : companionRatio;

            // 1. Player -> Companion
            const playerProcessedMods = new Set<string>();
            baseResult.finalEntities?.forEach(ent => {
                if (!ent.modifiers) return;
                ent.modifiers.forEach(mod => {
                    if (playerProcessedMods.has(mod.id)) return;
                    if (mod.shareWithTeam && baseResult.modifierResults[mod.id] !== undefined) {
                        playerProcessedMods.add(mod.id);
                        const value = baseResult.modifierResults[mod.id];
                        if (value !== 0 && !isNaN(value)) {
                            const effectiveValue = (value * mod.shareWithTeam) / safeRatio;
                            const targetStat = cStats[mod.targetStatKey];
                            if (targetStat) {
                                if (mod.isPerTurn) {
                                    targetStat.perTurn += effectiveValue;
                                    targetStat.trace.push(`[TEAM] ${ent.name} (Joueur) : ${Math.round(effectiveValue)}/tr (Compensé)`);
                                } else {
                                    targetStat.finalValue += effectiveValue;
                                    targetStat.trace.push(`[TEAM] ${ent.name} (Joueur) : ${Math.round(effectiveValue)} (Compensé)`);
                                }
                            }
                        }
                    }
                });
            });

            // 2. Companion -> Player
            const compProcessedMods = new Set<string>();
            baseCompanionResult?.finalEntities?.forEach(ent => {
                if (!ent.modifiers) return;
                ent.modifiers.forEach(mod => {
                    if (compProcessedMods.has(mod.id)) return;
                    if (mod.shareWithTeam && baseCompanionResult.modifierResults[mod.id] !== undefined) {
                        compProcessedMods.add(mod.id);
                        const value = baseCompanionResult.modifierResults[mod.id];
                        if (value !== 0 && !isNaN(value)) {
                            const effectiveValue = value * mod.shareWithTeam * companionRatio;
                            const targetStat = pStats[mod.targetStatKey];
                            if (targetStat) {
                                if (mod.isPerTurn) {
                                    targetStat.perTurn += effectiveValue;
                                    targetStat.trace.push(`[TEAM] ${ent.name} (Compagnon) : ${Math.round(effectiveValue)}/tr`);
                                } else {
                                    targetStat.finalValue += effectiveValue;
                                    targetStat.trace.push(`[TEAM] ${ent.name} (Compagnon) : ${Math.round(effectiveValue)}`);
                                }
                            }
                        }
                    }
                });
            });
        }

        return { finalPlayerStats: pStats, finalCompanionStats: cStats };
    }, [baseResult, baseCompanionResult]);

    // Construct Final Result Objects
    const result = useMemo(() => ({
        ...baseResult,
        stats: finalPlayerStats
    }), [baseResult, finalPlayerStats]);

    const companionResult = useMemo(() => (
        baseCompanionResult ? { ...baseCompanionResult, stats: finalCompanionStats! } : null
    ), [baseCompanionResult, finalCompanionStats]);

    // 5. DISPLAY CONTEXT (Using Final Stats)
    const contextForDisplay: any = useMemo(() => ({
        level: selection.level, 
        soul_count: selection.soulCount || 0,
        raceId: selection.raceId,
        subRaceId: selection.subRaceId,
        classId: selection.classId,
        specializationId: selection.specializationId,
        professionId: selection.professionId,
        careerId: selection.careerId,
        factionId: selection.factionId,
        guildIds: selection.guildIds,
        equippedItems: selection.equippedItems,
        weaponSlots: selection.weaponSlots,
        specialItems: selection.specialItems,
        bonusItems: selection.bonusItems,
        sealItems: selection.sealItems,
        
        toggles: selection.toggles,
        ...(selection.toggles || {}), 
        ...(selection.sliderValues || {}), 
        ...flattenItemConfigs(selection.itemConfigs),
        // FIX: DO NOT MERGE COMPANION CONFIGS HERE - Player Display should reflect Player Settings
        ...(Object.fromEntries(Object.entries(result.stats).map(([k, v]) => [k, (v as StatResult).finalValue])) as Record<string, number>)
    }), [selection, result]);

    // 6. DESCRIPTION PARSING
    const activeDescriptions = useMemo(() => {
         const descContext: any = { 
            level: deferredSelection.level, 
            soul_count: deferredSelection.soulCount || 0,
            toggles: deferredSelection.toggles,
            context: { toggles: deferredSelection.toggles }, 
            ...(deferredSelection.sliderValues || {}), 
            ...flattenItemConfigs(deferredSelection.itemConfigs), 
            // FIX: DO NOT MERGE COMPANION CONFIGS HERE for description parsing either
            ...(Object.fromEntries(Object.entries(result.stats).map(([k, v]) => [k, (v as StatResult).finalValue])) as Record<string, number>) 
        };
  
        const nameCounts: Record<string, number> = {};
        const entitiesToDescribe = result.finalEntities || activeEntities;

        const finalContextIds = new Set<string>();
        const ctx = result.evalContext?.context || {};
        
        if (ctx.equippedItems) Object.values(ctx.equippedItems).forEach((id: any) => finalContextIds.add(id));
        if (ctx.weaponSlots) ctx.weaponSlots.forEach((id: any) => finalContextIds.add(id));
        if (ctx.partitionSlots) ctx.partitionSlots.forEach((id: any) => finalContextIds.add(id));
        (ctx.bonusItems || []).forEach((id: any) => finalContextIds.add(id));
        (ctx.sealItems || []).forEach((id: any) => finalContextIds.add(id));
        (ctx.specialItems || []).forEach((id: any) => finalContextIds.add(id));

        const filteredEntities = entitiesToDescribe.filter(e => {
            if (e.type === EntityType.ITEM) {
                return finalContextIds.has(e.id);
            }
            return true;
        });

        filteredEntities.forEach(e => { if (e.type !== EntityType.GLOBAL_RULE && e.type !== EntityType.RACE && e.type !== EntityType.FACTION) { nameCounts[e.name] = (nameCounts[e.name] || 0) + 1; } });
        const currentCounts: Record<string, number> = {};
  
        return filteredEntities
          .filter(e => (e.descriptionBlocks?.length || (e.description && e.description.trim() !== '')) || e.modifiers?.some(m => m.displayTag) || e.effectTag)
          .filter(e => {
              if (e.hideInRecap) return false;
              if (e.type === EntityType.RACE || e.type === EntityType.FACTION) return false;
              if (e.type === EntityType.ITEM_SET) return false;
              if (e.type === EntityType.ITEM && e.setId === 'set_capitaine') return false;
              if (e.categoryId === 'armor_option') return false;
              if (e.categoryId === 'seal') return false;
              if (e.id.startsWith('custom_comp_')) {
                   const defaultDesc = "Un compagnon fidèle.";
                   if (!e.description || e.description.trim() === defaultDesc) return false;
              }
              if (e.type === EntityType.GLOBAL_RULE) {
                  return e.descriptionBlocks && e.descriptionBlocks.length > 0;
              }
              return true;
          })
          .map((e, idx) => {
              let textBlocks: { tag?: string, title?: string, text: string, isCollapsible?: boolean }[] = [];
              if (e.descriptionBlocks && e.descriptionBlocks.length > 0) {
                  textBlocks = e.descriptionBlocks
                      .filter(b => !b.condition || checkCondition(b.condition, descContext))
                      .map(b => ({ 
                          tag: b.tag, 
                          title: b.title, 
                          // USING CENTRALIZED PROCESSOR
                          text: processDynamicText(b.text, descContext, result.modifierResults), 
                          isCollapsible: b.isCollapsible 
                        }));
              } else if (e.description) {
                  textBlocks = [{ 
                      tag: e.effectTag, 
                      title: e.descriptionTitle, 
                      // USING CENTRALIZED PROCESSOR
                      text: processDynamicText(e.description, descContext, result.modifierResults), 
                      isCollapsible: false 
                    }];
              }
              const specialEffects = (e.modifiers || []).filter(m => m.displayTag).map(m => {
                  let val = m.value;
                  if(val.includes('{{') || val.includes('*')) {
                          const res = result.modifierResults[m.id];
                          if (res !== undefined) val = Math.ceil(res).toString();
                  }
                  const label = stats.find(s => s.key === m.targetStatKey)?.label || m.targetStatKey;
                  return { tag: m.displayTag, val: val, stat: label };
              });
              let displayName = e.name;
              if (nameCounts[e.name] > 1) { currentCounts[e.name] = (currentCounts[e.name] || 0) + 1; displayName = `${e.name} (${currentCounts[e.name]})`; }
              return { id: `${e.id}_${idx}`, name: displayName, textBlocks, specialEffects, type: e.type };
          });
    }, [activeEntities, result, deferredSelection, stats]);

    // 10. COMPANION DESCRIPTIONS (STRUCTURED)
    const companionDescriptions = useMemo(() => {
         if (deferredSelection.choiceSlotType !== 'companion') return [];
         
         const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
         const companionRatio = Number(companionScale) / 100;
         
         const { remappedConfigs, rawConfigs } = mergeCompanionConfigs(deferredSelection.itemConfigs, deferredSelection.companionItemConfigs);
         
         const compContext: any = { 
             level: deferredSelection.level, 
             soul_count: deferredSelection.soulCount || 0, 
             unit_scale: companionRatio,
             ...flattenItemConfigs(rawConfigs), 
             ...(Object.fromEntries(Object.entries(companionResult?.stats || {}).map(([k, v]) => [k, (v as StatResult).finalValue])) as Record<string, number>),
             // FIX: INCLUDE HELPERS FROM ENGINE
             ...companionResult?.evalContext,
             utils: companionResult?.evalContext?.utils
         };

         const entitiesToDescribe = companionResult?.finalEntities || companionEntities;

         const finalContextIds = new Set<string>();
         const ctx = companionResult?.evalContext?.context || {};
         
         if (ctx.equippedItems) Object.values(ctx.equippedItems).forEach((id: any) => finalContextIds.add(id));
         if (ctx.weaponSlots) ctx.weaponSlots.forEach((id: any) => finalContextIds.add(id));
         if (ctx.partitionSlots) ctx.partitionSlots.forEach((id: any) => finalContextIds.add(id));
         
         const filteredEntities = entitiesToDescribe.filter(e => {
             if (e.type === EntityType.ITEM) {
                 return finalContextIds.has(e.id);
             }
             return true;
         });

         // Helper for text replacement with scaling
         // FIX: Advanced logic to distinguish between Modifiers (to be scaled) and Context Stats (already scaled)
         const resolveText = (text: string) => {
             return text.replace(/\{\{(.*?)\}\}/g, (_, content) => { 
                const trimmed = content.trim(); 
                
                // 1. Try to find the value in modifierResults (Raw modifier values, usually unscaled)
                // This represents "Item gives X". We scale it.
                let val = companionResult?.modifierResults[trimmed]; 
                if (val === undefined) {
                    val = companionResult?.modifierResults[`${trimmed}_comp`];
                }

                if (val !== undefined) {
                    return Math.ceil(val * companionRatio).toString();
                }

                // 2. Fallback to formula evaluation (Context variables, like 'vit', are FINAL stats)
                // If context.vit is used, it is ALREADY scaled by the engine. We do NOT scale it again.
                try { 
                    val = evaluateFormula(trimmed, compContext); 
                    if (typeof val === 'number') {
                        return Math.ceil(val).toString(); // Return directly
                    }
                } catch (e) { val = 0; } 
                
                return '0'; 
            });
         };

         return filteredEntities
            .filter(e => (e.descriptionBlocks?.length || (e.description && e.description.trim() !== '')))
            .filter(e => e.type !== EntityType.GLOBAL_RULE && e.type !== EntityType.RACE)
            .filter(e => e.id !== 'set_capitaine') // Filter specific sets like player engine
            .map((e, idx) => { 
                
                let textBlocks: { tag?: string, title?: string, text: string, isCollapsible?: boolean }[] = [];
                
                if (e.descriptionBlocks && e.descriptionBlocks.length > 0) {
                    textBlocks = e.descriptionBlocks
                        // FIX: ADD CONDITION CHECK FOR COMPANION BLOCKS
                        .filter(b => !b.condition || checkCondition(b.condition, compContext))
                        .map(b => ({
                            tag: b.tag,
                            title: b.title,
                            text: resolveText(b.text),
                            isCollapsible: b.isCollapsible
                        }));
                } else if (e.description) {
                    textBlocks = [{
                        tag: e.effectTag,
                        title: e.descriptionTitle,
                        text: resolveText(e.description),
                        isCollapsible: false
                    }];
                }

                const specialEffects = (e.modifiers || []).filter(m => m.displayTag).map(m => {
                    let val = m.value;
                    if (val.includes('{{') || val.includes('*')) {
                        const res = companionResult?.modifierResults[m.id];
                        if (res !== undefined) val = Math.ceil(res * companionRatio).toString();
                        else {
                             try { val = Math.ceil(evaluateFormula(val, compContext)).toString(); } catch(e){}
                        }
                    }
                    const label = stats.find(s => s.key === m.targetStatKey)?.label || m.targetStatKey;
                    return { tag: m.displayTag, val: val, stat: label };
                });

                return { 
                    id: `${e.id}_comp_${idx}`, 
                    name: e.name, 
                    description: e.description, // FIX: RETURN DESCRIPTION FOR FALLBACK
                    textBlocks, 
                    specialEffects, 
                    type: e.type 
                }; 
            });
    }, [companionEntities, companionResult, deferredSelection.choiceSlotType, result.stats, deferredSelection.level, deferredSelection.itemConfigs]);

    // 11. COMBINED SUMMONS
    const allActiveSummons = useMemo(() => {
        let list = [...result.activeSummons];

        if (companionResult && companionResult.activeSummons.length > 0) {
            const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
            const ratio = companionScale / 100;

            const scaledCompanionSummons = companionResult.activeSummons.map(summon => ({
                ...summon,
                id: `${summon.id}_comp`, 
                sourceName: `${summon.sourceName} (Compagnon)`,
                stats: {
                    vit: Math.ceil(summon.stats.vit * ratio),
                    spd: Math.ceil(summon.stats.spd * ratio),
                    dmg: Math.ceil(summon.stats.dmg * ratio),
                }
            }));

            list = [...list, ...scaledCompanionSummons];
        }

        return list;
    }, [result.activeSummons, companionResult, result.stats]);

    return {
        allItems,
        activeEntities,
        result,
        contextForDisplay,
        activeDescriptions,
        companionResult,
        companionDescriptions,
        factions,
        eliteCompetence,
        racialCompetence,
        allActiveSummons
    };
};
