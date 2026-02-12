
import React, { useState } from 'react';
import { Dog, Zap, User, Plus, Check, X, PawPrint, Shield, Sword, Activity, Heart, AlertCircle, ChevronDown, ChevronUp, Info, FileText, Target, Star, Award, Crown } from 'lucide-react';
import { Entity, PlayerSelection, CalculationResult, StatResult, EntityType, StatDetail } from '../../../types';
import { SlotSelector } from '../../builder/SlotSelector';
import { toFantasyTitle, getTagColor, getTagLabel } from '../../builder/utils'; // ADDED IMPORTS
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { parseRichText, CollapsibleDescription } from '../../ui/RichText'; // ADDED IMPORTS
import { CollapsibleCard } from '../../ui/Card';
// Import Class Mechanics Widgets
import { ArlequinDealer, PugilistStances, BloodMagicSelector, ThanatoOrganSelector } from '../../builder/ClassMechanics';
import { usePlayerStore } from '../../../store/usePlayerStore';

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

// Helpers copiés/adaptés de CharacterSheet pour l'affichage des détails
const renderVal = (val: number, isPercent = false, forcePlus = false) => {
    if (Math.abs(val) < 0.01) return isPercent ? '0%' : '0';
    const formatted = parseFloat(val.toFixed(2));
    const sign = (forcePlus && formatted > 0) ? '+' : '';
    return `${sign}${formatted}${isPercent ? '%' : ''}`;
};

const renderDetailList = (list: StatDetail[] | undefined, color: string) => {
    if (!list || list.length === 0) return null;
    return (
        <div className={`pl-2 border-l-2 ${color.replace('text-', 'border-')} mt-1 mb-2 space-y-0.5`}>
            {list.map((item, i) => (
                <div key={i} className="flex justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[140px]" title={item.source}>{item.source}</span>
                    <span className="font-mono text-slate-300">{item.value > 0 ? '+' : ''}{parseFloat(item.value.toFixed(2))}</span>
                </div>
            ))}
        </div>
    );
};

