
import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Heart, Activity, Sword, Shield, Zap, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { TAG_OPTIONS } from '../../services/data';
import { evaluateFormula, resolveItemPreview } from '../../services/engine';
import { Entity, Modifier, Rarity, ModifierType } from '../../types';

// --- TEXT UTILS ---

export const toFantasyTitle = (text: string): string => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .toUpperCase();
};

// Configuration centrale pour l'affichage des stats
export const STAT_CONFIG: Record<string, { label: string, color: string, icon: any, bg: string }> = {
    vit: { label: 'VIT', color: 'text-emerald-400', icon: Heart, bg: 'bg-emerald-500/10' },
    spd: { label: 'SPD', color: 'text-amber-400', icon: Zap, bg: 'bg-amber-500/10' }, 
    dmg: { label: 'DMG', color: 'text-rose-400', icon: Sword, bg: 'bg-rose-500/10' },
    crit_primary: { label: 'CRIT', color: 'text-purple-400', icon: Star, bg: 'bg-purple-500/10' },
    crit_secondary: { label: 'C.MAX', color: 'text-fuchsia-400', icon: Sparkles, bg: 'bg-fuchsia-500/10' },
    res: { label: 'RES', color: 'text-blue-300', icon: Shield, bg: 'bg-blue-500/10' },
    aura: { label: 'AURA', color: 'text-cyan-300', icon: Zap, bg: 'bg-cyan-500/10' },
    absorption: { label: 'ABS', color: 'text-violet-400', icon: AlertCircle, bg: 'bg-violet-500/10' },
    renvois_degats: { label: 'RENVOI', color: 'text-orange-400', icon: RefreshCw, bg: 'bg-orange-500/10' }
};

export const getStatConfig = (key: string) => {
    return STAT_CONFIG[key] || { label: key.substring(0,3).toUpperCase(), color: 'text-slate-400', icon: Activity, bg: 'bg-slate-600/10' };
};

export const getStatStyle = (key: string) => {
    const conf = getStatConfig(key);
    return `${conf.color} ${conf.bg} border-${conf.color.split('-')[1]}-500/30`;
};

export const TAG_STYLES: Record<string, string> = {
    'special': 'text-indigo-400',
    'unblockable': 'text-purple-400 font-bold uppercase tracking-wider',
    'special_unblockable': 'text-fuchsia-400 font-bold uppercase tracking-wider',
    'active': 'text-green-400',
    'active_special': 'text-emerald-400',
    'used': 'text-slate-500 italic',
    'locked': 'text-red-400',
    'passive': 'text-slate-400'
};

export const getTagLabel = (value: string) => TAG_OPTIONS.find(t => t.value === value)?.label || value;
export const getTagColor = (value: string) => TAG_STYLES[value] || 'text-slate-300';

// --- RARITY STYLES ---
export const RARITY_STYLES: Record<string, { text: string, border: string, bg: string, glow: string, gradient: string }> = {
    normal: { 
        text: 'text-slate-300', 
        border: 'border-slate-700', 
        bg: 'bg-slate-900', 
        glow: '',
        gradient: 'from-slate-900 to-slate-950'
    },
    exotic: { 
        text: 'text-cyan-300', 
        border: 'border-cyan-500/50', 
        bg: 'bg-cyan-950/20', 
        glow: 'shadow-[0_0_15px_-5px_rgba(34,211,238,0.2)]',
        gradient: 'from-cyan-950/40 to-slate-950'
    },
    epic: { 
        text: 'text-[#fbbf24]', 
        border: 'border-[#f59e0b]/50', 
        bg: 'bg-amber-950/20', 
        glow: 'shadow-[0_0_15px_-5px_rgba(251,191,36,0.2)]',
        gradient: 'from-amber-950/40 to-slate-950'
    },
    legendary: { 
        text: 'text-[#e879f9]', 
        border: 'border-[#d946ef]/50', 
        bg: 'bg-fuchsia-950/20', 
        glow: 'shadow-[0_0_15px_-5px_rgba(232,121,249,0.3)]',
        gradient: 'from-fuchsia-950/40 to-slate-950'
    }
};

export const getRarityStyle = (rarity?: Rarity | string) => {
    return RARITY_STYLES[rarity || 'normal'] || RARITY_STYLES['normal'];
};

export const getRarityColor = (rarity?: Rarity | string): string => {
    return getRarityStyle(rarity).text;
};

// --- CALCULATORS ---

