
import React from 'react';
import { Flame, Droplet, Skull, Heart, Wind, Activity, Wand2, Feather, Hammer, Weight, Dna, Zap, Bug, Rabbit, PawPrint, UserCheck, Sword, PauseCircle, Hand, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { PlayerSelection, Entity, ModifierType } from '../../types';
import { evaluateFormula } from '../../services/engine';
import { DebouncedSlider } from '../ui/DebouncedControl';

// Helper to scale values based on effect booster and special mastery
const getScaledValue = (base: number, context: any) => {
    if (!context) return base;
    const booster = context.effect_booster || 0;
    const mastery = context.special_mastery || 0;
    const raw = base * (1 + booster/100 + mastery/100);
    return Math.ceil(parseFloat(raw.toFixed(2)));
};

export const BloodMagicSelector: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void; context?: any }> = ({ toggles, onToggle, context }) => {
    const valBase = getScaledValue(5, context);
    const valL1 = getScaledValue(10, context);
    const valL2 = getScaledValue(15, context);
    const valL3 = getScaledValue(25, context);

    const levels = [
        { id: 'base', label: 'Inactif', val: `${valBase}%`, desc: 'Base', icon: Droplet, color: 'text-slate-400', bg: 'bg-slate-900', border: 'border-slate-700' },
        { id: 'curse_lvl_1', label: 'Pacte I', val: `${valL1}%`, desc: 'Vit/2', icon: Droplet, color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-900' },
        { id: 'curse_lvl_2', label: 'Pacte II', val: `${valL2}%`, desc: 'Vit/3', icon: Droplet, color: 'text-red-500', bg: 'bg-red-950/60', border: 'border-red-700' },
        { id: 'curse_lvl_3', label: 'Pacte III', val: `${valL3}%`, desc: 'Vit/4', icon: Skull, color: 'text-red-600', bg: 'bg-red-950/80', border: 'border-red-500' },
    ];
    
    const currentLevel = toggles['curse_lvl_3'] ? 3 : toggles['curse_lvl_2'] ? 2 : toggles['curse_lvl_1'] ? 1 : 0;
    
    const handleSelect = (idx: number) => {
        const id = levels[idx].id;
        if (id === 'base') {
            if (currentLevel === 1) onToggle('curse_lvl_1', 'curse_pact');
            if (currentLevel === 2) onToggle('curse_lvl_2', 'curse_pact');
            if (currentLevel === 3) onToggle('curse_lvl_3', 'curse_pact');
        } else { onToggle(id, 'curse_pact'); }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 to-red-950/30 border border-red-900/30 rounded-xl p-4 mt-4 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-sm font-perrigord text-red-200 flex items-center tracking-wide"><Flame size={16} className="mr-2 text-red-500" /> Magie du Sang</h4>
                <div className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] text-red-300 font-mono">ABSORPTION</div>
            </div>
            
            {/* Visual Blood Vial Bar */}
            <div className="relative h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-900 to-red-500 transition-all duration-500 ease-out" 
                    style={{ width: `${(currentLevel / 3) * 100}%` }}
                ></div>
            </div>

            <div className="grid grid-cols-4 gap-2 relative z-10">
                {levels.map((lvl, idx) => {
                    const isActive = currentLevel === idx; 
                    const Icon = lvl.icon;
                    return (
                        <button 
                            key={lvl.id} 
                            onClick={() => handleSelect(idx)} 
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 relative overflow-hidden group ${isActive ? `${lvl.bg} ${lvl.border} ring-1 ring-red-500/50 scale-105 shadow-lg` : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'}`}
                        >
                            <Icon size={18} className={`mb-1 ${isActive ? 'text-white drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : lvl.color}`} />
                            <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-slate-500'}`}>{lvl.val}</span>
                            <span className="text-[8px] text-slate-500 mt-0.5">{lvl.desc}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export const ThanatoOrganSelector: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void; context?: any }> = ({ toggles, onToggle, context }) => {
    const valHeart = getScaledValue(20, context);
    const valLung = getScaledValue(20, context);
    const valLiver = getScaledValue(10, context);

    const organs = [
        { id: 'organ_heart', label: 'Cœur', val: `+${valHeart}% Vit`, icon: Heart, color: 'text-rose-500', from: 'from-rose-900/40', to: 'to-rose-950/10' },
        { id: 'organ_lung', label: 'Poumon', val: `+${valLung}% Spd`, icon: Wind, color: 'text-sky-400', from: 'from-sky-900/40', to: 'to-sky-950/10' },
        { id: 'organ_liver', label: 'Foie', val: `+${valLiver}% Abs`, icon: Activity, color: 'text-amber-500', from: 'from-amber-900/40', to: 'to-amber-950/10' },
    ];

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 relative z-10">
                <h4 className="text-sm font-perrigord text-slate-200 flex items-center tracking-wide"><Skull size={16} className="mr-2 text-rose-800" /> Festin d'Organes</h4>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
                {organs.map((organ) => {
                    const isActive = toggles[organ.id];
                    const Icon = organ.icon;
                    return (
                        <button 
                            key={organ.id} 
                            onClick={() => onToggle(organ.id, 'thanato_organ')} 
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-500 group relative overflow-hidden ${isActive ? `bg-gradient-to-b ${organ.from} ${organ.to} border-white/20 shadow-lg` : 'bg-slate-900 border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'}`}
                        >
                            <div className={`mb-2 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}>
                                <Icon size={24} className={isActive ? organ.color : 'text-slate-600'} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase mb-0.5 ${isActive ? 'text-white' : 'text-slate-500'}`}>{organ.label}</span>
                            <span className={`text-[9px] font-mono ${isActive ? organ.color : 'text-slate-600'}`}>{organ.val}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export const ArlequinDealer: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void; context?: any }> = ({ toggles, onToggle, context }) => {
    
    // Valeurs FIXES comme demandé
    const valStd = 20;
    const valRoyal = 50;

    const cards = [
        { id: 'card_spade', label: 'Pique', icon: '♠', color: 'text-slate-200', border: 'border-slate-400', bgActive: 'bg-slate-800', stat: 'Dégâts', val: `+${valStd}%` },
        { id: 'card_club', label: 'Trèfle', icon: '♣', color: 'text-emerald-400', border: 'border-emerald-500', bgActive: 'bg-emerald-950', stat: 'Vitesse', val: `+${valStd}%` },
        { id: 'card_heart', label: 'Cœur', icon: '♥', color: 'text-rose-500', border: 'border-rose-500', bgActive: 'bg-rose-950', stat: 'Vitalité', val: `+${valStd}%` },
        { id: 'card_diamond', label: 'Carreau', icon: '♦', color: 'text-amber-400', border: 'border-amber-500', bgActive: 'bg-amber-950', stat: 'TOUT', val: `+${valStd}%` },
        { id: 'card_royal', label: 'Royal', icon: '★', color: 'text-yellow-400', border: 'border-yellow-400', bgActive: 'bg-gradient-to-b from-yellow-900 to-indigo-900', stat: 'TOUT', val: `+${valRoyal}%`, isRoyal: true },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-perrigord text-amber-500 flex items-center tracking-wide">
                    <Dna size={16} className="mr-2" /> Tirage du Destin
                </h4>
                <div className="text-[10px] text-slate-500 font-mono">Une carte active à la fois</div>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
                {cards.map(card => {
                    const isActive = toggles[card.id];
                    return (
                        <button 
                            key={card.id} 
                            onClick={() => onToggle(card.id, 'arlequin_card')} 
                            className={`
                                relative aspect-[2/3] rounded-lg border flex flex-col items-center justify-between py-2 transition-all duration-300 group select-none
                                ${isActive 
                                    ? `${card.bgActive} ${card.border} scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 translate-y-[-4px]` 
                                    : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600 grayscale-[0.5] hover:grayscale-0'
                                }
                            `}
                        >
                            {/* Card Corner Pips */}
                            <div className={`absolute top-1 left-1.5 text-[8px] leading-none ${card.color} font-bold opacity-80`}>
                                <div>{card.isRoyal ? 'R' : 'A'}</div>
                                <div>{card.icon}</div>
                            </div>
                            <div className={`absolute bottom-1 right-1.5 text-[8px] leading-none ${card.color} font-bold opacity-80 rotate-180`}>
                                <div>{card.isRoyal ? 'R' : 'A'}</div>
                                <div>{card.icon}</div>
                            </div>

                            {/* Center Icon */}
                            <div className={`text-2xl mt-1 transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-md' : ''} ${card.isRoyal && isActive ? 'animate-spin-slow' : ''} ${card.color}`}>
                                {card.icon}
                            </div>

                            {/* Value Display */}
                            <div className="text-center z-10">
                                <div className={`text-[9px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {card.val}
                                </div>
                                {isActive && (
                                    <div className={`text-[7px] uppercase font-bold tracking-wider ${card.color} animate-in fade-in zoom-in duration-300`}>
                                        {card.stat}
                                    </div>
                                )}
                            </div>
                            
                            {/* Royal Glow Effect */}
                            {card.isRoyal && isActive && (
                                <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-lg pointer-events-none"></div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export const PugilistStances: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void }> = ({ toggles, onToggle }) => {
    const stances = [
        { id: 'pos_mante', label: 'Mante', icon: Bug, color: 'text-emerald-400', from: 'from-emerald-900/30', to: 'to-transparent' },
        { id: 'pos_serpent', label: 'Serpent', icon: Activity, color: 'text-amber-400', from: 'from-amber-900/30', to: 'to-transparent' },
        { id: 'pos_lievre', label: 'Lièvre', icon: Rabbit, color: 'text-rose-400', from: 'from-rose-900/30', to: 'to-transparent' },
        { id: 'pos_singe', label: 'Singe', icon: PawPrint, color: 'text-slate-300', from: 'from-slate-800', to: 'to-slate-900' },
    ];

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-perrigord text-indigo-300 flex items-center tracking-wide"><Zap size={16} className="mr-2" /> Postures Martiales</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {stances.map((stance) => {
                    const isActive = toggles[stance.id];
                    const Icon = stance.icon;
                    return (
                        <button 
                            key={stance.id} 
                            onClick={() => onToggle(stance.id, 'pugilist_stance')} 
                            className={`flex items-center p-3 rounded-xl border transition-all duration-300 overflow-hidden relative ${isActive ? `bg-gradient-to-r ${stance.from} ${stance.to} border-white/20 shadow-md` : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'}`}
                        >
                            <div className={`p-2 rounded-full mr-3 transition-transform ${isActive ? 'bg-white/10 scale-110' : 'bg-slate-800'}`}>
                                <Icon size={18} className={isActive ? stance.color : 'text-slate-500'} />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>{stance.label}</span>
                            {isActive && <div className={`absolute right-3 w-2 h-2 rounded-full ${stance.color.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor]`}></div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export const ArcaneSacrificePanel: React.FC<{ currentValue: number; onChange: (val: number) => void; context?: any; }> = ({ currentValue, onChange, context }) => {
    const totalVal = getScaledValue(currentValue * 10, context);
    return (
        <div className="bg-slate-900 border border-violet-900/40 p-5 rounded-xl relative overflow-hidden mt-4 group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-950/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-perrigord text-violet-300 uppercase flex items-center"><Wand2 size={16} className="mr-2" /> Arcanes Sombres</h4>
                    <div className={`px-3 py-1 rounded bg-violet-950 border border-violet-700 text-violet-300 font-mono font-bold text-xs shadow-[0_0_10px_rgba(139,92,246,0.3)]`}>+{totalVal}%</div>
                </div>
                <DebouncedSlider min={0} max={6} step={1} value={currentValue} onChange={onChange} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500" />
            </div>
        </div>
    );
};

export const NaturalStrengthPanel: React.FC<{ selection: PlayerSelection; allItems: Entity[]; onToggleAllocation: (slotId: string) => void; level: number; context?: any; }> = ({ selection, allItems, onToggleAllocation, level, context }) => {
    const getSpeedPenalty = (itemId: string | undefined) => {
        if (!itemId) return 0;
        const item = allItems.find(i => i.id === itemId);
        if (!item) return 0;
        let penalty = 0;
        const ctx = context || { level: level || 1 }; 
        (item.modifiers || []).forEach(m => {
            if (m.targetStatKey === 'spd' && m.type === ModifierType.FLAT) {
                const val = evaluateFormula(m.value, ctx as any);
                if (val < 0) penalty += val;
            }
        });
        return penalty;
    };
    const slotsToCheck: { id: string, label: string, itemType: 'chest' | 'weapon' }[] = [{ id: 'chest', label: 'Plastron', itemType: 'chest' }];
    selection.weaponSlots.forEach((_, idx) => { slotsToCheck.push({ id: `weapon_${idx}`, label: `Arme ${idx + 1}`, itemType: 'weapon' }); });
    const itemsWithPenalty = slotsToCheck.map(slot => { const itemId = slot.id === 'chest' ? selection.equippedItems['chest'] : selection.weaponSlots[parseInt(slot.id.split('_')[1])]; const item = allItems.find(i => i.id === itemId); const penalty = getSpeedPenalty(itemId); return { slotId: slot.id, label: slot.label, item, penalty, cost: slot.itemType === 'chest' ? 1 : (item?.equipmentCost || 1) }; }).filter(i => i.item && i.penalty < 0);
    const allocatedSlots = new Set(selection.naturalStrengthAllocation || []);
    const usedPoints = itemsWithPenalty.filter(i => allocatedSlots.has(i.slotId)).reduce((sum, i) => sum + i.cost, 0);
    const MAX_POINTS = 2; const remainingPoints = MAX_POINTS - usedPoints;

    return (
        <div className="bg-slate-900 border border-amber-900/30 p-5 rounded-xl relative overflow-hidden mt-4">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-4"><h4 className="text-sm font-perrigord text-amber-400 uppercase flex items-center"><Feather size={16} className="mr-2" /> Force Naturelle</h4><span className="text-xs font-mono font-bold text-amber-500">{usedPoints} / {MAX_POINTS} pts</span></div>
                {itemsWithPenalty.length > 0 ? (<div className="space-y-2">{itemsWithPenalty.map(i => { const isAllocated = allocatedSlots.has(i.slotId); const canAfford = remainingPoints >= i.cost || isAllocated; return (<button key={i.slotId} onClick={() => { if (isAllocated || canAfford) onToggleAllocation(i.slotId); }} disabled={!isAllocated && !canAfford} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${isAllocated ? 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : canAfford ? 'bg-slate-950 border-slate-800 hover:border-amber-500/30' : 'bg-slate-950/50 border-slate-800 opacity-50 cursor-not-allowed'}`}><div className="flex items-center text-left"><div className={`p-2 rounded-lg mr-3 transition-colors ${isAllocated ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-500'}`}><Weight size={18} /></div><div><div className={`text-xs font-bold ${isAllocated ? 'text-amber-200' : 'text-slate-300'}`}>{i.item?.name}</div><div className="flex items-center text-[10px] text-slate-500 mt-0.5"><span className="mr-2 text-red-400 font-mono">Penalité: {i.penalty} SPD</span><span className="flex items-center text-slate-400 bg-slate-900 px-1.5 rounded"><Hammer size={8} className="mr-1"/> Coût: {i.cost}</span></div></div></div><div className="text-[10px] font-bold uppercase tracking-wider">{isAllocated ? (<span className="text-amber-400 flex items-center"><Check size={14} className="mr-1"/> Allégé</span>) : (<span className="text-slate-600 group-hover:text-slate-400">Rembourser</span>)}</div></button>); })}</div>) : (<div className="text-center p-6 border border-dashed border-slate-800 rounded-lg"><p className="text-xs text-slate-500 italic">Aucun équipement lourd.</p></div>)}
             </div>
        </div>
    );
};

export const ZenitudePanel: React.FC<{ active: boolean; onToggle: () => void }> = ({ active, onToggle }) => { return (<div className={`mt-4 rounded-xl border p-5 relative overflow-hidden transition-all duration-500 ${active ? 'bg-cyan-900/20 border-cyan-500/50 shadow-lg' : 'bg-slate-900 border-slate-800'}`}><div className="flex justify-between items-center relative z-10"><div className="flex items-center"><div className={`p-3 rounded-full mr-4 transition-all duration-500 ${active ? 'bg-cyan-500/20 text-cyan-400 rotate-180' : 'bg-slate-800 text-slate-600'}`}><PauseCircle size={28} strokeWidth={1.5} /></div><div><h4 className={`text-sm font-bold uppercase tracking-widest ${active ? 'text-cyan-300' : 'text-slate-500'}`}>{active ? 'Méditation Active' : 'Combat Standard'}</h4></div></div><button onClick={onToggle} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all duration-300 flex items-center shadow-md ${active ? 'bg-cyan-600 text-white border-cyan-400 hover:bg-cyan-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>{active ? 'ACTIVE' : 'ACTIVER'}</button></div></div>); };
export const LutteurPanel: React.FC<{ active: boolean; onToggle: () => void; hasWeapons: boolean }> = ({ active, onToggle, hasWeapons }) => { return (<div className={`mt-4 rounded-xl border p-5 relative overflow-hidden transition-all duration-500 ${active ? 'bg-orange-900/20 border-orange-500/50 shadow-lg' : 'bg-slate-900 border-slate-800'}`}><div className="flex justify-between items-center relative z-10"><div className="flex items-center"><div className={`p-3 rounded-full mr-4 transition-all duration-500 ${active ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-600'}`}><Hand size={28} strokeWidth={1.5} /></div><div><h4 className={`text-sm font-bold uppercase tracking-widest ${active ? 'text-orange-300' : 'text-slate-500'}`}>{active ? 'Posture Mains Nues' : 'Combat Standard'}</h4><p className={`text-[10px] font-mono mt-1 ${hasWeapons ? 'text-red-400' : 'text-slate-600'}`}>{hasWeapons ? '⚠️ Arme équipée' : ''}</p></div></div><button onClick={onToggle} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all duration-300 flex items-center shadow-md ${active ? 'bg-orange-600 text-white border-orange-400 hover:bg-orange-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>{active ? 'ACTIVE' : 'ACTIVER'}</button></div></div>); };
export const SansPeurPanel: React.FC<{ stacks: number; protecting: boolean; onStackChange: (val: number) => void; onToggleProtect: () => void; context?: any; }> = ({ stacks, protecting, onStackChange, onToggleProtect, context }) => { const totalVal = getScaledValue(stacks * 10, context); return (<div className="bg-slate-900 border border-indigo-900/40 p-5 rounded-xl relative overflow-hidden mt-4 group"><div className="relative z-10"><div className="flex justify-between items-center mb-4"><h4 className="text-sm font-perrigord text-indigo-400 uppercase flex items-center"><Sword size={16} className="mr-2" /> Sans Peur</h4><div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${stacks > 0 ? 'bg-indigo-900/50 border-indigo-500 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>+{totalVal}%</div></div><div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800"><div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2"><span>Coups Reçus</span><span className="text-indigo-400">{stacks}</span></div><DebouncedSlider min={0} max={20} step={1} value={stacks} onChange={onStackChange} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" /></div><button onClick={onToggleProtect} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-300 group ${protecting ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}><div className="flex items-center"><UserCheck size={20} className={protecting ? 'text-indigo-400' : 'text-slate-600'} /><div className="ml-3 text-xs font-bold uppercase text-slate-300">Protéger Allié</div></div><div className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${protecting ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-600'}`}>{protecting ? 'ON' : 'OFF'}</div></button></div></div>); };
export const RagePanel: React.FC<{ stacks: number; onStackChange: (val: number) => void; context?: any; }> = ({ stacks, onStackChange, context }) => { const totalVal = getScaledValue(stacks * 10, context); return (<div className="bg-slate-900 border border-red-900/40 p-5 rounded-xl relative overflow-hidden mt-4 group"><div className="relative z-10"><div className="flex justify-between items-center mb-4"><h4 className="text-sm font-perrigord text-red-400 uppercase flex items-center"><Zap size={16} className="mr-2" /> Rage Décuplée</h4><div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${stacks > 0 ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>+{totalVal}%</div></div><div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800"><div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2"><span>Coups Reçus</span><span className="text-red-400">{stacks}</span></div><DebouncedSlider min={0} max={20} step={1} value={stacks} onChange={onStackChange} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500" /></div></div></div>); };
export const ColereVivePanel: React.FC<{ stacks: number; onStackChange: (val: number) => void; context?: any; }> = ({ stacks, onStackChange, context }) => { const totalVal = getScaledValue(stacks * 10, context); return (<div className="bg-slate-900 border border-orange-900/40 p-5 rounded-xl relative overflow-hidden mt-4 group"><div className="relative z-10"><div className="flex justify-between items-center mb-4"><h4 className="text-sm font-perrigord text-orange-400 uppercase flex items-center"><AlertTriangle size={16} className="mr-2" /> Colère Vive</h4><div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${stacks > 0 ? 'bg-orange-900/50 border-orange-500 text-orange-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>+{totalVal}%</div></div><div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800"><div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2"><span>Échecs Critiques</span><span className="text-orange-400">{stacks}</span></div><DebouncedSlider min={0} max={20} step={1} value={stacks} onChange={onStackChange} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" /></div></div></div>); };