export const CompanionSection: React.FC<CompanionSectionProps> = ({
    selection, setSelection, allItems, context, result, companionResult, companionDescriptions,
    openItemPicker, equipFixedItem, setIsCompanionForgeOpen
}) => {
    const { updateCompanionItemConfig } = usePlayerStore();
    
    const [showDetails, setShowDetails] = useState(false);
    const [activeStatDetail, setActiveStatDetail] = useState<{key: string, label: string, mainColor: string} | null>(null);

    // Logic for Institut de Magie - Professor of Fauna & Flora
    const isProfFauna = selection.careerId === 'career_institut' && 
                        selection.sliderValues?.['career_institut_rank'] === 1 && 
                        selection.sliderValues?.['career_institut_specialty'] === 2;

    const showSecondFamiliarSlot = isProfFauna && selection.choiceSlotType === 'familiar';

    // Companion Stats Calculation
    const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
    const companionRatio = Number(companionScale) / 100;
    
    // Helper to extract clean stats
    const getStatData = (res: CalculationResult | null, key: string) => {
        if (!res || !res.stats[key]) return { val: 0, ptFlat: 0, ptPct: 0 };
        const s = res.stats[key];
        return {
            val: Math.ceil(s.finalValue * companionRatio),
            ptFlat: Math.floor((s.perTurn || 0) * companionRatio), // Scale flat gain per turn
            ptPct: s.perTurnPercent || 0 // Keep percent as is (relative to its own stats)
        };
    };
    
    const stats = { 
        vit: getStatData(companionResult, 'vit'), 
        spd: getStatData(companionResult, 'spd'), 
        dmg: getStatData(companionResult, 'dmg'), 
        aura: getStatData(companionResult, 'aura'), 
        res: getStatData(companionResult, 'res') 
    };

    // Construct companion context for widgets
    // This allows Arlequin Dealer (etc.) to see the companion's "Special Mastery" if items give it.
    const companionContext = {
        level: selection.level,
        effect_booster: companionResult?.stats['effect_booster']?.finalValue || 0,
        special_mastery: companionResult?.stats['special_mastery']?.finalValue || 0,
        ...selection.companionToggles
    };

    // Configuration for the selector cards
    const CHOICE_TYPES = [
        { id: 'mount', label: 'Monture', icon: PawPrint, color: "text-amber-400" },
        { id: 'familiar', label: 'Familier', icon: Zap, color: "text-indigo-400" }, 
        { id: 'companion', label: 'Compagnon', icon: User, color: "text-rose-400" }
    ];

    // Helper for toggling companion specific effects
    const toggleCompanionEffect = (id: string, groupName?: string) => { 
        setSelection(prev => { 
            const newToggles = { ...prev.companionToggles }; 
            if (groupName) { 
                if (groupName === 'arlequin_card') { 
                    const wasActive = newToggles[id]; 
                    ['card_spade', 'card_club', 'card_diamond', 'card_heart', 'card_royal'].forEach(k => delete newToggles[k]); 
                    if (!wasActive) newToggles[id] = true; 
                } else if (groupName === 'curse_pact') { 
                    const wasActive = newToggles[id]; 
                    ['curse_lvl_1', 'curse_lvl_2', 'curse_lvl_3'].forEach(k => delete newToggles[k]); 
                    if (!wasActive) newToggles[id] = true; 
                } else if (groupName === 'thanato_organ') { 
                    const wasActive = newToggles[id]; 
                    ['organ_heart', 'organ_lung', 'organ_liver'].forEach(k => delete newToggles[k]); 
                    if (!wasActive) newToggles[id] = true; 
                } else if (groupName === 'pugilist_stance') {
                    newToggles[id] = !newToggles[id];
                } else if (groupName === 'tarolex_royal') {
                    const wasActive = newToggles[id];
                    ['toggle_tarolex_r_club', 'toggle_tarolex_r_heart', 'toggle_tarolex_r_spade', 'toggle_tarolex_r_diamond'].forEach(k => delete newToggles[k]);
                    if (!wasActive) newToggles[id] = true;
                } else if (groupName === 'career_artist_deck') {
                    // NEW: Artist Career Deck for Companion
                    const wasActive = newToggles[id];
                    ['career_card_heart', 'career_card_club', 'career_card_spade', 'career_card_diamond', 'career_card_royal'].forEach(k => delete newToggles[k]);
                    if (!wasActive) newToggles[id] = true;
                } else { 
                    newToggles[id] = !newToggles[id]; 
                } 
            } else { 
                newToggles[id] = !newToggles[id]; 
            } 
            return { ...prev, companionToggles: newToggles }; 
        }); 
    };

    // Secret Card & Tarolex Logic for Companion
    const secretCardProviderId = React.useMemo(() => {
        return selection.weaponSlots.find(id => {
            const item = allItems.find(i => i.id === id);
            return item && (item.id === 'carte_secrete' || item.description?.includes('Carte secrète') || item.name.includes('Carte secrète'));
        });
    }, [selection.weaponSlots, allItems]);

    // Check Tarolex presence in Companion's active items
    const hasTarolex = React.useMemo(() => {
        if (!companionResult) return false;
        return companionResult.finalEntities.some(e => 
            e.id === 'tarolex_dore' || 
            e.name === 'Tarolex Doré' ||
            (e.modifiers && e.modifiers.some(m => m.toggleGroup === 'tarolex_royal'))
        );
    }, [companionResult]);
    
    // Modification: Le compagnon peut choisir n'importe quel deck, même si le joueur l'a déjà choisi.
    // Updated to support Sub-Ingredients via description parsing
    const getCompanionSecretOptions = (providerId: string) => {
        return selection.weaponSlots.flatMap((id, idx) => {
            const item = allItems.find(i => i.id === id);
            if (!item) return [];

            const isSelf = item.id === providerId;
            
            const isDeck = item.subCategory === 'Decks' || item.id.startsWith('fused_') || item.categoryId === 'weapon';
            if (!isDeck) return [];
            
            // IF FUSION: Extract ingredients
            if (item.description && item.description.startsWith('Fusion:')) {
                const ingredientsStr = item.description.substring(8); 
                const ingredients = ingredientsStr.split(' + ').map(s => s.trim());
                
                const options = [];
                // REGLE : Si fusion, on ne peut PAS cibler le global.
                
                ingredients.forEach(ing => {
                    options.push({ value: `${idx}|${ing}`, label: `Arme ${idx + 1}: [${ing}]` });
                });
                return options;
            }

            if (isSelf) return []; // Can't boost self if not fusion
            return [{ value: `${idx}|`, label: `Arme ${idx + 1}: ${item.name}` }];
        });
    };

    const handleCompSecretTargetChange = (wId: string, val: string) => {
        const [idxStr, subName] = val.split('|');
        const idx = parseInt(idxStr);
        updateCompanionItemConfig(wId, 'targetSlotIndex', idx);
        updateCompanionItemConfig(wId, 'targetSubName' as any, subName as any);
    };

    // Calculate current selection value
    const secretConfig = selection.companionItemConfigs?.[secretCardProviderId || ''];
    const secretCurrentValue = `${secretConfig?.targetSlotIndex ?? -1}|${secretConfig?.targetSubName || ''}`;

    // --- ARTIST CAREER CONSTANTS ---
    const artistCards = [
        { id: 'career_card_spade', label: 'Pique', icon: '♠', color: 'text-slate-300', bg: 'bg-slate-800', bonus: `Dmg` },
        { id: 'career_card_club', label: 'Trèfle', icon: '♣', color: 'text-emerald-400', bg: 'bg-slate-900', bonus: `Spd` },
        { id: 'career_card_heart', label: 'Cœur', icon: '♥', color: 'text-rose-500', bg: 'bg-slate-900', bonus: `Vit` },
        { id: 'career_card_diamond', label: 'Carreau', icon: '♦', color: 'text-amber-400', bg: 'bg-slate-900', bonus: `Tout` },
        { id: 'career_card_royal', label: 'Royal', icon: '★', color: 'text-yellow-400', bg: 'bg-indigo-950', bonus: `Tout` },
    ];

    const renderStatBox = (label: string, data: { val: number, ptFlat: number, ptPct: number }, statKey: string, icon: any, mainColor: string, bgColor: string) => {
        const hasPerTurn = data.ptFlat !== 0 || data.ptPct !== 0;
        
        return (
            <div className={`flex flex-col items-center p-3 rounded-lg border relative group ${bgColor} ${mainColor.replace('text-', 'border-').replace('400', '500/20')}`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); setActiveStatDetail({ key: statKey, label, mainColor }); }}
                    className="absolute top-1 right-1 p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    title="Voir le détail du calcul"
                >
                    <Info size={14} className={mainColor} />
                </button>
                
                {React.createElement(icon, { size: 16, className: `mb-1 ${mainColor}` })}
                <span className={`text-[10px] uppercase font-bold opacity-70 ${mainColor}`}>{label}</span>
                <span className="text-xl font-bold text-white tracking-tight"><AnimatedCounter value={data.val} /></span>
                
                {hasPerTurn && (
                    <div className="text-[9px] font-bold mt-1 bg-black/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className={data.ptFlat < 0 ? 'text-red-400' : 'text-emerald-400'}>
                            {data.ptFlat !== 0 ? (data.ptFlat > 0 ? `+${data.ptFlat}` : `${data.ptFlat}`) : ''}
                        </span>
                        {(data.ptFlat !== 0 && data.ptPct !== 0) && <span className="text-slate-500">&</span>}
                        <span className={data.ptPct < 0 ? 'text-red-400' : 'text-emerald-400'}>
                            {data.ptPct !== 0 ? (data.ptPct > 0 ? `+${data.ptPct}%` : `${data.ptPct}%`) : ''}
                        </span>
                        <span className="text-slate-500">/tr</span>
                    </div>
                )}
            </div>
        );
    };

    const renderDetailModal = () => {
        if (!activeStatDetail || !companionResult) return null;
        
        const statRes = companionResult.stats[activeStatDetail.key] as StatResult | undefined;
        const bd = statRes?.breakdown;
        const traces = statRes?.trace || [];
        
        const rawValue = statRes?.finalValue || 0;
        const finalValue = Math.ceil(rawValue * companionRatio);

        const standardCalc = bd ? (bd.base + bd.flat) * (1 + (bd.percentAdd / 100)) : 0;
        const hasComplexMods = Math.abs(rawValue - standardCalc) > 1;

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setActiveStatDetail(null)}>
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                        <h3 className={`text-lg font-bold flex items-center ${activeStatDetail.mainColor}`}>
                            <FileText size={20} className="mr-2"/> Détail : {activeStatDetail.label}
                        </h3>
                        <button onClick={() => setActiveStatDetail(null)} className="text-slate-500 hover:text-white bg-slate-800 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        
                        {/* Breakdown Grid */}
                        {bd && (
                            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 grid grid-cols-2 gap-y-3 gap-x-8 text-xs">
                                <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 border-b border-slate-800 pb-1">Calculs Intermédiaires</div>
                                
                                <div className="flex justify-between items-start">
                                    <span className="text-slate-400 font-bold">Base (Héritée)</span>
                                    <div className="text-right">
                                        <div className="text-slate-200 font-mono">{renderVal(bd.base)}</div>
                                        {renderDetailList(statRes?.detailedBase, 'text-slate-500')}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-blue-400 font-bold">Bonus Fixe</span>
                                    <div className="text-right">
                                        <div className="text-blue-200 font-mono">{renderVal(bd.flat, false, true)}</div>
                                        {renderDetailList(statRes?.detailedFlat, 'text-blue-400')}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-green-400 font-bold">Pourcentage Additif</span>
                                    <span className="text-green-200 font-mono">{renderVal(bd.percentAdd, true, true)}</span>
                                </div>

                                {hasComplexMods && (
                                    <div className="col-span-2 flex justify-between items-center bg-indigo-900/20 px-2 py-1 rounded border border-indigo-500/20">
                                        <span className="text-indigo-300 font-bold">Modificateurs Spéciaux</span>
                                        <span className="text-indigo-200 font-mono">Appliqués (voir logs)</span>
                                    </div>
                                )}

                                <div className="col-span-2 h-px bg-slate-800 my-1"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 font-bold">Total Compagnon (Pleine Puissance)</span>
                                    <span className="text-white font-mono font-bold text-sm">{Math.floor(rawValue)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-purple-400 font-bold">Échelle Compagnon</span>
                                    <span className="text-purple-300 font-mono">x {companionScale}%</span>
                                </div>

                                <div className="col-span-2 h-px bg-slate-700 my-1"></div>

                                <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded -mx-2">
                                    <span className={`font-bold uppercase ${activeStatDetail.mainColor}`}>Valeur Finale</span>
                                    <span className={`font-mono font-bold text-xl ${activeStatDetail.mainColor}`}>{finalValue}</span>
                                </div>
                            </div>
                        )}

                        {/* Logs Console */}
                        <div className="flex flex-col h-full min-h-[200px]">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center">
                                <Activity size={12} className="mr-1.5"/> Journal de Trace (Moteur)
                            </label>
                            <div className="flex-1 bg-black/80 rounded-lg border border-slate-800 p-3 overflow-y-auto custom-scrollbar font-mono text-[10px] text-slate-400 space-y-1">
                                {traces.length > 0 ? traces.map((t, i) => (
                                    <div key={i} className="break-words border-b border-slate-800/30 pb-0.5 last:border-0">
                                        <span className="text-slate-600 mr-2">[{i+1}]</span>
                                        {t.includes('FINAL:') ? <span className="text-emerald-400 font-bold">{t}</span> : 
                                         t.includes('ÉCRASE') ? <span className="text-red-400 font-bold">{t}</span> :
                                         t.includes('ALT') ? <span className="text-yellow-400">{t}</span> :
                                         t}
                                    </div>
                                )) : (
                                    <span className="text-slate-600 italic">Aucun log disponible.</span>
                                )}
                                <div className="text-purple-400 font-bold mt-2 pt-2 border-t border-slate-800">
                                    [SCALE] Ratio {companionScale}% appliqué : {Math.floor(rawValue)} &rarr; {finalValue}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* MODAL PORTAL */}
            {renderDetailModal()}

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
                                className="flex items-center text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-md hover:shadow-indigo-500/20 font-bold uppercase tracking-wide border border-indigo-400/20"
                            >
                                <Plus size={12} className="mr-1.5" /> Créer
                            </button>
                        )}
                        {selection.choiceSlotType === 'companion' && (
                            <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] flex items-center shadow-inner" title={`Puissance transférée au compagnon : ${companionScale}%`}>
                                <span className="text-slate-500 mr-1.5 uppercase font-bold tracking-wider">Échelle</span>
                                <span className={`font-mono font-bold ${companionScale > 50 ? 'text-green-400' : companionScale < 50 ? 'text-red-400' : 'text-slate-200'}`}>
                                    {companionScale}%
                                </span>
                            </div>
                        )}
                    </div>
                }
            >
                <div>
                    {/* Minimalist Selection Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {CHOICE_TYPES.map(type => {
                            if (selection.classId === 'animistes' && type.id === 'companion') return null;
                            
                            const isActive = selection.choiceSlotType === type.id;
                            const Icon = type.icon;

                            return (
                                <button
                                    key={type.id}
                                    onClick={() => { 
                                        const newEquipped = { ...selection.equippedItems }; 
                                        delete newEquipped['custom_companion']; 
                                        setSelection({ ...selection, choiceSlotType: type.id, equippedItems: newEquipped }); 
                                    }}
                                    className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-300 group ${
                                        isActive 
                                        ? 'bg-slate-900 border-slate-700 shadow-lg scale-[1.02]' 
                                        : 'bg-slate-900 border-slate-800 hover:bg-slate-900 hover:border-slate-700 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <Icon 
                                        size={20} 
                                        strokeWidth={1.5}
                                        className={`mb-2 transition-colors duration-300 ${isActive ? type.color : 'text-slate-600 group-hover:text-slate-400'}`} 
                                    />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-slate-200' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Primary Companion Slot */}
                    {selection.choiceSlotType !== 'companion' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SlotSelector 
                                slot={{ id: 'custom_companion', name: isProfFauna ? 'Slot Principal' : 'Selection', acceptedCategories: [selection.choiceSlotType || 'mount'] }} 
                                allItems={allItems} 
                                selectedItemId={selection.equippedItems['custom_companion']} 
                                onOpenPicker={() => openItemPicker('custom_companion', [selection.choiceSlotType || 'mount'])} 
                                onClear={() => equipFixedItem('custom_companion', 'none')} 
                                playerContext={context} 
                            />
                        </div>
                    )}

                    {/* Secondary Familiar Slot */}
                    {showSecondFamiliarSlot && (
                        <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/30 p-3 rounded-lg animate-in fade-in slide-in-from-top-2 border border-dashed border-slate-800/50">
                            <div className="text-[10px] text-purple-400 mb-2 flex items-center font-bold uppercase tracking-wider">
                                <Zap size={10} className="mr-1.5"/> Bonus Professeur : 2nd Familier
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

                    {/* COMPANION MINI-SHEET (Only for Humanoid Companion mode) */}
                    {selection.choiceSlotType === 'companion' && (
                        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-300">
                            
                            {/* Rules Header */}
                            <div className="bg-slate-900/50 p-3 border-b border-slate-800 flex justify-between items-center">
                                <div className="flex gap-4 text-[10px]">
                                    <div className="text-emerald-400 flex items-center bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20" title="Le compagnon possède la même Race, Classe et porte les mêmes Armes/Armures que le joueur.">
                                        <Check size={12} className="mr-1.5"/> Hérite : Race, Classe, Objets, Sceaux
                                    </div>
                                    <div className="text-red-400/80 flex items-center bg-red-950/30 px-2 py-1 rounded border border-red-500/20" title="Le compagnon ne bénéficie pas de votre Spécialisation, ni de vos Métiers ou bonus de Guilde.">
                                        <X size={12} className="mr-1.5"/> Exclu : Spécialisation, Guilde
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid with Tooltips */}
                            <div className="p-4 grid grid-cols-3 gap-3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
                                {renderStatBox('Vitalité', stats.vit, 'vit', Heart, 'text-emerald-400', 'bg-emerald-900/10')}
                                {renderStatBox('Vitesse', stats.spd, 'spd', Zap, 'text-amber-400', 'bg-amber-900/10')}
                                {renderStatBox('Dégâts', stats.dmg, 'dmg', Sword, 'text-rose-400', 'bg-rose-900/10')}
                            </div>

                            {/* Secondary Stats Row */}
                            <div className="flex divide-x divide-slate-800 border-t border-slate-800 bg-slate-900/50">
                                <div className="flex-1 py-2 text-center group relative">
                                    <div className="text-[9px] text-cyan-400 font-bold uppercase mb-0.5">Aura</div>
                                    <div className="text-sm font-mono text-slate-300">{stats.aura.val}</div>
                                </div>
                                <div className="flex-1 py-2 text-center group relative">
                                    <div className="text-[9px] text-blue-400 font-bold uppercase mb-0.5">Résistance</div>
                                    <div className="text-sm font-mono text-slate-300">{stats.res.val}</div>
                                </div>
                            </div>

                            {/* COMPANION CLASS MECHANICS (Independent Controls) */}
                            <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-800">
                                {/* ARTIST CAREER FOR COMPANION */}
                                {selection.careerId === 'career_artiste' && (
                                    <div className="mt-3 p-3 bg-indigo-900/10 border border-indigo-500/30 rounded-lg animate-in fade-in slide-in-from-top-2 mb-3">
                                        <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-2 flex items-center justify-between">
                                            <span className="flex items-center"><Star size={12} className="mr-1.5"/> Inspiration (Artiste)</span>
                                            <span className="text-slate-500 font-mono">Hérite Rang</span>
                                        </label>
                                        <div className="flex justify-between items-center gap-1">
                                            {artistCards.map(card => {
                                                const isActive = selection.companionToggles?.[card.id];
                                                return (
                                                    <button key={card.id} onClick={() => toggleCompanionEffect(card.id, 'career_artist_deck')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded border transition-all duration-200 transform ${isActive ? `${card.bg} border-current ${card.color} shadow-[0_0_5px_currentColor] scale-105` : `border-slate-700 bg-slate-900/50 ${card.color} opacity-60 hover:opacity-100 hover:border-slate-500`}`}>
                                                        <span className={`text-lg leading-none mb-0.5`}>{card.icon}</span>
                                                        <span className="text-[7px] font-bold uppercase tracking-wider">{card.bonus}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {selection.classId === 'arlequins' && (
                                    <>
                                        <ArlequinDealer toggles={selection.companionToggles || {}} onToggle={toggleCompanionEffect} context={companionContext} />
                                        
                                        {/* TAROLEX ROYAL CHOICE (Companion) */}
                                        {hasTarolex && selection.companionToggles?.['card_royal'] && (
                                            <div className="mt-3 p-3 bg-yellow-900/10 border border-yellow-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-[10px] uppercase font-bold text-yellow-400 mb-2 flex items-center">
                                                    <Info size={12} className="mr-1.5"/> Choix Royal (Tarolex)
                                                </label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        { id: 'toggle_tarolex_r_club', label: '♣', color: 'text-emerald-400' },
                                                        { id: 'toggle_tarolex_r_heart', label: '♥', color: 'text-rose-500' },
                                                        { id: 'toggle_tarolex_r_spade', label: '♠', color: 'text-slate-300' },
                                                        { id: 'toggle_tarolex_r_diamond', label: '♦', color: 'text-amber-400' }
                                                    ].map(opt => {
                                                        const isActive = selection.companionToggles?.[opt.id];
                                                        return (
                                                            <button 
                                                                key={opt.id}
                                                                onClick={() => toggleCompanionEffect(opt.id, 'tarolex_royal')}
                                                                className={`p-2 rounded border transition-all ${isActive ? 'bg-slate-800 border-white text-white' : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-500'}`}
                                                            >
                                                                <span className={`text-lg leading-none ${isActive ? '' : opt.color}`}>{opt.label}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* COMPANION SECRET CARD SELECTOR */}
                                        {secretCardProviderId && (
                                            <div className="mt-3 p-3 bg-indigo-900/10 border border-indigo-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-2 flex items-center">
                                                    <Target size={12} className="mr-1.5"/> Cible Carte Secrète (Compagnon)
                                                </label>
                                                <select 
                                                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded p-2 outline-none focus:border-indigo-500"
                                                    value={secretCurrentValue}
                                                    onChange={(e) => handleCompSecretTargetChange(secretCardProviderId, e.target.value)}
                                                >
                                                    <option value="-1|">-- Choisir une Cible --</option>
                                                    {getCompanionSecretOptions(secretCardProviderId).map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                <p className="text-[9px] text-slate-500 mt-1 italic">
                                                    Le compagnon possède sa propre carte secrète et peut booster une arme différente de la vôtre.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                                {selection.classId === 'pugilistes' && (
                                    <PugilistStances toggles={selection.companionToggles || {}} onToggle={toggleCompanionEffect} />
                                )}
                                {selection.classId === 'corrompu' && (
                                    <>
                                        <BloodMagicSelector toggles={selection.companionToggles || {}} onToggle={toggleCompanionEffect} context={companionContext} />
                                        <ThanatoOrganSelector toggles={selection.companionToggles || {}} onToggle={toggleCompanionEffect} context={companionContext} />
                                    </>
                                )}
                            </div>

                            {/* Effects Details Toggle */}
                            {companionDescriptions && companionDescriptions.length > 0 && (
                                <div className="border-t border-slate-800">
                                    <button 
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="w-full flex items-center justify-between p-3 text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
                                    >
                                        <span className="flex items-center">
                                            <AlertCircle size={12} className="mr-2" /> Effets Actifs & Passifs ({companionDescriptions.length})
                                        </span>
                                        {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                    
                                    {showDetails && (
                                        <div className="px-3 pb-3 space-y-2 max-h-40 overflow-y-auto custom-scrollbar bg-slate-900/50 animate-in fade-in slide-in-from-top-1">
                                            {companionDescriptions.map(desc => (
                                                <div key={desc.id} className="relative pl-3 border-l-2 border-slate-700 py-1">
                                                    <span className="font-bold text-indigo-300 block mb-0.5 text-[10px]">{desc.name}</span> 
                                                    {desc.textBlocks && desc.textBlocks.length > 0 ? (
                                                        desc.textBlocks.map((block: any, i: number) => (
                                                            <CollapsibleDescription key={i} block={block} />
                                                        ))
                                                    ) : (
                                                        <span className="italic opacity-80 text-[10px] text-slate-400">{parseRichText(desc.description)}</span>
                                                    )}
                                                    {desc.specialEffects && desc.specialEffects.length > 0 && (
                                                        <div className="space-y-1 mt-1.5">
                                                            {desc.specialEffects.map((eff: any, i: number) => (
                                                                <div key={i} className="text-[10px] font-mono">
                                                                    <span className={`${getTagColor(eff.tag || '')} font-bold`}>
                                                                        {getTagLabel(eff.tag || '')}
                                                                    </span>
                                                                    <span className="text-slate-500"> : </span>
                                                                    <span className="text-slate-300">{Number(eff.val) > 0 ? '+' : ''}{eff.val} {eff.stat}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CollapsibleCard>
        </>
    );
};
