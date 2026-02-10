
import React, { useState, useMemo, useEffect } from 'react';
import { Combine, Calculator, Coins, Anvil, Search, Filter, Plus, X } from 'lucide-react';
import { Entity, EntityType, ModifierType, StatDefinition, DescriptionBlock, Rarity } from '../../../types';
import { getStatStyle, getRarityColor } from '../utils';

interface FusionForgeTabProps {
    allItems: Entity[];
    stats: StatDefinition[];
    onSave: (item: Entity) => void;
}

export const FusionForgeTab: React.FC<FusionForgeTabProps> = ({ allItems, stats, onSave }) => {
    const [fusionIngredients, setFusionIngredients] = useState<string[]>([]);
    const [fusionSearch, setFusionSearch] = useState('');
    const [fusionName, setFusionName] = useState('');
    const [fusionCategoryFilter, setFusionCategoryFilter] = useState('');
    const [fusionTargetSubCat, setFusionTargetSubCat] = useState('');

    // --- DATA PREPARATION ---
    const availableSubCategories = useMemo(() => {
        const subCats = new Set<string>();
        allItems.forEach(item => {
            if ((item.categoryId === 'weapon' || item.slotId === 'weapon_any') && item.subCategory) {
                subCats.add(item.subCategory);
            }
        });
        return Array.from(subCats).sort();
    }, [allItems]);

    const availableIngredients = useMemo(() => {
        return (allItems || []).filter(item => {
            const isWeapon = item.categoryId === 'weapon' || (item.slotId === 'weapon_any');
            const matchesSearch = !fusionSearch || item.name.toLowerCase().includes(fusionSearch.toLowerCase());
            const matchesCat = !fusionCategoryFilter || item.subCategory === fusionCategoryFilter;
            return isWeapon && matchesSearch && matchesCat;
        });
    }, [allItems, fusionSearch, fusionCategoryFilter]);

    const selectedEntities = useMemo(() => {
        return fusionIngredients.map(id => allItems.find(i => i.id === id)).filter(Boolean) as Entity[];
    }, [fusionIngredients, allItems]);

    const fusionPossibleTypes = useMemo(() => {
        const types = new Set<string>();
        selectedEntities.forEach(e => {
            if(e.subCategory) types.add(e.subCategory);
        });
        return Array.from(types).sort();
    }, [selectedEntities]);

    const fusionTotalGold = useMemo(() => {
        return selectedEntities.reduce((sum, e) => sum + (e.goldCost || 0), 0);
    }, [selectedEntities]);

    const isResultTungsten = useMemo(() => {
        return selectedEntities.some(e => e.isTungsten);
    }, [selectedEntities]);

    useEffect(() => {
        if (fusionPossibleTypes.length > 0) {
            if (!fusionTargetSubCat || !fusionPossibleTypes.includes(fusionTargetSubCat)) {
                setFusionTargetSubCat(fusionPossibleTypes[0]);
            }
        } else {
            setFusionTargetSubCat('');
        }
    }, [fusionPossibleTypes]);

    // --- ALGEBRA PREVIEW LOGIC ---
    const fusionPreviewStats = useMemo(() => {
        const summary: Record<string, string> = {}; 
        const otherEffectsMap: Map<string, number> = new Map(); 
        let maxPartitionCap = 0;

        const statGroups: Record<string, string[]> = {};

        selectedEntities.forEach(ent => {
            (ent.modifiers || []).forEach(mod => {
                if (mod.targetStatKey === 'partition_cap') {
                    const capVal = parseInt(mod.value, 10);
                    if (!isNaN(capVal) && capVal > maxPartitionCap) maxPartitionCap = capVal;
                    return;
                }

                if (mod.type === ModifierType.FLAT || mod.type === ModifierType.PERCENT_ADD) {
                    if (!statGroups[mod.targetStatKey]) statGroups[mod.targetStatKey] = [];
                    statGroups[mod.targetStatKey].push(mod.value);
                } else {
                    const statLabel = stats.find(s => s.key === mod.targetStatKey)?.label || mod.targetStatKey;
                    const effectText = `${statLabel}: ${mod.value}`;
                    otherEffectsMap.set(effectText, (otherEffectsMap.get(effectText) || 0) + 1);
                }
            });
        });

        Object.entries(statGroups).forEach(([key, values]) => {
            let numSum = 0;
            const variableCoeffs: Record<string, number> = {};
            
            values.forEach(v => {
                const trimmed = v.trim();
                if (!isNaN(Number(trimmed)) && trimmed !== '') {
                    numSum += Number(trimmed);
                    return;
                }
                const varPattern = /^([\d\.]+)\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)$|^([a-zA-Z_][a-zA-Z0-9_]*)\s*\*\s*([\d\.]+)$/;
                const match = trimmed.match(varPattern);
                if (match) {
                    const val = parseFloat(match[1] || match[4]);
                    const variable = match[2] || match[3];
                    if (!isNaN(val) && variable) {
                        variableCoeffs[variable] = (variableCoeffs[variable] || 0) + val;
                        return;
                    }
                }
            });

            const parts = [];
            if (numSum !== 0) parts.push(numSum.toString());
            Object.entries(variableCoeffs).forEach(([v, c]) => {
                if (c !== 0) parts.push(`${c}*${v}`);
            });
            
            if (parts.length > 0) summary[key] = parts.join(' + ');
        });

        if (maxPartitionCap > 0) summary['partition_cap'] = `Max ${maxPartitionCap}`;

        const otherEffects = Array.from(otherEffectsMap.entries()).map(([text, count]) => {
            return count > 1 ? `${text} (x${count})` : text;
        });

        return { summary, otherEffects };
    }, [selectedEntities, stats]);

    // --- SAVE HANDLER ---
    const handleSaveFusion = () => {
        if (!fusionName || selectedEntities.length < 2) return;

        const newId = `fused_wep_${Date.now()}`;
        const allMods = selectedEntities.flatMap(ent => ent.modifiers || []);
        const capMods: any[] = [];
        const complexModifiers: any[] = [];
        const mergeableBuckets: Record<string, { type: ModifierType, values: string[] }> = {};

        allMods.forEach(mod => {
            if (mod.targetStatKey === 'partition_cap') {
                capMods.push(mod);
                return;
            }
            const isMergeableType = mod.type === ModifierType.FLAT || mod.type === ModifierType.PERCENT_ADD;
            const isClean = !mod.condition && !mod.toggleId && !mod.toggleGroup;

            if (isMergeableType && isClean) {
                const key = `${mod.targetStatKey}|${mod.type}`; 
                if (!mergeableBuckets[key]) {
                    mergeableBuckets[key] = { type: mod.type, values: [] };
                }
                mergeableBuckets[key].values.push(mod.value);
            } else {
                complexModifiers.push({
                    ...mod,
                    id: `${newId}_cx_${Math.random().toString(36).substr(2, 5)}`
                });
            }
        });

        const finalModifiers = [...complexModifiers];

        Object.entries(mergeableBuckets).forEach(([key, data]) => {
            const [statKey] = key.split('|');
            const { type, values } = data;
            if (values.length === 0) return;

            let numSum = 0;
            const variableCoeffs: Record<string, number> = {}; 
            const formulaParts: string[] = [];

            values.forEach(v => {
                const trimmed = v.trim();
                if (!isNaN(Number(trimmed)) && trimmed !== '') {
                    numSum += Number(trimmed);
                    return;
                }
                const varPattern = /^([\d\.]+)\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)$|^([a-zA-Z_][a-zA-Z0-9_]*)\s*\*\s*([\d\.]+)$/;
                const match = trimmed.match(varPattern);
                if (match) {
                    const val = parseFloat(match[1] || match[4]);
                    const variable = match[2] || match[3];
                    if (!isNaN(val) && variable) {
                        variableCoeffs[variable] = (variableCoeffs[variable] || 0) + val;
                        return;
                    }
                }
                formulaParts.push(trimmed);
            });

            const parts = [];
            if (numSum !== 0) parts.push(parseFloat(numSum.toFixed(2)).toString());
            Object.entries(variableCoeffs).forEach(([variable, coeff]) => {
                 const c = parseFloat(coeff.toFixed(2));
                 if (c !== 0) parts.push(`${c} * ${variable}`);
            });
            if (formulaParts.length > 0) parts.push(...formulaParts);
            if (parts.length === 0) return; 

            const finalFormula = parts.join(' + ');
            finalModifiers.push({
                id: `${newId}_merged_${statKey}_${type}`,
                type: type,
                targetStatKey: statKey,
                value: finalFormula,
                name: 'Bonus Fusionné'
            });
        });

        let maxPartitionCap = 0;
        capMods.forEach(m => {
            const val = parseInt(m.value, 10);
            if (!isNaN(val) && val > maxPartitionCap) maxPartitionCap = val;
        });
        if (maxPartitionCap > 0) {
            finalModifiers.push({
                id: `${newId}_fused_cap`,
                type: ModifierType.FLAT,
                targetStatKey: 'partition_cap',
                value: maxPartitionCap.toString(),
                name: 'Capacité Pupitre (Max Fusion)'
            });
        }

        const descText = selectedEntities.map(e => e.name).join(' + ');
        const mergedDescriptionBlocks: DescriptionBlock[] = [];
        mergedDescriptionBlocks.push({ title: "Alliance", text: descText, tag: "info" });

        selectedEntities.forEach(ent => {
            if (ent.descriptionBlocks && ent.descriptionBlocks.length > 0) {
                ent.descriptionBlocks.forEach(b => {
                    mergedDescriptionBlocks.push({
                        ...b,
                        title: b.title ? `${b.title} (${ent.name})` : ent.name
                    });
                });
            } else if (ent.description && !ent.description.startsWith('Fusion:')) {
                mergedDescriptionBlocks.push({ title: ent.name, text: ent.description, tag: 'passive' });
            }
        });

        const inheritedSetId = selectedEntities.find(e => e.setId)?.setId;
        const inheritedFactionId = selectedEntities.find(e => e.factionId)?.factionId;
        const inheritedGuildStatus = selectedEntities.find(e => e.guildStatus)?.guildStatus;
        
        const rarityWeights: Record<string, number> = { 'legendary': 4, 'epic': 3, 'exotic': 2, 'normal': 1 };
        let finalRarity: Rarity = 'normal';
        let maxRarityWeight = 0;

        selectedEntities.forEach(e => {
            const r = e.rarity || 'normal';
            const w = rarityWeights[r] || 1;
            if (w > maxRarityWeight) {
                maxRarityWeight = w;
                finalRarity = r as Rarity;
            }
        });
        
        const mergedTags = new Set<string>();
        selectedEntities.forEach(e => { if (e.tags) e.tags.forEach(t => mergedTags.add(t)); });
        
        const finalSubCategory = fusionTargetSubCat || 'Amalgame';

        const fusedItem: Entity = {
            id: newId,
            type: EntityType.ITEM,
            name: fusionName,
            description: `Fusion: ${descText}`,
            descriptionBlocks: mergedDescriptionBlocks.length > 0 ? mergedDescriptionBlocks : undefined,
            slotId: 'weapon_any',
            categoryId: 'weapon',
            subCategory: finalSubCategory,
            equipmentCost: 2, 
            goldCost: fusionTotalGold,
            modifiers: finalModifiers,
            isCraftable: false,
            isTungsten: isResultTungsten,
            imageUrl: selectedEntities[0].imageUrl,
            setId: inheritedSetId,
            factionId: inheritedFactionId,
            guildStatus: inheritedGuildStatus,
            rarity: finalRarity,
            tags: mergedTags.size > 0 ? Array.from(mergedTags) : undefined
        };

        onSave(fusedItem);
    };

    const renderStatBadge = (mod: any) => {
        const style = getStatStyle(mod.targetStatKey);
        const label = mod.targetStatKey.substring(0,3).toUpperCase();
        let displayVal = mod.value;
        if (displayVal.length > 8) {
             if (displayVal.includes('level')) displayVal = 'LvlScale';
             else displayVal = 'Fx';
        }
        return (
            <span key={mod.id} className={`inline-flex items-center px-1 py-0.5 rounded text-[9px] font-mono font-bold border mr-1 mb-1 ${style}`}>
                {displayVal} {label}
            </span>
        );
    };

    const isFusionReady = selectedEntities.length >= 2;

    return (
        <div className="absolute inset-0 flex flex-col md:flex-row">
            {/* LEFT: INGREDIENT LIST - MOBILE 40% HEIGHT, DESKTOP FULL */}
            <div className="w-full md:w-5/12 p-4 border-r border-slate-800 flex flex-col h-[40%] md:h-full bg-slate-950/50">
                <div className="space-y-2 mb-4">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                        <input 
                            value={fusionSearch} 
                            onChange={e => setFusionSearch(e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-indigo-500 outline-none" 
                            placeholder="Rechercher une arme..." 
                        />
                    </div>
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-2.5 text-slate-500" />
                        <select 
                            value={fusionCategoryFilter} 
                            onChange={e => setFusionCategoryFilter(e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-300 focus:border-indigo-500 outline-none appearance-none"
                        >
                            <option value="">Toutes catégories</option>
                            {availableSubCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-0">
                    {availableIngredients.length > 0 ? availableIngredients.map(item => {
                        const rarityColor = getRarityColor(item.rarity);
                        return (
                            <div key={item.id} onClick={() => setFusionIngredients([...fusionIngredients, item.id])} className="bg-slate-900 border border-slate-800 p-3 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-900/10 transition-all group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className={`text-xs font-bold flex items-center ${rarityColor} group-hover:text-white`}>
                                            {item.name}
                                            {item.isCraftable && <Anvil size={12} className="text-emerald-500/70 ml-1.5" />}
                                            {item.isTungsten && <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" className="w-3.5 h-3.5 ml-1 opacity-70" alt="Tungstène" />}
                                        </div>
                                        <div className="text-[9px] text-slate-500 mb-1">{item.subCategory || 'Arme'}</div>
                                    </div>
                                    <Plus size={14} className="text-slate-600 group-hover:text-indigo-400" />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(item.modifiers || []).map((m, idx) => renderStatBadge(m))}
                                </div>
                                {item.goldCost && (
                                    <div className="flex items-center text-[9px] text-yellow-500 mt-1 border-t border-slate-800/50 pt-1">
                                        <Coins size={10} className="mr-1" /> {item.goldCost} Po
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="text-center py-8 text-slate-500 text-xs italic">Aucune arme disponible.</div>
                    )}
                </div>
            </div>

            {/* RIGHT: FUSION RESULT */}
            <div className="w-full md:w-7/12 p-6 flex flex-col h-[60%] md:h-full bg-slate-900">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center">
                    <Combine size={14} className="mr-2" /> Ingrédients du Creuset
                </h4>
                
                <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar min-h-0">
                    {selectedEntities.length > 0 ? (
                        <div className="space-y-2">
                            {selectedEntities.map((item, idx) => {
                                const rarityColor = getRarityColor(item.rarity);
                                return (
                                    <div key={`${item.id}-${idx}`} className="flex flex-col bg-slate-950 p-3 rounded border border-slate-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`text-xs font-bold flex items-center ${rarityColor}`}>
                                                {item.name}
                                                {item.isCraftable && <Anvil size={12} className="text-emerald-500/70 ml-1.5" />}
                                                {item.isTungsten && <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" className="w-3.5 h-3.5 ml-1 opacity-70" alt="Tungstène" />}
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newIngredients = [...fusionIngredients];
                                                    newIngredients.splice(idx, 1);
                                                    setFusionIngredients(newIngredients);
                                                }} 
                                                className="text-slate-600 hover:text-red-400"
                                            >
                                                <X size={14}/>
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {(item.modifiers || []).map((m, idx) => renderStatBadge(m))}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* FUSION PREVIEW BOX */}
                            <div className="mt-4 p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-900/10 relative">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calculator size={14} className="text-indigo-400" />
                                    <span className="text-xs font-bold text-indigo-300 uppercase">Prévision du Résultat</span>
                                    {isResultTungsten && (
                                        <div className="ml-auto flex items-center bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-[9px] text-slate-300 font-bold" title="Héritage Tungstène">
                                            <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" className="w-3.5 h-3.5 mr-1" alt="Tungstène" />
                                            Tungstène
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(fusionPreviewStats.summary).map(([key, val]) => (
                                        <span key={key} className={`px-2 py-1 rounded text-xs font-mono font-bold border ${getStatStyle(key)}`}>
                                            {key === 'partition_cap' ? `${val}` : `+${val}`} {key.substring(0,3).toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                                {fusionPreviewStats.otherEffects.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {fusionPreviewStats.otherEffects.map((eff, i) => (
                                            <div key={i} className="text-[10px] text-slate-400 italic">• {eff}</div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-3 text-[9px] text-slate-500 italic border-t border-indigo-500/10 pt-2">
                                    Note : Les bonus identiques s'additionnent algébriquement.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg text-slate-600 text-xs">
                            Sélectionnez au moins 2 armes
                        </div>
                    )}
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-lg">
                    <label className="block text-xs uppercase font-bold text-indigo-400 mb-2">Nom de l'arme fusionnée</label>
                    <input 
                        value={fusionName} 
                        onChange={e => setFusionName(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white outline-none focus:border-indigo-500 mb-3" 
                        placeholder="Ex: Lame du Chaos..." 
                    />
                    
                    {fusionPossibleTypes.length > 1 && (
                        <div className="mb-3">
                            <label className="block text-xs uppercase font-bold text-indigo-400 mb-1">Type de l'arme résultante</label>
                            <select
                                value={fusionTargetSubCat}
                                onChange={(e) => setFusionTargetSubCat(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-indigo-500"
                            >
                                {fusionPossibleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    )}
                    {fusionPossibleTypes.length === 1 && (
                         <div className="mb-3">
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Type</label>
                            <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                                {fusionPossibleTypes[0]}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 text-[10px] text-slate-400 mb-4 items-center">
                        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Coût: 2 pts</span>
                        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Effets: {selectedEntities.reduce((acc, e) => acc + (e.modifiers?.length || 0), 0)}</span>
                        
                        {fusionTotalGold > 0 && (
                            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 flex items-center text-yellow-400 border-yellow-500/30">
                                <Coins size={10} className="mr-1" /> {fusionTotalGold} Po
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={handleSaveFusion} 
                        disabled={!isFusionReady || !fusionName}
                        className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center shadow-lg ${
                            isFusionReady 
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white animate-shake shadow-indigo-500/50' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        }`}
                    >
                        <Combine size={18} className="mr-2" /> 
                        {isFusionReady ? "FUSION !!!" : "Fusion"}
                    </button>
                </div>
            </div>
        </div>
    );
};
