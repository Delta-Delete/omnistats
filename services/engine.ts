
// ... imports unchanged ...
import { StatDefinition, Entity, Modifier, ModifierType, StatResult, CalculationResult, EntityType, ActiveSummon, StatDetail, SummonProcessor } from '../types';
import { STATS } from './constants';

export interface EvaluationContext {
// ... (Interface EvaluationContext unchanged)
  level: number;
  raceId?: string;
  subRaceId?: string;
  classId?: string;
  specializationId?: string;
  professionId?: string;
  factionId?: string;
  guildIds?: string[];
  itemIds: string[];
  soul_count?: number;
  pass_index?: number;
  is_final_pass?: boolean;
  unit_scale?: number;
  [key: string]: any; 
}

const formulaCache = new Map<string, Function>();
const MAX_CACHE_SIZE = 2000;

const clearCacheIfNeeded = () => {
    if (formulaCache.size > MAX_CACHE_SIZE) {
        formulaCache.clear();
    }
};

// Mode debug global
let DEBUG_FORMULAS = false;
export const setEngineDebug = (val: boolean) => { DEBUG_FORMULAS = val; };

export const evaluateFormula = (formula: string, context: EvaluationContext): number => {
// ... (evaluateFormula unchanged)
  if (!formula) return 0;
  const numeric = Number(formula);
  if (!isNaN(numeric)) return numeric;

  try {
    const safeContext = context || {};
    const contextKeys = Object.keys(safeContext).sort();
    const contextValues = contextKeys.map(k => safeContext[k]);

    const cacheKey = `${formula}::${contextKeys.join(',')}`;
    
    let func = formulaCache.get(cacheKey);
    
    if (!func) {
        clearCacheIfNeeded();
        // eslint-disable-next-line
        func = new Function(...contextKeys, `try { return (${formula}); } catch(e) { throw e; }`);
        formulaCache.set(cacheKey, func);
    }

    const result = func(...contextValues);
    return isNaN(Number(result)) ? 0 : Number(result);
  } catch (e) {
    if (DEBUG_FORMULAS) {
        console.error(`[Engine] Error evaluating formula: "${formula}"`, e);
    }
    return 0;
  }
};

export const validateFormulaSyntax = (formula: string): boolean => {
// ... (validateFormulaSyntax unchanged)
    if (!formula || !isNaN(Number(formula))) return true;
    try {
        new Function('context', `return (${formula});`);
        return true;
    } catch (e) {
        return false;
    }
};

export const analyzeFormulaReferences = (formula: string, validKeywords: Set<string>): string[] => {
// ... (analyzeFormulaReferences unchanged)
    if (!formula || !isNaN(Number(formula))) return [];
    const cleanFormula = formula.replace(/['"][^'"]*['"]/g, ''); 
    const tokens = cleanFormula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const errors: string[] = [];
    tokens.forEach(token => {
        if (!validKeywords.has(token)) {
            if (['Math', 'min', 'max', 'floor', 'ceil', 'round', 'abs', 'true', 'false', 'undefined', 'null', 'typeof'].includes(token)) return;
            errors.push(token);
        }
    });
    return errors;
};

export const checkCondition = (condition: string | undefined, context: EvaluationContext): boolean => {
// ... (checkCondition unchanged)
  if (!condition || condition.trim() === '') return true;
  try {
    const safeContext = context || {};
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
    if (DEBUG_FORMULAS) console.warn(`Condition error "${condition}":`, e);
    return false;
  }
};

export const resolveItemPreview = (
    item: Entity, 
    modifier: Modifier, 
    context: any, 
    upgradeBonus: number = 0
): { enhanced: number, base: number } => {
// ... (resolveItemPreview unchanged)
    let rawBaseValue = 0;
    const strippedContext = {
        ...context,
        weapon_effect_mult: 1,      
        mult_lance_dmg: 1,          
        turret_mult: 1,             
        partition_mult: 1,          
        seal_potency: 0, 
        effect_booster: 0,
        special_mastery: 0,
        enchantment_mult: 1
    };

    const multPattern = /^(\d+)\s*\*\s*([a-zA-Z_0-9]+)$/;
    const match = modifier.value.match(multPattern);

    if (match && upgradeBonus > 0) {
        const baseVal = parseFloat(match[1]);
        const variable = match[2];
        const multiplier = context[variable] || 1;
        return {
            enhanced: Math.ceil((baseVal + upgradeBonus) * multiplier),
            base: Math.ceil(baseVal * multiplier)
        };
    }

    try {
        rawBaseValue = Math.ceil(evaluateFormula(modifier.value, strippedContext));
        if (modifier.type === ModifierType.FLAT) {
            rawBaseValue += upgradeBonus;
        }
    } catch (e) { rawBaseValue = 0; }

    let enhancedValue = rawBaseValue;
    try {
        let valWithContext = Math.ceil(evaluateFormula(modifier.value, context));
        if (match && upgradeBonus > 0) {
             const baseVal = parseFloat(match[1]);
             const variable = match[2];
             valWithContext = Math.ceil((baseVal + upgradeBonus) * (context[variable] || 1));
        } else if (modifier.type === ModifierType.FLAT) {
             valWithContext += upgradeBonus;
        }
        enhancedValue = valWithContext;
    } catch (e) { enhancedValue = rawBaseValue; }

    return { base: rawBaseValue, enhanced: enhancedValue };
};

