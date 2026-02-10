
import React from 'react';
import { Lock, Trash2 } from 'lucide-react';
import { Entity, ItemConfigValues } from '../../../types';
import { CollapsibleCard } from '../../ui/Card';
import { ItemConfigControl } from './ItemConfigControl';
import { toFantasyTitle, calculateEnhancedStats, getStatConfig } from '../utils';
import { checkCondition } from '../../../services/engine';

interface InventoryBagProps {
    id: string;
    title: string;
    icon: React.ElementType;
    itemIds: string[];
    allItems: Entity[];
    context: any;
    
    // Logic props
    onAddItem: (id: string) => void;
    onRemoveItem: (index: number) => void;
    onUpdateConfig: (itemId: string, key: keyof ItemConfigValues, value: number) => void;
    getItemConfig: (itemId: string) => ItemConfigValues;
    
    // Display props
    availableItemsFilter: (item: Entity) => boolean;
    isLockedPredicate?: (itemId: string) => boolean;
    itemBgColor?: string; // Optional override for card bg
    lockedIconColor?: string;
    placeholderText?: string;
}

export const InventoryBag: React.FC<InventoryBagProps> = ({
    id, title, icon, itemIds, allItems, context,
    onAddItem, onRemoveItem, onUpdateConfig, getItemConfig,
    availableItemsFilter, isLockedPredicate,
    itemBgColor = 'bg-slate-800', lockedIconColor = 'text-amber-500/50', placeholderText = "+ Ajouter..."
}) => {
    
    const renderItemCard = (itemId: string, index: number) => {
        const item = allItems.find(i => i.id === itemId);
        const isLocked = isLockedPredicate ? isLockedPredicate(itemId) : false;
        const hasConfig = !!item?.userConfig;
        
        // Determine container style
        const containerClass = `relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-200 shadow-sm ${
            isLocked 
            ? 'bg-amber-950/20 border-amber-600/30' 
            : `${itemBgColor} border-slate-700/50 hover:border-slate-600`
        } ${hasConfig ? 'w-full md:w-[48%]' : ''}`; // Config items take more width

        // CALCULATE CONSOLIDATED STATS FOR DISPLAY
        // This solves the issue where items with multiple conditional modifiers (like Seals) 
        // would only show the first few, or show confusing values.
        // Now sums up ALL active modifiers for the current context.
        const consolidatedStats = [];
        if (!hasConfig && item?.modifiers) {
            const statsMap = new Map<string, number>();
            item.modifiers.forEach(m => {
                // Check if the modifier is active in current context
                if (m.condition && !checkCondition(m.condition, context)) return;
                
                const { enhanced } = calculateEnhancedStats(m, context, item);
                if (enhanced !== 0) {
                    statsMap.set(m.targetStatKey, (statsMap.get(m.targetStatKey) || 0) + enhanced);
                }
            });
            
            // Convert map to array for display
            statsMap.forEach((val, key) => {
                consolidatedStats.push({ key, val });
            });
        }

        return (
            <div key={`${itemId}-${index}`} className={containerClass}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-bold line-clamp-1 truncate ${isLocked ? 'text-amber-400' : 'text-slate-200'}`}>
                            {item?.name || 'Objet Inconnu'}
                        </span>
                        
                        {/* Consolidated Stats Preview (Real-time Value) */}
                        {!hasConfig && consolidatedStats.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {consolidatedStats.map((stat, sIdx) => {
                                    const label = stat.key.substring(0, 3).toUpperCase();
                                    
                                    // Dynamic Color Mapping using shared utility config
                                    const conf = getStatConfig(stat.key);
                                    // Strip bg classes, keep text color
                                    const colorClass = (conf.color.match(/text-\S+/) || ['text-slate-400'])[0];
                                    
                                    return (
                                        <span key={sIdx} className={`text-[9px] font-mono font-bold ${colorClass}`}>
                                            {stat.val > 0 ? '+' : ''}{stat.val} {label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                        
                        {/* Fallback if no active stats found (e.g. condition not met) */}
                        {!hasConfig && consolidatedStats.length === 0 && item?.modifiers && item.modifiers.length > 0 && (
                            <span className="text-[9px] text-slate-500 italic mt-1">Inactif (Condition non remplie)</span>
                        )}
                    </div>
                    
                    {isLocked ? (
                        <Lock size={12} className={`${lockedIconColor} flex-shrink-0`} />
                    ) : (
                        <button onClick={() => onRemoveItem(index)} className="text-slate-600 hover:text-red-400 p-1 -mt-1 -mr-1 transition-colors">
                            <Trash2 size={12}/>
                        </button>
                    )}
                </div>

                <div className="flex-1">
                    {item && (
                        <ItemConfigControl 
                            item={item} 
                            configValues={getItemConfig(itemId)} 
                            onUpdate={(k, v) => onUpdateConfig(itemId, k, v)} 
                        />
                    )}
                    
                    {!hasConfig && item?.description && (
                        <div className="mt-auto pt-2 text-[9px] text-slate-500 italic line-clamp-2 border-t border-slate-700/30">
                            {item.description}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <CollapsibleCard id={id} title={toFantasyTitle(title)} icon={icon}>
            <div className="flex flex-wrap gap-3 mb-3">
                {itemIds.map((itemId, idx) => renderItemCard(itemId, idx))}
            </div>
            
            <select 
                className="w-full bg-slate-800 border-slate-700 rounded text-sm text-slate-300 p-2 outline-none hover:border-slate-600 transition-colors" 
                onChange={(e) => { onAddItem(e.target.value); e.target.value = 'none'; }}
                value="none"
            >
                <option value="none">{placeholderText}</option>
                {allItems.filter(availableItemsFilter).map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                ))}
            </select>
        </CollapsibleCard>
    );
};
