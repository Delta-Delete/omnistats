
import { useMemo, useDeferredValue } from 'react';
import { Entity, EntityType, PlayerSelection, StatDefinition, CalculationResult, StatResult, ActiveSummon, ModifierType } from '../types';
import { calculateStats, evaluateFormula, checkCondition } from '../services/engine';
import { processWeaponUpgrades, processForceNaturelle, processDynamicSummons, processMountBoost } from '../services/rules';

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
    allActiveSummons: ActiveSummon[]; // NEW: Combined list
}

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
    const result: CalculationResult = useMemo(() => { 
        const calcContext = { ...deferredSelection, soulCount: deferredSelection.soulCount || 0 };
        return calculateStats(
            stats, 
            activeEntities, 
            calcContext, 
            // INJECTED HERE: processMountBoost before Pass A logic
            [processWeaponUpgrades, processForceNaturelle, processMountBoost],
            [processDynamicSummons] 
        ); 
    }, [stats, activeEntities, deferredSelection]);

    // 5. DISPLAY CONTEXT
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
        // PASSING INVENTORY LISTS FOR UI LOGIC (Fix for Zephyr Pendant display)
        specialItems: selection.specialItems,
        bonusItems: selection.bonusItems,
        sealItems: selection.sealItems,
        
        toggles: selection.toggles,
        ...(selection.toggles || {}), 
        ...(selection.sliderValues || {}), 
        ...Object.fromEntries(Object.entries(result.stats).map(([k, v]) => [k, (v as StatResult).finalValue]))
    }), [selection, result]);

    // 6. DESCRIPTION PARSING
    const activeDescriptions = useMemo(() => {
         const descContext: any = { 
            level: deferredSelection.level, 
            soul_count: deferredSelection.soulCount || 0,
            toggles: deferredSelection.toggles,
            context: { toggles: deferredSelection.toggles }, 
            ...(deferredSelection.sliderValues || {}), 
            ...Object.fromEntries(Object.entries(result.stats).map(([k, v]) => [k, (v as StatResult).finalValue])) 
        };

        const processText = (text: string) => {
            return text.replace(/\{\{(.*?)\}\}/g, (_, content) => { 
                const trimmed = content.trim(); 
                const val = result.modifierResults[trimmed]; 
                if (typeof val === 'number') { return Math.ceil(val).toString(); } 
                try { 
                    const evaluated = evaluateFormula(trimmed, descContext); 
                    return Math.ceil(evaluated).toString(); 
                } catch (err) { return '?'; } 
            });
        };
  
        const nameCounts: Record<string, number> = {};
        activeEntities.forEach(e => { if (e.type !== EntityType.GLOBAL_RULE && e.type !== EntityType.RACE && e.type !== EntityType.FACTION) { nameCounts[e.name] = (nameCounts[e.name] || 0) + 1; } });
        const currentCounts: Record<string, number> = {};
  
        return activeEntities
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
                      .map(b => ({ tag: b.tag, title: b.title, text: processText(b.text), isCollapsible: b.isCollapsible }));
              } else if (e.description) {
                  textBlocks = [{ tag: e.effectTag, title: e.descriptionTitle, text: processText(e.description), isCollapsible: false }];
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

    // 7. COMPANION LOGIC
    
    const companionEntities = useMemo(() => {
        if (deferredSelection.choiceSlotType !== 'companion') return [];

        const allowedTypes = [EntityType.RACE, EntityType.CLASS, EntityType.GLOBAL_RULE, EntityType.ITEM];
        
        const allowedItemCategories = [
            'weapon', 'armor_head', 'armor_chest', 'armor_legs', 'shield',
            'seal', 'artifact', 'rebreather'
        ];

        return activeEntities.map(e => {
            // Check basic type allowance first
            if (!allowedTypes.includes(e.type)) return null;

            // DETERMINE MODE
            // 1. Check explicit override on entity
            let mode = e.companionAllowed;

            // 2. Backward compatibility (true -> full, false -> none)
            if (mode === true) mode = 'full';
            if (mode === false) mode = 'none';

            // 3. 'auto' or undefined: Use category logic
            if (!mode || mode === 'auto') {
                if (e.type === EntityType.ITEM) {
                    if (e.categoryId === 'enchantment') mode = 'none';
                    else if (allowedItemCategories.includes(e.categoryId || '')) mode = 'full';
                    else if (e.slotId === 'weapon_any') mode = 'full';
                    else mode = 'none';
                } else {
                    mode = 'full'; // Races, Classes, Rules are auto-allowed by default logic
                }
            }

            // APPLY MODE
            if (mode === 'none') return null;

            if (mode === 'stats_only') {
                // Return a Sanitized Virtual Copy
                const statsToKeep = ['vit', 'spd', 'dmg', 'res', 'aura', 'crit_primary', 'crit_secondary'];
                return {
                    ...e,
                    id: `${e.id}_comp_stats_only`,
                    modifiers: (e.modifiers || []).filter(m => 
                        statsToKeep.includes(m.targetStatKey) && 
                        (m.type === ModifierType.FLAT || m.type === ModifierType.PERCENT_ADD) &&
                        !m.toggleId && !m.toggleGroup // Remove toggles
                    ),
                    summons: [], // No summons
                    descriptionBlocks: [], // No text effects
                    description: `(Stats Uniquement) ${e.name}`
                };
            }

            // Full Mode
            return e;

        }).filter(Boolean) as Entity[];

    }, [activeEntities, deferredSelection.choiceSlotType]);
  
    const companionResult = useMemo(() => { 
        if (deferredSelection.choiceSlotType !== 'companion') return null; 
        
        const companionContext = {
            ...deferredSelection,
            specializationId: undefined, 
            professionId: undefined,     
            careerId: undefined,         
            guildIds: [],                
            subProfessions: {},          
            toggles: deferredSelection.companionToggles || {},
            // Inject Player Final Stats into companion context for reference (e.g. "10% of Master's HP")
            ...Object.fromEntries(Object.entries(result.stats).map(([k, v]) => [`player_${k}`, (v as StatResult).finalValue]))
        };

        return calculateStats(
            stats, 
            companionEntities, 
            companionContext,
            // ADDED PROCESSORS to ensure Full Calculation (Weapon Upgrades, Force Naturelle, Mount Boost)
            [processWeaponUpgrades, processForceNaturelle, processMountBoost]
        ); 
    }, [stats, companionEntities, deferredSelection, result.stats]);
    
    const companionDescriptions = useMemo(() => {
         if (deferredSelection.choiceSlotType !== 'companion') return [];
         
         const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
         const companionRatio = Number(companionScale) / 100;
         
         const compContext: any = { 
             level: deferredSelection.level, 
             soul_count: deferredSelection.soulCount || 0, 
             ...Object.fromEntries(Object.entries(companionResult?.stats || {}).map(([k, v]) => [k, (v as StatResult).finalValue])) 
         };

         return companionEntities
            .filter(e => (e.descriptionBlocks?.length || (e.description && e.description.trim() !== '')))
            .filter(e => e.type !== EntityType.GLOBAL_RULE && e.type !== EntityType.RACE)
            .map((e, idx) => { 
                let rawDesc = ''; 
                if (e.descriptionBlocks && e.descriptionBlocks.length > 0) rawDesc = e.descriptionBlocks[0].text; 
                else if (e.description) rawDesc = e.description; 
                
                let desc = rawDesc.replace(/\{\{(.*?)\}\}/g, (_, content) => { 
                    const trimmed = content.trim(); 
                    let val = companionResult?.modifierResults[trimmed]; 
                    if (val === undefined) { 
                        try { val = evaluateFormula(trimmed, compContext); } catch (e) { val = 0; } 
                    } 
                    if (typeof val === 'number') { 
                        const num = val * companionRatio; 
                        return Math.ceil(num).toString(); 
                    } 
                    return '0'; 
                }); 
                
                return { id: `${e.id}_comp_${idx}`, name: e.name, description: desc, type: e.type }; 
            });
    }, [companionEntities, companionResult, deferredSelection.choiceSlotType, result.stats, deferredSelection.level]);

    // 8. COMBINED SUMMONS (Player + Scaled Companion Summons)
    const allActiveSummons = useMemo(() => {
        let list = [...result.activeSummons];

        if (companionResult && companionResult.activeSummons.length > 0) {
            const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50;
            const ratio = companionScale / 100;

            const scaledCompanionSummons = companionResult.activeSummons.map(summon => ({
                ...summon,
                // On renomme pour que l'utilisateur sache d'où ça vient
                sourceName: `${summon.sourceName} (Compagnon)`,
                // On applique le ratio d'échelle aux stats de l'invocation
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
        allActiveSummons // Expose combined list
    };
};
