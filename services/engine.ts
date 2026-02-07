
// ... existing imports
import { StatDefinition, Entity, Modifier, ModifierType, StatResult, CalculationResult, EntityType, PlayerSelection, ActiveSummon, SummonDefinition, StatDetail } from '../types';

export interface EvaluationContext {
  // ... existing interface
  level: number;
  raceId?: string;
  subRaceId?: string;
  classId?: string;
  specializationId?: string;
  professionId?: string;
  factionId?: string; // NEW
  guildIds?: string[]; // NEW
  itemIds: string[];
  soul_count?: number; // Added soul_count
  pass_index?: number; // NEW: 0, 1, 2...
  is_final_pass?: boolean; // NEW: true if last pass
  [key: string]: any; 
}

// ... formulaCache and evaluateFormula unchanged ...
const formulaCache = new Map<string, Function>();
const MAX_CACHE_SIZE = 2000;

const clearCacheIfNeeded = () => {
    if (formulaCache.size > MAX_CACHE_SIZE) {
        formulaCache.clear();
        // console.debug("Formula cache cleared to prevent memory leak");
    }
};

/**
 * Enhanced Safe Math Evaluator
 * EXPORTED so AdminPanel can use it for previews.
 */
export const evaluateFormula = (formula: string, context: EvaluationContext): number => {
  if (!formula) return 0;
  
  try {
    // 1. Optimization: If purely numeric, return immediately
    const numeric = Number(formula);
    if (!isNaN(numeric)) return numeric;

    // 2. Prepare evaluation scope keys
    // Defensive copy to ensure we don't crash on null context
    const safeContext = context || {};
    
    // CRITICAL FIX: Sort keys to ensure cache hits regardless of object creation order
    const contextKeys = Object.keys(safeContext).sort();
    const contextValues = contextKeys.map(k => safeContext[k]);

    // 3. Check Cache
    const cacheKey = `${formula}::${contextKeys.join(',')}`;
    
    let func = formulaCache.get(cacheKey);
    
    if (!func) {
        clearCacheIfNeeded();
        // Create the function. 
        // We wrap in try/catch to return 0 on runtime errors (e.g. division by zero, undefined prop)
        // eslint-disable-next-line
        func = new Function(...contextKeys, `try { return (${formula}); } catch(e) { return 0; }`);
        formulaCache.set(cacheKey, func);
    }

    // 4. Execute
    const result = func(...contextValues);
    
    return isNaN(Number(result)) ? 0 : Number(result);
  } catch (e) {
    // console.warn('Formula eval error:', e);
    return 0;
  }
};

// ... checkCondition unchanged ...
export const checkCondition = (condition: string | undefined, context: EvaluationContext): boolean => {
  if (!condition || condition.trim() === '') return true;
  try {
    const safeContext = context || {};
    // CRITICAL FIX: Sort keys here as well
    const contextKeys = Object.keys(safeContext).sort();
    const contextValues = contextKeys.map(k => safeContext[k]);
    
    const cacheKey = `COND:${condition}::${contextKeys.join(',')}`;

    let func = formulaCache.get(cacheKey);
    if (!func) {
        clearCacheIfNeeded();
        // eslint-disable-next-line
        func = new Function(...contextKeys, `try { return !!(${condition}); } catch(e) { return false; }`);
        formulaCache.set(cacheKey, func);
    }
    
    return func(...contextValues);
  } catch (e) {
    console.warn(`Condition error "${condition}":`, e);
    return false;
  }
};

// Helper to flatten itemConfigs into the context
const flattenItemConfigs = (configs: Record<string, any> | undefined): Record<string, number> => {
    const flattened: Record<string, number> = {};
    if (!configs) return flattened;
    
    Object.entries(configs).forEach(([itemId, values]) => {
        if (values.val !== undefined) flattened[`config_${itemId}_val`] = values.val;
        if (values.vit !== undefined) flattened[`config_${itemId}_vit`] = values.vit;
        if (values.spd !== undefined) flattened[`config_${itemId}_spd`] = values.spd;
        if (values.dmg !== undefined) flattened[`config_${itemId}_dmg`] = values.dmg;
    });
    return flattened;
};

