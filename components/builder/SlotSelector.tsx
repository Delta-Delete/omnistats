
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, RefreshCw, Hammer, Coins, Ban, AlertTriangle, Sword, Shield, Feather, Anvil, PawPrint, Zap, User, Music } from 'lucide-react';
import { ItemSlot, Entity, Modifier, EntityType, ModifierType } from '../../types';
import { getStatConfig, getRarityStyle } from './utils';
import { calculateEnhancedStats } from '../../services/preview';
import { checkCondition } from '../../services/engine';
import { ItemTooltip } from './ItemTooltip';

interface SlotSelectorProps {
    slot: ItemSlot;
    allItems: Entity[];
    selectedItemId?: string;
    onOpenPicker: () => void;
    onClear: () => void;
    effectiveCost?: number; 
    playerContext?: any;
    isAlleviated?: boolean;
    upgradeLevel?: number; 
    upgradeLevelVit?: number; 
    totalTungstenCount?: number;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ slot, allItems, selectedItemId, onOpenPicker, onClear, effectiveCost, playerContext, isAlleviated, upgradeLevel, upgradeLevelVit, totalTungstenCount = 0 }) => {
    const selectedItem = allItems.find((i) => i.id === selectedItemId);
    
    // --- HOVER STATE LOGIC ---
    const [tooltipStatus, setTooltipStatus] = useState<'idle' | 'loading' | 'visible'>('idle');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!selectedItem) return;
        setMousePos({ x: e.clientX, y: e.clientY });
        setTooltipStatus('loading');
        timerRef.current = setTimeout(() => { setTooltipStatus('visible'); }, 500);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (tooltipStatus !== 'idle') { setMousePos({ x: e.clientX, y: e.clientY }); }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setTooltipStatus('idle');
    };

    useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

    // Find the faction entity if the item is linked to one
    const faction = selectedItem?.factionId ? allItems.find(e => e.id === selectedItem.factionId && e.type === EntityType.FACTION) : null;

    if (!selectedItem) {
        return (
            <div 
                onClick={onOpenPicker}
                className="relative flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-900 hover:border-slate-500 transition-all cursor-pointer h-[72px] group overflow-hidden"
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-indigo-500 transition-opacity"></div>
                <div className="flex flex-col items-center text-slate-500 group-hover:text-indigo-300 transition-colors z-10">
                    <Plus size={20} className="mb-1 opacity-70 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{slot.name || 'Vide'}</span>
                </div>
            </div>
        )
    }

    const mods = selectedItem.modifiers || [];
    const displayCost = effectiveCost !== undefined ? effectiveCost : selectedItem.equipmentCost;
    const isCostModified = effectiveCost !== undefined && effectiveCost !== selectedItem.equipmentCost;
    
    const displayContext = playerContext || {};

    const itemFactionId = selectedItem.factionId;
    const playerFactionId = displayContext.factionId;
    const isFactionMismatch = itemFactionId && itemFactionId !== playerFactionId;

    const isReservedItem = selectedItem.description?.includes('{Réservé');
    const hasFailedConditions = isReservedItem && mods.some(m => m.condition && !checkCondition(m.condition, displayContext));
    const isTungstenError = selectedItem.isTungsten && totalTungstenCount > 1;
    const isRestricted = isFactionMismatch || hasFailedConditions || isTungstenError;
    
    let restrictionLabel = '';
    if (isFactionMismatch) restrictionLabel = 'Faction Requise';
    else if (hasFailedConditions) restrictionLabel = 'Condition non remplie';
    else if (isTungstenError) restrictionLabel = 'Unique (Tungstène)';

    const rarityStyle = getRarityStyle(selectedItem.rarity);
    const isFusion = selectedItem.id.startsWith('fused_wep_') || selectedItem.subCategory === 'Amalgame';

    // --- ZEPHYR BOOST CHECK ---
    const ZEPHYR_ID = 'pendentif_zephyrien';
    const specialItems = displayContext.specialItems || [];
    const bonusItems = displayContext.bonusItems || [];
    const equippedMap = displayContext.equippedItems || {};
    
    const hasZephyrPendant = specialItems.includes(ZEPHYR_ID) || 
                             bonusItems.includes(ZEPHYR_ID) || 
                             Object.values(equippedMap).includes(ZEPHYR_ID);

    const isMountOrFamiliar = selectedItem.categoryId === 'mount' || selectedItem.categoryId === 'familiar';
    const applyZephyrBoost = hasZephyrPendant && isMountOrFamiliar;

    // --- ICON LOGIC ---
    const renderDefaultIcon = () => {
        switch(selectedItem.categoryId) {
            case 'mount': return <PawPrint size={14} />;
            case 'familiar': return <Zap size={14} />;
            case 'companion': return <User size={14} />;
            case 'partition': return <Music size={14} />;
            case 'weapon': return <Sword size={14} />;
            default: return <Shield size={14} />;
        }
    };

    return (
        <>
            <div 
                className={`relative h-[72px] rounded-xl border transition-all group overflow-hidden flex cursor-help ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow}`}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* BACKGROUND DECORATION */}
                {faction && faction.imageUrl && !isRestricted && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 group-hover:opacity-20 transition-opacity z-0 pointer-events-none overflow-hidden">
                        <img src={faction.imageUrl} className="w-full h-full object-cover mix-blend-overlay" alt="Faction" />
                    </div>
                )}
                
                {/* LEFT: ICON / ACTIONS */}
                <div className="w-12 border-r border-slate-700/50 flex flex-col items-center justify-between py-1.5 bg-black/20 z-10">
                    <div className="flex-1 flex items-center justify-center">
                        {selectedItem.icon ? (
                            <img src={selectedItem.icon} className="w-8 h-8 object-contain" alt="" />
                        ) : (
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900/50 border border-slate-700/50 ${rarityStyle.text}`}>
                                {renderDefaultIcon()}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onOpenPicker(); }} 
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Changer"
                        >
                            <RefreshCw size={10} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                            title="Retirer"
                        >
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* RIGHT: INFO */}
                <div className="flex-1 flex flex-col justify-center px-3 min-w-0 z-10">
                    {/* TOP ROW: NAME & METADATA */}
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center min-w-0 flex-1">
                            {isAlleviated && (
                                <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-900/30 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" title="Poids Allégé (Force Naturelle)">
                                    <Feather size={14} className="text-amber-400" />
                                </div>
                            )}
                            <span className={`text-xs font-bold truncate mr-2 ${isRestricted ? 'text-red-400 line-through decoration-red-500/50' : rarityStyle.text}`}>
                                {selectedItem.name}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                            {selectedItem.isCraftable && (
                                <div className="flex items-center justify-center w-6 h-6 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-sm" title="Craftable">
                                    <Anvil size={14} />
                                </div>
                            )}
                            {selectedItem.isTungsten && (
                                <div className={`flex items-center justify-center w-6 h-6 rounded border shadow-sm ${isTungstenError ? 'bg-red-950 border-red-500 animate-pulse' : 'bg-red-950/50 border-red-500/50'}`} title="Tungstène (Unique)">
                                    <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" alt="Tungstène" className="w-4 h-4 object-contain filter drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
                                </div>
                            )}

                            {displayCost && displayCost > 0 && (
                                <div className={`flex items-center px-2 py-0.5 h-6 rounded text-[10px] font-mono font-bold leading-none border ${isCostModified ? 'bg-green-900 border-green-500 text-green-300' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
                                    <Hammer size={12} className="mr-1.5 text-slate-400" />{displayCost}
                                </div>
                            )}
                            {selectedItem.goldCost && (
                                <div className="flex items-center px-2 py-0.5 h-6 rounded text-[10px] font-mono font-bold leading-none border bg-yellow-950/40 border-yellow-600/50 text-yellow-400">
                                    <Coins size={12} className="mr-1.5 text-yellow-500" />{selectedItem.goldCost}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BOTTOM ROW: STATS / ERROR */}
                    <div className="flex items-center gap-2 overflow-hidden h-5">
                        {isRestricted ? (
                            <div className="flex items-center text-[9px] text-red-300 bg-red-950/80 border border-red-500/30 px-1.5 py-0.5 rounded w-full font-bold uppercase animate-pulse">
                                {isTungstenError ? <Ban size={10} className="mr-1.5" /> : <AlertTriangle size={10} className="mr-1.5"/>} 
                                {restrictionLabel}
                            </div>
                        ) : (
                            <>
                                {isFusion && <span className="text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded flex items-center">Fusion</span>}
                                
                                <div className="flex gap-2 items-center overflow-hidden">
                                    {mods.length > 0 ? mods.slice(0, 3).map((m: Modifier, idx) => {
                                        // Upgrade Calculation Logic (Weapons)
                                        let currentUpgradeBonus = 0;
                                        if (upgradeLevel && upgradeLevel > 0) {
                                            if (selectedItem.subCategory === 'Anneaux' && m.targetStatKey === 'vit') currentUpgradeBonus += 50 * upgradeLevel;
                                            else if (selectedItem.subCategory === 'Gantelets' && m.targetStatKey === 'absorption') currentUpgradeBonus += 2 * upgradeLevel;
                                            else if (m.targetStatKey === 'dmg') currentUpgradeBonus += 50 * upgradeLevel;
                                        }
                                        if (upgradeLevelVit && upgradeLevelVit > 0 && m.targetStatKey === 'vit') {
                                            currentUpgradeBonus += 50 * upgradeLevelVit;
                                        }

                                        let { enhanced, bonus } = calculateEnhancedStats(m, displayContext, selectedItem, currentUpgradeBonus);
                                        
                                        // Zephyr Boost Logic (Mounts/Familiars) - Dynamic Display
                                        let zephyrBonus = 0;
                                        if (applyZephyrBoost && m.type === ModifierType.FLAT && ['vit', 'spd', 'dmg'].includes(m.targetStatKey)) {
                                            const boostedValue = Math.ceil(enhanced * 1.5);
                                            zephyrBonus = boostedValue - enhanced;
                                            enhanced = boostedValue;
                                        }

                                        const statConfig = getStatConfig(m.targetStatKey);
                                        const Icon = statConfig.icon;
                                        const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT].includes(m.type);
                                        
                                        const totalBonus = bonus + zephyrBonus;
                                        const showBonus = totalBonus > 0.01;
                                        const baseVal = enhanced - totalBonus;

                                        return (
                                            <div key={idx} className="flex items-center gap-1 bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800">
                                                <Icon size={10} className={statConfig.color} />
                                                <span className={`text-[10px] font-mono font-bold ${statConfig.color}`}>
                                                    {baseVal > 0 ? '+' : ''}{baseVal}{isPercent && '%'}{m.isPerTurn && '/tr'}
                                                    {showBonus && (
                                                        <span className="text-emerald-400 ml-0.5">
                                                            (+{Math.ceil(totalBonus)})
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }) : (
                                        <span className="text-[9px] text-slate-500 italic">Aucun effet</span>
                                    )}
                                    {mods.length > 3 && <span className="text-slate-600 text-[9px] px-1 bg-slate-900 rounded border border-slate-800">+{mods.length - 3}</span>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* PORTAL TOOLTIP */}
            {tooltipStatus !== 'idle' && selectedItem && (
                <ItemTooltip 
                    item={selectedItem} 
                    position={mousePos} 
                    status={tooltipStatus}
                    context={displayContext}
                    rarityStyle={rarityStyle}
                />
            )}
        </>
    )
};
