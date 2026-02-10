
import React from 'react';
import { Check, Hammer, Coins, Anvil, ShieldAlert, Star, Tag } from 'lucide-react';
import { Entity, Modifier, ModifierType, StatDefinition } from '../../../types';
import { getStatStyle, getRarityStyle, getRarityColor, calculateEnhancedStats, parseRichText, getTagLabel } from '../utils';
import { evaluateFormula, checkCondition } from '../../../services/engine';

interface ItemPickerCardProps {
    item: Entity;
    currentItem?: Entity;
    isSelected: boolean;
    context: any;
    stats: StatDefinition[]; // Pour l'ordre et les labels des stats
    onSelect: (id: string) => void;
    // Données pré-calculées depuis le parent pour éviter de recalculer à chaque rendu
    categoryName: string;
    faction?: Entity;
}

export const ItemPickerCard: React.FC<ItemPickerCardProps> = ({ 
    item, currentItem, isSelected, context, stats, onSelect, categoryName, faction 
}) => {
    
    // --- RESTRICTION CHECK ---
    const isFactionLocked = !!item.factionId && (context.factionId !== item.factionId);
    const isReservedItem = item.description?.includes('{Réservé');
    // On vérifie les conditions spécifiques des modificateurs si c'est un item réservé
    const hasFailedConditions = isReservedItem && (item.modifiers || []).some(m => m.condition && !checkCondition(m.condition, context));
    const isRestricted = isFactionLocked || hasFailedConditions;
    const restrictionLabel = isFactionLocked ? (faction?.name || 'Faction Requise') : 'Condition non remplie';

    // --- STYLES ---
    const rarityStyle = getRarityStyle(item.rarity);

    // --- STATS LOGIC ---
    const primaryStatKeys = new Set(stats.filter(s => s.group === 'Primary').map(s => s.key));
    const mods = item.modifiers || [];
    const simpleMods = mods.filter(m => !m.condition && !m.toggleId);
    const visibleMods = simpleMods.filter(m => primaryStatKeys.has(m.targetStatKey));
    const hiddenMods = simpleMods.filter(m => !primaryStatKeys.has(m.targetStatKey));
    const hasHidden = hiddenMods.length > 0;

    // Helper pour calculer la valeur totale d'une stat sur un item
    const getItemStatValue = (targetItem: Entity, statKey: string) => {
        let total = 0;
        (targetItem.modifiers || []).forEach(m => {
            if (m.targetStatKey === statKey) {
                const { enhanced } = calculateEnhancedStats(m, context, targetItem);
                total += enhanced;
            }
        });
        return total;
    };

    const renderStatBadge = (m: Modifier, idx: number) => {
        const label = m.targetStatKey.substring(0,3).toUpperCase();
        const style = getStatStyle(m.targetStatKey);
        
        const { base, bonus } = calculateEnhancedStats(m, context, item);
        const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT, ModifierType.PERCENT_MULTI_PRE].includes(m.type);

        let diff = null;
        let diffColor = '';
        
        // Calcul de la différence par rapport à l'item équipé
        if (currentItem && currentItem.id !== item.id) {
            const currentVal = getItemStatValue(currentItem, m.targetStatKey);
            const targetVal = getItemStatValue(item, m.targetStatKey);
            
            const diffVal = targetVal - currentVal;
            // Ignore negligible diffs
            if (Math.abs(diffVal) > 0.01) {
                diff = diffVal;
                if (diffVal > 0) diffColor = 'border-green-500 bg-green-900/30';
                else diffColor = 'border-red-500 bg-red-900/30 opacity-90';
            }
        } 

        const containerClass = diffColor || style;
        
        // Bonus Text Logic (Avoid +0)
        const showBonus = bonus > 0.01;

        return (
            <span key={idx} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border transition-colors duration-200 ${containerClass}`} title={m.displayTag ? getTagLabel(m.displayTag) : m.targetStatKey}>
                {m.displayTag && <Star size={8} className="mr-1 text-yellow-500 fill-yellow-500/50" />}
                {base > 0 ? '+' : ''}{base}{isPercent && '%'}
                {showBonus && <span className="text-emerald-400 ml-0.5 text-[9px]">(+{Math.ceil(bonus)}{isPercent && '%'})</span>} 
                {' '}{label}
                {m.isPerTurn && <span className="text-[8px] opacity-75 ml-0.5">/T</span>}
                
                {diff !== null && (
                    <span className={`ml-1.5 text-[9px] font-bold flex items-center ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {diff > 0 ? '▲' : '▼'} {Math.abs(diff)}
                    </span>
                )}
            </span>
        )
    };

    // --- DESCRIPTION RENDER ---
    const renderDescription = () => {
        if (item.descriptionBlocks && item.descriptionBlocks.length > 0) {
            return (
                <div className="text-[11px] text-slate-400 italic leading-relaxed space-y-1.5 border-t border-slate-800/50 pt-2 mt-2">
                    {item.descriptionBlocks.map((block, bIdx) => {
                        const text = block.text.replace(/\{\{(.*?)\}\}/g, (_, formula) => {
                                try {
                                    const val = evaluateFormula(formula, context);
                                    return Math.ceil(val).toString();
                                } catch (e) { return '?'; }
                        });
                        return (
                            <div key={bIdx}>
                                {block.title && <span className="font-bold text-slate-300 mr-1 not-italic">{block.title}:</span>}
                                {parseRichText(text)}
                            </div>
                        )
                    })}
                </div>
            );
        }
        if (item.description) {
                let description = item.description.replace(/\{\{(.*?)\}\}/g, (_, formula) => {
                try {
                    const val = evaluateFormula(formula, context);
                    return Math.ceil(val).toString();
                } catch (e) { return '?'; }
            });
            return <div className="text-[11px] text-slate-400 italic leading-relaxed border-t border-slate-800/50 pt-2 mt-2">{parseRichText(description)}</div>;
        }
        return null;
    };

    return (
        <button 
            onClick={() => onSelect(item.id)} 
            className={`relative text-left p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 group h-full overflow-hidden ${
                isRestricted 
                ? 'bg-red-950/20 border-red-900/50 hover:border-red-500/50 grayscale-[0.5]' 
                : isSelected 
                    ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                    : `${rarityStyle.bg} border-slate-800 hover:border-slate-600 hover:shadow-lg hover:-translate-y-1`
            }`}
        >
            {/* RARITY GLOW ON HOVER */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500 ${rarityStyle.glow}`}></div>

            {/* HEADER */}
            <div className="flex justify-between items-start relative z-10">
                {faction && faction.imageUrl && (
                    <div className={`mr-3 mt-0.5 flex-shrink-0 ${isRestricted ? 'opacity-50' : ''}`}>
                        <div className="w-8 h-8 rounded bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center p-0.5">
                            <img src={faction.imageUrl} alt={faction.name} className="w-full h-full object-contain" />
                        </div>
                    </div>
                )}
                <div className="flex-1 min-w-0 pr-2">
                    <div className={`font-bold text-sm line-clamp-1 truncate ${isSelected ? 'text-indigo-300' : rarityStyle.text}`}>
                        {item.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5 flex items-center gap-2">
                        {categoryName}
                        {/* COST BADGE */}
                        {item.equipmentCost && item.equipmentCost > 0 && (
                            <span className="flex items-center text-amber-500 bg-black/30 px-1.5 py-0.5 rounded border border-slate-800">
                                <Hammer size={10} className="mr-1"/>{item.equipmentCost}
                            </span>
                        )}
                        {/* GOLD COST BADGE */}
                        {item.goldCost && (
                            <span className="flex items-center text-yellow-400 bg-black/30 px-1.5 py-0.5 rounded border border-yellow-500/30">
                                <Coins size={10} className="mr-1" />{item.goldCost} Po
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                    {item.isCraftable && (
                        <div className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" title="Craftable">
                            <Anvil size={14} />
                        </div>
                    )}
                    {item.isTungsten && (
                        <div className="" title="Tungstène">
                            <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" alt="Tungstène" className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                </div>
            </div>
            
            {/* RESTRICTION WARNING */}
            {isRestricted && (
                <div className="bg-red-950/40 border border-red-900/50 rounded px-2 py-1.5 flex items-center gap-2 mt-1 animate-pulse">
                    <ShieldAlert size={12} className="text-red-500 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-red-300 uppercase tracking-wide truncate">{restrictionLabel}</span>
                </div>
            )}

            {/* STATS BADGES */}
            <div className={`flex flex-wrap gap-1.5 mt-1 relative z-10 ${isRestricted ? 'opacity-50 blur-[0.5px]' : ''}`}>
                {visibleMods.map((m, idx) => renderStatBadge(m, idx))}
                {hasHidden && (
                    <div className="group/hidden relative flex">
                        <div className="flex items-center justify-center w-6 h-5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px]">
                            +{hiddenMods.length}
                        </div>
                        {/* Tooltip for hidden stats */}
                        <div className="absolute left-0 bottom-full mb-1 bg-slate-900 border border-slate-700 p-2 rounded shadow-xl hidden group-hover/hidden:flex flex-wrap gap-1 min-w-[150px] z-50">
                            {hiddenMods.map((m, idx) => renderStatBadge(m, idx + 100))}
                        </div>
                    </div>
                )}
            </div>

            {/* DESCRIPTION */}
            <div className="relative z-10">
                {renderDescription()}
            </div>

            <div className="flex-1"></div>
            
            {/* TAGS FOOTER */}
            {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.tags.map(tag => (
                        <span key={tag} className="flex items-center text-[9px] bg-black/30 text-slate-400 border border-white/5 rounded px-1.5 py-0.5">
                            <Tag size={8} className="mr-1" />{tag}
                        </span>
                    ))}
                </div>
            )}

            {isSelected && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] z-20">
                    <Check size={12} strokeWidth={4} />
                </div>
            )}
        </button>
    );
};
