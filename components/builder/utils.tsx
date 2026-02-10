
import React, { useState, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { TAG_OPTIONS } from '../../services/data';
import { evaluateFormula } from '../../services/engine';
import { Entity, Modifier, Rarity, ModifierType } from '../../types';

// --- TEXT UTILS ---

export const toFantasyTitle = (text: string): string => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .toUpperCase();
};

export const STAT_COLORS: Record<string, string> = {
    vit: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    spd: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    dmg: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    crit_primary: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    crit_secondary: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
    aura: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    res: 'text-blue-300 border-blue-500/30 bg-blue-500/10',
    partition_cap: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    absorption: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    renvois_degats: 'text-orange-400 border-orange-500/30 bg-orange-500/10'
};

export const getStatStyle = (key: string) => STAT_COLORS[key] || 'text-slate-400 border-slate-600/30 bg-slate-600/10';

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

// --- RARITY STYLES (NEW SYSTEM) ---
export const RARITY_STYLES: Record<string, { text: string, border: string, bg: string, glow: string }> = {
    normal: { 
        text: 'text-slate-300', 
        border: 'border-slate-600', 
        bg: 'bg-slate-900', 
        glow: '' 
    },
    exotic: { 
        text: 'text-cyan-300', 
        border: 'border-cyan-500/70', 
        bg: 'bg-cyan-950/20', 
        glow: 'shadow-[0_0_15px_-5px_rgba(34,211,238,0.3)]' 
    },
    epic: { 
        text: 'text-[#fbbf24]', // Amber-400
        border: 'border-[#f59e0b]/70', 
        bg: 'bg-amber-950/20', 
        glow: 'shadow-[0_0_15px_-5px_rgba(251,191,36,0.3)]' 
    },
    legendary: { 
        text: 'text-[#e879f9]', // Fuchsia-400
        border: 'border-[#d946ef]/70', 
        bg: 'bg-fuchsia-950/20', 
        glow: 'shadow-[0_0_15px_-5px_rgba(232,121,249,0.4)]' 
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
    
    // 1. Calculate Standard Value (Current Context)
    const safeUpgradeBonus = (mod.type === ModifierType.FLAT) ? upgradeBonus : 0;

    let standardValue = 0;
    
    const multPattern = /^(\d+)\s*\*\s*([a-zA-Z_0-9]+)$/;
    const match = mod.value.match(multPattern);

    if (match && safeUpgradeBonus > 0) {
        const baseVal = parseFloat(match[1]);
        const variable = match[2];
        const multiplier = context[variable] || 1; 
        
        standardValue = Math.ceil((baseVal + safeUpgradeBonus) * multiplier);
    } else {
        try {
            standardValue = Math.ceil(evaluateFormula(mod.value, context));
        } catch (e) { standardValue = 0; }
        standardValue += safeUpgradeBonus;
    }

    // 2. Calculate Raw Base Value (Stripped Context)
    const strippedContext = {
        ...context,
        weapon_effect_mult: 1,      
        mult_lance_dmg: 1,          
        turret_mult: 1,             
        partition_mult: 1,          
        seal_potency: 0, 
        effect_booster: 0,
        special_mastery: 0,
        enchantment_mult: context.enchantment_mult || 1 
    };

    let rawBaseValue = 0;
    
    if (match && safeUpgradeBonus > 0) {
        const baseVal = parseFloat(match[1]);
        const multiplier = strippedContext[match[2]] || 1; 
        rawBaseValue = Math.ceil((baseVal + safeUpgradeBonus) * multiplier);
    } else {
        try {
            rawBaseValue = Math.ceil(evaluateFormula(mod.value, strippedContext));
        } catch (e) { rawBaseValue = 0; }
        
        // Defensive check: If rawBase is 0 but standard is not, and the formula starts with a number,
        // it means evaluating with stripped context failed (e.g. division by 0 or complex logic).
        // We try to extract the static base number.
        if (rawBaseValue === 0 && standardValue !== 0) {
            const staticMatch = mod.value.match(/^(\d+)/);
            if (staticMatch) {
                rawBaseValue = parseInt(staticMatch[1], 10);
            }
        }

        rawBaseValue += safeUpgradeBonus;
    }

    let finalEnhancedValue = standardValue;

    // 3. Apply External Class & Set Rules (Visual Overrides)
    
    const sub = item.subCategory || '';
    const spec = context.specializationId;
    const stat = mod.targetStatKey;
    const boosters = 1 + ((context.effect_booster || 0)/100) + ((context.special_mastery || 0)/100);

    // --- SET HÉGÉMONIE (Machiavel) ---
    if (context && context.equippedItems) {
        let setPieces = 0;
        const items = typeof context.equippedItems === 'object' ? Object.values(context.equippedItems) : [];
        items.forEach((id: any) => {
            if (['heg_chest', 'heg_head', 'heg_legs'].includes(id)) setPieces++;
        });

        if (setPieces >= 3) {
            const allowed = ['Dagues', 'Griffes', 'Arcs', 'Arbalètes'];
            if (allowed.includes(sub)) {
                const rawPP = context.political_points ?? context.political_points_input ?? 0;
                const pp = Math.min(Math.max(0, rawPP), 200);
                
                if (pp > 0) {
                    const factor = 1 + (pp / 100);
                    if (stat === 'dmg') {
                        finalEnhancedValue = Math.ceil(finalEnhancedValue * factor);
                    }
                }
            }
        }
    }

    // --- ARCHERS (Maîtrise & Œil de Faucon) ---
    if (stat === 'dmg' && ['Arcs', 'Arbalètes', 'Frondes'].includes(sub)) {
        if (context.classId === 'archers') {
            let archerMultiplier = 2; // Class Passive (+100%)
            if (spec === 'spec_oeil_faucon') {
                archerMultiplier += 0.25 * boosters; 
            }
            
            let valWithClass = Math.ceil(rawBaseValue * archerMultiplier);
            
            if (context && context.equippedItems) {
                 let setPieces = 0;
                 const items = typeof context.equippedItems === 'object' ? Object.values(context.equippedItems) : [];
                 items.forEach((id: any) => { if (['heg_chest', 'heg_head', 'heg_legs'].includes(id)) setPieces++; });
                 if (setPieces >= 3) {
                     const rawPP = context.political_points ?? context.political_points_input ?? 0;
                     const pp = Math.min(Math.max(0, rawPP), 200);
                     if (pp > 0) {
                         const factor = 1 + (pp / 100);
                         valWithClass = Math.ceil(valWithClass * factor); 
                     }
                 }
            }
            finalEnhancedValue = valWithClass;
        }
    }

    // --- GUERRIERS (Chevalier) ---
    if (spec === 'spec_chevalier' && stat === 'dmg' && (sub === 'Épées' || sub === 'Lances')) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }

    // --- GUETTEURS (Célérité) ---
    if (spec === 'spec_celerite' && stat === 'spd' && (sub === 'Griffes' || sub === 'Frondes')) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }

    // --- VIRTUOSES (Maître de l'air) ---
    if (spec === 'spec_maitre_air' && sub.startsWith('Instrument') && ['vit', 'spd', 'dmg'].includes(stat)) {
        const capMod = item.modifiers?.find(m => m.targetStatKey === 'partition_cap');
        if (capMod) {
            const capVal = evaluateFormula(capMod.value, strippedContext);
            if (capVal >= 7) {
                finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.5 * boosters)));
            }
        }
    }

    // --- CONJURATEURS (Aura Inquisitoriale) ---
    if (spec === 'spec_aura_inquisitoriale' && sub === 'Lances' && stat === 'dmg') {
        if (!mod.value.includes('mult_lance_dmg')) {
             finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
        }
    }

    // --- PALADINS (Croisé) ---
    if (spec === 'spec_croise' && stat === 'vit' && (sub.includes('Bouclier') || sub.includes('Fléaux'))) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }

    // --- PUGILISTES (Poing de Ki) ---
    if (spec === 'spec_poing_ki' && stat === 'dmg' && sub === 'Cestes') {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * 1.10); 
    }

    // --- BARBARES (Anticipation Sauvage) ---
    if (spec === 'spec_anticipation_sauvage' && stat === 'vit' && item.equipmentCost && item.equipmentCost >= 2) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.33 * boosters)));
    }

    return { 
        base: rawBaseValue, 
        enhanced: finalEnhancedValue, 
        bonus: finalEnhancedValue - rawBaseValue 
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
            const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            
            const current = start + (end - start) * ease;
            
            setDisplayValue(current);
            
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setDisplayValue(end); // Ensure exact final value
            }
        };
        
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [value]);

    const formatted = precision > 0 
        ? displayValue.toFixed(precision) 
        : Math.ceil(displayValue).toString();

    return <span className={className}>{formatted}</span>;
}

