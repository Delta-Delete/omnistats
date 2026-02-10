
import React from 'react';
import { Trash2, Plus, EyeOff, Sliders, Dog, Save } from 'lucide-react';
import { Entity, EntityType, ItemSlot, ItemCategory, StatDefinition, ModifierType, UserConfigType, Rarity, CompanionAllowedMode } from '../../types';
import { ModifierCard } from './ModifierCard';
import { useToastStore } from '../../store/useToastStore';

interface EntityFormProps {
    entity: Entity;
    entities: Entity[]; // Pour les listes parents (Classes, Races...)
    onUpdate: (updatedEntity: Entity) => void;
    onDelete: (id: string) => void;
    stats: StatDefinition[];
    slots: ItemSlot[];
    categories: ItemCategory[];
    typeLabels: Record<string, string>;
}

export const EntityForm: React.FC<EntityFormProps> = ({ 
    entity, 
    entities, 
    onUpdate, 
    onDelete, 
    stats, 
    slots, 
    categories, 
    typeLabels 
}) => {
    const { addToast } = useToastStore();
    
    // Helper pour mettre à jour l'entité actuelle
    const updateField = (field: keyof Entity, value: any) => {
        onUpdate({ ...entity, [field]: value });
    };

    const handleUserConfigChange = (type: UserConfigType) => {
        if (type === 'none') {
            updateField('userConfig', undefined);
        } else {
            updateField('userConfig', {
                type: type,
                min: 0,
                max: 100,
                step: 1,
                label: 'Valeur'
            });
        }
    };

    const updateUserConfigField = (key: string, val: any) => {
        updateField('userConfig', { ...entity.userConfig, [key]: val });
    };

    const handleManualSave = () => {
        addToast("Modifications enregistrées", "success");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
            {/* HEADER: NOM & SUPPRESSION */}
            <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nom</label>
                    <input 
                        value={entity.name} 
                        onChange={e => updateField('name', e.target.value)} 
                        className="bg-transparent text-2xl font-bold text-white border-b border-slate-700 w-full focus:border-indigo-500 outline-none pb-1"
                    />
                </div>
                <button onClick={() => onDelete(entity.id)} className="text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors">
                    <Trash2 size={20}/>
                </button>
            </div>
            
            {/* ID & TYPE */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">ID (Unique)</label>
                    <input 
                        value={entity.id} 
                        onChange={e => updateField('id', e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-indigo-300"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Type</label>
                    <select 
                        value={entity.type} 
                        onChange={e => updateField('type', e.target.value as EntityType)} 
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300"
                    >
                        {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>
            </div>

            {/* PARENT LINKING */}
            {(entity.type === EntityType.SPECIALIZATION || entity.type === EntityType.ELITE_COMPETENCE) && (
                <div className="p-4 bg-indigo-900/10 border border-indigo-500/30 rounded-lg">
                    <label className="block text-[10px] uppercase font-bold text-indigo-300 mb-1">Classe Parente</label>
                    <select value={entity.parentId || ''} onChange={e => updateField('parentId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white">
                        <option value="">-- Aucune --</option>
                        {entities.filter(e => e.type === EntityType.CLASS).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            )}

            {(entity.type === EntityType.RACIAL_COMPETENCE) && (
                <div className="p-4 bg-indigo-900/10 border border-indigo-500/30 rounded-lg">
                    <label className="block text-[10px] uppercase font-bold text-indigo-300 mb-1">Race Parente</label>
                    <select value={entity.parentId || ''} onChange={e => updateField('parentId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white">
                        <option value="">-- Aucune --</option>
                        {entities.filter(e => e.type === EntityType.RACE).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
            )}

            {/* ITEM SPECIFIC FIELDS */}
            {entity.type === EntityType.ITEM && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Catégorie</label>
                        <select value={entity.categoryId || ''} onChange={e => updateField('categoryId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white">
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sous-Catégorie</label>
                        <input 
                            value={entity.subCategory || ''} 
                            onChange={e => updateField('subCategory', e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" 
                            list="subcats"
                        />
                        <datalist id="subcats">{categories.find(c => c.id === entity.categoryId)?.subCategories?.map(s => <option key={s} value={s}/>)}</datalist>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Slot</label>
                        <select value={entity.slotId || ''} onChange={e => updateField('slotId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white">
                            <option value="">-- Aucun --</option>
                            {slots.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Coût Équip.</label>
                        <input type="number" value={entity.equipmentCost || 0} onChange={e => updateField('equipmentCost', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"/>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-amber-500 mb-1">Prix (Or)</label>
                        <input type="number" value={entity.goldCost || 0} onChange={e => updateField('goldCost', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300"/>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Faction ID</label>
                        <input value={entity.factionId || ''} onChange={e => updateField('factionId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" placeholder="fac_..."/>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Set ID</label>
                        <input value={entity.setId || ''} onChange={e => updateField('setId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" placeholder="set_..."/>
                    </div>
                    
                    {/* RARITY SELECTOR */}
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Rareté</label>
                        <select 
                            value={entity.rarity || 'normal'} 
                            onChange={e => updateField('rarity', e.target.value as Rarity)} 
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        >
                            <option value="normal">Normale (Blanc)</option>
                            <option value="exotic">Exotique (Bleu Aura)</option>
                            <option value="epic">Épique (Or)</option>
                            <option value="legendary">Légendaire (Rose)</option>
                        </select>
                    </div>

                    {/* COMPANION ALLOWED (UPDATED) */}
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-purple-400 mb-1 flex items-center">
                            <Dog size={10} className="mr-1"/> Héritage Comp.
                        </label>
                        <select 
                            value={
                                entity.companionAllowed === true ? 'full' : 
                                entity.companionAllowed === false ? 'none' : 
                                (entity.companionAllowed || 'auto')
                            } 
                            onChange={e => updateField('companionAllowed', e.target.value as CompanionAllowedMode)} 
                            className="w-full bg-slate-900 border border-purple-500/50 rounded px-2 py-1 text-xs text-purple-200 focus:border-purple-500 outline-none"
                        >
                            <option value="auto">Automatique (Catégorie)</option>
                            <option value="none">Interdit (Aucun)</option>
                            <option value="stats_only">Stats Uniquement (Pas d'effets)</option>
                            <option value="full">Complet (Tout)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 col-span-3 sm:col-span-1">
                        <label className="flex items-center space-x-2 cursor-pointer pt-4">
                            <input type="checkbox" checked={entity.isCraftable || false} onChange={e => updateField('isCraftable', e.target.checked)} className="accent-emerald-500"/>
                            <span className="text-xs text-emerald-400 font-bold">Craftable ?</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={entity.isTungsten || false} onChange={e => updateField('isTungsten', e.target.checked)} className="accent-slate-500"/>
                            <span className="text-xs text-slate-400 font-bold">Tungstène ?</span>
                        </label>
                    </div>
                </div>
            )}

            {/* ITEM USER CONFIGURATION (ADMIN) */}
            {entity.type === EntityType.ITEM && (
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase flex items-center">
                            <Sliders size={14} className="mr-2"/> Configuration Joueur (Sceaux)
                        </h4>
                        <select 
                            value={entity.userConfig?.type || 'none'} 
                            onChange={(e) => handleUserConfigChange(e.target.value as UserConfigType)}
                            className="bg-slate-950 border border-slate-700 text-[10px] rounded px-2 py-1 text-white outline-none focus:border-indigo-500"
                        >
                            <option value="none">Désactivé</option>
                            <option value="slider">Barre (Slider)</option>
                            <option value="manual_stats">Entrée Libre (3 Stats)</option>
                        </select>
                    </div>

                    {entity.userConfig?.type === 'slider' && (
                        <div className="grid grid-cols-4 gap-3 bg-slate-950/50 p-2 rounded">
                            <div className="col-span-1">
                                <label className="block text-[9px] uppercase text-slate-500">Min</label>
                                <input type="number" value={entity.userConfig.min} onChange={e => updateUserConfigField('min', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"/>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[9px] uppercase text-slate-500">Max</label>
                                <input type="number" value={entity.userConfig.max} onChange={e => updateUserConfigField('max', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"/>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[9px] uppercase text-slate-500">Pas (Step)</label>
                                <input type="number" value={entity.userConfig.step} onChange={e => updateUserConfigField('step', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"/>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[9px] uppercase text-slate-500">Label</label>
                                <input type="text" value={entity.userConfig.label} onChange={e => updateUserConfigField('label', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"/>
                            </div>
                            <div className="col-span-4 text-[9px] text-slate-500 italic mt-1">
                                Variable à utiliser dans les modificateurs : <code className="text-indigo-400 font-mono">config_{entity.id}_val</code>
                            </div>
                        </div>
                    )}

                    {entity.userConfig?.type === 'manual_stats' && (
                        <div className="bg-slate-950/50 p-2 rounded text-[10px] text-slate-400">
                            <p>Le joueur pourra entrer manuellement 3 valeurs.</p>
                            <p className="mt-1">Variables à utiliser dans les modificateurs :</p>
                            <ul className="list-disc pl-4 mt-1 font-mono text-indigo-300">
                                <li>config_{entity.id}_vit</li>
                                <li>config_{entity.id}_spd</li>
                                <li>config_{entity.id}_dmg</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* IMAGE URL */}
            {(entity.type === EntityType.FACTION || entity.type === EntityType.CAREER || entity.type === EntityType.ITEM || entity.type === EntityType.ITEM_SET || entity.type === EntityType.GUILD) && (
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">URL Image (Optionnel)</label>
                    <div className="flex gap-2">
                        <input value={entity.imageUrl || ''} onChange={e => updateField('imageUrl', e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300 font-mono" placeholder="https://..." />
                        {entity.imageUrl && <img src={entity.imageUrl} alt="Preview" className="w-8 h-8 object-contain bg-slate-800 rounded border border-slate-700" />}
                    </div>
                </div>
            )}

            {/* DESCRIPTION & DISPLAY OPTIONS */}
            <div className="flex flex-col gap-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500">Description</label>
                <textarea 
                    value={entity.description || ''} 
                    onChange={e => updateField('description', e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300 min-h-[80px]" 
                    placeholder="Description simple..."
                />
                
                <div className="flex items-center space-x-2 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer select-none bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg hover:border-slate-500 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={entity.hideInRecap || false} 
                            onChange={e => updateField('hideInRecap', e.target.checked)} 
                            className="accent-red-500"
                        />
                        <div className="flex items-center text-xs">
                            <EyeOff size={14} className={`mr-2 ${entity.hideInRecap ? 'text-red-400' : 'text-slate-500'}`}/>
                            <span className={entity.hideInRecap ? 'text-red-300 font-bold' : 'text-slate-400'}>Masquer du Récapitulatif (Lore/Stats pures)</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* MODIFIERS SECTION */}
            <div className="space-y-3">
                <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-white uppercase">Modificateurs ({entity.modifiers?.length || 0})</h4>
                    <button 
                        onClick={() => updateField('modifiers', [...(entity.modifiers || []), { id: `mod_${Date.now()}`, type: ModifierType.FLAT, targetStatKey: 'vit', value: '0' }])} 
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded flex items-center"
                    >
                        <Plus size={12} className="mr-1"/> Ajouter Modifier
                    </button>
                </div>
                <div className="space-y-2">
                    {(entity.modifiers || []).map((mod, idx) => (
                        <ModifierCard 
                            key={mod.id || idx} 
                            mod={mod} 
                            stats={stats} 
                            onChange={(newMod) => {
                                const newMods = [...(entity.modifiers || [])];
                                newMods[idx] = newMod;
                                updateField('modifiers', newMods);
                            }}
                            onDelete={() => {
                                const newMods = [...(entity.modifiers || [])];
                                newMods.splice(idx, 1);
                                updateField('modifiers', newMods);
                            }}
                        />
                    ))}
                    {(entity.modifiers || []).length === 0 && (
                        <div className="text-center py-8 text-slate-600 text-xs italic border-2 border-dashed border-slate-800 rounded-lg">Aucun modificateur.</div>
                    )}
                </div>
            </div>

            {/* EXPLICIT SAVE BUTTON */}
            <div className="sticky bottom-4 z-20 flex justify-end pt-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800 -mx-6 px-6">
                <button 
                    onClick={handleManualSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Save size={18} />
                    <span>Enregistrer les modifications</span>
                </button>
            </div>
        </div>
    );
};
