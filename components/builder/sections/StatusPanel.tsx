import React from 'react';
import { Flag, ToggleRight, ToggleLeft, CircleCheck, Circle, Users, Star, Globe, Lock, EyeOff } from 'lucide-react';
import { PlayerSelection, Entity, EntityType, CalculationResult, ModifierType, ActiveSummon } from '../../../types';
import { evaluateFormula } from '../../../services/engine';
import { SetBonusesPanel } from '../SetBonusesPanel';
import { SummonsPanel } from '../SummonsPanel';
import { toFantasyTitle } from '../utils';
import { CollapsibleCard } from '../../ui/Card';
import { useStatusLogic } from '../../../hooks/useStatusLogic';

interface StatusPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    activeEntities: Entity[];
    allItems: Entity[]; 
    context: any;
    result: CalculationResult;
    activeSummons?: ActiveSummon[]; // Optional prop for overrides (like combined summons)
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ selection, setSelection, activeEntities, allItems, context, result, activeSummons }) => {
    
    // UTILISATION DU HOOK CENTRALISÉ
    const { 
        activeFactionsDetails, 
        activeGuildsWithToggles, 
        toggleConfig, 
        toggleEffect 
    } = useStatusLogic({ selection, setSelection, activeEntities, context });

    const renderGuildStatus = (status?: string) => {
        switch(status) {
            case 'OPEN':
                return <span className="flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Cette guilde recrute publiquement"><Globe size={10} className="mr-1"/> Ouverte</span>;
            case 'SEMI_OPEN':
                return <span className="flex items-center text-[9px] font-bold text-amber-400 bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-500/20" title="Cette guilde recrute sous condition"><Lock size={10} className="mr-1"/> Semi-Ouverte</span>;
            case 'SECRET':
                return <span className="flex items-center text-[9px] font-bold text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-500/20" title="L'existence même de cette guilde est cachée"><EyeOff size={10} className="mr-1"/> Secrète</span>;
            default:
                return null;
        }
    };

    // Helper to render a toggle section for a rank
    const renderRankToggle = (rank: any) => {
        if (!rank || !rank.modifiers) return null;
        
        const toggleMod = rank.modifiers.find((m: any) => !!m.toggleId);
        if (!toggleMod) return null;

        const toggleId = toggleMod.toggleId;
        const isActive = selection.toggles[toggleId];
        const label = toggleMod.toggleName || "Activer Bonus";

        return (
            <div className="mt-3 pt-2 border-t border-slate-800/50">
                <button 
                    onClick={() => toggleEffect(toggleId)}
                    className={`w-full flex items-center justify-between p-2 rounded border transition-all ${
                        isActive 
                        ? 'bg-purple-900/20 border-purple-500/50 text-purple-300' 
                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'
                    }`}
                >
                    <span className="text-[10px] font-bold uppercase flex items-center">
                        {isActive ? <CircleCheck size={12} className="mr-1.5"/> : <Circle size={12} className="mr-1.5"/>}
                        {label}
                    </span>
                    <div className="flex gap-1 flex-wrap justify-end">
                        {rank.modifiers.filter((m: any) => m.toggleId === toggleId).map((m: any, midx: number) => {
                            const val = evaluateFormula(m.value, context);
                            const isPercent = m.type === ModifierType.ALT_PERCENT || m.type === ModifierType.PERCENT_ADD || m.type === ModifierType.FINAL_ADDITIVE_PERCENT;
                            
                            return (
                                <span key={midx} className={`text-[9px] font-mono px-1 rounded ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                    {val}{isPercent ? '%' : ''} {m.targetStatKey.substring(0,3).toUpperCase()}
                                </span>
                            )
                        })}
                    </div>
                </button>
            </div>
        );
    };

    // Helper for Group Name Display
    const formatGroupName = (groupName: string) => {
        if (groupName === 'tritheiste_blessing') return 'Bénédiction djöllfuline';
        if (groupName === 'rp_location') return 'Localisation RP';
        if (groupName === 'Les poisons') return 'Poisons (Voleur)';
        return groupName.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-4">
            {/* 1. FACTIONS (IDENTITY ONLY) */}
            {activeFactionsDetails.length > 0 && (
                <CollapsibleCard 
                    id="identity_factions_panel"
                    title={toFantasyTitle("Faction (Identité)")} 
                    icon={Flag}
                    className="bg-indigo-950/20 border-indigo-500/20"
                >
                    <div className="space-y-3">
                        {activeFactionsDetails.map((fac, idx) => (
                            <div key={idx} className="flex items-center bg-slate-950/50 p-3 rounded border border-slate-800">
                                {fac.imageUrl ? (
                                    <img src={fac.imageUrl} className="w-10 h-10 object-contain mr-3 opacity-90 bg-slate-900 rounded p-1" alt="Icon" />
                                ) : (<Flag size={24} className="mr-3 text-slate-500" />)}
                                <div>
                                    <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                        {fac.name}
                                        {fac.prestige && fac.prestige > 0 && (
                                            <div className="flex space-x-0.5 ml-2" title={`Prestige: ${fac.prestige}`}>
                                                {Array.from({ length: fac.prestige }).map((_, i) => (
                                                    <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 italic">{fac.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>
            )}

            {/* 2. ITEM SETS */}
            <SetBonusesPanel activeEntities={activeEntities} allItems={allItems} context={context} />

            {/* 3. GUILDS (ONLY WITH TOGGLES) */}
            {activeGuildsWithToggles.length > 0 && (
                <CollapsibleCard 
                    id="guilds_active_panel"
                    title={toFantasyTitle("Guildes Actives")} 
                    icon={Users}
                >
                    <div className="space-y-2">
                        {activeGuildsWithToggles.map((guild, idx) => {
                            const selectedRankId = selection.guildRanks?.[guild.id];
                            const selectedRank = guild.guildRanks?.find(r => r.id === selectedRankId);
                            
                            const selectedSecRankId = selection.guildSecondaryRanks?.[guild.id];
                            const selectedSecRank = guild.secondaryGuildRanks?.find(r => r.id === selectedSecRankId);

                            return (
                                <div key={idx} className="flex flex-col bg-slate-950 p-3 rounded border border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center min-w-0 flex-1 mr-2">
                                            {guild.imageUrl ? (
                                                <div className="w-8 h-8 rounded bg-slate-950 border border-slate-700 flex-shrink-0 mr-2 overflow-hidden flex items-center justify-center p-0.5">
                                                    <img src={guild.imageUrl} className="w-full h-full object-contain" alt="Icon" />
                                                </div>
                                            ) : (<Users size={16} className="mr-2 text-slate-500" />)}
                                            <div className="min-w-0">
                                                <span className="text-xs font-bold text-slate-200 block truncate">{guild.name}</span>
                                                <div className="mt-0.5 flex gap-2 items-center flex-wrap">
                                                    {renderGuildStatus(guild.guildStatus)}
                                                    {selectedRank && (
                                                        <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                                                            Rang: {selectedRank.name}
                                                        </span>
                                                    )}
                                                    {selectedSecRank && (
                                                        <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                                                            Sec: {selectedSecRank.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {renderRankToggle(selectedRank)}
                                    {renderRankToggle(selectedSecRank)}
                                </div>
                            );
                        })}
                    </div>
                </CollapsibleCard>
            )}

            {/* 4. SITUATIONAL TOGGLES */}
            {(toggleConfig.standalone.length > 0 || Object.keys(toggleConfig.groups).length > 0) && (
                <CollapsibleCard 
                    id="situational_toggles_panel"
                    title={toFantasyTitle("Effets Situationnels")} 
                    icon={ToggleRight}
                    className="bg-indigo-900/10 border-indigo-500/30"
                >
                    <div className="space-y-4">
                        {toggleConfig.standalone.length > 0 && (
                            <div className="space-y-2">
                                {toggleConfig.standalone.map(t => { 
                                    const isActive = selection.toggles[t.id] || false; 
                                    return (
                                        <button key={t.id} onClick={() => toggleEffect(t.id)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isActive ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-medium text-left">{t.label}</span>
                                                {t.valueDisplay && (
                                                    <span className={`text-[10px] font-mono font-bold mt-0.5 ${isActive ? 'text-emerald-300' : 'text-slate-600'}`}>
                                                        {t.valueDisplay}
                                                    </span>
                                                )}
                                            </div>
                                            {isActive ? <ToggleRight size={24} className="text-indigo-400" /> : <ToggleLeft size={24} className="text-slate-600" />}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                        {Object.entries(toggleConfig.groups).map(([groupName, items]) => (
                            <div key={groupName} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 border-b border-slate-800 pb-1">
                                    {formatGroupName(groupName)}
                                </label>
                                <div className="flex flex-col gap-2">
                                    {(items as {id: string, label: string, valueDisplay?: string}[]).map(t => { 
                                        const isActive = selection.toggles[t.id] || false; 
                                        return (
                                            <button key={t.id} onClick={() => toggleEffect(t.id, groupName)} className={`flex items-center px-2 py-1.5 rounded transition-colors w-full text-left ${isActive ? 'text-indigo-400 bg-indigo-900/20' : 'text-slate-400 hover:text-white'}`}>
                                                <div className="flex items-center flex-1">
                                                    {isActive ? <CircleCheck size={16} className="mr-2 flex-shrink-0 fill-indigo-500/10" /> : <Circle size={16} className="mr-2 flex-shrink-0 text-slate-600" />}
                                                    <span className="text-sm">{t.label}</span>
                                                    {t.valueDisplay && (
                                                        <span className={`text-[10px] font-mono font-bold ml-2 whitespace-nowrap ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                                                            {t.valueDisplay}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>
            )}

            {/* 5. SUMMONS */}
            {/* Utilisation de la prop activeSummons si disponible (Merge), sinon fallback sur result.activeSummons */}
            <SummonsPanel activeSummons={activeSummons || result.activeSummons} selection={selection} setSelection={setSelection} context={context} />
        </div>
    );
};