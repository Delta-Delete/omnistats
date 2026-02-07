
import { useMemo } from 'react';
import { Entity, EntityType, PlayerSelection, StatDefinition, CalculationResult, StatResult, ModifierType } from '../types';
import { calculateStats, evaluateFormula, checkCondition } from '../services/engine';

interface UsePlayerEngineProps {
    selection: PlayerSelection;
    stats: StatDefinition[];
    entities: Entity[]; // System entities
    customItems: Entity[]; // Forge items
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
}

export const usePlayerEngine = ({ selection, stats, entities, customItems }: UsePlayerEngineProps): UsePlayerEngineResult => {
    
    // 1. COMBINE ITEMS
    const allItems: Entity[] = useMemo(() => { 
        return [...entities.filter(e => e.type === EntityType.ITEM), ...customItems]; 
    }, [entities, customItems]);

    // 2. IDENTIFY HELPERS
    const factions = useMemo(() => entities.filter(e => e.type === EntityType.FACTION), [entities]);
    const eliteCompetence = entities.find(e => e.type === EntityType.ELITE_COMPETENCE && e.parentId === selection.classId);
    const racialCompetence = entities.find(e => e.type === EntityType.RACIAL_COMPETENCE && (e.parentId === selection.raceId || e.parentId === selection.subRaceId));
    const coreRules = entities.filter(e => e.type === EntityType.GLOBAL_RULE);

    // 3. RESOLVE ACTIVE ENTITIES
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
        addEntity(entities.find(e => e.id === selection.raceId));
        addEntity(entities.find(e => e.id === selection.subRaceId));
        addEntity(entities.find(e => e.id === selection.classId));
        addEntity(entities.find(e => e.id === selection.specializationId));
        addEntity(entities.find(e => e.id === selection.professionId));
        addEntity(entities.find(e => e.id === selection.careerId));
        addEntity(entities.find(e => e.id === selection.factionId)); // Add Identity Faction
        
        // Add Sub-Professions (From map keys)
        if (selection.subProfessions) {
            Object.keys(selection.subProfessions).forEach(subId => {
                addEntity(entities.find(e => e.id === subId));
            });
        }

        (selection.guildIds || []).forEach(id => {
            const guildEntity = entities.find(e => e.id === id);
            addEntity(guildEntity);
            
            // PRIMARY GUILD RANK
            if (guildEntity && guildEntity.guildRanks && selection.guildRanks && selection.guildRanks[id]) {
                const rankId = selection.guildRanks[id];
                const rankData = guildEntity.guildRanks.find(r => r.id === rankId);
                if (rankData && rankData.modifiers && rankData.modifiers.length > 0) {
                    const rankEntity: Entity = {
                        id: `virtual_rank_${rankId}`,
                        type: EntityType.GLOBAL_RULE, 
                        name: `Rang : ${rankData.name}`,
                        modifiers: rankData.modifiers
                    };
                    addEntity(rankEntity);
                }
            }

            // SECONDARY GUILD RANK
            if (guildEntity && guildEntity.secondaryGuildRanks && selection.guildSecondaryRanks && selection.guildSecondaryRanks[id]) {
                const rankId = selection.guildSecondaryRanks[id];
                const rankData = guildEntity.secondaryGuildRanks.find(r => r.id === rankId);
                
                // Add modifiers from the rank itself (e.g. Ennemi des deux couronnes maluses)
                if (rankData && rankData.modifiers && rankData.modifiers.length > 0) {
                    const rankEntity: Entity = {
                        id: `virtual_rank_sec_${rankId}`,
                        type: EntityType.GLOBAL_RULE, 
                        name: `Réputation : ${rankData.name}`,
                        modifiers: rankData.modifiers
                    };
                    addEntity(rankEntity);
                }
                
                // GEMME SPELUNCIENNE LOGIC (Restored)
                if (id === 'guild_crocs_spelunca') {
                    const gemMap: Record<string, string> = {
                        'croc_rep_sympathisant': 'item_gemme_spel_1',
                        'croc_rep_allie': 'item_gemme_spel_2',
                        'croc_rep_ami': 'item_gemme_spel_3',
                        'croc_rep_fidele': 'item_gemme_spel_5'
                    };
                    const gemId = gemMap[rankId];
                    if (gemId) {
                        const gemItem = allItems.find(i => i.id === gemId);
                        if (gemItem) addEntity(gemItem);
                    }
                }
            }
        });

        // MANUAL GUILD BONUSES (Virtual Entity)
        if (selection.guildIds && selection.guildIds.length > 0 && selection.guildManualBonuses) {
            const bonuses = selection.guildManualBonuses;
            const manualModifiers = [];
            
            if (bonuses.vit) manualModifiers.push({ id: 'guild_man_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: bonuses.vit.toString() });
            if (bonuses.spd) manualModifiers.push({ id: 'guild_man_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: bonuses.spd.toString() });
            if (bonuses.dmg) manualModifiers.push({ id: 'guild_man_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: bonuses.dmg.toString() });
            
            // Only Corrompus get the Absorption bonus
            if (selection.classId === 'corrompu' && bonuses.absorption) {
                manualModifiers.push({ id: 'guild_man_abs', type: ModifierType.FLAT, targetStatKey: 'absorption', value: bonuses.absorption.toString() });
            }

            if (manualModifiers.length > 0) {
                addEntity({
                    id: 'guild_manual_bonus_virtual',
                    type: EntityType.GLOBAL_RULE,
                    name: 'Bonus de Guilde (Manuel)',
                    modifiers: manualModifiers
                });
            }
        }
   
        if (selection.eliteCompetenceActive && eliteCompetence) addEntity(eliteCompetence);
        if (selection.racialCompetenceActive && racialCompetence) addEntity(racialCompetence);
   
        // Item Instances
        const itemInstances = [ 
            ...Object.values(selection.equippedItems).map(getItem), 
            ...selection.weaponSlots.map(getItem), 
            ...selection.partitionSlots.map(getItem), 
            ...(selection.bonusItems || []).map(getItem), 
            ...(selection.sealItems || []).map(getItem), 
            ...(selection.specialItems || []).map(getItem) 
        ].filter(Boolean) as Entity[];
        
        // Factions/Sets Triggered by Items
        itemInstances.forEach(item => { 
            // Legacy Faction Trigger
            if (item.factionId) {
                const faction = entities.find(e => e.id === item.factionId && (e.type === EntityType.FACTION));
                addEntity(faction);
            }
            // Item Set Trigger
            if (item.setId) {
                const setEntity = entities.find(e => e.id === item.setId && e.type === EntityType.ITEM_SET);
                addEntity(setEntity);
            }
        });
   
        // Combine Unique System Entities + Item Instances (Instances allow duplicates like 2 weapons)
        return [...Array.from(uniqueEntityMap.values()), ...itemInstances];
   
     }, [selection, entities, coreRules, allItems, eliteCompetence, racialCompetence]);

    // 4. MAIN CALCULATION
    const result: CalculationResult = useMemo(() => { 
        const calcContext = { ...selection, soulCount: selection.soulCount || 0 };
        return calculateStats(stats, activeEntities, calcContext); 
    }, [stats, activeEntities, selection]);

    // 5. DISPLAY CONTEXT (For UI conditionals & Visual Utils)
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
        // CRITICAL FIX: Exposed equippedItems for visual utils (Hegemony Check in utils.tsx)
        equippedItems: selection.equippedItems,
        // CRITICAL FIX: Exposed toggles object for safe access in formulas (e.g., toggles.my_toggle)
        toggles: selection.toggles,
        ...(selection.toggles || {}), // Spread for direct access if needed
        ...(selection.sliderValues || {}), 
        ...Object.fromEntries(Object.entries(result.stats).map(([k, v]) => [k, (v as StatResult).finalValue]))
    }), [selection, result]);

    // 6. DESCRIPTION PARSING
    const activeDescriptions = useMemo(() => {
        const descContext: any = { 
            level: selection.level, 
            soul_count: selection.soulCount || 0,
            toggles: selection.toggles,
            context: { toggles: selection.toggles }, // Legacy support
            ...(selection.sliderValues || {}), 
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
              if (e.hideInRecap) return false; // NEW: Allow hiding specific entities from recap
              
              // Races/Factions are typically static summaries, ignored here
              if (e.type === EntityType.RACE || e.type === EntityType.FACTION) return false;
              
              // --- AGGRESSIVE FILTERING FOR CLEANER RECAP ---
              
              // 1. Remove Item Sets (Handled in dedicated Set Panel)
              if (e.type === EntityType.ITEM_SET) return false;

              // 2. Remove Items from "Panoplie du Capitaine" (Handled in Set Panel)
              if (e.type === EntityType.ITEM && e.setId === 'set_capitaine') return false;

              // 3. Remove Armor Options (Just stats, no lore)
              if (e.categoryId === 'armor_option') return false;

              // 4. Remove ALL Seals (Sceaux)
              if (e.categoryId === 'seal') return false;

              // 5. REMOVED: Filter for Fusions is gone. They are now allowed.

              // 6. Remove Custom Companions if description is default
              if (e.id.startsWith('custom_comp_')) {
                   const defaultDesc = "Un compagnon fidèle.";
                   if (!e.description || e.description.trim() === defaultDesc) return false;
              }

              // GLOBAL_RULE: Only show if they have explicit description blocks (Lore Rules)
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
    }, [activeEntities, result.modifierResults, result.stats, selection.level, selection.soulCount, selection.sliderValues, selection.toggles, stats]);

    // 7. COMPANION LOGIC
    const companionEntities = useMemo(() => {
        if (selection.choiceSlotType !== 'companion') return [];
        return activeEntities.filter(e => {
            if (e.companionAllowed === true) return true;
            if (e.companionAllowed === false) return false;
            if (e.type === EntityType.RACE) return true;
            if (e.type === EntityType.CLASS) return true;
            if (e.type === EntityType.SPECIALIZATION) return false;
            if (e.type === EntityType.ITEM) { const cat = e.categoryId || ''; const allowedCategories = ['weapon', 'armor_head', 'armor_chest', 'armor_legs', 'seal', 'artifact']; if (cat === 'enchantment') return false; if (e.factionId) { const isWeaponOrArmor = ['weapon', 'armor_head', 'armor_chest', 'armor_legs'].includes(cat); if (!isWeaponOrArmor) return false; } if (allowedCategories.includes(cat)) return true; }
            return false;
        });
    }, [activeEntities, selection]);
  
    const companionResult = useMemo(() => { 
        if (selection.choiceSlotType !== 'companion') return null; 
        return calculateStats(stats, companionEntities, selection); 
    }, [stats, companionEntities, selection]);
    
    const companionDescriptions = useMemo(() => {
        if (selection.choiceSlotType !== 'companion') return [];
        const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
        const companionRatio = Number(companionScale) / 100;
        const compContext: any = { level: selection.level, soul_count: selection.soulCount || 0, ...Object.fromEntries(Object.entries(companionResult?.stats || {}).map(([k, v]) => [k, (v as StatResult).finalValue])) };
        return companionEntities.filter(e => (e.descriptionBlocks?.length || (e.description && e.description.trim() !== ''))).filter(e => e.type !== EntityType.GLOBAL_RULE && e.type !== EntityType.RACE).map((e, idx) => { let rawDesc = ''; if (e.descriptionBlocks && e.descriptionBlocks.length > 0) rawDesc = e.descriptionBlocks[0].text; else if (e.description) rawDesc = e.description; let desc = rawDesc.replace(/\{\{(.*?)\}\}/g, (_, content) => { const trimmed = content.trim(); let val = companionResult?.modifierResults[trimmed]; if (val === undefined) { try { val = evaluateFormula(trimmed, compContext); } catch (e) { val = 0; } } if (typeof val === 'number') { const num = val * companionRatio; return Math.ceil(num).toString(); } return '0'; }); return { id: `${e.id}_comp_${idx}`, name: e.name, description: desc, type: e.type }; });
    }, [companionEntities, companionResult, selection.choiceSlotType, result.stats, selection.level, selection.soulCount]);

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
        racialCompetence
    };
};
