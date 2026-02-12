
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getTagColor, getTagLabel } from '../builder/utils'; // Keep logic ref for tags

/**
 * Transforme une chaîne contenant des balises propriétaires (^^valeur^^, **gras**) en JSX.
 */
export const parseRichText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\^\^.*?\^\^|\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('^^') && part.endsWith('^^')) {
            const cleanVal = part.slice(2, -2).trim(); 
            const num = parseFloat(cleanVal.replace(/[^0-9.-]/g, ''));
            // Si la valeur est ~0, on ne l'affiche pas (optionnel, mais garde le texte propre)
            if (!isNaN(num) && Math.abs(num) < 0.01) return null;
            return <span key={index} className="text-emerald-400 font-bold ml-1">{cleanVal}</span>;
        } else if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={index} className="text-white font-bold">{part.slice(2, -2).trim()}</span>;
        }
        return <span key={index}>{part}</span>;
    });
};

interface CollapsibleDescriptionProps {
    block: { 
        tag?: string, 
        title?: string, 
        text: string, 
        isCollapsible?: boolean 
    };
}

export const CollapsibleDescription: React.FC<CollapsibleDescriptionProps> = ({ block }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!block.isCollapsible) {
        return (
            <div className="mb-2 last:mb-0">
                {block.tag && <span className={`${getTagColor(block.tag)} text-[10px] mr-1.5`}>{getTagLabel(block.tag)}</span>}
                {block.title && <span className="text-xs font-bold text-slate-200 mr-1">{block.title} :</span>}
                <span className="text-xs text-slate-400 italic leading-relaxed whitespace-pre-line">{parseRichText(block.text)}</span>
            </div>
        );
    }

    return (
        <div className="mb-2 last:mb-0">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-left w-full group focus:outline-none">
                <ChevronRight size={14} className={`text-slate-500 group-hover:text-white mr-1.5 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                <div className="flex-1">
                    {block.tag && <span className={`${getTagColor(block.tag)} text-[10px] mr-1.5`}>{getTagLabel(block.tag)}</span>}
                    <span className={`text-xs font-bold ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'} transition-colors`}>{block.title || 'Détails'}</span>
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out pl-6 border-l border-slate-800 ml-1.5 ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs text-slate-400 italic leading-relaxed py-1 whitespace-pre-line">{parseRichText(block.text)}</p>
            </div>
        </div>
    );
};
