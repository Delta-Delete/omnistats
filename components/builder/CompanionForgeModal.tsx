
import React, { useState } from 'react';
import { Save, X, Dog, Zap, Heart, Activity, Sword, MessageSquare } from 'lucide-react';
import { Entity, EntityType, ModifierType } from '../../types';

interface CompanionForgeModalProps {
    onClose: () => void;
    onSave: (item: Entity) => void;
}

export const CompanionForgeModal: React.FC<CompanionForgeModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'mount' | 'familiar'>('mount');
    const [description, setDescription] = useState('');
    
    // Stats
    const [stats, setStats] = useState({
        vit: 0,
        spd: 0,
        dmg: 0
    });

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
            subCategory: type === 'mount' ? 'Créature' : 'Esprit',
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
                    <div className="space-y-3">
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
                        
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Type</label>
                            <div className="flex bg-slate-800 rounded border border-slate-700 overflow-hidden">
                                <button 
                                    onClick={() => setType('mount')} 
                                    className={`flex-1 py-2 text-xs font-bold transition-colors flex items-center justify-center ${type === 'mount' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Dog size={14} className="mr-2" /> Monture
                                </button>
                                <div className="w-px bg-slate-700"></div>
                                <button 
                                    onClick={() => setType('familiar')} 
                                    className={`flex-1 py-2 text-xs font-bold transition-colors flex items-center justify-center ${type === 'familiar' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Zap size={14} className="mr-2" /> Familier
                                </button>
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