export const calculateEnhancedStats = (mod: Modifier, context: any, item: Entity, upgradeBonus: number = 0): { base: number, enhanced: number, bonus: number } => {
    // Délégation complète au moteur engine.ts
    // Cela utilise les mêmes règles d'évaluation que le calcul global du personnage
    const { enhanced, base } = resolveItemPreview(item, mod, context, upgradeBonus);

    // Application des Overrides visuels "En direct" pour refléter les bonus de classe
    // Ces bonus sont appliqués en tant que bonus de JOUEUR dans engine.ts (ex: Archers +100%)
    // Mais pour l'infobulle, on veut montrer la valeur finale de l'objet.
    
    let finalEnhancedValue = enhanced;
    const sub = item.subCategory || '';
    const spec = context.specializationId;
    const stat = mod.targetStatKey;
    const boosters = 1 + ((context.effect_booster || 0)/100) + ((context.special_mastery || 0)/100);

    // LOGIQUE VISUELLE SEULEMENT (Pour refléter les bonus globaux sur l'item spécifique)
    // 1. SET HÉGÉMONIE
    if (context && context.equippedItems) {
        let setPieces = 0;
        const items = typeof context.equippedItems === 'object' ? Object.values(context.equippedItems) : [];
        items.forEach((id: any) => { if (['heg_chest', 'heg_head', 'heg_legs'].includes(id)) setPieces++; });

        if (setPieces >= 3 && ['Dagues', 'Griffes', 'Arcs', 'Arbalètes'].includes(sub)) {
            const rawPP = context.political_points ?? context.political_points_input ?? 0;
            const pp = Math.min(Math.max(0, rawPP), 200);
            if (pp > 0 && stat === 'dmg') {
                finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (pp / 100)));
            }
        }
    }

    // 2. ARCHERS (Base Class Bonus + Spec)
    if (stat === 'dmg' && ['Arcs', 'Arbalètes', 'Frondes'].includes(sub)) {
        if (context.classId === 'archers') {
            let archerMultiplier = 2; // +100% Base
            if (spec === 'spec_oeil_faucon') archerMultiplier += 0.25 * boosters;
            finalEnhancedValue = Math.ceil(base * archerMultiplier); // Use BASE for cleaner multiplication
        }
    }

    // 3. Spécialisations diverses
    if (spec === 'spec_chevalier' && stat === 'dmg' && (sub === 'Épées' || sub === 'Lances')) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }
    if (spec === 'spec_celerite' && stat === 'spd' && (sub === 'Griffes' || sub === 'Frondes')) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }
    if (spec === 'spec_croise' && stat === 'vit' && (sub.includes('Bouclier') || sub.includes('Fléaux'))) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }
    if (spec === 'spec_poing_ki' && stat === 'dmg' && sub === 'Cestes') {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * 1.10); 
    }
    if (spec === 'spec_anticipation_sauvage' && stat === 'vit' && item.equipmentCost && item.equipmentCost >= 2) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.33 * boosters)));
    }
    // Virtuoses - Maître de l'air
    if (spec === 'spec_maitre_air' && sub.startsWith('Instrument') && ['vit', 'spd', 'dmg'].includes(stat)) {
        const capMod = item.modifiers?.find(m => m.targetStatKey === 'partition_cap');
        if (capMod) {
            const capVal = evaluateFormula(capMod.value, context); // Use clean context for check
            if (capVal >= 7) {
                finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.5 * boosters)));
            }
        }
    }

    return { 
        base: base, 
        enhanced: finalEnhancedValue, 
        bonus: finalEnhancedValue - base 
    };
};

export const AnimatedCounter = ({ value, className, precision = 0 }: { value: number, className?: string, precision?: number }) => {
    const [displayValue, setDisplayValue] = useState(value);
    useEffect(() => {
        let start = displayValue;
        let end = value;
        if (start === end) return;
        const duration = 500;
        const startTime = performance.now();
        let animationFrameId: number;
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * ease;
            setDisplayValue(current);
            if (progress < 1) animationFrameId = requestAnimationFrame(animate);
            else setDisplayValue(end);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [value]);
    const formatted = precision > 0 ? displayValue.toFixed(precision) : Math.ceil(displayValue).toString();
    return <span className={className}>{formatted}</span>;
}

export const parseRichText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\^\^.*?\^\^|\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('^^') && part.endsWith('^^')) {
            const cleanVal = part.slice(2, -2).trim(); 
            const num = parseFloat(cleanVal.replace(/[^0-9.-]/g, ''));
            if (!isNaN(num) && Math.abs(num) < 0.01) return null;
            return <span key={index} className="text-emerald-400 font-bold ml-1">{cleanVal}</span>;
        } else if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={index} className="text-white font-bold">{part.slice(2, -2).trim()}</span>;
        }
        return <span key={index}>{part}</span>;
    });
};

export const CollapsibleDescription: React.FC<{ block: { tag?: string, title?: string, text: string, isCollapsible?: boolean } }> = ({ block }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!block.isCollapsible) {
        return (
            <div className="mb-2 last:mb-0">
                {block.tag && <span className={`${getTagColor(block.tag)} text-[10px] mr-1.5`}>{getTagLabel(block.tag)}</span>}
                {block.title && <span className="text-xs font-bold text-slate-200 mr-1">{block.title} :</span>}
                <span className="text-xs text-slate-400 italic leading-relaxed">{parseRichText(block.text)}</span>
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
                <p className="text-xs text-slate-400 italic leading-relaxed py-1">{parseRichText(block.text)}</p>
            </div>
        </div>
    );
};
