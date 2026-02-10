
import React from 'react';
import { Dog, Car, Zap, User, Plus, Check, X, PawPrint } from 'lucide-react';
import { Entity, PlayerSelection, CalculationResult, StatResult } from '../../../types';
import { SlotSelector } from '../../builder/SlotSelector';
import { toFantasyTitle } from '../../builder/utils';
import { CollapsibleCard } from '../../ui/Card';

interface CompanionSectionProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    allItems: Entity[];
    context: any;
    result: CalculationResult;
    companionResult: CalculationResult | null;
    companionDescriptions: any[];
    openItemPicker: (slotId: string, acceptedCats?: string[]) => void;
    equipFixedItem: (slotId: string, itemId: string) => void;
    setIsCompanionForgeOpen: (isOpen: boolean) => void;
}

export const CompanionSection: React.FC<CompanionSectionProps> = ({
    selection, setSelection, allItems, context, result, companionResult, companionDescriptions,
    openItemPicker, equipFixedItem, setIsCompanionForgeOpen
}) => {
    
    // Logic for Institut de Magie - Professor of Fauna & Flora
    const isProfFauna = selection.careerId === 'career_institut' && 
                        selection.sliderValues?.['career_institut_rank'] === 1 && 
                        selection.sliderValues?.['career_institut_specialty'] === 2;

    const showSecondFamiliarSlot = isProfFauna && selection.choiceSlotType === 'familiar';

    // Companion Stats
    const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
    const companionRatio = Number(companionScale) / 100;
    
    const getPreFinal = (res: CalculationResult | null, key: string) => {
        if (!res || !res.stats[key]) return 0;
        const bd = res.stats[key].breakdown;
        return (bd.base + bd.flat) * (1 + (bd.percentAdd / 100));
    };
    
    const companionStats = { 
        vit: Math.ceil((getPreFinal(companionResult, 'vit')) * companionRatio), 
        spd: Math.ceil((getPreFinal(companionResult, 'spd')) * companionRatio), 
        dmg: Math.ceil((getPreFinal(companionResult, 'dmg')) * companionRatio), 
        aura: Math.ceil((getPreFinal(companionResult, 'aura')) * companionRatio), 
        res: Math.ceil((getPreFinal(companionResult, 'res')) * companionRatio) 
    };

    // UI Configuration for tabs
    const tabOptions = [
        { 
            id: 'mount', 
            label: 'Monture', 
            icon: Dog, // Using Dog/Paw metaphor as generic creature icon if Car is weird, or keep existing
            colorClass: 'text-amber-400',
            activeClass: 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
            inactiveClass: 'hover:text-amber-200' 
        },
        { 
            id: 'familiar', 
            label: 'Familier', 
            icon: Zap, 
            colorClass: 'text-cyan-400',
            activeClass: 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]',
            inactiveClass: 'hover:text-cyan-200'
        },
        { 
            id: 'companion', 
            label: 'Compagnon', 
            icon: User, 
            colorClass: 'text-indigo-400',
            activeClass: 'bg-indigo-950/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
            inactiveClass: 'hover:text-indigo-200'
        }
    ];

    return (
        <CollapsibleCard 
            id="companion_panel"
            title={toFantasyTitle("Compagnon de Route")} 
            icon={Dog}
            className="border-l-4 border-l-indigo-500"
            headerActions={
                <div className="flex items-center gap-2">
                    {selection.choiceSlotType !== 'companion' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsCompanionForgeOpen(true); }} 
                            className="flex items-center text-[9px] bg-indigo-700 hover:bg-indigo-600 text-white px-2 py-1 rounded transition-colors shadow-sm"
                        >
                            <Plus size={10} className="mr-1" /> Créer Perso
                        </button>
                    )}
                    {selection.choiceSlotType === 'companion' && (
                        <div className="bg-slate-950 px-2 py-1 rounded border border-slate-700 text-[10px] flex items-center">
                            <span className="text-slate-500 mr-1 uppercase font-bold">Échelle</span>
                            <span className={`font-mono font-bold ${companionScale > 50 ? 'text-green-400' : companionScale < 50 ? 'text-red-400' : 'text-slate-200'}`}>
                                {companionScale}%
                            </span>
                        </div>
                    )}
                </div>
            }
        >
            <div>
                {/* Visual Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50">
                    {tabOptions.map(opt => {
                        // Skip Companion for Animistes
                        if (selection.classId === 'animistes' && opt.id === 'companion') return null;
                        
                        const isActive = selection.choiceSlotType === opt.id;
                        const Icon = opt.icon;

                        return (
                            <button
                                key={opt.id}
                                onClick={() => { 
                                    const newEquipped = { ...selection.equippedItems }; 
                                    delete newEquipped['custom_companion']; 
                                    setSelection({ ...selection, choiceSlotType: opt.id, equippedItems: newEquipped }); 
                                }}
                                className={`
                                    relative flex flex-col items-center justify-center py-3 rounded-lg border transition-all duration-300 group overflow-hidden
                                    ${isActive 
                                        ? `${opt.activeClass} border scale-[1.02]` 
                                        : `bg-slate-900/30 border-transparent opacity-60 hover:opacity-100 hover:bg-slate-900 ${opt.inactiveClass}`
                                    }
                                `}
                            >
                                <div className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    <Icon size={20} className={isActive ? opt.colorClass : 'text-slate-500'} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                    {opt.label}
                                </span>
                                {isActive && (
                                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] rounded-full ${opt.colorClass.replace('text-', 'bg-')}`}></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Primary Companion Slot */}
                {selection.choiceSlotType !== 'companion' && (
                    <SlotSelector 
                        slot={{ id: 'custom_companion', name: isProfFauna ? 'Slot Principal' : 'Selection', acceptedCategories: [selection.choiceSlotType || 'mount'] }} 
                        allItems={allItems} 
                        selectedItemId={selection.equippedItems['custom_companion']} 
                        onOpenPicker={() => openItemPicker('custom_companion', [selection.choiceSlotType || 'mount'])} 
                        onClear={() => equipFixedItem('custom_companion', 'none')} 
                        playerContext={context} 
                    />
                )}

                {/* Secondary Familiar Slot */}
                {showSecondFamiliarSlot && (
                    <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/50 p-2 rounded animate-in fade-in slide-in-from-top-2">
                        <div className="text-[10px] text-purple-400 mb-2 flex items-center font-bold uppercase tracking-wider">
                            <Zap size={10} className="mr-1"/> Bonus Professeur : 2nd Familier
                        </div>
                        <SlotSelector 
                            slot={{ id: 'custom_familiar_2', name: 'Familier Secondaire', acceptedCategories: ['familiar'] }} 
                            allItems={allItems} 
                            selectedItemId={selection.equippedItems['custom_familiar_2']} 
                            onOpenPicker={() => openItemPicker('custom_familiar_2', ['familiar'])} 
                            onClear={() => equipFixedItem('custom_familiar_2', 'none')} 
                            playerContext={context} 
                        />
                    </div>
                )}

                {/* Companion Stat Block (Only for Humanoid Companion mode) */}
                {selection.choiceSlotType === 'companion' && (
                    <div className="mt-3 bg-slate-950/50 p-3 rounded border border-slate-800 relative overflow-hidden group">
                        <div className="flex justify-center gap-4 mb-3 text-[9px] border-b border-slate-800 pb-2"><div className="text-emerald-400 flex items-center" title="Inclus: Race, Classe, Armes, Armures, Sceaux, Artefacts"><Check size={10} className="mr-1"/> Inclus</div><div className="text-red-400/70 flex items-center" title="Exclus: Spécialisation, Enchantements, Faction (hors Armes/Armures)"><X size={10} className="mr-1"/> Exclus</div></div>
                        <div className="grid grid-cols-5 gap-2 text-center mb-3 border-b border-slate-800/50 pb-3">{[{ label: 'Vit', val: companionStats.vit, color: 'text-emerald-400' }, { label: 'Spd', val: companionStats.spd, color: 'text-amber-400' }, { label: 'Dmg', val: companionStats.dmg, color: 'text-rose-400' }, { label: 'Aura', val: companionStats.aura, color: 'text-cyan-300' }, { label: 'Res', val: companionStats.res, color: 'text-blue-300' }].map(s => (<div key={s.label} className="flex flex-col"><span className="text-[9px] text-slate-500 uppercase">{s.label}</span><span className={`text-xs font-mono font-bold ${s.color}`}>{s.val}</span></div>))}</div>
                        {companionDescriptions && companionDescriptions.length > 0 && (<div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Effets Copiés (Ajustés)</div>{companionDescriptions.map(desc => (<div key={desc.id} className="text-[10px] text-slate-300 leading-tight pl-2 border-l border-slate-700"><span className="font-bold text-slate-400">{desc.name}:</span> <span className="italic opacity-80">{desc.description}</span></div>))}</div>)}
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
};
