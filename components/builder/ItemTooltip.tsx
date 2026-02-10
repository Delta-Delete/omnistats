
import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Clock } from 'lucide-react';
import { Entity, Modifier, ModifierType } from '../../types';
import { getStatStyle, calculateEnhancedStats, parseRichText } from './utils';
import { evaluateFormula } from '../../services/engine';

interface ItemTooltipProps {
    item: Entity;
    position: { x: number, y: number };
    status: 'loading' | 'visible';
    context: any;
    rarityStyle: { text: string };
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, position, status, context, rarityStyle }) => {
    const body = document.querySelector('body');
    if (!body) return null;

    const style: React.CSSProperties = {
        top: position.y + 16,
        left: position.x + 16,
    };

    // Prevent tooltip from going off-screen (basic check)
    if (position.x > window.innerWidth - 350) {
        style.left = 'auto';
        style.right = window.innerWidth - position.x + 16;
    }

    const processDescription = (text: string) => {
        if (!text) return '';
        return text.replace(/\{\{(.*?)\}\}/g, (_, formula) => {
            try {
                const val = evaluateFormula(formula, context);
                return Math.ceil(val).toString();
            } catch (e) { return '?'; }
        });
    };

    const content = (
        <div 
            className="fixed z-[9999] pointer-events-none flex flex-col items-start"
            style={style}
        >
            {status === 'loading' && (
                <div className="bg-slate-900/90 backdrop-blur text-indigo-400 p-1.5 rounded-full border border-indigo-500/30 shadow-xl animate-in fade-in zoom-in duration-200">
                    <Loader2 size={16} className="animate-spin" />
                </div>
            )}

            {status === 'visible' && (
                <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl w-80 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className={`text-sm font-bold mb-0.5 ${rarityStyle.text}`}>{item.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-3">{item.subCategory || 'Objet'}</div>
                    
                    {/* Stats */}
                    {item.modifiers && item.modifiers.length > 0 && (
                        <div className="space-y-1.5 mb-4 border-b border-slate-800 pb-3">
                            {item.modifiers.map((m: Modifier, idx: number) => {
                                const { enhanced } = calculateEnhancedStats(m, context, item);
                                const label = m.targetStatKey.substring(0, 3).toUpperCase();
                                const colorClass = (getStatStyle(m.targetStatKey).match(/text-\S+/) || ['text-slate-400'])[0];
                                const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT].includes(m.type);
                                
                                return (
                                    <div key={idx} className="flex justify-between text-xs items-center">
                                        <div className="flex items-center text-slate-400">
                                            <span>{m.targetStatKey === 'crit_bonus' ? 'Critique' : label}</span>
                                            {m.isPerTurn && (
                                                <span className="flex items-center ml-1.5 text-[9px] text-indigo-400 bg-indigo-900/20 px-1 rounded border border-indigo-500/20">
                                                    <Clock size={8} className="mr-1" /> / tour
                                                </span>
                                            )}
                                        </div>
                                        <span className={`font-mono font-bold ${colorClass}`}>
                                            {enhanced > 0 ? '+' : ''}{enhanced}{isPercent ? '%' : ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Description */}
                    {(item.description || (item.descriptionBlocks && item.descriptionBlocks.length > 0)) && (
                        <div className="text-xs text-slate-400 italic leading-relaxed">
                            {item.descriptionBlocks ? (
                                item.descriptionBlocks.map((b, i) => (
                                    <div key={i} className="mb-2 last:mb-0">
                                        {b.title && <span className="text-slate-300 font-bold not-italic">{b.title}: </span>}
                                        {parseRichText(processDescription(b.text))}
                                    </div>
                                ))
                            ) : (
                                parseRichText(processDescription(item.description || ''))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return createPortal(content, body);
};
