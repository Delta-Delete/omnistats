
import React, { useState, useMemo } from 'react';
import { Activity, Sword, Zap, Crosshair, Eye, EyeOff, Info, Scroll, Users, BarChart3, Radar, Coins, Heart } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import { CalculationResult, StatDefinition, StatResult, StatDetail, EntityType, Entity } from '../../types';
import { getStatStyle, getTagLabel, getTagColor, getStatConfig, toFantasyTitle } from './utils';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { CollapsibleDescription } from '../ui/RichText';

interface DescriptionItem {
    id: string;
    name: string;
    textBlocks: { tag?: string; title?: string; text: string; isCollapsible?: boolean }[];
    specialEffects: { tag?: string; val: string; stat: string }[];
    type: string;
}

interface CharacterSheetProps {
    result: CalculationResult;
    stats: StatDefinition[];
    activeDescriptions: DescriptionItem[];
    activeEntities: Entity[];
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ result, stats, activeDescriptions, activeEntities }) => {
    const [showHiddenStats, setShowHiddenStats] = useState(false);
    const [viewMode, setViewMode] = useState<'radar' | 'bars'>('radar');

    // --- Computed Visual Data ---
    const chartStats = useMemo(() => stats.filter(s => ['vit', 'spd', 'dmg'].includes(s.key)), [stats]);
    
    // Calculate Max values for scaling (dynamic soft caps for visualization)
    const maxValues = useMemo(() => {
        return {
            vit: Math.max(2000, (result.stats['vit']?.finalValue || 0) * 1.2),
            spd: Math.max(500, (result.stats['spd']?.finalValue || 0) * 1.2),
            dmg: Math.max(500, (result.stats['dmg']?.finalValue || 0) * 1.2)
        };
    }, [result.stats]);

    const chartData = useMemo(() => {
        return chartStats.map(s => ({ 
            subject: getStatConfig(s.key).shortLabel, // Use shared config for labels
            A: (result.stats[s.key] as StatResult | undefined)?.finalValue || 0, 
            fullMark: maxValues[s.key as keyof typeof maxValues] || 100 
        }));
    }, [chartStats, result.stats, maxValues]);

    const visibleStats = useMemo(() => {
        return stats.filter(s => { 
            // 1. Strict priority to the toggle
            if (showHiddenStats) return true; 
            
            // 2. Hide anything marked as Hidden if toggle is off
            if (s.group === 'Hidden') return false; 

            // 3. Exclude Main Stats (handled in the top widgets)
            if (['vit', 'spd', 'dmg', 'absorption'].includes(s.key)) return false; 
            if (['crit_primary', 'crit_secondary'].includes(s.key)) return false; 
            
            // 4. Hide zero values to keep UI clean
            const statRes = result.stats[s.key] as StatResult | undefined; 
            const val = statRes?.finalValue || 0; 
            if (Math.abs(val) < 0.01) return false;
            
            return true; 
        });
    }, [stats, showHiddenStats, result.stats]);

    const critPrimary = result.stats['crit_primary'] as StatResult | undefined;
    const critSecondary = result.stats['crit_secondary'] as StatResult | undefined;
    
    const showSecondaryCrit = critSecondary && (
        (critSecondary.finalValue > (critPrimary?.finalValue || 0)) || 
        showHiddenStats
    );

    const totalSummonSpeed = useMemo(() => {
        return result.activeSummons.reduce((acc, s) => acc + (s.stats.spd * s.count), 0);
    }, [result.activeSummons]);

    const totalTeamSpeed = (result.stats['spd']?.finalValue || 0) + totalSummonSpeed;

    // Calculate Total Gold Cost from active entities
    const totalGoldCost = useMemo(() => {
        return activeEntities
            .filter(e => e.type === EntityType.ITEM)
            .reduce((acc, item) => acc + (item.goldCost || 0), 0);
    }, [activeEntities]);

    const renderVal = (val: number, isPercent = false, forcePlus = false) => {
        if (Math.abs(val) < 0.01) return isPercent ? '0%' : '0';
        const formatted = parseFloat(val.toFixed(2));
        const sign = (forcePlus && formatted > 0) ? '+' : '';
        return `${sign}${formatted}${isPercent ? '%' : ''}`;
    };

    const renderPerTurn = (stat: StatResult | undefined, colorClass: string) => {
        if (!stat) return null;
        const flat = stat.perTurn || 0;
        const pct = stat.perTurnPercent || 0;
        if (flat === 0 && pct === 0) return null;
        
        return (
            <span className={`${colorClass} font-bold ml-1 text-[9px]`}>
                {flat !== 0 ? (flat > 0 ? `+${flat}` : `${flat}`) : ''}
                {flat !== 0 && pct !== 0 ? ' & ' : ''}
                {pct !== 0 ? (pct > 0 ? `+${pct}%` : `${pct}%`) : ''}
                /tr
            </span>
        );
    };

    const renderDetailList = (list: StatDetail[] | undefined, color: string) => {
        if (!list || list.length === 0) return null;
        return (
            <div className={`pl-2 border-l-2 ${color.replace('text-', 'border-')} mt-1 mb-2 space-y-0.5`}>
                {list.map((item, i) => (
                    <div key={i} className="flex justify-between text-[9px] text-slate-400">
                        <span className="truncate max-w-[140px]" title={item.source}>{item.source}</span>
                        <span className="font-mono text-slate-300">{item.value > 0 ? '+' : ''}{parseFloat(item.value.toFixed(2))}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* STATS OVERVIEW PANEL */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-perrigord text-white flex items-center tracking-wide">
                        <Activity size={20} className="mr-2 text-indigo-400" /> {toFantasyTitle("Aperçu Global")}
                    </h3>
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button 
                            onClick={() => setViewMode('radar')}
                            className={`p-1.5 rounded transition-all ${viewMode === 'radar' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Vue Radar"
                        >
                            <Radar size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('bars')}
                            className={`p-1.5 rounded transition-all ${viewMode === 'bars' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Vue Barres (Stats Brutes)"
                        >
                            <BarChart3 size={16} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
                        <div className="bg-slate-950/50 border border-emerald-500/30 p-3 rounded-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Vitalité</span>
                                <Heart size={14} className="text-emerald-500/40" />
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight">
                                <AnimatedCounter value={result.stats['vit']?.finalValue || 0} />
                            </div>
                            <div className="text-[9px] text-slate-500 flex justify-between items-center">
                                <span>Base {result.stats['vit']?.base} <span className="text-emerald-500">+{result.stats['vit']?.finalValue - result.stats['vit']?.base}</span></span>
                                {renderPerTurn(result.stats['vit'], 'text-emerald-400')}
                            </div>
                        </div>
                        <div className="bg-slate-950/50 border border-amber-500/30 p-3 rounded-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Vitesse</span>
                                <Zap size={14} className="text-amber-500/40" />
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight">
                                <AnimatedCounter value={result.stats['spd']?.finalValue || 0} />
                            </div>
                            <div className="text-[9px] text-slate-500 flex justify-between items-center">
                                <span>Base {result.stats['spd']?.base} <span className="text-amber-500">+{result.stats['spd']?.finalValue - result.stats['spd']?.base}</span></span>
                                {renderPerTurn(result.stats['spd'], 'text-amber-400')}
                            </div>
                            {totalSummonSpeed > 0 && (
                                <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between animate-in fade-in slide-in-from-bottom-1">
                                    <span className="text-[9px] font-bold text-amber-200/70 uppercase tracking-wider flex items-center" title="Vitesse cumulée (Joueur + Invocations)">
                                        <Users size={10} className="mr-1" /> Total Équipe
                                    </span>
                                    <span className="text-sm font-mono font-bold text-amber-300">
                                        {totalTeamSpeed}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-950/50 border border-rose-500/30 p-3 rounded-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Dégâts</span>
                                <Sword size={14} className="text-rose-500/40" />
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight">
                                <AnimatedCounter value={result.stats['dmg']?.finalValue || 0} />
                            </div>
                            <div className="text-[9px] text-slate-500 flex justify-between items-center">
                                <span>Base {result.stats['dmg']?.base} <span className="text-rose-500">+{result.stats['dmg']?.finalValue - result.stats['dmg']?.base}</span></span>
                                {renderPerTurn(result.stats['dmg'], 'text-rose-400')}
                            </div>
                            {result.stats['absorption']?.finalValue > 0 && (
                                <div className="mt-2 pt-2 border-t border-rose-500/20 flex items-center justify-between animate-in fade-in slide-in-from-bottom-1">
                                    <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider flex items-center">
                                        <Activity size={10} className="mr-1" /> Absorption
                                    </span>
                                    <span className="text-sm font-mono font-bold text-violet-300">
                                        {result.stats['absorption']?.finalValue}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-950/50 border border-purple-500/30 p-3 rounded-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Critique</span>
                                <Crosshair size={14} className="text-purple-500/40" />
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    <AnimatedCounter value={critPrimary?.finalValue || 0} />
                                </span>
                                <span className="text-xs text-slate-500 ml-1">%</span>
                            </div>
                            {showSecondaryCrit && (
                                <div className="text-[9px] text-fuchsia-400">Max: {critSecondary?.finalValue}%</div>
                            )}
                        </div>
                    </div>
                    
                    {/* VISUALIZATION CONTAINER */}
                    <div className="w-full sm:w-1/3 min-w-0 flex flex-col gap-2">
                        <div className="flex-1 bg-slate-950/30 rounded-lg border border-slate-800 flex items-center justify-center relative p-2 overflow-hidden h-40">
                            {viewMode === 'radar' ? (
                                <>
                                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                            <PolarGrid stroke="#334155" strokeWidth={0.5} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                            <RechartsRadar name="Stats" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#6366f1" fillOpacity={0.4} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col justify-center space-y-2 px-2">
                                    {['vit', 'spd', 'dmg'].map(key => {
                                        const statRes = result.stats[key] as StatResult | undefined;
                                        if (!statRes) return null;

                                        const bd = statRes.breakdown;
                                        const val = Math.ceil((bd.base + bd.flat) * (1 + (bd.percentAdd / 100)));

                                        const max = maxValues[key as keyof typeof maxValues] || 100;
                                        const percent = Math.min(100, (val / max) * 100);
                                        
                                        let color = 'bg-slate-500';
                                        if(key === 'vit') color = 'bg-emerald-500';
                                        if(key === 'spd') color = 'bg-amber-500';
                                        if(key === 'dmg') color = 'bg-rose-500';

                                        return (
                                            <div key={key} className="w-full">
                                                <div className="flex justify-between text-[9px] uppercase font-bold mb-0.5">
                                                    <span className="text-slate-400">{key}</span>
                                                    <span className="text-white">{val}</span>
                                                </div>
                                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        
                        {/* TOTAL GOLD DISPLAY */}
                        <div className="flex items-center justify-between bg-black/40 border border-yellow-500/20 rounded-lg p-2 px-3">
                            <div className="flex items-center text-xs font-bold text-yellow-500 uppercase tracking-wide">
                                <Coins size={14} className="mr-2" /> Valeur Équipement
                            </div>
                            <div className="font-mono text-sm font-bold text-yellow-300">
                                {totalGoldCost} Po
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECAP EFFECTS */}
            {activeDescriptions && activeDescriptions.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 bg-slate-800/30 border-b border-slate-800 flex items-center">
                        <Scroll size={20} className="mr-2 text-yellow-500" />
                        <h3 className="text-lg font-perrigord text-white tracking-wide">{toFantasyTitle("Récapitulatif des Effets")}</h3>
                    </div>
                    <div className="p-4 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                        {activeDescriptions.map(ent => {
                            const showHeader = ent.type !== EntityType.GLOBAL_RULE;
                            
                            return (
                                <div key={ent.id} className={`relative ${showHeader ? 'pl-4 border-l-2 border-slate-700' : ''}`}>
                                    {showHeader && <h4 className="text-xs font-bold text-slate-300 mb-0.5">{ent.name}</h4>}
                                    {ent.textBlocks.map((block, i) => (
                                        <CollapsibleDescription key={i} block={block} />
                                    ))}
                                    {ent.specialEffects && ent.specialEffects.length > 0 && (
                                        <div className="space-y-1 mt-1.5">
                                            {ent.specialEffects.map((eff, i) => (
                                                <div key={i} className="text-[10px] font-mono">
                                                    <span className={`${getTagColor(eff.tag || '')} font-bold`}>
                                                        {getTagLabel(eff.tag || '')}
                                                    </span>
                                                    <span className="text-slate-500"> : </span>
                                                    <span className="text-slate-300">{Number(eff.val) > 0 ? '+' : ''}{eff.val} {eff.stat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* OTHER STATS LIST */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between rounded-t-xl bg-slate-800/20">
                    <div className="flex items-center">
                        <Sword size={20} className="mr-2 text-indigo-400" />
                        <h3 className="text-lg font-perrigord text-white tracking-wide">{toFantasyTitle("Autres Statistiques")}</h3>
                    </div>
                    <button 
                        onClick={() => setShowHiddenStats(!showHiddenStats)} 
                        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${showHiddenStats ? 'text-indigo-400' : 'text-slate-600'}`}
                    >
                        {showHiddenStats ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
                <div className="divide-y divide-slate-800">
                    {visibleStats.map((stat, index) => {
                        const res = result.stats[stat.key];
                        if (!res) return null;

                        const typedRes = res as unknown as StatResult;
                        const bd = typedRes.breakdown;
                        const isHidden = stat.group === 'Hidden';
                        const isLast = index === visibleStats.length - 1;
                        const traces: string[] = typedRes.trace || [];
                        return (
                            <div key={stat.id} className={`group px-3 py-2 hover:bg-slate-800/50 transition-colors flex flex-col justify-center ${isHidden ? 'bg-slate-900/40 border-l-2 border-l-indigo-500/50' : ''} ${isLast ? 'rounded-b-xl' : ''}`}>
                                <div className="flex justify-between items-center mb-0.5">
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-xs ${getStatStyle(stat.key).split(' ')[0]} ${isHidden ? 'opacity-80 font-mono' : ''}`}>{stat.label}</span>
                                        <span className="text-[8px] text-slate-500 uppercase tracking-wider">{stat.group}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-lg font-bold tracking-tight ${isHidden ? 'text-indigo-400/80' : 'text-white'}`}>
                                            <AnimatedCounter value={typedRes.finalValue} precision={2} />
                                        </span>
                                        <div className="relative">
                                            <Info size={14} className="text-slate-700 hover:text-slate-500 cursor-help transition-colors" />
                                            <div className="absolute right-0 top-5 w-80 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 hidden group-hover:block max-h-[80vh] overflow-y-auto custom-scrollbar">
                                                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-1 mb-2">Détail: {stat.label}</h4>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] mb-2">
                                                    <div className="text-slate-500 font-bold" title="Statistique de Base + Bonus de Race">Base (Inné/Race):</div>
                                                    <div className="text-right text-slate-300">
                                                        {renderVal(bd.base)}
                                                        {renderDetailList(typedRes.detailedBase, 'text-slate-500')}
                                                    </div>
                                                    
                                                    <div className="text-blue-400 font-bold" title="Bonus fixe provenant de la Classe, des Objets, Buffs et Spécialisations">Bonus Fixe (Classe/Items):</div>
                                                    <div className="text-right text-blue-200 font-mono">
                                                        {renderVal(bd.flat, false, true)}
                                                        {renderDetailList(typedRes.detailedFlat, 'text-blue-400')}
                                                    </div>
                                                    
                                                    <div className="text-green-400">Total % Add:</div>
                                                    <div className="text-right text-green-200">{renderVal(bd.percentAdd, true, true)}</div>
                                                    
                                                    <div className="text-sky-400">Multi. Pré-Posture:</div>
                                                    <div className="text-right text-sky-200">{renderVal(bd.percentMultiPre, true, true)}</div>
                                                    
                                                    <div className="text-amber-500">Post-Additive:</div>
                                                    <div className="text-right text-amber-200">{renderVal(bd.finalAdditivePercent, true, true)}</div>
                                                    
                                                    <div className="text-yellow-400">Alt Fixe:</div>
                                                    <div className="text-right text-yellow-200">{renderVal(bd.altFlat, false, true)}</div>
                                                    
                                                    <div className="text-purple-400">Alt Multi:</div>
                                                    <div className="text-right text-purple-200">{renderVal(bd.altPercent, true, true)}</div>
                                                </div>
                                                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                                    <p className="text-[9px] font-mono text-slate-500 mb-1">JOURNAL DE TRACE:</p>
                                                    <ul className="text-[9px] text-slate-400 space-y-0.5 max-h-40 overflow-y-auto custom-scrollbar">
                                                        {traces.map((t, i) => (<li key={i} className="font-mono break-words whitespace-pre-wrap">{t}</li>))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
