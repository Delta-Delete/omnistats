
import React, { useState, useMemo, useEffect } from 'react';
import { Hammer, X, Music, Plus, Copy, Trash2, Save, Flag, ArrowRight, Combine, Search, Filter, Calculator } from 'lucide-react';
import { ItemCategory, StatDefinition, Entity, EntityType, ModifierType, Rarity, DescriptionBlock } from '../../types';
import { getStatStyle } from './utils';

export const WeaponForgeModal: React.FC<{ 
    categories: ItemCategory[]; 
    stats: StatDefinition[]; 
    factions?: Entity[]; 
    allItems: Entity[]; // Necessary for selecting fusion ingredients
    onClose: () => void; 
    onSave: (item: Entity) => void; 
}> = ({ categories, stats, factions, allItems, onClose, onSave }) => {
    // --- MODE SWITCHER ---
    const [activeTab, setActiveTab] = useState<'create' | 'fusion'>('create');

    // --- STANDARD FORGE STATE ---
    const [tempItemId] = useState(`custom_wep_${Date.now()}`);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [weaponFamily, setWeaponFamily] = useState<'standard' | 'instrument'>('standard');
    const [subCat, setSubCat] = useState('');
    const [partitionCount, setPartitionCount] = useState(2);
    const [cost, setCost] = useState(1);
    const [factionId, setFactionId] = useState('');
    const [bonuses, setBonuses] = useState<{id: string, stat: string, val: string, name: string}[]>([{ id: `${tempItemId}_m0`, stat: 'dmg', val: '10', name: '' }]);

    // --- FUSION STATE ---
    const [fusionIngredients, setFusionIngredients] = useState<string[]>([]);
    const [fusionSearch, setFusionSearch] = useState('');
    const [fusionName, setFusionName] = useState('');
    const [fusionCategoryFilter, setFusionCategoryFilter] = useState('');
    const [fusionTargetSubCat, setFusionTargetSubCat] = useState(''); // NEW: User choice for resulting type

    const availableTypes = useMemo((): string[] => {
        const weaponCat = (categories || []).find(c => c.id === 'weapon');
        if (!weaponCat || !weaponCat.subCategories) return [];
        if (weaponFamily === 'instrument') return weaponCat.subCategories.filter(sc => sc.startsWith('Instrument'));
        else return weaponCat.subCategories.filter(sc => !sc.startsWith('Instrument'));
    }, [categories, weaponFamily]);

    useEffect(() => { if (availableTypes.length > 0 && !availableTypes.includes(subCat)) setSubCat(availableTypes[0]); }, [availableTypes, subCat]);

    const handleSaveStandard = () => {
        if (!name) return;
        const safeCatId = (categories || []).find(c => c.id === 'weapon')?.id || categories?.[0]?.id || 'unknown';
        const newItem: Entity = {
            id: tempItemId, 
            type: EntityType.ITEM, 
            name: name, 
            description: description,
            slotId: 'weapon_any', 
            categoryId: safeCatId, 
            subCategory: subCat, 
            equipmentCost: cost, 
            factionId: factionId || undefined, 
            modifiers: [], 
            isCraftable: true
        };
        if (weaponFamily === 'instrument') newItem.modifiers.push({ id: `${tempItemId}_cap`, type: ModifierType.FLAT, targetStatKey: 'partition_cap', value: partitionCount.toString(), name: 'Capacité Pupitre' });
        bonuses.forEach((b) => { if (b.val && b.val !== '0') newItem.modifiers.push({ id: b.id, type: ModifierType.FLAT, targetStatKey: b.stat, value: b.val, name: b.name || undefined }); });
        onSave(newItem);
    };

    // --- FUSION LOGIC ---
    
    // Extract unique weapon subcategories for the filter dropdown
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
            // Filter only weapons (Category 'weapon' or subCategory implies weapon)
            const isWeapon = item.categoryId === 'weapon' || (item.slotId === 'weapon_any');
            
            // Allow selecting same item multiple times (removed 'notSelected' filter)
            
            // Search filter
            const matchesSearch = !fusionSearch || item.name.toLowerCase().includes(fusionSearch.toLowerCase());
            // Category filter
            const matchesCat = !fusionCategoryFilter || item.subCategory === fusionCategoryFilter;
            
            return isWeapon && matchesSearch && matchesCat;
        });
    }, [allItems, fusionSearch, fusionCategoryFilter]);

    const selectedEntities = useMemo(() => {
        return fusionIngredients.map(id => allItems.find(i => i.id === id)).filter(Boolean) as Entity[];
    }, [fusionIngredients, allItems]);

    // NEW: Determine possible resulting types from ingredients
    const fusionPossibleTypes = useMemo(() => {
        const types = new Set<string>();
        selectedEntities.forEach(e => {
            if(e.subCategory) types.add(e.subCategory);
        });
        return Array.from(types).sort();
    }, [selectedEntities]);

    // NEW: Auto-select type logic
    useEffect(() => {
        if (fusionPossibleTypes.length > 0) {
            // If current selection is invalid (not in list), or list has changed significantly, default to first
            if (!fusionTargetSubCat || !fusionPossibleTypes.includes(fusionTargetSubCat)) {
                setFusionTargetSubCat(fusionPossibleTypes[0]);
            }
        } else {
            setFusionTargetSubCat('');
        }
    }, [fusionPossibleTypes]); // Dependency on the list content

    // NEW: Calculate projected stats for the fusion preview
    const fusionPreviewStats = useMemo(() => {
        const summary: Record<string, string> = {}; // Changed to string to hold formulas
        const otherEffectsMap: Map<string, number> = new Map(); // Use Map to count duplicates
        let maxPartitionCap = 0;

        // Group modifiers by Stat Key to simulate the fusion logic
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

        // Simulate Algebra for Preview
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

    const handleSaveFusion = () => {
        if (!fusionName || selectedEntities.length < 2) return;

        const newId = `fused_wep_${Date.now()}`;
        
        // 1. Get all modifiers from ingredients
        const allMods = selectedEntities.flatMap(ent => ent.modifiers || []);

        // 2. Groups
        const capMods: any[] = [];
        const complexModifiers: any[] = [];
        // Bucket Key: "statKey|type" (e.g. "dmg|FLAT")
        const mergeableBuckets: Record<string, { type: ModifierType, values: string[] }> = {};

        // 3. Iterate and Sort
        allMods.forEach(mod => {
            // A. Partition Cap: Max Logic (Exceptions)
            if (mod.targetStatKey === 'partition_cap') {
                capMods.push(mod);
                return;
            }

            // B. Check if mergeable
            // We merge FLAT and PERCENT_ADD if they have no conditions/toggles
            // This includes combining formulas (level * 5 + level * 5)
            const isMergeableType = mod.type === ModifierType.FLAT || mod.type === ModifierType.PERCENT_ADD;
            const isClean = !mod.condition && !mod.toggleId && !mod.toggleGroup;

            if (isMergeableType && isClean) {
                const key = `${mod.targetStatKey}|${mod.type}`; // Group by stat AND type
                if (!mergeableBuckets[key]) {
                    mergeableBuckets[key] = { type: mod.type, values: [] };
                }
                mergeableBuckets[key].values.push(mod.value);
            } else {
                // Keep complex mods (conditional, toggles, overrides) separate
                complexModifiers.push({
                    ...mod,
                    id: `${newId}_cx_${Math.random().toString(36).substr(2, 5)}`
                });
            }
        });

        // 4. Construct Final Modifier List
        const finalModifiers = [...complexModifiers];

        // Process Mergeable Buckets
        Object.entries(mergeableBuckets).forEach(([key, data]) => {
            const [statKey] = key.split('|');
            const { type, values } = data;

            if (values.length === 0) return;

            let numSum = 0;
            const variableCoeffs: Record<string, number> = {}; 
            const formulaParts: string[] = [];

            values.forEach(v => {
                const trimmed = v.trim();
                
                // 1. Pure Number check
                if (!isNaN(Number(trimmed)) && trimmed !== '') {
                    numSum += Number(trimmed);
                    return;
                }

                // 2. Generic Variable Pattern: "X * var" or "var * X"
                // This regex captures patterns like "10 * level" OR "level * 10" OR "5 * effect_booster"
                // Group 1 & 2: (Number) * (Variable)
                // Group 3 & 4: (Variable) * (Number)
                const varPattern = /^([\d\.]+)\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)$|^([a-zA-Z_][a-zA-Z0-9_]*)\s*\*\s*([\d\.]+)$/;
                const match = trimmed.match(varPattern);

                if (match) {
                    // Extract values based on which group matched
                    const val = parseFloat(match[1] || match[4]);
                    const variable = match[2] || match[3];
                    
                    if (!isNaN(val) && variable) {
                        variableCoeffs[variable] = (variableCoeffs[variable] || 0) + val;
                        return;
                    }
                }

                // 3. Fallback: Keep as string
                formulaParts.push(trimmed);
            });

            const parts = [];
            // Add Constant Sum
            if (numSum !== 0) parts.push(parseFloat(numSum.toFixed(2)).toString());
            
            // Add Variable Sums (e.g. "10 * level", "5 * effect_booster")
            Object.entries(variableCoeffs).forEach(([variable, coeff]) => {
                 // Format coeff to avoid long decimals
                 const c = parseFloat(coeff.toFixed(2));
                 if (c !== 0) {
                     // Always output as "Coeff * Variable" for consistency
                     // Note: We use "10 * level" format
                     parts.push(`${c} * ${variable}`);
                 }
            });

            // Add unknowns
            if (formulaParts.length > 0) parts.push(...formulaParts);

            if (parts.length === 0) return; 

            // Join with " + " to create the combined formula
            // Example: "50 + 15 * effect_booster"
            const finalFormula = parts.join(' + ');

            finalModifiers.push({
                id: `${newId}_merged_${statKey}_${type}`,
                type: type,
                targetStatKey: statKey,
                value: finalFormula,
                name: 'Bonus Fusionné'
            });
        });

        // 5. Process Cap Mods (Take Max)
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

        // 6. Combine Descriptions & Metadata
        const descText = selectedEntities.map(e => e.name).join(' + ');
        
        // NEW: MERGE DESCRIPTION BLOCKS
        const mergedDescriptionBlocks: DescriptionBlock[] = [];
        
        // ADDED: FORCE A COMPOSITION BLOCK TO ALWAYS APPEAR
        mergedDescriptionBlocks.push({
            title: "Alliance",
            text: descText,
            tag: "info"
        });

        selectedEntities.forEach(ent => {
            // A. If ingredient has rich description blocks, keep them
            if (ent.descriptionBlocks && ent.descriptionBlocks.length > 0) {
                ent.descriptionBlocks.forEach(b => {
                    mergedDescriptionBlocks.push({
                        ...b,
                        // Append source name to title for clarity in recap
                        title: b.title ? `${b.title} (${ent.name})` : ent.name
                    });
                });
            } 
            // B. If ingredient has a simple description (legacy/simple items like Excalibur), convert to block
            else if (ent.description) {
                // Avoid recursive "Fusion:" descriptions if refusing existing fusions
                if (!ent.description.startsWith('Fusion:')) {
                    mergedDescriptionBlocks.push({
                        title: ent.name,
                        text: ent.description,
                        tag: 'passive' // Default to passive tag
                    });
                }
            }
        });

        // 7. INHERIT METADATA (Set, Faction, Tags, RARITY)
        // We inherit from the first entity that has the property for simple metadata
        const inheritedSetId = selectedEntities.find(e => e.setId)?.setId;
        const inheritedFactionId = selectedEntities.find(e => e.factionId)?.factionId;
        const inheritedGuildStatus = selectedEntities.find(e => e.guildStatus)?.guildStatus;
        
        // RARITY: Take the highest
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
        
        // Merge tags
        const mergedTags = new Set<string>();
        selectedEntities.forEach(e => {
            if (e.tags) e.tags.forEach(t => mergedTags.add(t));
        });
        
        // 8. USE SELECTED SUB CATEGORY
        const finalSubCategory = fusionTargetSubCat || 'Amalgame';

        const fusedItem: Entity = {
            id: newId,
            type: EntityType.ITEM,
            name: fusionName,
            description: `Fusion: ${descText}`,
            // Attach the merged blocks so they show up in CharacterSheet recap
            descriptionBlocks: mergedDescriptionBlocks.length > 0 ? mergedDescriptionBlocks : undefined,
            slotId: 'weapon_any',
            categoryId: 'weapon',
            subCategory: finalSubCategory,
            equipmentCost: 2, // Forced to 2 as per spec
            modifiers: finalModifiers,
            isCraftable: true,
            // Visual inheritance
            imageUrl: selectedEntities[0].imageUrl,
            // Metadata Inheritance
            setId: inheritedSetId,
            factionId: inheritedFactionId,
            guildStatus: inheritedGuildStatus,
            rarity: finalRarity, // Applied Highest Rarity
            tags: mergedTags.size > 0 ? Array.from(mergedTags) : undefined
        };

        onSave(fusedItem);
    };
    
    const availableStats = useMemo(() => [...stats].sort((a, b) => a.label.localeCompare(b.label)), [stats]);

    // Helper to render a mini stat badge
    const renderStatBadge = (mod: any) => {
        const style = getStatStyle(mod.targetStatKey);
        const label = mod.targetStatKey.substring(0,3).toUpperCase();
        // If the value is a complex formula, show 'Fx' or simple representation
        let displayVal = mod.value;
        if (displayVal.length > 8) {
             // Try to simplify visual for badge
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
             <style>
                {`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                    animation-iteration-count: infinite;
                }
                `}
             </style>
             {/* Use h-[90vh] to force modal height */}
             <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* HEADER */}
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <Hammer size={18} className="mr-2 text-amber-500" /> Forge & Fusion
                        </h3>
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button 
                                onClick={() => setActiveTab('create')} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'create' ? 'bg-amber-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Création
                            </button>
                            <button 
                                onClick={() => setActiveTab('fusion')} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center ${activeTab === 'fusion' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Combine size={14} className="mr-1.5" /> Fusion
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                </div>

                {/* CONTENT AREA: Uses relative positioning to allow children to use absolute inset-0 */}
                <div className="flex-1 relative">
                    {activeTab === 'create' ? (
                        <div className="absolute inset-0 flex flex-col p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            {/* STANDARD FORGE CONTENT (UNCHANGED LOGIC) */}
                            <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nom de l'arme</label><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500 placeholder-slate-600" placeholder="Ex: Excalibur" autoFocus /></div>
                            <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Description / Effets Narratifs</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500 placeholder-slate-600 resize-none h-20 text-xs" placeholder="Ex: Une lame qui vibre. Inflige {{custom_wep_..._m0}} dégâts bruts." /></div>
                            
                            {availableTypes.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Classe d'objet</label><div className="flex bg-slate-800 rounded border border-slate-700 overflow-hidden"><button onClick={() => setWeaponFamily('standard')} className={`flex-1 py-2 text-[10px] uppercase font-bold transition-colors ${weaponFamily === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Arme</button><div className="w-px bg-slate-700"></div><button onClick={() => setWeaponFamily('instrument')} className={`flex-1 py-2 text-[10px] uppercase font-bold transition-colors ${weaponFamily === 'instrument' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Instrument</button></div></div>
                                    <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Type Spécifique</label><select value={subCat} onChange={e => setSubCat(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500">{availableTypes.map(t => <option key={t} value={t}>{t.replace('Instrument ', '')}</option>)}</select></div>
                                </div>
                            ) : (<div className="p-3 border border-red-900/50 bg-red-900/20 rounded text-xs text-red-300">Catégorie 'Arme' introuvable.</div>)}
                            
                            {weaponFamily === 'instrument' && (<div className="bg-indigo-900/10 border border-indigo-500/20 p-3 rounded-lg"><label className="flex justify-between text-xs uppercase font-bold text-indigo-300 mb-2"><span className="flex items-center"><Music size={12} className="mr-1"/> Slots de Partitions</span><span className="text-white bg-indigo-600 px-2 rounded-full">{partitionCount}</span></label><input type="range" min="1" max="9" value={partitionCount} onChange={(e) => setPartitionCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/><div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono"><span>1</span><span>9</span></div></div>)}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Coût (Pts)</label>
                                    <div className="flex bg-slate-800 rounded border border-slate-700 overflow-hidden"><button onClick={() => setCost(1)} className={`flex-1 text-xs font-bold py-2 transition-colors ${cost === 1 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>1 Main</button><div className="w-px bg-slate-700"></div><button onClick={() => setCost(2)} className={`flex-1 text-xs font-bold py-2 transition-colors ${cost === 2 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>2 Mains</button></div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex items-center"><Flag size={10} className="mr-1"/> Set / Faction</label>
                                    <select value={factionId} onChange={e => setFactionId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500 text-xs h-[34px]">
                                        <option value="">-- Aucun --</option>
                                        {(factions || []).map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-800 pt-4 mt-2"><div className="flex justify-between items-center mb-2"><label className="block text-xs uppercase font-bold text-slate-500">Effets & Bonus</label><button onClick={() => setBonuses([...bonuses, { id: `${tempItemId}_m${Date.now().toString().slice(-4)}`, stat: 'vit', val: '0', name: '' }])} className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 text-green-400 px-3 py-1 rounded flex items-center transition-colors"><Plus size={12} className="mr-1"/> Ajouter</button></div>
                                <div className="space-y-3">
                                    {bonuses.map((bonus, idx) => (<div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-indigo-500/30 transition-colors"><div className="flex justify-between items-center mb-1"><input type="text" value={bonus.name} onChange={(e) => { const n = [...bonuses]; n[idx].name = e.target.value; setBonuses(n); }} className="bg-transparent text-xs text-slate-300 border-b border-transparent focus:border-indigo-500 outline-none pb-0.5 placeholder-slate-600 flex-1 mr-2" placeholder="Nom de l'effet (optionnel)" /><button onClick={() => navigator.clipboard.writeText(`{{${bonus.id}}}`)} className="flex items-center text-[9px] font-mono text-slate-600 hover:text-indigo-400 bg-slate-900/50 hover:bg-slate-900 border border-transparent hover:border-indigo-500/30 px-1.5 py-0.5 rounded transition-all ml-auto" title="Cliquer pour copier l'ID dans le presse-papier"><Copy size={10} className="mr-1.5" />{`{{${bonus.id}}}`}</button></div><div className="flex gap-2 items-center"><div className="flex-1 relative"><select value={bonus.stat} onChange={(e) => { const n = [...bonuses]; n[idx].stat = e.target.value; setBonuses(n); }} className={`w-full bg-slate-900 text-xs font-bold border border-slate-700 rounded px-3 py-2 outline-none focus:border-indigo-500 appearance-none ${getStatStyle(bonus.stat)}`}>{availableStats.map(s => <option key={s.key} value={s.key} className="bg-slate-900 text-slate-300">{s.label} ({s.key})</option>)}</select></div><div className="flex items-center bg-slate-900 border border-slate-700 rounded px-3 py-2 w-32 focus-within:border-indigo-500"><span className="text-slate-500 text-xs mr-2">=</span><input type="text" value={bonus.val} onChange={(e) => { const n = [...bonuses]; n[idx].val = e.target.value; setBonuses(n); }} className="w-full bg-transparent text-white font-mono text-xs outline-none text-right" placeholder="10" /></div><button onClick={() => { const n = [...bonuses]; n.splice(idx, 1); setBonuses(n); }} className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-900 rounded transition-colors"><Trash2 size={16} /></button></div></div>))}
                                </div>
                            </div>
                        </div>
                    ) : (
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
                                    {availableIngredients.length > 0 ? availableIngredients.map(item => (
                                        <div key={item.id} onClick={() => setFusionIngredients([...fusionIngredients, item.id])} className="bg-slate-900 border border-slate-800 p-3 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-900/10 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-300 group-hover:text-white">{item.name}</div>
                                                    <div className="text-[9px] text-slate-500 mb-1">{item.subCategory || 'Arme'}</div>
                                                </div>
                                                <Plus size={14} className="text-slate-600 group-hover:text-indigo-400" />
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(item.modifiers || []).map((m, idx) => renderStatBadge(m))}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-slate-500 text-xs italic">Aucune arme disponible.</div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: FUSION RESULT - MOBILE 60% HEIGHT, DESKTOP FULL */}
                            <div className="w-full md:w-7/12 p-6 flex flex-col h-[60%] md:h-full bg-slate-900">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center">
                                    <Combine size={14} className="mr-2" /> Ingrédients du Creuset
                                </h4>
                                
                                <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar min-h-0">
                                    {selectedEntities.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedEntities.map((item, idx) => (
                                                <div key={`${item.id}-${idx}`} className="flex flex-col bg-slate-950 p-3 rounded border border-slate-800">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-xs font-bold text-slate-300">{item.name}</div>
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
                                            ))}
                                            
                                            {/* FUSION PREVIEW BOX */}
                                            <div className="mt-4 p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-900/10">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calculator size={14} className="text-indigo-400" />
                                                    <span className="text-xs font-bold text-indigo-300 uppercase">Prévision du Résultat</span>
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
                                                    Note : Les bonus identiques s'additionnent algébriquement. (ex: 10 * level + 10 * level = 20 * level)
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

                                    <div className="flex gap-2 text-[10px] text-slate-400 mb-4">
                                        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Coût: 2 pts</span>
                                        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Effets cumulés: {selectedEntities.reduce((acc, e) => acc + (e.modifiers?.length || 0), 0)}</span>
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
                    )}
                </div>

                {/* FOOTER (ONLY FOR CREATE MODE) */}
                {activeTab === 'create' && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950 flex-shrink-0">
                        <button onClick={handleSaveStandard} disabled={!name} className="w-full bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-amber-900/20">
                            <Save size={18} className="mr-2" /> Forger l'arme
                        </button>
                    </div>
                )}
             </div>
        </div>
    )
}
