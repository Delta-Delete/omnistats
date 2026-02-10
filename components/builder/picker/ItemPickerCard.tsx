
import React from 'react';
import { Check, Hammer, Coins, Anvil, ShieldAlert, Star, Tag, Clock } from 'lucide-react';
import { Entity, Modifier, ModifierType, StatDefinition } from '../../../types';
import { getStatConfig, getRarityStyle, calculateEnhancedStats, parseRichText, getTagLabel } from '../utils';
import { evaluateFormula, checkCondition } from '../../../services/engine';

interface ItemPickerCardProps {
    item: Entity;
    currentItem?: Entity;
    isSelected: boolean;
    context: any;
    stats: StatDefinition[]; 
    onSelect: (id: string) => void;
    categoryName: string;
    faction?: Entity;
}

export const ItemPickerCard: React.FC<ItemPickerCardProps> = ({ 
    item, currentItem, isSelected, context, stats, onSelect, categoryName, faction 
}) => {
    
    // --- RESTRICTION CHECK ---
    const isFactionLocked = !!item.factionId && (context.factionId !== item.factionId);
    const isReservedItem = item.description?.includes('{Réservé');
    const hasFailedConditions = isReservedItem && (item.modifiers || []).some(m => m.condition && !checkCondition(m.condition, context));
    const isRestricted = isFactionLocked || hasFailedConditions;
    const restrictionLabel = isFactionLocked ? (faction?.name || 'Faction Requise') : 'Condition non remplie';

    // --- STYLES ---
    const rarityStyle = getRarityStyle(item.rarity);

    // --- STATS EXTRACTION ---
    // On extrait spécifiquement les stats principales pour la grille, et on garde le reste pour le footer
    const MAIN_KEYS = ['vit', 'spd', 'dmg'];
    
    // Helper: Calculer la valeur cumulée d'une stat pour un item (pour le comparateur)
    const getItemTotalStat = (targetItem: Entity, key: string) => {
        if (!targetItem.modifiers) return 0;
        return targetItem.modifiers
            .filter(m => m.targetStatKey === key && !m.toggleId)
            .reduce((sum, m) => sum + calculateEnhancedStats(m, context, targetItem).enhanced, 0);
    };

    // Préparation des stats principales avec comparateur
    const mainStatsData = MAIN_KEYS.map(key => {
        const itemVal = getItemTotalStat(item, key);
        const currentVal = currentItem ? getItemTotalStat(currentItem, key) : 0;
        const diff = itemVal - currentVal;
        
        // Détection si c'est un pourcentage
        const isPercent = item.modifiers?.some(m => 
            m.targetStatKey === key && 
            !m.toggleId && 
            [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT, ModifierType.PERCENT_MULTI_PRE].includes(m.type)
        );

        return {
            key,
            val: itemVal,
            diff,
            hasStat: itemVal !== 0 || (currentItem && currentVal !== 0), // Afficher si l'item a la stat OU si l'item équipé en avait
            isPercent,
            config: getStatConfig(key)
        };
    });

    // Autres modificateurs (Critique, Résistance, Effets Spéciaux...)
    const otherModifiers = (item.modifiers || []).filter(m => !MAIN_KEYS.includes(m.targetStatKey) && !m.toggleId);

    // --- DESCRIPTION ---
    const renderDescription = () => {
        // ... (Logique description inchangée, juste nettoyée visuellement)
        if (item.descriptionBlocks && item.descriptionBlocks.length > 0) {
            return (
                <div className="text-[10px] text-slate-400 italic leading-relaxed space-y-1 mt-2 pt-2 border-t border-slate-700/30">
                    {item.descriptionBlocks.map((block, bIdx) => {
                        const text = block.text.replace(/\{\{(.*?)\}\}/g, (_, formula) => {
                                try { return Math.ceil(evaluateFormula(formula, context)).toString(); } catch (e) { return '?'; }
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
                try { return Math.ceil(evaluateFormula(formula, context)).toString(); } catch (e) { return '?'; }
            });
            return <div className="text-[10px] text-slate-400 italic leading-relaxed mt-2 pt-2 border-t border-slate-700/30">{parseRichText(description)}</div>;
        }
        return null;
    };

    return (
        <button 
            onClick={() => onSelect(item.id)} 
            className={`relative text-left p-3 rounded-xl border transition-all duration-300 flex flex-col gap-2 group h-full overflow-hidden ${
                isRestricted 
                ? 'bg-red-950/10 border-red-900/30 grayscale-[0.5] hover:bg-red-950/20 hover:border-red-900/50' 
                : isSelected 
                    ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                    : `bg-gradient-to-br ${rarityStyle.gradient} ${rarityStyle.border} hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110`
            }`}
        >
            {/* Header: Icons & Name */}
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center min-w-0 pr-2 w-full">
                    {/* Faction Icon or Category Icon placeholder if needed */}
                    <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-300' : rarityStyle.text}`}>
                            {item.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mr-1">{categoryName}</span>
                            
                            {item.isCraftable && (
                                <div className="flex items-center justify-center w-6 h-6 rounded bg-emerald-900 border border-emerald-500 text-emerald-400 shadow-sm" title="Craftable">
                                    <Anvil size={14} />
                                </div>
                            )}
                            
                            {item.isTungsten && (
                                <div className="flex items-center justify-center w-6 h-6 rounded bg-red-900 border border-red-500 shadow-sm" title="Tungstène (Unique)">
                                    <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" alt="Tungstène" className="w-4 h-4 object-contain filter drop-shadow-sm" />
                                </div>
                            )}

                            {item.equipmentCost! > 0 && (
                                <span className="flex items-center text-[9px] text-slate-300 font-bold bg-slate-800 border border-slate-600 px-2 py-0.5 h-6 rounded">
                                    <Hammer size={12} className="mr-1.5 text-slate-400"/>{item.equipmentCost}
                                </span>
                            )}
                            
                            {item.goldCost! > 0 && (
                                <span className="flex items-center text-[9px] text-yellow-400 font-bold bg-yellow-950/40 border border-yellow-600/50 px-2 py-0.5 h-6 rounded">
                                    <Coins size={12} className="mr-1.5 text-yellow-500"/>{item.goldCost}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RESTRICTION WARNING */}
            {isRestricted && (
                <div className="bg-red-950/40 border border-red-900/50 rounded px-2 py-1 flex items-center gap-2">
                    <ShieldAlert size={12} className="text-red-500 flex-shrink-0" />
                    <span className="text-[9px] font-bold text-red-300 uppercase tracking-wide truncate">{restrictionLabel}</span>
                </div>
            )}

            {/* MAIN STATS GRID */}
            <div className={`grid grid-cols-3 gap-1 mt-1 ${isRestricted ? 'opacity-50' : ''}`}>
                {mainStatsData.map(stat => {
                    const Icon = stat.config.icon;
                    // On affiche la case si la stat est présente ou s'il y a une différence (comparaison avec l'équipement actuel)
                    // Si pas de stat et pas de diff, on affiche une case vide grisée pour garder l'alignement
                    const isEmpty = !stat.hasStat; 
                    
                    return (
                        <div key={stat.key} className={`flex flex-col items-center justify-center px-1.5 py-1 rounded-lg border ${isEmpty ? 'border-slate-800/50 bg-slate-900/20' : `${stat.config.bg} border-${stat.config.color.split('-')[1]}-500/20`}`}>
                            <div className="flex items-center">
                                <Icon size={10} className={isEmpty ? 'text-slate-700' : stat.config.color} />
                                <span className={`text-[9px] font-bold ml-1 ${isEmpty ? 'text-slate-700' : stat.config.color}`}>{stat.config.label}</span>
                            </div>
                            <div className={`text-sm font-mono font-bold ${isEmpty ? 'text-slate-700' : (stat.val < 0 ? 'text-red-400' : 'text-slate-200')}`}>
                                {stat.val !== 0 ? (stat.val > 0 ? `+${stat.val}` : stat.val) : '-'}
                                {stat.isPercent && stat.val !== 0 && '%'}
                            </div>
                            {/* Diff Display */}
                            {currentItem && stat.diff !== 0 && (
                                <div className={`text-[9px] font-bold flex items-center -mt-0.5 ${stat.diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {stat.diff > 0 ? '▲' : '▼'} {Math.abs(stat.diff)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* SECONDARY MODIFIERS (Badges) */}
            {otherModifiers.length > 0 && (
                <div className={`flex flex-wrap gap-1.5 mt-2 ${isRestricted ? 'opacity-50' : ''}`}>
                    {otherModifiers.map((m, idx) => {
                        const { enhanced } = calculateEnhancedStats(m, context, item);
                        const conf = getStatConfig(m.targetStatKey);
                        const label = conf.label;
                        
                        // Check diff for secondary stats too
                        let diffDisplay = null;
                        if (currentItem) {
                            const currentVal = getItemTotalStat(currentItem, m.targetStatKey);
                            const diff = enhanced - currentVal;
                            if (Math.abs(diff) > 0) {
                                diffDisplay = <span className={diff > 0 ? 'text-emerald-400' : 'text-red-400'}>{diff > 0 ? '▲' : '▼'}</span>;
                            }
                        }

                        // Check percent for badges too
                        const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT, ModifierType.PERCENT_MULTI_PRE].includes(m.type);

                        return (
                            <span key={idx} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border bg-slate-900/50 border-slate-700 text-slate-300`}>
                                {m.displayTag && <Star size={8} className="mr-1 text-yellow-500 fill-yellow-500/50" />}
                                {enhanced > 0 ? '+' : ''}{enhanced}{isPercent && '%'} <span className={`mx-1 ${conf.color}`}>{label}</span>
                                {m.isPerTurn && <Clock size={8} className="ml-0.5 text-slate-500" />}
                                {diffDisplay && <span className="ml-1 text-[8px]">{diffDisplay}</span>}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* DESCRIPTION */}
            <div className="mt-auto w-full">
                {renderDescription()}
            </div>

            {/* TAGS FOOTER */}
            {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 opacity-60">
                    {item.tags.map(tag => (
                        <span key={tag} className="flex items-center text-[8px] text-slate-500 bg-black/20 border border-slate-800 rounded px-1.5 py-0.5">
                            <Tag size={8} className="mr-1" />{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* SELECTED INDICATOR */}
            {isSelected && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] z-20 animate-in zoom-in duration-200">
                    <Check size={12} strokeWidth={4} />
                </div>
            )}
        </button>
    );
};
