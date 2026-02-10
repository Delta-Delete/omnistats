
import React, { useState } from 'react';
import { Users, Flame, Divide, UserPlus, Save, X, Pencil } from 'lucide-react';
import { ActiveSummon, PlayerSelection } from '../../types';
import { toFantasyTitle } from './utils';

interface SummonsPanelProps {
    activeSummons: ActiveSummon[];
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    context: any;
}

export const SummonsPanel: React.FC<SummonsPanelProps> = ({ activeSummons, selection, setSelection, context }) => {
    const [editingSummonId, setEditingSummonId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const startEditing = (id: string | undefined, currentName: string) => {
        if (!id) return;
        setEditingSummonId(id);
        setEditName(currentName);
    };

    const saveName = (id: string) => {
        setSelection(prev => ({
            ...prev,
            summonNames: { ...(prev.summonNames || {}), [id]: editName }
        }));
        setEditingSummonId(null);
    };

    const getBoostedValue = (base: number) => {
        const booster = (context.effect_booster || 0) / 100;
        const enhanced = Math.ceil(base * (1 + booster));
        const bonus = enhanced - base;
        return { base, enhanced, bonus };
    };

    if (activeSummons.length === 0 && selection.specializationId !== 'spec_vaudou') return null;

    return (
        <div className="bg-slate-900 border border-emerald-900/30 p-5 rounded-xl border-l-4 border-l-emerald-500 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-perrigord text-emerald-400 flex items-center tracking-wide"><Users size={20} className="mr-2" /> {toFantasyTitle("Grimoire d'Invocations")}</h4>
                
                {selection.specializationId === 'spec_vaudou' && (
                    <button 
                        onClick={() => setSelection(prev => ({...prev, toggles: {...prev.toggles, vaudou_ritual: !prev.toggles.vaudou_ritual}}))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                            selection.toggles['vaudou_ritual'] 
                            ? 'bg-red-900/40 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                            : 'bg-slate-950 border-red-900/30 text-red-700 hover:border-red-500/50 hover:text-red-400'
                        }`}
                    >
                        <Flame size={12} className={selection.toggles['vaudou_ritual'] ? 'animate-pulse text-red-400' : ''} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Rituel de Sang</span>
                    </button>
                )}
            </div>

            {activeSummons.length > 0 ? (
                <div className="space-y-3">
                    {activeSummons.map((summon: ActiveSummon, idx: number) => {
                        const isShared = summon.sharePercent !== undefined;
                        const isAnimistePack = summon.sourceName === 'Animiste';
                        const customName = (summon.id && selection.summonNames?.[summon.id]) ? selection.summonNames[summon.id] : summon.name;
                        const isEditing = editingSummonId === summon.id;

                        return (
                            <div key={idx} className="bg-slate-950/50 rounded border border-slate-800 p-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800/50">
                                    <div className="flex flex-col flex-1 mr-2">
                                        {isEditing ? (
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="bg-slate-900 text-xs font-bold text-white border border-slate-600 rounded px-2 py-1 outline-none focus:border-indigo-500 w-full"
                                                    autoFocus
                                                />
                                                <button onClick={() => saveName(summon.id!)} className="text-green-400 hover:bg-green-900/20 p-1 rounded"><Save size={14}/></button>
                                                <button onClick={() => setEditingSummonId(null)} className="text-red-400 hover:bg-red-900/20 p-1 rounded"><X size={14}/></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center group">
                                                <span className="text-xs font-bold text-slate-200 mr-2">{customName}</span>
                                                {summon.id && (
                                                    <button 
                                                        onClick={() => startEditing(summon.id, customName)}
                                                        className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Renommer"
                                                    >
                                                        <Pencil size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <span className="text-[10px] text-slate-500 italic">Source: {summon.sourceName}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center">
                                                <span className="text-[10px] text-slate-500 uppercase mr-2 font-bold">Quantité</span>
                                                <span className="bg-emerald-900/30 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20">{summon.count}</span>
                                            </div>
                                            {isAnimistePack ? (
                                                <div className="flex items-center px-1.5 py-0.5 rounded bg-violet-900/20 border border-violet-500/30 text-[9px] text-violet-300 font-bold uppercase" title="Les stats sont divisées entre les membres de la meute">
                                                    <Divide size={10} className="mr-1"/> Partagé
                                                </div>
                                            ) : (
                                                <div className="flex items-center px-1.5 py-0.5 rounded bg-blue-900/20 border border-blue-500/30 text-[9px] text-blue-300 font-bold uppercase" title="Chaque unité possède ses propres stats complètes">
                                                    <UserPlus size={10} className="mr-1"/> Individuel
                                                </div>
                                            )}
                                    </div>
                                </div>
                                {isShared && (
                                    <div className="text-[9px] text-slate-400 text-center mb-2 border-b border-slate-800/50 pb-1">
                                        Base: <span className="text-indigo-400 font-bold">{summon.sharePercent}%</span> des stats du joueur
                                        {isAnimistePack && summon.count > 1 && (
                                            <span className="block text-[8px] text-slate-500">(Divisé par {summon.count} unités)</span>
                                        )}
                                    </div>
                                )}
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {[{ label: 'Vit', val: summon.stats.vit, color: 'text-emerald-400' }, 
                                        { label: 'Spd', val: summon.stats.spd, color: 'text-amber-400' }, 
                                        { label: 'Dmg', val: summon.stats.dmg, color: 'text-rose-400' }
                                    ].map(s => (
                                        <div key={s.label} className="flex flex-col items-center">
                                            <span className="text-[9px] text-slate-500 uppercase">{s.label}</span>
                                            <div className="flex items-center gap-1">
                                                <span className={`text-xs font-mono font-bold ${s.color}`}>{s.val}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-4 text-[10px] text-slate-500 italic">
                    Aucune invocation active. Activez vos compétences ou équipez des objets d'invocation.
                </div>
            )}
            
            {selection.toggles['vaudou_ritual'] && (
                <div className="mt-3 pt-2 border-t border-slate-800 text-center text-[10px] text-red-400 font-mono animate-in fade-in">
                    {(() => {
                        const { bonus } = getBoostedValue(10);
                        return (
                            <>
                                <span className="font-bold">EFFET ACTIF:</span> Sacrifice PV (-30%) &rarr; Boost Partage 
                                <span className="text-emerald-400 font-bold"> (+10%{bonus > 0 ? ` +${bonus}%` : ''})</span>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};
