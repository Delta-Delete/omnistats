
import React from 'react';
import { Flame, Droplet, Skull, Heart, Wind, Activity, Wand2, Ban, Feather, Check, Hammer, Weight, Dna, Zap, Bug, Rabbit, PawPrint, Shield, UserCheck, Sword, PauseCircle, Hand, AlertTriangle } from 'lucide-react';
import { PlayerSelection, Entity, ModifierType } from '../../types';
import { evaluateFormula } from '../../services/engine';

// Helper to scale values based on effect booster and special mastery
// FIXED: Added precision handling to prevent 55.0000001 becoming 56
const getScaledValue = (base: number, context: any) => {
    if (!context) return base;
    const booster = context.effect_booster || 0;
    const mastery = context.special_mastery || 0;
    const raw = base * (1 + booster/100 + mastery/100);
    // Remove floating point noise before ceiling
    return Math.ceil(parseFloat(raw.toFixed(2)));
};

export const BloodMagicSelector: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void; context?: any }> = ({ toggles, onToggle, context }) => {
    // Scaling base values
    const valBase = getScaledValue(5, context);
    const valL1 = getScaledValue(10, context); // 5 base + 5 mod
    const valL2 = getScaledValue(15, context); // 5 base + 10 mod
    const valL3 = getScaledValue(25, context); // 5 base + 20 mod

    const levels = [
        { id: 'base', label: 'Base', val: `${valBase}%`, desc: 'Aucun Malus', icon: Droplet },
        { id: 'curse_lvl_1', label: 'Pacte I', val: `${valL1}%`, desc: 'Vitesse / 2', icon: Droplet },
        { id: 'curse_lvl_2', label: 'Pacte II', val: `${valL2}%`, desc: 'Vitesse / 3', icon: Droplet },
        { id: 'curse_lvl_3', label: 'Pacte III', val: `${valL3}%`, desc: 'Vitesse / 4', icon: Skull },
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
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#7f1d1d_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10"><h4 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center"><Flame size={14} className="mr-2" /> Magie du Sang</h4><span className="text-[10px] text-red-800 font-mono">ABSORPTION_CTRL</span></div>
            <div className="grid grid-cols-4 gap-2 relative z-10">
                {levels.map((lvl, idx) => {
                    const isActive = currentLevel === idx; const Icon = lvl.icon;
                    return (<button key={lvl.id} onClick={() => handleSelect(idx)} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 relative overflow-hidden group ${isActive ? 'bg-red-900/80 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-slate-900/50 border-red-900/30 hover:bg-red-950/50 hover:border-red-700'}`}><div className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}><Icon size={20} className={isActive ? 'fill-red-500 text-red-200' : 'text-red-900 group-hover:text-red-700'} /></div><span className={`text-[10px] font-bold uppercase mb-0.5 ${isActive ? 'text-white' : 'text-red-800 group-hover:text-red-400'}`}>{lvl.val}</span><span className="text-[8px] font-mono text-red-300/50 leading-tight text-center">{lvl.desc}</span>{isActive && (<div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 shadow-[0_0_5px_red]"></div>)}</button>)
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
        { id: 'organ_heart', label: 'Cœur', val: `+${valHeart}% Vit`, icon: Heart, color: 'text-rose-500', border: 'border-rose-500', activeBg: 'bg-rose-900/50', hover: 'hover:border-rose-400', desc: 'Vie non absorbée' },
        { id: 'organ_lung', label: 'Poumon', val: `+${valLung}% Spd`, icon: Wind, color: 'text-sky-400', border: 'border-sky-500', activeBg: 'bg-sky-900/50', hover: 'hover:border-sky-400', desc: 'Souffle de course' },
        { id: 'organ_liver', label: 'Foie', val: `+${valLiver}% Abs`, icon: Activity, color: 'text-amber-500', border: 'border-amber-500', activeBg: 'bg-amber-900/50', hover: 'hover:border-amber-400', desc: 'Filtrage toxique' },
    ];

    return (
        <div className="bg-slate-950 border border-red-900/30 rounded-xl p-4 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#450a0a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest flex items-center"><Skull size={14} className="mr-2" /> Festin d'Organes</h4>
                <span className="text-[10px] text-slate-600 font-mono">CONSUMPTION</span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
                {organs.map((organ) => {
                    const isActive = toggles[organ.id];
                    const Icon = organ.icon;
                    return (
                        <button 
                            key={organ.id} 
                            onClick={() => onToggle(organ.id, 'thanato_organ')} 
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 group relative overflow-hidden ${isActive ? `${organ.activeBg} ${organ.border} shadow-[0_0_15px_rgba(0,0,0,0.5)]` : `bg-slate-900/50 border-slate-800 ${organ.hover}`}`}
                        >
                            <div className={`mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                                <Icon size={24} className={isActive ? organ.color : 'text-slate-600 group-hover:text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-xs font-bold uppercase mb-0.5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{organ.label}</span>
                            <span className={`text-[10px] font-mono ${isActive ? organ.color : 'text-slate-600'}`}>{organ.val}</span>
                            {isActive && (<div className={`absolute bottom-0 left-0 right-0 h-1 bg-current opacity-50 ${organ.color}`}></div>)}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-500 italic relative z-10">
                {toggles['organ_heart'] ? "Le bonus de vitalité du Cœur n'augmente pas vos dégâts." : "Consommez un organe au début du combat."}
            </div>
        </div>
    );
};

export const ArcaneSacrificePanel: React.FC<{ 
    currentValue: number;
    onChange: (val: number) => void;
    context?: any;
}> = ({ currentValue, onChange, context }) => {
    const MAX_STACKS = 6;
    const PER_STACK = 10;
    
    // UPDATED: Use getScaledValue for consistent boosted display
    const totalVal = getScaledValue(currentValue * PER_STACK, context);
    
    return (
        <div className="bg-slate-900 border border-violet-900/40 p-5 rounded-xl border-l-4 border-l-violet-600 relative overflow-hidden mt-4 group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Wand2 size={100} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-violet-400 uppercase flex items-center">
                        <Ban size={16} className="mr-2" /> Arcanes Sombres
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Bonus Actif</span>
                        <div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${currentValue > 0 ? 'bg-violet-900/50 border-violet-500 text-violet-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                            +{totalVal}%
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Bonus Annulés (Alliés/Ennemis)</span>
                        <span>{currentValue} / {MAX_STACKS}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max={MAX_STACKS} 
                        step="1" 
                        value={currentValue} 
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                    <div className="flex justify-between mt-1 text-[9px] text-slate-600 font-mono">
                        <span>0%</span>
                        <span>+{(MAX_STACKS * PER_STACK) / 2}%</span>
                        <span>+{(MAX_STACKS * PER_STACK)}%</span>
                    </div>
                </div>

                <p className="text-[10px] text-slate-400 italic bg-slate-950/50 p-2 rounded border border-slate-800">
                    <span className="text-violet-400 font-bold">Effet :</span> Pour chaque bonus annulé (allié consentant ou ennemi), vous gagnez <span className="text-white">10% Vitalité, Vitesse & Dégâts</span> (Alt Mult) en début de combat.
                </p>
            </div>
        </div>
    );
};

export const NaturalStrengthPanel: React.FC<{ 
    selection: PlayerSelection;
    allItems: Entity[];
    onToggleAllocation: (slotId: string) => void;
    level: number;
    context?: any;
}> = ({ selection, allItems, onToggleAllocation, level, context }) => {
    
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

    const slotsToCheck: { id: string, label: string, itemType: 'chest' | 'weapon' }[] = [
        { id: 'chest', label: 'Plastron', itemType: 'chest' }
    ];
    selection.weaponSlots.forEach((_, idx) => {
        slotsToCheck.push({ id: `weapon_${idx}`, label: `Arme ${idx + 1}`, itemType: 'weapon' });
    });

    const itemsWithPenalty = slotsToCheck.map(slot => {
        const itemId = slot.id === 'chest' 
            ? selection.equippedItems['chest'] 
            : selection.weaponSlots[parseInt(slot.id.split('_')[1])];
        
        const item = allItems.find(i => i.id === itemId);
        const penalty = getSpeedPenalty(itemId);
        
        return {
            slotId: slot.id,
            label: slot.label,
            item,
            penalty,
            cost: slot.itemType === 'chest' ? 1 : (item?.equipmentCost || 1)
        };
    }).filter(i => i.item && i.penalty < 0);

    const allocatedSlots = new Set(selection.naturalStrengthAllocation || []);
    const usedPoints = itemsWithPenalty
        .filter(i => allocatedSlots.has(i.slotId))
        .reduce((sum, i) => sum + i.cost, 0);
    
    const MAX_POINTS = 2;
    const remainingPoints = MAX_POINTS - usedPoints;

    return (
        <div className="bg-slate-900 border border-amber-900/30 p-5 rounded-xl border-l-4 border-l-amber-500 relative overflow-hidden mt-4">
             <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none"><Feather size={120} /></div>
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-amber-400 uppercase flex items-center">
                        <Feather size={16} className="mr-2" /> Force Naturelle
                    </h4>
                    <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mr-2">Points de Récupération</span>
                        <div className="flex space-x-1">
                            {Array.from({length: MAX_POINTS}).map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < usedPoints ? 'bg-amber-600' : 'bg-slate-800 border border-slate-700'}`}></div>
                            ))}
                        </div>
                        <span className="ml-2 text-xs font-mono font-bold text-amber-500">{usedPoints} / {MAX_POINTS}</span>
                    </div>
                </div>

                {itemsWithPenalty.length > 0 ? (
                    <div className="space-y-2">
                        {itemsWithPenalty.map(i => {
                            const isAllocated = allocatedSlots.has(i.slotId);
                            const canAfford = remainingPoints >= i.cost || isAllocated;

                            return (
                                <button 
                                    key={i.slotId}
                                    onClick={() => {
                                        if (isAllocated || canAfford) onToggleAllocation(i.slotId);
                                    }}
                                    disabled={!isAllocated && !canAfford}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
                                        isAllocated 
                                        ? 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                                        : canAfford 
                                            ? 'bg-slate-950 border-slate-800 hover:border-amber-500/30' 
                                            : 'bg-slate-950/50 border-slate-800 opacity-50 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex items-center text-left">
                                        <div className={`p-2 rounded-lg mr-3 transition-colors ${isAllocated ? 'bg-amber-500 text-black' : 'bg-slate-900 text-slate-500'}`}>
                                            <Weight size={18} />
                                        </div>
                                        <div>
                                            <div className={`text-xs font-bold ${isAllocated ? 'text-amber-200' : 'text-slate-300'}`}>
                                                {i.item?.name}
                                            </div>
                                            <div className="flex items-center text-[10px] text-slate-500 mt-0.5">
                                                <span className="mr-2 text-red-400 font-mono">Penalité: {i.penalty} SPD</span>
                                                <span className="flex items-center text-slate-400 bg-slate-900 px-1.5 rounded">
                                                    <Hammer size={8} className="mr-1"/> Coût: {i.cost}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider">
                                        {isAllocated ? (
                                            <span className="text-amber-400 flex items-center"><Check size={14} className="mr-1"/> Allégé</span>
                                        ) : (
                                            <span className="text-slate-600 group-hover:text-slate-400">Rembourser</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center p-6 border border-dashed border-slate-800 rounded-lg">
                        <p className="text-xs text-slate-500 italic">Aucun équipement lourd (Plastron ou Arme) ne vous ralentit actuellement.</p>
                    </div>
                )}
             </div>
        </div>
    );
};

export const ArlequinDealer: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void }> = ({ toggles, onToggle }) => {
    const cards = [
        { id: 'card_spade', label: 'Pique', icon: '♠', color: 'text-slate-300', bg: 'bg-slate-800', hover: 'hover:bg-slate-700', active: 'bg-slate-200 text-black border-slate-400' },
        { id: 'card_club', label: 'Trèfle', icon: '♣', color: 'text-emerald-400', bg: 'bg-slate-900', hover: 'hover:bg-emerald-900/30', active: 'bg-emerald-500 text-black border-emerald-400' },
        { id: 'card_diamond', label: 'Carreau', icon: '♦', color: 'text-amber-400', bg: 'bg-slate-900', hover: 'hover:bg-amber-900/30', active: 'bg-amber-500 text-black border-amber-400' },
        { id: 'card_heart', label: 'Cœur', icon: '♥', color: 'text-rose-500', bg: 'bg-slate-900', hover: 'hover:bg-rose-900/30', active: 'bg-rose-500 text-white border-rose-400' },
        { id: 'card_royal', label: 'Royal', icon: '★', color: 'text-yellow-400', bg: 'bg-indigo-950', hover: 'hover:bg-yellow-900/30', active: 'bg-gradient-to-tr from-yellow-600 to-yellow-400 text-black border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
    ];
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10"><h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center"><Dna size={14} className="mr-2" /> Tirage du Destin</h4><span className="text-[10px] text-slate-500 font-mono">ARLEQUIN_SYS_V1</span></div>
            <div className="flex justify-between items-center gap-2 relative z-10">
                {cards.map(card => {
                    const isActive = toggles[card.id];
                    return (<button key={card.id} onClick={() => onToggle(card.id, 'arlequin_card')} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg border-2 transition-all duration-300 transform ${isActive ? `${card.active} scale-105 shadow-lg` : `border-slate-800 ${card.bg} ${card.color} ${card.hover} opacity-60 hover:opacity-100 hover:scale-105`}`}><span className={`text-2xl leading-none mb-1 ${isActive && card.id === 'card_royal' ? 'animate-spin-slow' : ''}`}>{card.icon}</span><span className="text-[9px] font-bold uppercase">{card.label}</span></button>)
                })}
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-500 relative z-10">Sélectionnez une carte pour activer les effets de vos Decks et passifs.</div>
        </div>
    );
};

export const PugilistStances: React.FC<{ toggles: Record<string, boolean>; onToggle: (id: string, group: string) => void }> = ({ toggles, onToggle }) => {
    const stances = [
        { id: 'pos_mante', label: 'Mante', val: 'Vit x2 | Spd -10%', icon: Bug, color: 'text-emerald-400', activeBg: 'bg-emerald-900/50', border: 'border-emerald-500' },
        { id: 'pos_serpent', label: 'Serpent', val: 'Spd x2 | Dmg -10%', icon: Activity, color: 'text-amber-400', activeBg: 'bg-amber-900/50', border: 'border-amber-500' },
        { id: 'pos_lievre', label: 'Lièvre', val: 'Dmg x2 | Vit -10%', icon: Rabbit, color: 'text-rose-400', activeBg: 'bg-rose-900/50', border: 'border-rose-500' },
        { id: 'pos_singe', label: 'Singe', val: 'Tout -10%', icon: PawPrint, color: 'text-slate-400', activeBg: 'bg-slate-800', border: 'border-slate-500' },
    ];

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center"><Zap size={14} className="mr-2" /> Arts Martiaux</h4>
                <span className="text-[10px] text-slate-600 font-mono">POSTURES ANIMALES</span>
            </div>
            <div className="grid grid-cols-2 gap-3 relative z-10">
                {stances.map((stance) => {
                    const isActive = toggles[stance.id];
                    const Icon = stance.icon;
                    return (
                        <button 
                            key={stance.id} 
                            onClick={() => onToggle(stance.id, 'pugilist_stance')} 
                            className={`flex items-center p-2 rounded-lg border-2 transition-all duration-200 group ${isActive ? `${stance.activeBg} ${stance.border} shadow-lg` : `bg-slate-900/50 border-slate-800 hover:border-slate-600`}`}
                        >
                            <div className={`p-2 rounded-full mr-3 transition-transform ${isActive ? 'bg-black/20 scale-110' : 'bg-slate-800'}`}>
                                <Icon size={18} className={isActive ? stance.color : 'text-slate-500'} />
                            </div>
                            <div className="text-left">
                                <span className={`block text-xs font-bold uppercase ${isActive ? 'text-white' : 'text-slate-400'}`}>{stance.label}</span>
                                <span className={`block text-[9px] font-mono ${isActive ? stance.color : 'text-slate-600'}`}>{stance.val}</span>
                            </div>
                            {isActive && <div className={`ml-auto w-2 h-2 rounded-full ${stance.color.replace('text-', 'bg-')}`}></div>}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 text-center text-[10px] text-slate-500 italic relative z-10">
                Activez une ou plusieurs postures pour modifier votre style de combat. Les bonus s'additionnent.
            </div>
        </div>
    );
};

export const ZenitudePanel: React.FC<{ active: boolean; onToggle: () => void }> = ({ active, onToggle }) => {
    return (
        <div className={`mt-4 rounded-xl border p-5 relative overflow-hidden transition-all duration-500 ${active ? 'bg-cyan-900/20 border-cyan-500/50 shadow-lg' : 'bg-slate-900 border-slate-800'}`}>
            {/* Ambient Background */}
            <div className={`absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none transition-opacity duration-500 ${active ? 'opacity-20' : 'opacity-5'}`}></div>
            
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 transition-all duration-500 ${active ? 'bg-cyan-500/20 text-cyan-400 rotate-180' : 'bg-slate-800 text-slate-600'}`}>
                        <PauseCircle size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className={`text-sm font-bold uppercase tracking-widest ${active ? 'text-cyan-300' : 'text-slate-500'}`}>
                            {active ? 'Méditation Active' : 'Combat Standard'}
                        </h4>
                        <p className={`text-[10px] font-mono mt-1 ${active ? 'text-cyan-200/70' : 'text-slate-600'}`}>
                            {active ? 'ATTENTION: Aucune attaque possible.' : 'Attaques autorisées.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <button 
                        onClick={onToggle}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all duration-300 flex items-center shadow-md ${
                            active 
                            ? 'bg-cyan-600 text-white border-cyan-400 hover:bg-cyan-500' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                        }`}
                    >
                        {active ? (
                            <>
                                <span className="mr-2">Zénitude</span>
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            </>
                        ) : (
                            <span>Activer</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Visual Effect Bar */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-700/50 flex justify-between items-center">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Réduction de Dégâts</span>
                <div className={`flex items-center font-mono font-bold text-lg transition-colors duration-300 ${active ? 'text-cyan-400' : 'text-slate-700'}`}>
                    <Shield size={16} className="mr-2 opacity-80" />
                    <span>{active ? '-45%' : '0%'}</span>
                </div>
            </div>
        </div>
    );
};

export const LutteurPanel: React.FC<{ active: boolean; onToggle: () => void; hasWeapons: boolean }> = ({ active, onToggle, hasWeapons }) => {
    return (
        <div className={`mt-4 rounded-xl border p-5 relative overflow-hidden transition-all duration-500 ${active ? 'bg-orange-900/20 border-orange-500/50 shadow-lg' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none transition-opacity duration-500 ${active ? 'opacity-20' : 'opacity-5'}`}></div>
            
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 transition-all duration-500 ${active ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-600'}`}>
                        <Hand size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className={`text-sm font-bold uppercase tracking-widest ${active ? 'text-orange-300' : 'text-slate-500'}`}>
                            {active ? 'Posture Mains Nues' : 'Combat Standard'}
                        </h4>
                        <p className={`text-[10px] font-mono mt-1 ${hasWeapons ? 'text-red-400' : (active ? 'text-orange-200/70' : 'text-slate-600')}`}>
                            {hasWeapons ? '⚠️ Arme équipée : Bonus inactif' : 'Bonus actif sans arme.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <button 
                        onClick={onToggle}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all duration-300 flex items-center shadow-md ${
                            active 
                            ? 'bg-orange-600 text-white border-orange-400 hover:bg-orange-500' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                        }`}
                    >
                        {active ? (
                            <>
                                <span className="mr-2">Lutteur</span>
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            </>
                        ) : (
                            <span>Activer</span>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-700/50 flex justify-between items-center">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Bonus Postures</span>
                <div className={`flex items-center font-mono font-bold text-lg transition-colors duration-300 ${active && !hasWeapons ? 'text-orange-400' : 'text-slate-700'}`}>
                    <Zap size={16} className="mr-2 opacity-80" />
                    <span>{active && !hasWeapons ? '+20%' : '0%'}</span>
                </div>
            </div>
        </div>
    );
};

export const SansPeurPanel: React.FC<{
    stacks: number;
    protecting: boolean;
    onStackChange: (val: number) => void;
    onToggleProtect: () => void;
    context?: any;
}> = ({ stacks, protecting, onStackChange, onToggleProtect, context }) => {
    const MAX_STACKS = 20;
    
    // UPDATED: Use getScaledValue for consistent boosted display
    const totalVal = getScaledValue(stacks * 10, context);

    // Calculate description values
    const basePerStack = 10;
    const booster = context?.effect_booster || 0;
    const bonusPerStack = parseFloat((basePerStack * (booster/100)).toFixed(2));

    return (
        <div className="bg-slate-900 border border-indigo-900/40 p-5 rounded-xl border-l-4 border-l-indigo-600 relative overflow-hidden mt-4 group">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Shield size={100} />
            </div>
            
            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase flex items-center">
                        <Sword size={16} className="mr-2" /> Sans Peur
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Bonus Dégâts</span>
                        <div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${stacks > 0 ? 'bg-indigo-900/50 border-indigo-500 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                            +{totalVal}%
                        </div>
                    </div>
                </div>

                {/* Stacks Slider */}
                <div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Attaques Subies (Cumul)</span>
                        <span className="text-indigo-400">{stacks} / {MAX_STACKS}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max={MAX_STACKS} 
                        step="1" 
                        value={stacks} 
                        onChange={(e) => onStackChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[9px] text-slate-500 mt-2 italic">
                        +{basePerStack}% {bonusPerStack > 0 && <span className="text-emerald-400 font-bold">+{bonusPerStack}%</span>} Dégâts par attaque reçue.
                    </p>
                </div>

                {/* Protect Toggle */}
                <button 
                    onClick={onToggleProtect}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-300 group ${
                        protecting 
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                    }`}
                >
                    <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 transition-colors ${protecting ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                            <UserCheck size={20} />
                        </div>
                        <div className="text-left">
                            <div className={`text-xs font-bold uppercase ${protecting ? 'text-indigo-300' : 'text-slate-400'}`}>
                                Protection d'Allié
                            </div>
                            <div className="text-[9px] text-slate-500 mt-0.5">
                                Encaisser les dégâts à la place d'un allié ce tour.
                            </div>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${protecting ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-600'}`}>
                        {protecting ? 'ACTIVE' : 'OFF'}
                    </div>
                </button>
            </div>
        </div>
    );
};

export const RagePanel: React.FC<{ 
    stacks: number;
    onStackChange: (val: number) => void;
    context?: any;
}> = ({ stacks, onStackChange, context }) => {
    const MAX_STACKS = 20; // Limite visuelle (peut aller au delà théoriquement)
    
    // Use getScaledValue for consistency
    const totalVal = getScaledValue(stacks * 10, context);

    // Calculate description values
    const basePerStack = 10;
    const booster = context?.effect_booster || 0;
    const bonusPerStack = parseFloat((basePerStack * (booster/100)).toFixed(2));

    return (
        <div className="bg-slate-900 border border-red-900/40 p-5 rounded-xl border-l-4 border-l-red-600 relative overflow-hidden mt-4 group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Flame size={100} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-red-400 uppercase flex items-center">
                        <Zap size={16} className="mr-2" /> Rage Décuplée
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Bonus Actif</span>
                        <div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${stacks > 0 ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                            +{totalVal}%
                        </div>
                    </div>
                </div>

                <div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Coups Reçus (Cumul)</span>
                        <span className="text-red-400">{stacks}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max={MAX_STACKS} 
                        step="1" 
                        value={stacks} 
                        onChange={(e) => onStackChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <p className="text-[9px] text-slate-500 mt-2 italic">
                        +{basePerStack}% {bonusPerStack > 0 && <span className="text-emerald-400 font-bold">+{bonusPerStack}%</span>} Dégâts par attaque reçue.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const ColereVivePanel: React.FC<{ 
    stacks: number;
    onStackChange: (val: number) => void;
    context?: any;
}> = ({ stacks, onStackChange, context }) => {
    const MAX_STACKS = 20; 
    
    // Note: C'est 10% Vit et 10% Spd par stack
    const valPerStack = 10;
    const totalVal = getScaledValue(stacks * valPerStack, context);

    // Calculate description values
    const booster = context?.effect_booster || 0;
    const bonusPerStack = parseFloat((valPerStack * (booster/100)).toFixed(2));

    return (
        <div className="bg-slate-900 border border-orange-900/40 p-5 rounded-xl border-l-4 border-l-orange-600 relative overflow-hidden mt-4 group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <AlertTriangle size={100} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-orange-400 uppercase flex items-center">
                        <AlertTriangle size={16} className="mr-2" /> Colère Vive
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Bonus Actif</span>
                        <div className={`px-2 py-1 rounded border font-mono font-bold text-xs ${stacks > 0 ? 'bg-orange-900/50 border-orange-500 text-orange-200' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                            +{totalVal}% Vit/Spd
                        </div>
                    </div>
                </div>

                <div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Échecs Critiques (Cumul)</span>
                        <span className="text-orange-400">{stacks} / {MAX_STACKS}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max={MAX_STACKS} 
                        step="1" 
                        value={stacks} 
                        onChange={(e) => onStackChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <p className="text-[9px] text-slate-500 mt-2 italic">
                        +{valPerStack}% {bonusPerStack > 0 && <span className="text-emerald-400 font-bold">+{bonusPerStack}%</span>} Vitalité & Vitesse par Échec Critique.
                    </p>
                </div>
            </div>
        </div>
    );
};