export const parseRichText = (text: string) => {
    if (!text) return null;
    
    // Split by markers for ^^...^^ and **...**
    // The capture groups allow us to keep the delimiters in the array to process them
    const parts = text.split(/(\^\^.*?\^\^|\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
        // Matches ^^ +10% ^^
        if (part.startsWith('^^') && part.endsWith('^^')) {
            const cleanVal = part.slice(2, -2).trim(); 
            // Check if value is numerically zero or close to it
            const num = parseFloat(cleanVal.replace(/[^0-9.-]/g, ''));
            if (!isNaN(num) && Math.abs(num) < 0.01) {
                return null; // Don't render +0%
            }
            return <span key={index} className="text-emerald-400 font-bold ml-1">{cleanVal}</span>;
        } 
        // Matches ** Bold Text **
        else if (part.startsWith('**') && part.endsWith('**')) {
            const cleanVal = part.slice(2, -2).trim(); 
            return <span key={index} className="text-white font-bold">{cleanVal}</span>;
        }
        // Regular Text
        return <span key={index}>{part}</span>;
    });
};

export const CollapsibleDescription: React.FC<{ block: { tag?: string, title?: string, text: string, isCollapsible?: boolean } }> = ({ block }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!block.isCollapsible) {
        return (
            <div className="mb-2 last:mb-0">
                {block.tag && (
                    <span className={`${getTagColor(block.tag)} text-[10px] mr-1.5`}>
                        {getTagLabel(block.tag)}
                    </span>
                )}
                {block.title && (
                    <span className="text-xs font-bold text-slate-200 mr-1">
                        {block.title} :
                    </span>
                )}
                <span className="text-xs text-slate-400 italic leading-relaxed">
                    {parseRichText(block.text)}
                </span>
            </div>
        );
    }

    return (
        <div className="mb-2 last:mb-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center text-left w-full group focus:outline-none"
            >
                <ChevronRight 
                    size={14} 
                    className={`text-slate-500 group-hover:text-white mr-1.5 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} 
                />
                <div className="flex-1">
                    {block.tag && (
                        <span className={`${getTagColor(block.tag)} text-[10px] mr-1.5`}>
                            {getTagLabel(block.tag)}
                        </span>
                    )}
                    <span className={`text-xs font-bold ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'} transition-colors`}>
                        {block.title || 'Détails'}
                    </span>
                </div>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out pl-6 border-l border-slate-800 ml-1.5 ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-xs text-slate-400 italic leading-relaxed py-1">
                    {parseRichText(block.text)}
                </p>
            </div>
        </div>
    );
};