const executePass = (
    statDefs: StatDefinition[], 
    entities: Entity[], 
    contextParams: any, 
    extraItemIds: string[] = []
): { results: Record<string, StatResult>, modifierResults: Record<string, number>, evalContext: EvaluationContext } => {
    
    const results: Record<string, StatResult> = {};
    const modifierResults: Record<string, number> = {}; 
    const currentStatValues: Record<string, number> = {}; 

    // ... Init results loop ...
    (statDefs || []).forEach(def => {
        results[def.key] = {
            key: def.key,
            base: def.baseValue,
            finalValue: def.baseValue,
            perTurn: 0, // Init perTurn
            perTurnPercent: 0, // Init perTurnPercent
            breakdown: { base: def.baseValue, flat: 0, percentAdd: 0, percentMultiPre: 0, finalAdditivePercent: 0, altFlat: 0, altPercent: 0 },
            detailedBase: [], // Init detailed lists
            detailedFlat: [],
            trace: [`[${def.label}] Definition: ${def.baseValue}`]
        };
        currentStatValues[def.key] = def.baseValue;
    });

    // ... existing logic to combine items ...
    const safeEquipped = contextParams.equippedItems || {};
    const safeWeapons = contextParams.weaponSlots || [];
    const safeBonus = contextParams.bonusItems || [];
    const safeSeals = contextParams.sealItems || [];
    const safeSpecials = contextParams.specialItems || [];

    const allItemIds = [
        ...Object.values(safeEquipped),
        ...safeWeapons,
        ...safeBonus,
        ...safeSeals,
        ...safeSpecials,
        ...extraItemIds
    ].filter(Boolean) as string[];

    const safeEntities = Array.isArray(entities) ? entities : [];
    const equippedInstances = allItemIds.map(id => safeEntities.find(e => e.id === id)).filter(Boolean) as Entity[];

    // ... isMatch helper ...
    const isMatch = (item: Entity, target: string) => {
        if (!item) return false;
        const targetLower = target.toLowerCase();
        if (item.categoryId?.toLowerCase() === targetLower) return true;
        if (item.subCategory?.toLowerCase() === targetLower) return true;
        if (item.name.toLowerCase().includes(targetLower)) return true;
        if (item.tags && item.tags.some(t => t.toLowerCase() === targetLower)) return true;
        if (target === 'Instrument' && item.subCategory?.startsWith('Instrument')) return true;
        if (item.subCategory && item.subCategory.toLowerCase().includes('multi-type')) {
             if (targetLower.includes('percussion') || targetLower.includes('corde') || targetLower.includes('vent')) {
                 return true;
             }
        }
        if (['Vent', 'Corde', 'Percussion'].includes(target)) {
            if (item.subCategory?.includes(target)) return true;
        }
        return false;
    };

    // Helper context logic
    const getHelperContext = () => {
        const dynamicStats: Record<string, number> = {};
        Object.keys(results).forEach(k => {
            dynamicStats[k] = results[k].finalValue;
        });

        const sliderValues = contextParams.sliderValues || {};
        // NEW: Flatten item configs for helper context too
        const itemConfigValues = flattenItemConfigs(contextParams.itemConfigs);

        return {
            ...currentStatValues, 
            ...dynamicStats,      
            level: contextParams.level ?? 0, 
            soul_count: contextParams.soulCount || 0,
            ...sliderValues,     
            ...itemConfigValues, // Inject config vars
            toggles: contextParams.toggles || {}, // ADDED: Toggles for helpers
            ...contextParams 
        };
    };

    // ... utils definition (bestItemStat, etc.) unchanged ...
    const utils = {
        bestItemStat: (categoryOrSub: string, statKey: string): number => {
            const candidates = equippedInstances.filter(item => isMatch(item, categoryOrSub));
            if (candidates.length === 0) return 0;
            let maxVal = 0;
            const ctx = getHelperContext();
            candidates.forEach(item => {
                let itemVal = 0;
                (item.modifiers || []).filter(m => m.targetStatKey === statKey && m.type === ModifierType.FLAT).forEach(m => {
                    itemVal += evaluateFormula(m.value, ctx as any);
                });
                if (itemVal > maxVal) maxVal = itemVal;
            });
            return maxVal;
        },
        sumItemStats: (categoryOrSub: string, statKey: string): number => {
            let total = 0;
            const candidates = equippedInstances.filter(item => isMatch(item, categoryOrSub));
            const ctx = getHelperContext();
            
            candidates.forEach(item => {
                (item.modifiers || []).filter(m => m.targetStatKey === statKey && m.type === ModifierType.FLAT).forEach(m => {
                        total += evaluateFormula(m.value, ctx as any);
                });
            });
            return total;
        },
        sumItemCost: (categoryOrSub: string): number => {
            let total = 0;
            const candidates = equippedInstances.filter(item => isMatch(item, categoryOrSub));
            const ctx = getHelperContext();
            const reductionActive = (ctx['reduce_heavy_weapon_cost'] || 0) > 0;

            candidates.forEach(item => {
                let cost = item.equipmentCost || 0;
                if (reductionActive && cost === 2) cost = 1;
                total += cost;
            });
            return total;
        },
        maxItemCost: (categoryOrSub: string): number => {
            let max = 0;
            const candidates = equippedInstances.filter(item => isMatch(item, categoryOrSub));
            const ctx = getHelperContext();
            const reductionActive = (ctx['reduce_heavy_weapon_cost'] || 0) > 0;

            candidates.forEach(item => {
                let cost = item.equipmentCost || 0;
                if (reductionActive && cost === 2) cost = 1;
                if (cost > max) max = cost;
            });
            return max;
        },
        sumOriginalItemCost: (categoryOrSub: string): number => {
            let total = 0;
            const candidates = equippedInstances.filter(item => isMatch(item, categoryOrSub));
            candidates.forEach(item => {
                total += (item.equipmentCost || 0);
            });
            return total;
        },
        maxOriginalItemCost: (categoryOrSub: string): number => {
            let max = 0;
            const candidates = equippedInstances.filter(item => isMatch(item, categoryOrSub));
            candidates.forEach(item => {
                const cost = item.equipmentCost || 0;
                if (cost > max) max = cost;
            });
            return max;
        },
        countItems: (categoryOrSub: string): number => {
            return equippedInstances.filter(item => isMatch(item, categoryOrSub)).length;
        },
        countFaction: (factionId: string): number => {
            return equippedInstances.filter(item => item.factionId === factionId).length;
        },
        countSet: (setId: string): number => {
            return equippedInstances.filter(item => item.setId === setId).length;
        },
        countCustomItems: (): number => {
            return equippedInstances.filter(item => item.id.startsWith('custom_wep_')).length;
        },
        hasItem: (itemId: string): boolean => {
            return allItemIds.includes(itemId);
        }
    };

    const sliderValues = contextParams.sliderValues || {};
    // NEW: Flatten configs for main eval context
    const itemConfigValues = flattenItemConfigs(contextParams.itemConfigs);

    const evalContext: EvaluationContext = {
        ...currentStatValues,
        level: contextParams.level ?? 0, 
        raceId: contextParams.raceId,
        subRaceId: contextParams.subRaceId,
        classId: contextParams.classId,
        specializationId: contextParams.specializationId,
        professionId: contextParams.professionId,
        factionId: contextParams.factionId, 
        guildIds: contextParams.guildIds, 
        itemIds: allItemIds,
        soul_count: contextParams.soulCount || 0,
        pass_index: 0, 
        is_final_pass: false,
        ...utils,
        ...sliderValues, 
        ...itemConfigValues, // INJECT CONFIGS HERE
        toggles: contextParams.toggles || {}, // CRITICAL FIX: Inject toggles object for formula access
        utils: utils, 
        context: { ...contextParams, itemIds: allItemIds }
    };

    // ... Priority logic and Main Loop ...
    // MODIFIED: GLOBAL_RULE set to 0 to run first (Sync PP, etc.)
    const getPriority = (type: string) => {
        switch(type) {
            case 'GLOBAL_RULE': return 0; // Highest priority for rule syncing
            case 'RACE': return 0;
            case 'CLASS': return 1;
            case 'SPECIALIZATION': return 2;
            case 'PROFESSION': return 3;
            case 'FACTION': return 3; 
            case 'GUILD': return 3; 
            case 'ITEM_SET': return 3; 
            case 'ITEM': return 4;
            default: return 5;
        }
    };

    const safeToggles = contextParams.toggles || {};
    const PASSES = 3;

    for (let pass = 0; pass < PASSES; pass++) {
        Object.keys(results).forEach(key => { evalContext[key] = results[key].finalValue; });
        evalContext.pass_index = pass;
        evalContext.is_final_pass = (pass === PASSES - 1);

        const activeModifiers: { mod: Modifier; source: string; priority: number; entityType: string }[] = [];

        // 2a. Process Singleton Entities
        safeEntities.forEach(ent => {
            if (ent.type === EntityType.ITEM || ent.type === EntityType.BUFF) return;
            (ent.modifiers || []).forEach(mod => {
                 if (mod.toggleId && !safeToggles[mod.toggleId]) return;
                 if (checkCondition(mod.condition, evalContext)) {
                    const sourceName = mod.name ? `${ent.name} (${mod.name})` : ent.name;
                    activeModifiers.push({ mod, source: sourceName, priority: getPriority(ent.type), entityType: ent.type });
                 }
            });
        });

        // 2b. Process Item Instances
        allItemIds.forEach((itemId, idx) => {
             const ent = safeEntities.find(e => e.id === itemId);
             if (!ent) return;
             if (ent.type !== EntityType.ITEM && ent.type !== EntityType.ITEM_SET && ent.type !== EntityType.BUFF) return;

             (ent.modifiers || []).forEach(mod => {
                 if (mod.toggleId && !safeToggles[mod.toggleId]) return;
                 if (checkCondition(mod.condition, evalContext)) {
                    const suffix = allItemIds.filter(id => id === itemId).length > 0 ? ` #${idx+1}` : '';
                    const sourceName = mod.name ? `${ent.name}${suffix} (${mod.name})` : `${ent.name}${suffix}`;
                    activeModifiers.push({ mod, source: sourceName, priority: getPriority(ent.type), entityType: ent.type });
                 }
            });
        });
        
        activeModifiers.sort((a, b) => a.priority - b.priority);

        // ... calculation loop (unchanged) ...
        (statDefs || []).forEach(stat => {
            const res = results[stat.key];
            if (!res) return;

            const mods = activeModifiers.filter(m => m.mod.targetStatKey === stat.key);
            
            let inherentBase = stat.baseValue; 
            let flatSum = 0;
            let perTurnSum = 0;
            let perTurnPercentSum = 0;
            let percentAddSum = 0;
            let percentMultiPreSum = 0;
            let finalAdditivePercentSum = 0;
            let altFlatSum = 0;
            let altPercentProd = 1;
            
            const currentPassDetailsBase: StatDetail[] = [];
            const currentPassDetailsFlat: StatDetail[] = [];
            const passTrace: string[] = [`--- Passe ${pass + 1} ---`];

            const override = [...mods].reverse().find(m => m.mod.type === ModifierType.OVERRIDE);
            
            if (override) {
                const val = evaluateFormula(override.mod.value, evalContext);
                modifierResults[override.mod.id] = val;
                res.finalValue = val;
                passTrace.push(`ÉCRASE par ${override.source}: = ${val}`);
                res.trace = [...res.trace, ...passTrace];
                res.detailedBase = [{ source: override.source, value: val }];
                res.detailedFlat = [];
                return; 
            }

            mods.filter(m => m.mod.type === ModifierType.FLAT).forEach(m => {
                const val = evaluateFormula(m.mod.value, evalContext);
                modifierResults[m.mod.id] = val;
                
                if (m.mod.isPerTurn) {
                    perTurnSum += val;
                    passTrace.push(`GAIN/TOUR [${m.source}]: +${val}/tr`);
                } else {
                    const isInherent = [EntityType.RACE, EntityType.GLOBAL_RULE, EntityType.RACIAL_COMPETENCE].includes(m.entityType as EntityType);
                    if (isInherent) {
                        inherentBase += val;
                        passTrace.push(`BASE [${m.source}]: +${val}`);
                        currentPassDetailsBase.push({ source: m.source, value: val });
                    } else {
                        if (stat.key === 'partition_cap') {
                            if (val > flatSum) {
                                flatSum = val;
                                currentPassDetailsFlat.length = 0; 
                                currentPassDetailsFlat.push({ source: m.source, value: val });
                                passTrace.push(`MAX [${m.source}]: ${val} (Remplace le précédent)`);
                            } else {
                                passTrace.push(`IGNORÉ [${m.source}]: ${val} (Inférieur au max actuel: ${flatSum})`);
                            }
                        } else {
                            flatSum += val;
                            passTrace.push(`BONUS [${m.source}]: +${val}`);
                            currentPassDetailsFlat.push({ source: m.source, value: val });
                        }
                    }
                }
            });

            mods.filter(m => m.mod.type === ModifierType.PERCENT_ADD).forEach(m => {
                const val = evaluateFormula(m.mod.value, evalContext);
                modifierResults[m.mod.id] = val;
                if (m.mod.isPerTurn) { perTurnPercentSum += val; passTrace.push(`GAIN %/TOUR [${m.source}]: +${val}%/tr`); } 
                else { percentAddSum += val; passTrace.push(`% ADD [${m.source}]: +${val}%`); }
            });

            mods.filter(m => m.mod.type === ModifierType.PERCENT_MULTI_PRE).forEach(m => {
                const val = evaluateFormula(m.mod.value, evalContext);
                modifierResults[m.mod.id] = val;
                percentMultiPreSum += val;
                passTrace.push(`% PRE-POSTURE [${m.source}]: +${val}%`);
            });

            mods.filter(m => m.mod.type === ModifierType.FINAL_ADDITIVE_PERCENT).forEach(m => {
                const val = evaluateFormula(m.mod.value, evalContext);
                modifierResults[m.mod.id] = val;
                finalAdditivePercentSum += val;
                passTrace.push(`% FINAL ADD [${m.source}]: +${val}%`);
            });

            mods.filter(m => m.mod.type === ModifierType.ALT_FLAT).forEach(m => {
                const val = evaluateFormula(m.mod.value, evalContext);
                modifierResults[m.mod.id] = val;
                altFlatSum += val;
                passTrace.push(`ALT FIXE [${m.source}]: +${val}`);
            });
            mods.filter(m => m.mod.type === ModifierType.ALT_PERCENT).forEach(m => {
                const val = evaluateFormula(m.mod.value, evalContext);
                modifierResults[m.mod.id] = val;
                const factor = 1 + (val / 100);
                altPercentProd *= factor;
                passTrace.push(`ALT MULT [${m.source}]: x${factor.toFixed(2)}`);
            });

            const baseWithFlat = inherentBase + flatSum;
            const withPercentAdd = baseWithFlat * (1 + (percentAddSum / 100));
            const withPreMulti = withPercentAdd * (1 + (percentMultiPreSum / 100));
            const withFinalAdditive = withPreMulti * (1 + (finalAdditivePercentSum / 100));
            const withAltFlat = withFinalAdditive + altFlatSum;
            const final = withAltFlat * altPercentProd;

            res.breakdown = { base: inherentBase, flat: flatSum, percentAdd: percentAddSum, percentMultiPre: percentMultiPreSum, finalAdditivePercent: finalAdditivePercentSum, altFlat: altFlatSum, altPercent: (altPercentProd - 1) * 100 };
            res.base = inherentBase;
            res.perTurn = perTurnSum;
            res.perTurnPercent = perTurnPercentSum;

            let clamped = final;
            if (stat.min !== undefined) clamped = Math.max(stat.min, clamped);
            if (stat.max !== undefined) clamped = Math.min(stat.max, clamped);
            
            if (stat.precision !== undefined && stat.precision > 0) {
                const p = Math.pow(10, stat.precision);
                res.finalValue = Math.round(clamped * p) / p;
            } else {
                res.finalValue = Math.ceil(clamped);
            }
            
            if (pass === PASSES - 1) {
                res.detailedBase = currentPassDetailsBase;
                res.detailedFlat = currentPassDetailsFlat;
                res.trace.push(...passTrace);
                res.trace.push(`FINAL: ${res.finalValue} (Base Inné: ${inherentBase} + Bonus: ${flatSum})`);
                if (perTurnSum > 0 || perTurnPercentSum > 0) res.trace.push(`NOTE: Gain de +${perTurnSum} (Flat) et +${perTurnPercentSum}% par tour (Non inclus dans le total)`);
            }
        });
    }

    return { results, modifierResults, evalContext };
}

