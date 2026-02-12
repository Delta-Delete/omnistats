
import React from 'react';
import { Heart, Zap, Sword, Coins, Activity } from 'lucide-react';
import { CalculationResult, StatResult } from '../../types';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface StickyStatsHUDProps {
    result: CalculationResult;
    totalGold: number;
    isVisible: boolean;
}

export const StickyStatsHUD: React.FC<StickyStatsHUDProps> = ({ result, totalGold, isVisible }) => {
    if (!isVisible) return null;

    const getStatVal = (key: string) => (result.stats[key] as StatResult | undefined)?.finalValue || 0;

    const stats = [
        { label: 'VIT', val: getStatVal('vit'), icon: Heart, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/40' },
        { label: 'SPD', val: getStatVal('spd'), icon: Zap, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/40' },
        { label: 'DMG', val: getStatVal('dmg'), icon: Sword, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/40' },
    ];

    const abs = getStatVal('absorption');

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none animate-in slide-in-from-top-full duration-300">
            <div className="bg-slate-950/80 backdrop-blur-md border-b border-x border-slate-700/50 rounded-b-xl px-6 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-4 pointer-events-auto mt-0">
                
                {/* PRIMARY STATS */}
                <div className="flex gap-2">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${stat.border} ${stat.bg}`}>
                            <stat.icon size={14} className={stat.color} fill="currentColor" fillOpacity={0.2} />
                            <div className="flex flex-col leading-none">
                                <span className={`text-[10px] font-bold opacity-70 ${stat.color}`}>{stat.label}</span>
                                <span className="text-sm font-bold text-white font-mono min-w-[30px]">
                                    <AnimatedCounter value={stat.val} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ABSORPTION (Conditionnel) */}
                {abs > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-500/30 bg-violet-950/40">
                        <Activity size={14} className="text-violet-400" />
                        <span className="text-xs font-bold text-violet-200 font-mono">{abs}% Abs</span>
                    </div>
                )}

                {/* SEPARATOR */}
                <div className="w-px h-8 bg-slate-700 hidden sm:block"></div>

                {/* GOLD */}
                <div className="hidden sm:flex items-center gap-2">
                    <div className="bg-yellow-950/30 p-1.5 rounded-full border border-yellow-500/30">
                        <Coins size={14} className="text-yellow-500" />
                    </div>
                    <span className="text-sm font-bold text-yellow-200 font-mono">
                        <AnimatedCounter value={totalGold} /> Po
                    </span>
                </div>

            </div>
        </div>
    );
};