const flattenItemConfigs = (configs: Record<string, any> | undefined): Record<string, number> => {
// ... (flattenItemConfigs unchanged)
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
    // ... (executePass unchanged - keeping logic intact)
    const results: Record<string, StatResult> = {};
    const modifierResults: Record<string, number> = {}; 
    const currentStatValues: Record<string, number> = {}; 

    (statDefs || []).forEach(def => {
        results[def.key] = {
            key: def.key,
            base: def.baseValue,
            finalValue: def.baseValue,
            perTurn: 0,
            perTurnPercent: 0,
            breakdown: { base: def.baseValue, flat: 0, percentAdd: 0, percentMultiPre: 0, finalAdditivePercent: 0, altFlat: 0, altPercent: 0 },
            detailedBase: [],
            detailedFlat: [],
            trace: [`[${def.label}] Definition: ${def.baseValue}`]
        };
        currentStatValues[def.key] = def.baseValue;
    });

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

    const getHelperContext = () => {
        const dynamicStats: Record<string, number> = {};
        Object.keys(results).forEach(k => {
            dynamicStats[k] = results[k].finalValue;
            dynamicStats[`base_${k}`] = results[k].base;
        });
        const sliderValues = contextParams.sliderValues || {};
        const itemConfigValues = flattenItemConfigs(contextParams.itemConfigs);
        return {
            ...currentStatValues, 
            ...dynamicStats,      
            level: contextParams.level ?? 0, 
            soul_count: contextParams.soulCount || 0,
            ...sliderValues,     
            ...itemConfigValues, 
            toggles: contextParams.toggles || {}, 
            ...contextParams 
        };
    };

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
            const reductionActive = (ctx[STATS.REDUCE_HEAVY_COST] || 0) > 0;
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
            const reductionActive = (ctx[STATS.REDUCE_HEAVY_COST] || 0) > 0;
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
    const unitScale = contextParams.unit_scale || 1;

    for (let pass = 0; pass < PASSES; pass++) {
        Object.keys(results).forEach(key => { 
            evalContext[key] = results[key].finalValue;
            evalContext[`base_${key}`] = results[key].base;
            evalContext[`local_base_${key}`] = results[key].base * unitScale;
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
            let altPercentSum = 0; 
            
            const currentPassDetailsBase: StatDetail[] = [];
            const currentPassDetailsFlat: StatDetail[] = [];
            const passTrace: string[] = [`--- Passe ${pass + 1} ---`];

            const override = [...mods].reverse().find(m => m.mod.type === ModifierType.OVERRIDE);
            
            if (override) {
                const val = evaluateFormula(override.mod.value, evalContext);
                modifierResults[override.mod.id] = val;
                res.finalValue = val;
                passTrace.push(`ÉCRASE par ${override.source}: = ${val}`);
                res.trace.push(...passTrace);
                if (pass === PASSES - 1) {
                    res.detailedBase = [{ source: override.source, value: val }];
                    res.detailedFlat = [];
                }
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
                        currentPassDetailsBase.push({ source: m.source, value: val });
                    } else {
                        if (stat.key === STATS.PARTITION_CAP) {
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
                altPercentSum += val;
                passTrace.push(`ALT PERC [${m.source}]: ${val > 0 ? '+' : ''}${val}%`);
            });

            const baseWithFlat = inherentBase + flatSum;
            const withPercentAdd = baseWithFlat * (1 + (percentAddSum / 100));
            const withPreMulti = withPercentAdd * (1 + (percentMultiPreSum / 100));
            const withFinalAdditive = withPreMulti * (1 + (finalAdditivePercentSum / 100));
            const withAltFlat = withFinalAdditive + altFlatSum;
            const final = withAltFlat * (1 + (altPercentSum / 100));

            res.breakdown = { base: inherentBase, flat: flatSum, percentAdd: percentAddSum, percentMultiPre: percentMultiPreSum, finalAdditivePercent: finalAdditivePercentSum, altFlat: altFlatSum, altPercent: altPercentSum };
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
            
            res.trace.push(...passTrace);

            if (pass === PASSES - 1) {
                res.detailedBase = currentPassDetailsBase;
                res.detailedFlat = currentPassDetailsFlat;
                res.trace.push(`FINAL: ${res.finalValue} (Base Inné: ${inherentBase} + Bonus: ${flatSum})`);
                if (perTurnSum > 0 || perTurnPercentSum > 0) res.trace.push(`NOTE: Gain de +${perTurnSum} (Flat) et +${perTurnPercentSum}% par tour (Non inclus dans le total)`);
            }
        });
    }

    return { results, modifierResults, evalContext };
}

