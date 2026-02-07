
import React from 'react';
import { Plus, X, Settings, Hammer, Feather, Anvil, AlertTriangle, Combine } from 'lucide-react';
import { ItemSlot, Entity, Modifier, EntityType, ModifierType } from '../../types';
import { getStatStyle, calculateEnhancedStats, getRarityColor } from './utils';
import { checkCondition } from '../../services/engine';

interface SlotSelectorProps {
    slot: ItemSlot;
    allItems: Entity[];
    selectedItemId?: string;
    onOpenPicker: () => void;
    onClear: () => void;
    effectiveCost?: number; 
    playerContext?: any;
    isAlleviated?: boolean;
    upgradeLevel?: number; // Damage Upgrade
    upgradeLevelVit?: number; // Vitality Upgrade
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ slot, allItems, selectedItemId, onOpenPicker, onClear, effectiveCost, playerContext, isAlleviated, upgradeLevel, upgradeLevelVit }) => {
    const selectedItem = allItems.find((i) => i.id === selectedItemId);
    
    // Find the faction entity if the item is linked to one
    const faction = selectedItem?.factionId ? allItems.find(e => e.id === selectedItem.factionId && e.type === EntityType.FACTION) : null;

    if (!selectedItem) {
        return (
            <div 
                onClick={onOpenPicker}
                className="flex items-center justify-center p-2 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-900 hover:border-slate-500 transition-all cursor-pointer h-[56px] group"
            >
                <div className="flex items-center text-slate-500 group-hover:text-slate-300 transition-colors">
                    <Plus size={16} className="mr-1.5" />
                    <span className="text-sm font-bold uppercase truncate">{slot.name ? `Équiper ${slot.name}` : 'Équiper'}</span>
                </div>
            </div>
        )
    }

    const mods = selectedItem.modifiers || [];
    const displayCost = effectiveCost !== undefined ? effectiveCost : selectedItem.equipmentCost;
    const isCostModified = effectiveCost !== undefined && effectiveCost !== selectedItem.equipmentCost;

    const displayContext = playerContext || {};

    // --- RESTRICTION CHECK (FACTION or CONDITIONAL) ---
    // 1. Faction Check
    const itemFactionId = selectedItem.factionId;
    const playerFactionId = displayContext.factionId;
    const isFactionMismatch = itemFactionId && itemFactionId !== playerFactionId;

    // 2. Condition Check (For "Reserved" items like Chapeau de Sorcier)
    // If item description implies reservation, check if ANY non-cosmetic modifier condition fails.
    const isReservedItem = selectedItem.description?.includes('{Réservé');
    const hasFailedConditions = isReservedItem && mods.some(m => m.condition && !checkCondition(m.condition, displayContext));

    const isRestricted = isFactionMismatch || hasFailedConditions;
    const restrictionLabel = isFactionMismatch ? (faction?.name || 'Faction Requise') : 'Condition non remplie';

    // Rarity Color
    const rarityColor = getRarityColor(selectedItem.rarity);

    // Is Fusion Check
    const isFusion = selectedItem.id.startsWith('fused_wep_') || selectedItem.subCategory === 'Amalgame';

    return (
        <div className={`bg-slate-900 border rounded-lg p-2 flex items-center justify-between h-[56px] group transition-all relative overflow-hidden shadow-sm ${isRestricted ? 'border-red-500/50 bg-red-900/10' : 'border-slate-600 hover:border-indigo-400'}`}>
            {faction && faction.imageUrl && !isRestricted && (
                <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity z-0">
                    <img src={faction.imageUrl} className="w-16 h-16 object-contain translate-x-4 translate-y-4" alt="Faction" />
                </div>
            )}
            
            <div className="flex flex-col justify-center overflow-hidden flex-1 min-w-0 z-10 mr-1">
                <div className="flex items-center mb-0.5">
                    {isAlleviated && (
                        <div className="mr-1.5 text-amber-500" title="Poids allégé par Force Naturelle">
                            <Feather size={12} fill="currentColor" className="opacity-80" />
                        </div>
                    )}
                    <span className={`text-sm font-bold truncate mr-2 ${isRestricted ? 'text-red-300 decoration-line-through decoration-red-500/50' : rarityColor}`} title={selectedItem.name}>
                        {selectedItem.name}
                    </span>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {displayCost && displayCost > 0 && (
                            <div className={`flex-shrink-0 px-1 py-0.5 text-[8px] font-mono rounded border flex items-center leading-none ${isCostModified ? 'bg-green-900/40 border-green-500/50 text-green-300' : 'bg-slate-950 border-slate-700 text-amber-500'}`} title="Coût d'équipement">
                                <Hammer size={8} className="mr-0.5"/>{displayCost}
                            </div>
                        )}
                        {selectedItem.isCraftable && (
                            <div className="text-emerald-500/80 flex items-center" title="Objet Craftable">
                                <Anvil size={10} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center text-[11px] text-slate-400 overflow-hidden mt-0.5">
                    <div className="flex mr-1.5 space-x-1 flex-shrink-0">
                        {/* FUSION BADGE */}
                        {isFusion && (
                            <span className="bg-indigo-900/50 text-indigo-300 px-1 rounded border border-indigo-500/30 flex items-center whitespace-nowrap text-[10px] font-bold uppercase" title="Arme issue d'une fusion">
                                <Combine size={8} className="mr-1"/> Fusion
                            </span>
                        )}
                        
                        {selectedItem.tags && selectedItem.tags.length > 0 && (
                            selectedItem.tags.slice(0, 1).map(t => (
                                <span key={t} className="bg-slate-800 text-slate-300 px-1 rounded border border-slate-700 flex items-center whitespace-nowrap text-[10px]">
                                    {t}
                                </span>
                            ))
                        )}
                    </div>
                    
                    {/* STATS OR ERROR MESSAGE */}
                    {isRestricted ? (
                        <div className="flex items-center text-[10px] text-red-400 font-bold bg-red-950/50 border border-red-500/30 px-1.5 py-0.5 rounded animate-pulse">
                            <AlertTriangle size={10} className="mr-1.5"/>
                            <span>{restrictionLabel}</span>
                        </div>
                    ) : (
                        <div className="flex space-x-1.5 overflow-hidden whitespace-nowrap">
                            {mods.length > 0 ? (
                                mods.slice(0, 2).map((m: Modifier, idx) => {
                                    // Upgrade Calculation Logic (Handles Both DMG and VIT upgrades)
                                    let currentUpgradeBonus = 0;
                                    
                                    // 1. DAMAGE Upgrade (Standard + Exceptions)
                                    if (upgradeLevel && upgradeLevel > 0) {
                                        if (selectedItem.subCategory === 'Anneaux' && m.targetStatKey === 'vit') {
                                            currentUpgradeBonus += 50 * upgradeLevel;
                                        } else if (selectedItem.subCategory === 'Gantelets' && m.targetStatKey === 'absorption') {
                                            currentUpgradeBonus += 2 * upgradeLevel;
                                        } else if (m.targetStatKey === 'dmg') {
                                            currentUpgradeBonus += 50 * upgradeLevel;
                                        }
                                    }

                                    // 2. VITALITY Upgrade (New Track)
                                    if (upgradeLevelVit && upgradeLevelVit > 0) {
                                        if (m.targetStatKey === 'vit') {
                                            currentUpgradeBonus += 50 * upgradeLevelVit;
                                        }
                                    }

                                    const { base, bonus } = calculateEnhancedStats(m, displayContext, selectedItem, currentUpgradeBonus);
                                    
                                    const statLabel = m.targetStatKey.charAt(0).toUpperCase() + m.targetStatKey.slice(1, 3);
                                    const colorClass = (getStatStyle(m.targetStatKey).match(/text-\S+/) || ['text-slate-400'])[0];
                                    
                                    // Detect percentage
                                    const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT, ModifierType.PERCENT_MULTI_PRE].includes(m.type);

                                    return (
                                        <span key={idx} className={`${colorClass} font-mono font-bold flex items-center`}>
                                            {base > 0 && '+'}{base}{isPercent && '%'}
                                            {bonus > 0 && <span className="text-emerald-400 ml-0.5 text-[10px]">(+{bonus}{isPercent && '%'})</span>} 
                                            {' '}{statLabel}
                                            {m.isPerTurn && <span className="text-[9px] opacity-70 ml-0.5">/T</span>}
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="text-slate-500 italic truncate text-[10px]">{slot.name}</span>
                            )}
                            {mods.length > 2 && <span className="text-slate-600 text-[8px]">+</span>}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-1 z-20 flex-shrink-0 pl-1 border-l border-slate-800/50 bg-gradient-to-l from-slate-900 to-transparent">
                <button 
                    onClick={onOpenPicker} 
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Changer d'objet"
                >
                    <Settings size={14} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="p-1.5 rounded hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors"
                    title="Retirer"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
