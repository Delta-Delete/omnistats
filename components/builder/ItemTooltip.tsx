
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Clock } from 'lucide-react';
import { Entity, Modifier, ModifierType } from '../../types';
import { getStatStyle } from './utils';
import { calculateEnhancedStats } from '../../services/preview';
import { parseRichText } from '../ui/RichText';
import { processDynamicText } from '../../services/processing';

interface ItemTooltipProps {
    item: Entity;
    position: { x: number, y: number };
    status: 'loading' | 'visible';
    context: any;
    rarityStyle: { text: string };
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, position, status, context, rarityStyle }) => {
    const body = document.querySelector('body');
    const [isExpanded, setIsExpanded] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset state when item changes
    useEffect(() => {
        setIsExpanded(false);
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
    }, [item.id]);

    if (!body) return null;

    const style: React.CSSProperties = {
        top: position.y + 16,
        left: position.x + 16,
    };

    // Prevent tooltip from going off-screen
    if (position.x > window.innerWidth - 350) {
        style.left = 'auto';
        style.right = window.innerWidth - position.x + 16;
    }
    
    // Prevent tooltip from going below screen
    const estimatedHeight = 400; 
    if (position.y > window.innerHeight - estimatedHeight) {
        style.top = 'auto';
        style.bottom = window.innerHeight - position.y + 16;
    }

    // UPDATED: Use centralized processor
    const processDescription = (text: string) => {
        return processDynamicText(text, context);
    };

    const handleMouseEnter = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => {
            setIsExpanded(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setIsExpanded(false);
    };

    const content = (
        <div 
            className="fixed z-[9999] flex flex-col items-start pointer-events-none" 
            style={style}
        >
            {status === 'loading' && (
                <div className="bg-slate-900/90 backdrop-blur text-indigo-400 p-1.5 rounded-full border border-indigo-500/30 shadow-xl animate-in fade-in zoom-in duration-200">
                    <Loader2 size={16} className="animate-spin" />
                </div>
            )}

            {status === 'visible' && (
                <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl w-80 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
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

                    {/* Description (Expandable) */}
                    {(item.description || (item.descriptionBlocks && item.descriptionBlocks.length > 0)) && (
                        <div 
                            className="relative group cursor-help"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`text-xs text-slate-400 italic leading-relaxed transition-all duration-500 ease-in-out overflow-hidden whitespace-pre-line ${isExpanded ? 'max-h-[1000px]' : 'max-h-40'}`}>
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return createPortal(content, body);
};