type EntityProcessor = (entities: Entity[], safeContext: any, preCalcContext: any) => { entities: Entity[], virtualIds: string[] };

export const calculateStats = (
  statDefs: StatDefinition[],
  entities: Entity[],
  contextParams: any,
  virtualItemProcessors: EntityProcessor[] = [],
  summonProcessors: SummonProcessor[] = []
): CalculationResult & { finalEntities: Entity[] } => {
  const start = performance.now();
  
  const safeContext = {
      ...(contextParams || {}),
      weaponSlots: contextParams?.weaponSlots ? [...contextParams.weaponSlots] : [],
      level: contextParams?.level ?? 0,
      equippedItems: contextParams?.equippedItems ? { ...contextParams.equippedItems } : {},
      partitionSlots: contextParams?.partitionSlots ? [...contextParams.partitionSlots] : [],
      bonusItems: contextParams?.bonusItems ? [...contextParams.bonusItems] : [],
      sealItems: contextParams?.sealItems ? [...contextParams.sealItems] : [],
      specialItems: contextParams?.specialItems ? [...contextParams.specialItems] : [],
      toggles: contextParams?.toggles ? { ...contextParams.toggles } : {},
      sliderValues: contextParams?.sliderValues ? { ...contextParams.sliderValues } : {},
      soulCount: contextParams?.soulCount || 0,
      itemConfigs: contextParams?.itemConfigs ? JSON.parse(JSON.stringify(contextParams.itemConfigs)) : {}
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
      ...Object.fromEntries(Object.entries(discoveryPass.results).map(([k, v]) => [`base_${k}`, v.base]))
  };

  // --- GENERATE VIRTUAL ITEMS ---
  const allVirtualIds: string[] = [];
  
  virtualItemProcessors.forEach(processor => {
      const { entities: newEnts, virtualIds } = processor(activeEntities, safeContext, preCalcContext);
      // We append virtual items. If they replace existing IDs, the last one in the list wins in 'executePass' lookups?
      // No, executePass looks up by ID in 'safeEntities'.
      // If we push a virtual item with same ID as existing item (like 'deckecleon_upgraded'), we must ensure
      // that safeContext uses the NEW ID.
      // The processors usually update safeContext directly to point to the new ID.
      // But we must also add the new entity definition to activeEntities.
      activeEntities = [...activeEntities, ...newEnts];
      allVirtualIds.push(...virtualIds);
  });
  
  // Pass A (Main Calculation)
  const passA = executePass(statDefs, activeEntities, safeContext, allVirtualIds); 
  
  // Handle Partition Cap Logic
  const cap = passA.results[STATS.PARTITION_CAP]?.finalValue || 0;
  let finalResults = passA;
  
  if (cap > 0 && safeContext.partitionSlots && safeContext.partitionSlots.length > 0) {
      const validPartitionIds = safeContext.partitionSlots.slice(0, cap);
      if (validPartitionIds.length > 0) {
          const combinedExtraIds = [...allVirtualIds, ...validPartitionIds];
          finalResults = executePass(statDefs, activeEntities, safeContext, combinedExtraIds);
      }
  }

  // --- SUMMONS CALCULATION ---
  const getPreFinalStat = (key: string) => {
      const res = finalResults.results[key];
      if (!res) return 0;
      const bd = res.breakdown;
      return (bd.base + bd.flat) * (1 + (bd.percentAdd / 100)) * (1 + (bd.percentMultiPre / 100));
  };

  const activeSummons: ActiveSummon[] = [];
  const finalContext = finalResults.evalContext;
  const summonFlatBonus = finalResults.results[STATS.SUMMON_FLAT_BONUS]?.finalValue || 0;

  const summonContext: EvaluationContext = {
      ...finalContext,
      vit: getPreFinalStat(STATS.VIT),
      spd: getPreFinalStat(STATS.SPD),
      dmg: getPreFinalStat(STATS.DMG),
      aura: getPreFinalStat(STATS.AURA), 
      res: getPreFinalStat(STATS.RES),
  };

  const equippedItemIds = new Set(finalContext.itemIds);
  activeEntities.forEach(ent => {
       if ((ent.type === EntityType.ITEM || ent.type === EntityType.ITEM_SET || ent.type === EntityType.BUFF) && !equippedItemIds.has(ent.id)) return;

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

       summonProcessors.forEach(processor => {
           const dynamicSummon = processor(ent, summonContext, summonFlatBonus);
           if (dynamicSummon) {
               activeSummons.push(dynamicSummon);
           }
       });
  });

  const end = performance.now();
  return {
    stats: finalResults.results,
    modifierResults: finalResults.modifierResults,
    activeSummons: activeSummons,
    logs: [],
    executionTime: end - start,
    finalEntities: activeEntities, // RETURN MODIFIED ENTITY LIST
    evalContext: finalResults.evalContext // Returning evalContext
  };
};
