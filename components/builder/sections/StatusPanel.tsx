
import React from 'react';
import { Flag, ToggleRight, ToggleLeft, CircleCheck, Circle, Users, Star, Globe, Lock, EyeOff } from 'lucide-react';
import { PlayerSelection, Entity, EntityType, CalculationResult, ModifierType } from '../../../types';
import { evaluateFormula } from '../../../services/engine';
import { SetBonusesPanel } from '../SetBonusesPanel';
import { SummonsPanel } from '../SummonsPanel';
import { toFantasyTitle } from '../utils';

interface StatusPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    activeEntities: Entity[];
    allItems: Entity[]; 
    context: any;
    result: CalculationResult;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ selection, setSelection, activeEntities, allItems, context, result }) => {
    
    // FACTIONS (IDENTITY)
    const activeFactionsDetails = React.useMemo(() => {
        return activeEntities.filter(e => e.type === EntityType.FACTION);
    }, [activeEntities]);

    // GUILDS FILTERING (Updated to check both primary and secondary)
    const activeGuildsWithToggles = React.useMemo(() => {
        return activeEntities.filter(e => e.type === EntityType.GUILD).filter(guild => {
            // Check Primary Rank
            const rankId = selection.guildRanks?.[guild.id];
            const rank = guild.guildRanks?.find(r => r.id === rankId);
            const hasPrimaryToggle = rank?.modifiers?.some(m => !!m.toggleId);

            // Check Secondary Rank (if exists)
            const secRankId = selection.guildSecondaryRanks?.[guild.id];
            const secRank = guild.secondaryGuildRanks?.find(r => r.id === secRankId);
            const hasSecToggle = secRank?.modifiers?.some(m => !!m.toggleId);

            return hasPrimaryToggle || hasSecToggle;
        });
    }, [activeEntities, selection.guildRanks, selection.guildSecondaryRanks]);

    // TOGGLES CONFIGURATION
    const CUSTOM_PLACED_TOGGLES = [
        'curse_lvl_1', 'curse_lvl_2', 'curse_lvl_3', 
        'vaudou_ritual', 
        'organ_heart', 'organ_lung', 'organ_liver', 
        'pos_mante', 'pos_serpent', 'pos_lievre', 'pos_singe', 
        'toggle_protection_ally', 'toggle_zenitude', 'toggle_lutteur_unarmed',
        'career_card_spade', 'career_card_club', 'career_card_diamond', 'career_card_heart', 'career_card_royal',
        'career_athlete_second_wind',
        'toggle_respirator_active' // ADDED: Hides the main respirator toggle (handled in Inventory)
    ];

    const toggleConfig = React.useMemo(() => {
        const standalone: {id: string, label: string}[] = [];
        const groups: Record<string, {id: string, label: string}[]> = {};
        const seenIds = new Set<string>();
        activeEntities.forEach(ent => { 
            (ent.modifiers || []).forEach(mod => { 
                if (mod.toggleId && !seenIds.has(mod.toggleId)) { 
                    if (mod.toggleGroup === 'arlequin_card') return; 
                    if (mod.toggleGroup === 'career_artist_deck') return; 
                    if (mod.toggleGroup === 'thanato_organ') return; 
                    if (mod.toggleGroup === 'pugilist_stance') return; 
                    if (CUSTOM_PLACED_TOGGLES.includes(mod.toggleId)) return; 
                    
                    // Exclude specific guild rank bonuses (handled in Guild card)
                    if (mod.toggleId === 'guild_rank_bonus') return;
                    if (mod.toggleId.startsWith('toggle_cc_')) return;
                    if (mod.toggleId.startsWith('toggle_croc_')) return;

                    seenIds.add(mod.toggleId); 
                    const item = { id: mod.toggleId, label: mod.toggleName || mod.toggleId }; 
                    if (mod.toggleGroup) { 
                        if (!groups[mod.toggleGroup]) groups[mod.toggleGroup] = []; 
                        groups[mod.toggleGroup].push(item); 
                    } else { standalone.push(item); } 
                } 
            }); 
        });
        return { standalone, groups };
    }, [activeEntities]);

    const toggleEffect = (id: string, groupName?: string) => { 
        setSelection(prev => { 
            const newToggles = { ...prev.toggles }; 
            if (groupName) { 
                // LOGIC UPDATE: Allow Deselection in Groups
                const wasActive = newToggles[id];
                const groupItems = toggleConfig.groups[groupName] || []; 
                
                // 1. Reset all in group to false
                groupItems.forEach(item => { 
                    newToggles[item.id] = false; 
                }); 
                
                // 2. Only activate if it wasn't already active (Toggle behavior)
                if (!wasActive) {
                    newToggles[id] = true;
                }
            } else { 
                newToggles[id] = !newToggles[id]; 
            } 
            return { ...prev, toggles: newToggles }; 
        }); 
    };

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
        
        // Find if there's a toggle in this rank
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

    return (
        <div className="space-y-6 mt-6">
            {/* 1. FACTIONS (IDENTITY ONLY) */}
            {activeFactionsDetails.length > 0 && (
                <div className="bg-indigo-950/20 border border-indigo-500/20 p-5 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-indigo-500/20">
                        <h4 className="text-sm font-perrigord text-indigo-300 flex items-center tracking-wide"><Flag size={16} className="mr-2" /> {toFantasyTitle("Faction (Identité)")}</h4>
                    </div>
                    <div className="space-y-3">
                        {activeFactionsDetails.map((fac, idx) => (
                            <div key={idx} className="flex items-center bg-slate-950/50 p-3 rounded border border-slate-800">
                                {fac.imageUrl ? (
                                    <img src={fac.imageUrl} className="w-10 h-10 object-contain mr-3 opacity-90 bg-slate-900 rounded p-1" alt="Icon" />
                                ) : (<Flag size={24} className="mr-3 text-slate-500" />)}
                                <div>
                                    <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                        {fac.name}
                                        {/* PRESTIGE STARS DISPLAY */}
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
                </div>
            )}

            {/* 2. ITEM SETS */}
            <SetBonusesPanel activeEntities={activeEntities} allItems={allItems} context={context} />

            {/* 3. GUILDS (ONLY WITH TOGGLES) */}
            {activeGuildsWithToggles.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
                    <h4 className="text-sm font-perrigord text-slate-300 mb-3 flex items-center tracking-wide"><Users size={16} className="mr-2" /> {toFantasyTitle("Guildes Actives")}</h4>
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
                                    
                                    {/* Render Toggles for Primary Rank */}
                                    {renderRankToggle(selectedRank)}
                                    
                                    {/* Render Toggles for Secondary Rank */}
                                    {renderRankToggle(selectedSecRank)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 4. SITUATIONAL TOGGLES (Filtered) */}
            {(toggleConfig.standalone.length > 0 || Object.keys(toggleConfig.groups).length > 0) && (
                <div className="bg-indigo-900/10 border border-indigo-500/30 p-5 rounded-xl shadow-lg">
                    <h4 className="text-sm font-perrigord text-indigo-300 mb-3 flex items-center tracking-wide"><ToggleRight size={16} className="mr-2" /> {toFantasyTitle("Effets Situationnels")}</h4>
                    <div className="space-y-4">
                        {toggleConfig.standalone.length > 0 && (
                            <div className="space-y-2">
                                {toggleConfig.standalone.map(t => { 
                                    const isActive = selection.toggles[t.id] || false; 
                                    return (<button key={t.id} onClick={() => toggleEffect(t.id)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isActive ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}><span className="text-sm font-medium">{t.label}</span>{isActive ? <ToggleRight size={24} className="text-indigo-400" /> : <ToggleLeft size={24} className="text-slate-600" />}</button>)
                                })}
                            </div>
                        )}
                        {Object.entries(toggleConfig.groups).map(([groupName, items]) => (
                            <div key={groupName} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 border-b border-slate-800 pb-1">{groupName.replace('rp_location', 'Localisation RP')}</label>
                                <div className="flex flex-col gap-2">
                                    {(items as {id: string, label: string}[]).map(t => { 
                                        const isActive = selection.toggles[t.id] || false; 
                                        return (<button key={t.id} onClick={() => toggleEffect(t.id, groupName)} className={`flex items-center px-2 py-1.5 rounded transition-colors ${isActive ? 'text-indigo-400 bg-indigo-900/20' : 'text-slate-400 hover:text-white'}`}>{isActive ? <CircleCheck size={16} className="mr-2 fill-indigo-500/10" /> : <Circle size={16} className="mr-2 text-slate-600" />}<span className="text-sm">{t.label}</span></button>)
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 5. SUMMONS */}
            <SummonsPanel activeSummons={result.activeSummons} selection={selection} setSelection={setSelection} context={context} />
        </div>
    );
};
