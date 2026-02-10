
import React, { useState, useEffect, useMemo } from 'react';
import { Save, X, Dog, Zap, Heart, Activity, Sword, MessageSquare, Tag, PawPrint } from 'lucide-react';
import { Entity, EntityType, ModifierType, ItemCategory } from '../../types';

interface CompanionForgeModalProps {
    categories: ItemCategory[];
    onClose: () => void;
    onSave: (item: Entity) => void;
}

export const CompanionForgeModal: React.FC<CompanionForgeModalProps> = ({ categories, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'mount' | 'familiar'>('mount');
    const [subCat, setSubCat] = useState(''); // New State for SubCategory
    const [description, setDescription] = useState('');
    
    // Stats
    const [stats, setStats] = useState({
        vit: 0,
        spd: 0,
        dmg: 0
    });

    // Get available subcategories based on selected type
    const availableSubCats = useMemo(() => {
        const catDef = categories.find(c => c.id === type);
        return catDef?.subCategories || [];
    }, [type, categories]);

    // Auto-select first subcategory when type changes
    useEffect(() => {
        if (availableSubCats.length > 0) {
            setSubCat(availableSubCats[0]);
        } else {
            setSubCat(type === 'mount' ? 'Créature' : 'Esprit'); // Fallback
        }
    }, [type, availableSubCats]);

    const handleSave = () => {
        if (!name) return;

        const newId = `custom_comp_${Date.now()}`;
        const newItem: Entity = {
            id: newId,
            type: EntityType.ITEM,
            name: name,
            description: description || "Un compagnon fidèle.",
            // Slot flexible (handled by picker filter), but generally fits custom_companion slot
            slotId: 'custom_companion',
            categoryId: type, // 'mount' or 'familiar'
            subCategory: subCat, // Uses user selection
            equipmentCost: 0,
            modifiers: [],
            isCraftable: true,
            companionAllowed: true // Important for Companion Sheet calculation
        };

        // Add modifiers
        if (stats.vit > 0) newItem.modifiers.push({ id: `${newId}_vit`, type: ModifierType.FLAT, targetStatKey: 'vit', value: stats.vit.toString() });
        if (stats.spd > 0) newItem.modifiers.push({ id: `${newId}_spd`, type: ModifierType.FLAT, targetStatKey: 'spd', value: stats.spd.toString() });
        if (stats.dmg > 0) newItem.modifiers.push({ id: `${newId}_dmg`, type: ModifierType.FLAT, targetStatKey: 'dmg', value: stats.dmg.toString() });

        onSave(newItem);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <Dog size={20} className="mr-2 text-indigo-400" /> Élevage & Dressage
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    
                    {/* Name & Type */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nom de la créature</label>
                            <input 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-indigo-500 placeholder-slate-600" 
                                placeholder="Ex: Pégase Noir" 
                                autoFocus 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Catégorie</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setType('mount')} 
                                        className={`flex-1 py-2.5 px-2 rounded-lg border transition-all flex flex-col items-center justify-center group ${
                                            type === 'mount' 
                                            ? 'bg-amber-900/30 border-amber-500 text-amber-300 shadow-sm' 
                                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-700'
                                        }`}
                                    >
                                        <PawPrint size={18} className={`mb-1 ${type === 'mount' ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                        <span className="text-[10px] font-bold uppercase">Monture</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => setType('familiar')} 
                                        className={`flex-1 py-2.5 px-2 rounded-lg border transition-all flex flex-col items-center justify-center group ${
                                            type === 'familiar' 
                                            ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300 shadow-sm' 
                                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-700'
                                        }`}
                                    >
                                        <Zap size={18} className={`mb-1 ${type === 'familiar' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                        <span className="text-[10px] font-bold uppercase">Familier</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Type (Espèce)</label>
                                <div className="relative h-full">
                                    <select 
                                        value={subCat}
                                        onChange={(e) => setSubCat(e.target.value)}
                                        className="w-full h-[58px] bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500 appearance-none pl-9 font-bold"
                                    >
                                        {availableSubCats.map(sc => (
                                            <option key={sc} value={sc}>{sc}</option>
                                        ))}
                                    </select>
                                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Inputs */}
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-3 text-center">Statistiques Bonus</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="flex items-center justify-center text-[10px] font-bold text-emerald-400 mb-1"><Heart size={10} className="mr-1"/> Vitalité</label>
                                <input 
                                    type="number" 
                                    value={stats.vit} 
                                    onChange={(e) => setStats({...stats, vit: parseInt(e.target.value) || 0})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-center text-white outline-none focus:border-emerald-500 font-mono" 
                                />
                            </div>
                            <div>
                                <label className="flex items-center justify-center text-[10px] font-bold text-amber-400 mb-1"><Activity size={10} className="mr-1"/> Vitesse</label>
                                <input 
                                    type="number" 
                                    value={stats.spd} 
                                    onChange={(e) => setStats({...stats, spd: parseInt(e.target.value) || 0})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-center text-white outline-none focus:border-amber-500 font-mono" 
                                />
                            </div>
                            <div>
                                <label className="flex items-center justify-center text-[10px] font-bold text-rose-400 mb-1"><Sword size={10} className="mr-1"/> Dégâts</label>
                                <input 
                                    type="number" 
                                    value={stats.dmg} 
                                    onChange={(e) => setStats({...stats, dmg: parseInt(e.target.value) || 0})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-center text-white outline-none focus:border-rose-500 font-mono" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description / Effect */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex items-center">
                            <MessageSquare size={12} className="mr-1" /> Effet Spécial / Description
                        </label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-indigo-500 placeholder-slate-600 resize-none h-24 text-xs leading-relaxed" 
                            placeholder="Décrivez l'effet passif ou actif de votre compagnon. Ce texte apparaîtra dans le récapitulatif." 
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <button 
                        onClick={handleSave} 
                        disabled={!name} 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-indigo-900/20"
                    >
                        <Save size={18} className="mr-2" /> Enregistrer le Compagnon
                    </button>
                </div>
            </div>
        </div>
    );
};
