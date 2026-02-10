
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, RefreshCw, Hammer, Feather, AlertTriangle, Sword, Shield, Coins, Ban, Anvil } from 'lucide-react';
import { ItemSlot, Entity, Modifier, EntityType, ModifierType } from '../../types';
import { getStatStyle, calculateEnhancedStats, getRarityStyle } from './utils';
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
        
        timerRef.current = setTimeout(() => {
            setTooltipStatus('visible');
        }, 500);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (tooltipStatus !== 'idle') {
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setTooltipStatus('idle');
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

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
    const goldCost = selectedItem.goldCost;

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
                                {selectedItem.categoryId === 'weapon' ? <Sword size={14}/> : <Shield size={14} />}
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
                    {/* TOP ROW */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center min-w-0 flex-1">
                            {isAlleviated && (
                                <Feather size={10} className="text-amber-500 mr-1.5 flex-shrink-0" />
                            )}
                            <span className={`text-xs font-bold truncate mr-2 ${isRestricted ? 'text-red-400 line-through decoration-red-500/50' : rarityStyle.text}`}>
                                {selectedItem.name}
                            </span>
                            
                            {selectedItem.isCraftable && (
                                <div className="text-emerald-500/70 mr-1" title="Craftable"><Anvil size={12} /></div>
                            )}
                            {selectedItem.isTungsten && (
                                <div className="" title="Tungstène (Unique)">
                                    <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" alt="Tungstène" className={`w-5 h-5 object-contain ${isTungstenError ? 'opacity-100 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'opacity-80'}`} />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                            {displayCost && displayCost > 0 && (
                                <div className={`flex items-center px-1 py-0.5 rounded text-[9px] font-mono leading-none border ${isCostModified ? 'bg-green-900/40 border-green-500/50 text-green-300' : 'bg-black/40 border-slate-700 text-slate-400'}`}>
                                    <Hammer size={10} className="mr-1" />{displayCost}
                                </div>
                            )}
                            {goldCost && (
                                <div className="flex items-center px-1 py-0.5 rounded text-[9px] font-mono leading-none border bg-black/40 border-yellow-500/30 text-yellow-400">
                                    <Coins size={10} className="mr-1" />{goldCost} Po
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="flex items-center gap-1.5 overflow-hidden h-5">
                        {isRestricted ? (
                            <div className="flex items-center text-[9px] text-red-300 bg-red-950/80 border border-red-500/30 px-1.5 py-0.5 rounded w-full font-bold uppercase animate-pulse">
                                {isTungstenError ? <Ban size={10} className="mr-1.5" /> : <AlertTriangle size={10} className="mr-1.5"/>} 
                                {restrictionLabel}
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-1 flex-shrink-0">
                                    {isFusion && <span className="text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded flex items-center">Fusion</span>}
                                    {selectedItem.tags?.slice(0, 1).map(t => (
                                        <span key={t} className="text-[8px] bg-slate-800 text-slate-400 border border-slate-700 px-1 rounded truncate max-w-[60px]">{t}</span>
                                    ))}
                                </div>

                                <div className="flex gap-1.5 text-[10px] font-mono font-bold items-center overflow-hidden">
                                    {mods.length > 0 ? mods.slice(0, 3).map((m: Modifier, idx) => {
                                        let currentUpgradeBonus = 0;
                                        if (upgradeLevel && upgradeLevel > 0) {
                                            if (selectedItem.subCategory === 'Anneaux' && m.targetStatKey === 'vit') currentUpgradeBonus += 50 * upgradeLevel;
                                            else if (selectedItem.subCategory === 'Gantelets' && m.targetStatKey === 'absorption') currentUpgradeBonus += 2 * upgradeLevel;
                                            else if (m.targetStatKey === 'dmg') currentUpgradeBonus += 50 * upgradeLevel;
                                        }
                                        if (upgradeLevelVit && upgradeLevelVit > 0 && m.targetStatKey === 'vit') {
                                            currentUpgradeBonus += 50 * upgradeLevelVit;
                                        }

                                        const { base, bonus } = calculateEnhancedStats(m, displayContext, selectedItem, currentUpgradeBonus);
                                        const statLabel = m.targetStatKey.substring(0, 3).toUpperCase();
                                        const colorClass = (getStatStyle(m.targetStatKey).match(/text-\S+/) || ['text-slate-400'])[0];
                                        const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT].includes(m.type);
                                        const showBonus = bonus > 0.01;

                                        return (
                                            <div key={idx} className={`flex items-baseline ${colorClass}`}>
                                                <span className="opacity-90">{base > 0 && '+'}{base}{isPercent && '%'}</span>
                                                {showBonus && <span className="text-emerald-400 text-[8px] ml-px">+{Math.ceil(bonus)}</span>}
                                                <span className="ml-0.5 text-[8px] opacity-60">{statLabel}</span>
                                            </div>
                                        );
                                    }) : (
                                        <span className="text-[9px] text-slate-500 italic">Aucun effet</span>
                                    )}
                                    {mods.length > 3 && <span className="text-slate-600 text-[9px]">+</span>}
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
