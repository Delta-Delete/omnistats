
import React, { useState } from 'react';
import { Hammer, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Entity } from '../../../types';
import { toFantasyTitle } from '../utils';

interface ProfessionSelectorProps {
    professionId?: string;
    professionRank?: string;
    subProfessions?: Record<string, string>;
    mainProfessions: Entity[];
    subProfessionsList: Entity[];
    onMainUpdate: (profId: string) => void;
    onRankUpdate: (rank: string) => void;
    onSubToggle: (subId: string) => void;
    onSubRankUpdate: (subId: string, rank: string) => void;
}

const MAIN_RANKS = ['Novice', 'Apprenti', 'Compagnon', 'Maître', 'Maître Absolu'];
const POTION_POISON_RANKS = ['Débutant', 'Confirmé', 'Maître'];
const ENCHANTER_RANKS = ['Disciple', 'Initié(e)', 'Adepte-en-chef', 'Chef de maison/professeur', 'Enchanteur suprême'];

export const ProfessionSelector: React.FC<ProfessionSelectorProps> = ({
    professionId, professionRank, subProfessions,
    mainProfessions, subProfessionsList,
    onMainUpdate, onRankUpdate, onSubToggle, onSubRankUpdate
}) => {
    const [isSubProfOpen, setIsSubProfOpen] = useState(false);
    const activeSubCount = Object.keys(subProfessions || {}).length;

    const getSubProfRanks = (id: string) => {
        if (id.includes('potion') || id.includes('poison')) return POTION_POISON_RANKS;
        if (id.includes('enchanteur')) return ENCHANTER_RANKS;
        return [];
    };

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3">
            <div className="flex items-center text-sm text-slate-400 border-b border-slate-800 pb-2">
                <Hammer size={12} className="mr-2" /> 
                <span className="font-perrigord tracking-wide">{toFantasyTitle("Métiers & Artisanat")}</span>
            </div>
            
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Métier Principal</label>
                    <select 
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-2 py-1.5 text-xs focus:border-indigo-500 outline-none" 
                        value={professionId || ''} 
                        onChange={(e) => onMainUpdate(e.target.value)}
                    >
                        <option value="">-- Aucun --</option>
                        {mainProfessions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                {professionId && (
                    <div className="w-1/3">
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Rang</label>
                        <select 
                            className="w-full bg-slate-900 border border-slate-700 text-indigo-300 rounded-md px-2 py-1.5 text-xs focus:border-indigo-500 outline-none font-bold" 
                            value={professionRank || 'Novice'} 
                            onChange={(e) => onRankUpdate(e.target.value)}
                        >
                            {MAIN_RANKS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div>
                <button 
                    onClick={() => setIsSubProfOpen(!isSubProfOpen)} 
                    className="flex items-center justify-between w-full text-[10px] text-slate-500 uppercase font-bold mb-1.5 hover:text-slate-300 transition-colors group"
                >
                    <span className="flex items-center">
                        Spécialisations (Optionnels)
                        {activeSubCount > 0 && !isSubProfOpen && (
                            <span className="ml-2 bg-indigo-900/50 text-indigo-300 px-1.5 rounded text-[9px] border border-indigo-500/30">
                                {activeSubCount} Active{activeSubCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </span>
                    {isSubProfOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                
                {isSubProfOpen && (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {subProfessionsList.map(sub => {
                            const isChecked = !!subProfessions?.[sub.id];
                            const ranks = getSubProfRanks(sub.id);
                            const hasRanks = ranks.length > 0;
                            const currentRank = subProfessions?.[sub.id];

                            return (
                                <div 
                                    key={sub.id} 
                                    onClick={() => onSubToggle(sub.id)} 
                                    className={`p-2 rounded border transition-all cursor-pointer relative overflow-hidden group ${isChecked ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-bold leading-tight ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                                            {sub.name.replace('Fabricant de potion', 'Potions')}
                                        </span>
                                        {isChecked && <Check size={10} className="text-indigo-400" />}
                                    </div>
                                    
                                    {isChecked && hasRanks && (
                                        <div className="mt-1.5" onClick={e => e.stopPropagation()}>
                                            <select 
                                                value={currentRank} 
                                                onChange={(e) => onSubRankUpdate(sub.id, e.target.value)} 
                                                className="w-full bg-slate-950 border border-slate-700 text-[9px] rounded px-1 py-0.5 text-indigo-300 outline-none focus:border-indigo-500"
                                            >
                                                {ranks.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    
                                    {isChecked && !hasRanks && (
                                        <div className="mt-1 text-[8px] text-emerald-500 uppercase font-bold tracking-wide">Actif</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
