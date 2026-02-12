
import { Heart, Activity, Sword, Shield, Zap, Sparkles, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { TAG_OPTIONS } from '../../services/data';
import { Rarity } from '../../types';

// --- TEXT UTILS ---

export const toFantasyTitle = (text: string): string => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .toUpperCase();
};

// Configuration centrale pour l'affichage des stats
export const STAT_CONFIG: Record<string, { label: string, shortLabel: string, color: string, icon: any, bg: string }> = {
    vit: { label: 'VIT', shortLabel: 'HP', color: 'text-emerald-400', icon: Heart, bg: 'bg-emerald-500/10' },
    spd: { label: 'SPD', shortLabel: 'SPD', color: 'text-amber-400', icon: Zap, bg: 'bg-amber-500/10' }, 
    dmg: { label: 'DMG', shortLabel: 'DMG', color: 'text-rose-400', icon: Sword, bg: 'bg-rose-500/10' },
    crit_primary: { label: 'CRIT', shortLabel: 'CRT', color: 'text-purple-400', icon: Star, bg: 'bg-purple-500/10' },
    crit_secondary: { label: 'C.MAX', shortLabel: 'MAX', color: 'text-fuchsia-400', icon: Sparkles, bg: 'bg-fuchsia-500/10' },
    res: { label: 'RES', shortLabel: 'RES', color: 'text-blue-300', icon: Shield, bg: 'bg-blue-500/10' },
    aura: { label: 'AURA', shortLabel: 'AUR', color: 'text-cyan-300', icon: Zap, bg: 'bg-cyan-500/10' },
    absorption: { label: 'ABS', shortLabel: 'ABS', color: 'text-violet-400', icon: AlertCircle, bg: 'bg-violet-500/10' },
    renvois_degats: { label: 'RENVOI', shortLabel: 'RFL', color: 'text-orange-400', icon: RefreshCw, bg: 'bg-orange-500/10' }
};

export const getStatConfig = (key: string) => {
    return STAT_CONFIG[key] || { label: key.substring(0,3).toUpperCase(), shortLabel: key.substring(0,3).toUpperCase(), color: 'text-slate-400', icon: Activity, bg: 'bg-slate-600/10' };
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
