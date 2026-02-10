
// ... existing imports
import { StatDefinition, Entity, Modifier, ModifierType, StatResult, CalculationResult, EntityType, PlayerSelection, ActiveSummon, SummonDefinition, StatDetail, BreakdownComponent, SummonStatBreakdown } from '../types';

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
  isToggled?: (id: string) => boolean; // NEW: Helper
  [key: string]: any; 
}

// ... formulaCache, evaluateFormula, checkCondition, flattenItemConfigs, executePass, generateVirtualEntities ...
// (Conservez tout le code existant jusqu'à la fonction calculateStats)

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
        // Inject Base defaults for first pass
        currentStatValues[`${def.key}_base`] = def.baseValue;
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
            dynamicStats[`${k}_base`] = results[k].base; // Inject Base stats into helper context
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
            isToggled: (id: string) => !!(contextParams.toggles && contextParams.toggles[id]),
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
        ...itemConfigValues,
        toggles: contextParams.toggles || {}, 
        isToggled: (id: string) => !!(contextParams.toggles && contextParams.toggles[id]),
        utils: utils, 
        context: { ...contextParams, itemIds: allItemIds }
    };

    const getPriority = (type: string) => {
        switch(type) {
            case 'GLOBAL_RULE': return 0;
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
        Object.keys(results).forEach(key => { 
            evalContext[key] = results[key].finalValue;
            evalContext[`${key}_base`] = results[key].base; // INJECT BASE FOR FORMULAS
        });
        evalContext.pass_index = pass;
        evalContext.is_final_pass = (pass === PASSES - 1);

        const activeModifiers: { mod: Modifier; source: string; priority: number; entityType: string }[] = [];

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
                    const isInherent = [EntityType.RACE, EntityType.CLASS, EntityType.GLOBAL_RULE, EntityType.RACIAL_COMPETENCE].includes(m.entityType as EntityType);
                    
                    if (isInherent) {
                        inherentBase += val;
                        passTrace.push(`BASE [${m.source}]: +${val}`);
                        // CLEANUP: Only add to detailedBase if value is not 0
                        if (Math.abs(val) > 0) {
                            currentPassDetailsBase.push({ source: m.source, value: val });
                        }
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
                            // CLEANUP: Only add to detailedFlat if value is not 0
                            if (Math.abs(val) > 0) {
                                currentPassDetailsFlat.push({ source: m.source, value: val });
                            }
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
                
                if (m.mod.isPerTurn) {
                    perTurnSum += val;
                    passTrace.push(`GAIN ALT/TOUR [${m.source}]: +${val}/tr`);
                } else {
                    altFlatSum += val;
                    passTrace.push(`ALT FIXE [${m.source}]: +${val}`);
                }
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

const generateVirtualEntities = (entities: Entity[], safeContext: any, preCalcContext: any): { entities: Entity[], virtualIds: string[] } => {
    const generatedEntities: Entity[] = [];
    const virtualIds: string[] = [];

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
                        modifiers: [...baseItem.modifiers]
                    };

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

                    if (upgradeLevelDmg > 0) {
                        let targetStat = 'dmg';
                        let bonus = 50 * upgradeLevelDmg;
                        if (baseItem.subCategory === 'Anneaux') { targetStat = 'vit'; bonus = 50 * upgradeLevelDmg; }
                        else if (baseItem.subCategory === 'Gantelets') { targetStat = 'absorption'; bonus = 2 * upgradeLevelDmg; }
                        upsertMod(targetStat, bonus);
                    }

                    if (upgradeLevelVit > 0) {
                        upsertMod('vit', 50 * upgradeLevelVit);
                    }

                    generatedEntities.push(upgradedEntity);
                    safeContext.weaponSlots[idx] = uniqueId;
                }
            }
        });
    }

    if (safeContext.specializationId === 'spec_force_naturelle' && safeContext.naturalStrengthAllocation) {
        safeContext.naturalStrengthAllocation.forEach((slotId: string) => {
            let itemId: string | undefined;
            if (slotId.startsWith('weapon_')) {
                const idx = parseInt(slotId.split('_')[1]);
                itemId = safeContext.weaponSlots[idx];
            } else {
                itemId = safeContext.equippedItems[slotId];
            }

            if (itemId) {
                const item = generatedEntities.find(e => e.id === itemId) || entities.find(e => e.id === itemId);
                
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
                        generatedEntities.push({
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
                        virtualIds.push(virtualId);
                    }
                }
            }
        });
    }

    return { entities: generatedEntities, virtualIds };
};

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
      itemConfigs: contextParams?.itemConfigs || {}
  };
  
  let activeEntities = [...entities];
  
  const discoveryPass = executePass(statDefs, activeEntities, safeContext, []);
  
  const preCalcContext: any = { 
      level: safeContext.level ?? 0,
      soul_count: safeContext.soulCount || 0,
      ...(safeContext.sliderValues || {}),
      ...flattenItemConfigs(safeContext.itemConfigs), 
      ...safeContext,
      ...Object.fromEntries(Object.entries(discoveryPass.results).map(([k, v]) => [k, v.finalValue])),
      ...Object.fromEntries(Object.entries(discoveryPass.results).map(([k, v]) => [`${k}_base`, v.base])) // INJECT BASE STATS FOR PRECALC
  };

  const { entities: newEntities, virtualIds } = generateVirtualEntities(entities, safeContext, preCalcContext);
  activeEntities = [...activeEntities, ...newEntities];
  
  const passA = executePass(statDefs, activeEntities, safeContext, virtualIds); 
  
  const cap = passA.results['partition_cap']?.finalValue || 0;
  let finalResults = passA;
  
  if (cap > 0 && safeContext.partitionSlots && safeContext.partitionSlots.length > 0) {
      const validPartitionIds = safeContext.partitionSlots.slice(0, cap);
      if (validPartitionIds.length > 0) {
          const combinedExtraIds = [...virtualIds, ...validPartitionIds];
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
  const summonFlatBonus = finalResults.results['summon_flat_bonus']?.finalValue || 0;
  // NEW: Global Summon Multiplier Support
  const summonMultBonus = finalResults.results['summon_mult_bonus']?.finalValue || 0;
  const summonMultFactor = 1 + (summonMultBonus / 100);

  const allFinalStats = Object.fromEntries(
      Object.entries(finalResults.results).map(([k, v]) => [k, v.finalValue])
  );

  const summonContext: EvaluationContext = {
      ...finalContext,
      ...allFinalStats, 
      vit: getPreFinalStat('vit'),
      vit_base: finalResults.results['vit']?.base || 0,
      spd: getPreFinalStat('spd'),
      dmg: getPreFinalStat('dmg'),
      aura: getPreFinalStat('aura'), 
      res: getPreFinalStat('res'),
  };

  const generateBreakdown = (base: number, flat: number, context: any, stat: string): SummonStatBreakdown => {
      const components: BreakdownComponent[] = [];
      const booster = context.effect_booster || 0;
      const globalMult = context.summon_mult_bonus || 0;
      const croupier = context.croupier_mult || 1;
      const ratioDeck = context[`ratio_deck_${stat}`] || 0;
      const weaponEff = context.weapon_effect_mult || 1;

      // 1. Base
      if (base > 0) components.push({ label: `Base Joueur`, value: base });
      
      // 2. Flat Bonus
      if (flat > 0) components.push({ label: `Bonus Fixe Invoc`, value: `+${flat}` });

      // 3. Multipliers (Specific to Mastodonte logic mostly, but good generic display)
      if (croupier > 1) components.push({ label: `Multiplicateur Croupier`, value: `x${croupier}` });
      
      if (ratioDeck > 0) {
          const pct = Math.round(ratioDeck * 100);
          components.push({ label: `Ratio Deck (${stat.toUpperCase()})`, value: `+${pct}%` });
      }

      if (globalMult > 0) components.push({ label: `Boost Global Invoc`, value: `+${globalMult}%` });
      
      // Effect Booster is tricky because it's usually inside formulas, but we can show it if relevant
      if (booster > 0) components.push({ label: `Boost Effets Global`, value: `+${booster}%` });

      return {
          total: 0, // Calculated later
          components
      };
  };

  const equippedItemIds = new Set(finalContext.itemIds);
  activeEntities.forEach(ent => {
       if ((ent.type === 'ITEM' || ent.type === 'ITEM_SET' || ent.type === 'BUFF') && !equippedItemIds.has(ent.id)) return;

       if (ent.summons && ent.summons.length > 0) {
           ent.summons.forEach(s => {
               if (s.condition && !checkCondition(s.condition, summonContext)) return;
               
               const count = evaluateFormula(s.countValue, summonContext);
               if (count > 0) {
                   const baseVit = Math.ceil(evaluateFormula(s.stats.vit, summonContext));
                   const baseSpd = Math.ceil(evaluateFormula(s.stats.spd, summonContext));
                   const baseDmg = Math.ceil(evaluateFormula(s.stats.dmg, summonContext));

                   activeSummons.push({
                       id: s.id, 
                       sourceName: ent.name,
                       name: s.name,
                       count: Math.floor(count),
                       stats: {
                           vit: baseVit + summonFlatBonus,
                           spd: baseSpd + summonFlatBonus,
                           dmg: baseDmg + summonFlatBonus
                       },
                       breakdown: {
                           vit: { total: baseVit + summonFlatBonus, components: generateBreakdown(0, summonFlatBonus, summonContext, 'vit').components },
                           spd: { total: baseSpd + summonFlatBonus, components: generateBreakdown(0, summonFlatBonus, summonContext, 'spd').components },
                           dmg: { total: baseDmg + summonFlatBonus, components: generateBreakdown(0, summonFlatBonus, summonContext, 'dmg').components }
                       }
                   });
               }
           });
       }
  });

  // ANIMISTE / NECRO LOGIC (UNCHANGED, JUST WRAPPED IN NEW BREAKDOWN FORMAT)
  const invCount = finalResults.results['invocation_count']?.finalValue || 0;
  if (invCount > 0) {
      const rawShare = finalResults.results['invocation_share']?.finalValue || 0;
      const invShare = rawShare / 100;
      const splitFactor = invShare / invCount; 

      const baseVit = Math.ceil(getPreFinalStat('vit') * splitFactor * summonMultFactor);
      const baseSpd = Math.ceil(getPreFinalStat('spd') * splitFactor * summonMultFactor);
      const baseDmg = Math.ceil(getPreFinalStat('dmg') * splitFactor * summonMultFactor);

      activeSummons.push({
          sourceName: "Animiste",
          name: "Meute d'Invocations",
          count: invCount,
          sharePercent: rawShare,
          stats: {
              vit: baseVit + summonFlatBonus,
              spd: baseSpd + summonFlatBonus,
              dmg: baseDmg + summonFlatBonus,
          },
          breakdown: {
              vit: { total: baseVit + summonFlatBonus, components: [{ label: `Partage (${rawShare}%)`, value: baseVit }, { label: "Bonus Fixe", value: summonFlatBonus }] },
              spd: { total: baseSpd + summonFlatBonus, components: [{ label: `Partage (${rawShare}%)`, value: baseSpd }, { label: "Bonus Fixe", value: summonFlatBonus }] },
              dmg: { total: baseDmg + summonFlatBonus, components: [{ label: `Partage (${rawShare}%)`, value: baseDmg }, { label: "Bonus Fixe", value: summonFlatBonus }] }
          }
      });
  }

  const necroCount = finalResults.results['necro_pet_count']?.finalValue || 0;
  if (necroCount > 0) {
      const rawNecroShare = finalResults.results['necro_pet_share']?.finalValue || 0;
      const necroShare = rawNecroShare / 100;
      
      const baseVit = Math.ceil(getPreFinalStat('vit') * necroShare * summonMultFactor);
      const baseSpd = Math.ceil(getPreFinalStat('spd') * necroShare * summonMultFactor);
      const baseDmg = Math.ceil(getPreFinalStat('dmg') * necroShare * summonMultFactor);

      activeSummons.push({
          sourceName: "Nécromant",
          name: "Serviteur Macabre",
          count: necroCount,
          sharePercent: rawNecroShare,
          stats: {
              vit: baseVit + summonFlatBonus,
              spd: baseSpd + summonFlatBonus,
              dmg: baseDmg + summonFlatBonus,
          },
          breakdown: {
              vit: { total: baseVit + summonFlatBonus, components: [{ label: `Partage (${rawNecroShare}%)`, value: baseVit }, { label: "Bonus Fixe", value: summonFlatBonus }] },
              spd: { total: baseSpd + summonFlatBonus, components: [{ label: `Partage (${rawNecroShare}%)`, value: baseSpd }, { label: "Bonus Fixe", value: summonFlatBonus }] },
              dmg: { total: baseDmg + summonFlatBonus, components: [{ label: `Partage (${rawNecroShare}%)`, value: baseDmg }, { label: "Bonus Fixe", value: summonFlatBonus }] }
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