export const calculateStats = (
  statDefs: StatDefinition[],
  entities: Entity[],
  contextParams: any
): CalculationResult => {
  const start = performance.now();
  
  const safeContext = {
      ...(contextParams || {}),
      weaponSlots: contextParams?.weaponSlots ? [...contextParams.weaponSlots] : [],
      level: contextParams?.level ?? 0,
      equippedItems: contextParams?.equippedItems || {},
      partitionSlots: contextParams?.partitionSlots || [],
      bonusItems: contextParams?.bonusItems || [],
      sealItems: contextParams?.sealItems || [],
      specialItems: contextParams?.specialItems || [],
      toggles: contextParams?.toggles || {},
      sliderValues: contextParams?.sliderValues || {},
      soulCount: contextParams?.soulCount || 0,
      itemConfigs: contextParams?.itemConfigs || {} // Pass configs
  };
  
  const activeEntities = [...entities];
  
  // Pass 0 (Discovery)
  const discoveryPass = executePass(statDefs, activeEntities, safeContext, []);
  
  // Update Pre-Calc Context with results
  const preCalcContext: any = { 
      level: safeContext.level ?? 0,
      soul_count: safeContext.soulCount || 0,
      ...(safeContext.sliderValues || {}),
      ...flattenItemConfigs(safeContext.itemConfigs), // Flatten configs here too
      ...safeContext,
      ...Object.fromEntries(Object.entries(discoveryPass.results).map(([k, v]) => [k, v.finalValue]))
  };

  // ... Virtual Items Generation (Force Naturelle, Upgrades) ...
  const virtualItemIds: string[] = [];
  
  // MODIFIED: Handle BOTH Damage and Vitality upgrades on weapons
  if (safeContext.weaponSlots) {
      safeContext.weaponSlots.forEach((itemId, idx) => {
          if (!itemId) return;
          const upgradeLevelDmg = Number(safeContext.weaponUpgrades?.[idx] || 0);
          const upgradeLevelVit = Number(safeContext.weaponUpgradesVit?.[idx] || 0); // NEW

          // Process upgrades if either exists
          if (upgradeLevelDmg > 0 || upgradeLevelVit > 0) {
              const baseItem = entities.find(e => e.id === itemId);
              if (baseItem) {
                  let uniqueId = `${baseItem.id}_upgraded_slot_${idx}`;
                  const upgradedEntity: Entity = {
                      ...baseItem,
                      id: uniqueId,
                      name: `${baseItem.name} ${upgradeLevelDmg > 0 ? `(+${upgradeLevelDmg} DMG)` : ''} ${upgradeLevelVit > 0 ? `(+${upgradeLevelVit} VIT)` : ''}`,
                      modifiers: [...baseItem.modifiers] // Clone mods
                  };

                  // 1. DAMAGE UPGRADE LOGIC
                  if (upgradeLevelDmg > 0) {
                      let targetStat = 'dmg';
                      let bonus = 50 * upgradeLevelDmg;
                      if (baseItem.subCategory === 'Anneaux') { targetStat = 'vit'; bonus = 50 * upgradeLevelDmg; }
                      else if (baseItem.subCategory === 'Gantelets') { targetStat = 'absorption'; bonus = 2 * upgradeLevelDmg; }

                      let modFound = false;
                      let applied = false; // Prevent multiple applications to same stat
                      
                      upgradedEntity.modifiers = upgradedEntity.modifiers.map(m => {
                          if (!applied && m.targetStatKey === targetStat && m.type === ModifierType.FLAT) {
                              applied = true;
                              modFound = true;
                              const multPattern = /^(\d+)\s*\*\s*([a-zA-Z_0-9]+)$/;
                              const match = m.value.match(multPattern);
                              let newValue = `(${m.value} + ${bonus})`;
                              if (match) {
                                  const baseVal = match[1];
                                  const variable = match[2];
                                  newValue = `(${baseVal} + ${bonus}) * ${variable}`;
                              }
                              return { ...m, value: newValue };
                          }
                          return m;
                      });

                      if (!modFound) {
                          upgradedEntity.modifiers.push({ id: `auto_upgrade_dmg_${idx}`, type: ModifierType.FLAT, targetStatKey: targetStat, value: bonus.toString() });
                      }
                  }

                  // 2. VITALITY UPGRADE LOGIC (NEW)
                  if (upgradeLevelVit > 0) {
                      const bonusVit = 50 * upgradeLevelVit;
                      let modFound = false;
                      let applied = false; // Prevent multiple applications to same stat

                      // Update existing Vit mod if present
                      upgradedEntity.modifiers = upgradedEntity.modifiers.map(m => {
                          if (!applied && m.targetStatKey === 'vit' && m.type === ModifierType.FLAT) {
                              applied = true;
                              modFound = true;
                              const multPattern = /^(\d+)\s*\*\s*([a-zA-Z_0-9]+)$/;
                              const match = m.value.match(multPattern);
                              let newValue = `(${m.value} + ${bonusVit})`;
                              if (match) {
                                  const baseVal = match[1];
                                  const variable = match[2];
                                  newValue = `(${baseVal} + ${bonusVit}) * ${variable}`;
                              }
                              return { ...m, value: newValue };
                          }
                          return m;
                      });

                      if (!modFound) {
                          upgradedEntity.modifiers.push({ id: `auto_upgrade_vit_${idx}`, type: ModifierType.FLAT, targetStatKey: 'vit', value: bonusVit.toString() });
                      }
                  }

                  activeEntities.push(upgradedEntity);
                  safeContext.weaponSlots[idx] = uniqueId;
              }
          }
      });
  }

  if (safeContext.specializationId === 'spec_force_naturelle' && safeContext.naturalStrengthAllocation) {
      safeContext.naturalStrengthAllocation.forEach(slotId => {
          let itemId: string | undefined;
          if (slotId.startsWith('weapon_')) {
              const idx = parseInt(slotId.split('_')[1]);
              itemId = safeContext.weaponSlots[idx];
          } else {
              itemId = safeContext.equippedItems[slotId];
          }

          if (itemId) {
              const item = activeEntities.find(e => e.id === itemId);
              if (item) {
                  let spdSum = 0;
                  (item.modifiers || []).forEach(m => {
                      if (m.targetStatKey === 'spd' && m.type === ModifierType.FLAT) {
                          spdSum += evaluateFormula(m.value, preCalcContext as any);
                      }
                  });

                  if (spdSum < 0) {
                      const refundVal = Math.abs(spdSum);
                      const virtualId = `fn_refund_${slotId}`;
                      activeEntities.push({
                          id: virtualId,
                          type: EntityType.BUFF,
                          name: `Force Naturelle (${item.name})`,
                          modifiers: [{
                              id: `mod_fn_${slotId}`,
                              type: ModifierType.FLAT,
                              targetStatKey: 'spd',
                              value: refundVal.toString(),
                              name: 'Compensation Poids'
                          }]
                      });
                      virtualItemIds.push(virtualId);
                  }
              }
          }
      });
  }

  const passA = executePass(statDefs, activeEntities, safeContext, virtualItemIds); 
  const cap = passA.results['partition_cap']?.finalValue || 0;
  
  let finalResults = passA;
  
  if (cap > 0 && safeContext.partitionSlots && safeContext.partitionSlots.length > 0) {
      const validPartitionIds = safeContext.partitionSlots.slice(0, cap);
      if (validPartitionIds.length > 0) {
          const combinedExtraIds = [...virtualItemIds, ...validPartitionIds];
          finalResults = executePass(statDefs, activeEntities, safeContext, combinedExtraIds);
      }
  }

  const getPreFinalStat = (key: string) => {
      const res = finalResults.results[key];
      if (!res) return 0;
      const bd = res.breakdown;
      return (bd.base + bd.flat) * (1 + (bd.percentAdd / 100)) * (1 + (bd.percentMultiPre / 100));
  };

  const activeSummons: ActiveSummon[] = [];
  const finalContext = finalResults.evalContext;
  
  // NEW: Retrieve Flat Bonus for Summons
  const summonFlatBonus = finalResults.results['summon_flat_bonus']?.finalValue || 0;

  const summonContext: EvaluationContext = {
      ...finalContext,
      vit: getPreFinalStat('vit'),
      spd: getPreFinalStat('spd'),
      dmg: getPreFinalStat('dmg'),
      aura: getPreFinalStat('aura'), // REPLACED ARMOR WITH AURA
      res: getPreFinalStat('res'),
  };

  const equippedItemIds = new Set(finalContext.itemIds);
  activeEntities.forEach(ent => {
       if ((ent.type === 'ITEM' || ent.type === 'ITEM_SET' || ent.type === 'BUFF') && !equippedItemIds.has(ent.id)) return;

       if (ent.summons && ent.summons.length > 0) {
           ent.summons.forEach(s => {
               if (s.condition && !checkCondition(s.condition, summonContext)) return;
               
               const count = evaluateFormula(s.countValue, summonContext);
               if (count > 0) {
                   activeSummons.push({
                       id: s.id, 
                       sourceName: ent.name,
                       name: s.name,
                       count: Math.floor(count),
                       stats: {
                           vit: Math.ceil(evaluateFormula(s.stats.vit, summonContext)) + summonFlatBonus,
                           spd: Math.ceil(evaluateFormula(s.stats.spd, summonContext)) + summonFlatBonus,
                           dmg: Math.ceil(evaluateFormula(s.stats.dmg, summonContext)) + summonFlatBonus
                       }
                   });
               }
           });
       }
  });

  const invCount = finalResults.results['invocation_count']?.finalValue || 0;
  if (invCount > 0) {
      const rawShare = finalResults.results['invocation_share']?.finalValue || 0;
      const invShare = rawShare / 100;
      const splitFactor = invShare / invCount; 

      activeSummons.push({
          sourceName: "Animiste",
          name: "Meute d'Invocations",
          count: invCount,
          sharePercent: rawShare,
          stats: {
              vit: Math.ceil(getPreFinalStat('vit') * splitFactor) + summonFlatBonus,
              spd: Math.ceil(getPreFinalStat('spd') * splitFactor) + summonFlatBonus,
              dmg: Math.ceil(getPreFinalStat('dmg') * splitFactor) + summonFlatBonus,
          }
      });
  }

  const necroCount = finalResults.results['necro_pet_count']?.finalValue || 0;
  if (necroCount > 0) {
      const rawNecroShare = finalResults.results['necro_pet_share']?.finalValue || 0;
      const necroShare = rawNecroShare / 100;
      activeSummons.push({
          sourceName: "Nécromant",
          name: "Serviteur Macabre",
          count: necroCount,
          sharePercent: rawNecroShare,
          stats: {
              vit: Math.ceil(getPreFinalStat('vit') * necroShare) + summonFlatBonus,
              spd: Math.ceil(getPreFinalStat('spd') * necroShare) + summonFlatBonus,
              dmg: Math.ceil(getPreFinalStat('dmg') * necroShare) + summonFlatBonus,
          }
      });
  }

  const end = performance.now();
  return {
    stats: finalResults.results,
    modifierResults: finalResults.modifierResults,
    activeSummons: activeSummons,
    logs: [],
    executionTime: end - start
  };
};
