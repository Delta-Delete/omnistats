
import React from 'react';
import { Crown, Dna, Database, Ghost } from 'lucide-react';
import { PlayerSelection, Entity, EntityType, StatResult } from '../../../types';
import { BloodMagicSelector, ThanatoOrganSelector, ArcaneSacrificePanel, NaturalStrengthPanel, ArlequinDealer, PugilistStances, ZenitudePanel, LutteurPanel, SansPeurPanel, RagePanel, ColereVivePanel } from '../ClassMechanics';
import { CeleriteIndicator, AnticipationIndicator, ChevalierIndicator, ParadesParfaitesIndicator, CroiseIndicator, MaitreAirIndicator, CriGuerreIndicator } from '../ClassIndicators';
import { toFantasyTitle } from '../utils';

interface ClassMechanicsPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    entities: Entity[];
    activeEntities: Entity[];
    allItems: Entity[];
    context: any;
    result: any;
}

export const ClassMechanicsPanel: React.FC<ClassMechanicsPanelProps> = ({ selection, setSelection, entities, activeEntities, allItems, context, result }) => {
    const eliteCompetence = entities.find(e => e.type === EntityType.ELITE_COMPETENCE && e.parentId === selection.classId);
    const racialCompetence = entities.find(e => e.type === EntityType.RACIAL_COMPETENCE && (e.parentId === selection.raceId || e.parentId === selection.subRaceId));

    const toggleEffect = (id: string, groupName?: string) => { 
        setSelection(prev => { 
            const newToggles = { ...prev.toggles }; 
            if (groupName) { 
                if (groupName === 'arlequin_card') { 
                    const wasActive = newToggles[id]; 
                    ['card_spade', 'card_club', 'card_diamond', 'card_heart', 'card_royal'].forEach(k => delete newToggles[k]); 
                    if (!wasActive) newToggles[id] = true; 
                } else if (groupName === 'curse_pact') { 
                    const wasActive = newToggles[id]; 
                    ['curse_lvl_1', 'curse_lvl_2', 'curse_lvl_3'].forEach(k => delete newToggles[k]); 
                    if (!wasActive) newToggles[id] = true; 
                } else if (groupName === 'thanato_organ') { 
                    const wasActive = newToggles[id]; 
                    ['organ_heart', 'organ_lung', 'organ_liver'].forEach(k => delete newToggles[k]); 
                    if (!wasActive) newToggles[id] = true; 
                } else if (groupName === 'pugilist_stance') {
                    newToggles[id] = !newToggles[id];
                } else { 
                    // Generic grouping
                    newToggles[id] = !newToggles[id];
                } 
            } else { 
                newToggles[id] = !newToggles[id]; 
            } 
            return { ...prev, toggles: newToggles }; 
        }); 
    };

    const handleSliderChange = (key: string, value: number) => { 
        setSelection(prev => ({ ...prev, sliderValues: { ...(prev.sliderValues || {}), [key]: value } })); 
    };

    const toggleNaturalStrengthAllocation = (slotId: string) => { 
        setSelection(prev => { 
            const current = new Set(prev.naturalStrengthAllocation || []); 
            if (current.has(slotId)) current.delete(slotId); 
            else current.add(slotId); 
            return { ...prev, naturalStrengthAllocation: Array.from(current) }; 
        }); 
    };

    // Helper for visual boost calc
    const getBoostedValue = (base: number) => {
        const booster = (context.effect_booster || 0) / 100;
        const enhanced = Math.ceil(base * (1 + booster));
        const bonus = enhanced - base;
        return { base, enhanced, bonus };
    };

    return (
        <>
            {/* RACIAL COMPETENCE SECTION */}
            {racialCompetence && (
                <div className="mt-4 p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/10 to-transparent relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center">
                            <div className={`p-2.5 rounded-lg mr-3 transition-colors ${selection.racialCompetenceActive ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                                <Dna size={22} strokeWidth={selection.racialCompetenceActive ? 2.5 : 2} />
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold uppercase tracking-wider ${selection.racialCompetenceActive ? 'text-cyan-400 drop-shadow-sm' : 'text-slate-400'}`}>
                                    {racialCompetence.name}
                                </h4>
                                <span className="text-[10px] font-perrigord text-slate-500 tracking-widest">{toFantasyTitle("Compétence Raciale")}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelection(prev => ({...prev, racialCompetenceActive: !prev.racialCompetenceActive}))}
                            className={`px-4 py-1.5 rounded text-xs font-bold uppercase border transition-all duration-300 ${selection.racialCompetenceActive ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg scale-105' : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'}`}
                        >
                            {selection.racialCompetenceActive ? 'ACTIVÉE' : 'ACTIVER'}
                        </button>
                    </div>
                    {selection.racialCompetenceActive && racialCompetence.description && (
                        <div className="mt-3 text-xs text-cyan-100/80 italic border-t border-cyan-500/20 pt-2 animate-in fade-in slide-in-from-top-1">
                            {racialCompetence.description}
                        </div>
                    )}
                </div>
            )}

            {/* ELITE COMPETENCE SECTION */}
            {eliteCompetence && selection.level >= 5 && (
                <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-900/10 to-transparent relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center">
                            <div className={`p-2.5 rounded-lg mr-3 transition-colors ${selection.eliteCompetenceActive ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                                <Crown size={22} strokeWidth={selection.eliteCompetenceActive ? 2.5 : 2} />
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold uppercase tracking-wider ${selection.eliteCompetenceActive ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-400'}`}>
                                    {eliteCompetence.name}
                                </h4>
                                <span className="text-[10px] font-perrigord text-slate-500 tracking-widest">{toFantasyTitle("Compétence d'Élite")}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelection(prev => ({...prev, eliteCompetenceActive: !prev.eliteCompetenceActive}))}
                            className={`px-4 py-1.5 rounded text-xs font-bold uppercase border transition-all duration-300 ${selection.eliteCompetenceActive ? 'bg-yellow-600 text-white border-yellow-400 shadow-lg scale-105' : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'}`}
                        >
                            {selection.eliteCompetenceActive ? 'ACTIVÉE' : 'ACTIVER'}
                        </button>
                    </div>
                    {selection.eliteCompetenceActive && eliteCompetence.description && (
                        <div className="mt-3 text-xs text-yellow-100/80 italic border-t border-yellow-500/20 pt-2 animate-in fade-in slide-in-from-top-1">
                            {eliteCompetence.description}
                        </div>
                    )}
                </div>
            )}

            {/* CLASS SPECIFIC WIDGETS */}
            {selection.classId === 'arlequins' && (<ArlequinDealer toggles={selection.toggles} onToggle={toggleEffect} context={context} />)}
            {selection.classId === 'pugilistes' && (<PugilistStances toggles={selection.toggles} onToggle={toggleEffect} />)}
            {selection.specializationId === 'spec_zenitude' && (<ZenitudePanel active={selection.toggles['toggle_zenitude'] || false} onToggle={() => toggleEffect('toggle_zenitude')} />)}
            {selection.specializationId === 'spec_lutteur' && (<LutteurPanel active={selection.toggles['toggle_lutteur_unarmed'] || false} onToggle={() => toggleEffect('toggle_lutteur_unarmed')} hasWeapons={selection.weaponSlots.length > 0} />)}
            
            {selection.specializationId === 'spec_malediction' && (<BloodMagicSelector toggles={selection.toggles} onToggle={toggleEffect} context={context} />)}
            {selection.specializationId === 'spec_thanatopracteur' && (<ThanatoOrganSelector toggles={selection.toggles} onToggle={toggleEffect} context={context} />)}
            {selection.specializationId === 'spec_celerite' && (<CeleriteIndicator activeEntities={activeEntities} />)}
            {selection.specializationId === 'spec_anticipation_sauvage' && (<AnticipationIndicator activeEntities={activeEntities} />)}
            {selection.specializationId === 'spec_chevalier' && (<ChevalierIndicator activeEntities={activeEntities} />)}
            {selection.specializationId === 'spec_parades_parfaites' && (<ParadesParfaitesIndicator level={selection.level} modifierResults={result.modifierResults} />)}
            {selection.specializationId === 'spec_croise' && (<CroiseIndicator activeEntities={activeEntities} />)}
            {selection.specializationId === 'spec_maitre_air' && (
                <MaitreAirIndicator 
                    partitionCap={(result.stats['partition_cap'] as StatResult)?.finalValue || 0}
                    booster={context.effect_booster || 0}
                    mastery={context.special_mastery || 0}
                />
            )}
            {selection.specializationId === 'spec_cri_guerre' && (
                <CriGuerreIndicator 
                    activeEntities={activeEntities} 
                    booster={context.effect_booster || 0}
                    mastery={context.special_mastery || 0}
                />
            )}
            
            {selection.specializationId === 'spec_arcanes_sombres' && (<ArcaneSacrificePanel currentValue={selection.sliderValues?.['arcane_sacrifice_count'] || 0} onChange={(val) => handleSliderChange('arcane_sacrifice_count', val)} context={context} />)}
            {selection.specializationId === 'spec_force_naturelle' && (<NaturalStrengthPanel selection={selection} allItems={allItems} onToggleAllocation={toggleNaturalStrengthAllocation} level={selection.level} context={context} />)}
            {selection.specializationId === 'spec_sans_peur' && (
                <SansPeurPanel 
                    stacks={selection.sliderValues?.['sans_peur_stacks'] || 0} 
                    protecting={selection.toggles['toggle_protection_ally'] || false}
                    onStackChange={(val) => handleSliderChange('sans_peur_stacks', val)}
                    onToggleProtect={() => toggleEffect('toggle_protection_ally')}
                    context={context}
                />
            )}
            
            {selection.specializationId === 'spec_rage_decuplee' && (
                <RagePanel
                    stacks={selection.sliderValues?.['rage_stacks'] || 0}
                    onStackChange={(val) => handleSliderChange('rage_stacks', val)}
                    context={context}
                />
            )}
            
            {selection.specializationId === 'spec_colere_vive' && (
                <ColereVivePanel
                    stacks={selection.sliderValues?.['colere_vive_stacks'] || 0}
                    onStackChange={(val) => handleSliderChange('colere_vive_stacks', val)}
                    context={context}
                />
            )}
            
            {selection.classId === 'animistes' && (
                <div className="bg-slate-900 border border-violet-900/50 p-5 rounded-xl shadow-lg relative overflow-hidden group mt-4">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Ghost size={100} /></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-perrigord text-violet-300 flex items-center tracking-wide"><Ghost size={16} className="mr-2" /> {toFantasyTitle("Récolteur d'âmes")}</h3><div className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">{selection.specializationId === 'spec_lien_spirituel' ? 'Lien Spirituel Actif (x4)' : 'Standard (x1)'}</div></div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1"><label className="block text-xs font-bold text-slate-500 mb-1">Âmes récoltées</label><div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus-within:border-violet-500 transition-colors"><span className="text-violet-500 mr-2"><Database size={14}/></span><input type="number" min="0" value={selection.soulCount || 0} onChange={(e) => setSelection({...selection, soulCount: parseInt(e.target.value, 10) || 0})} className="bg-transparent text-white font-mono text-sm w-full outline-none" placeholder="0" /></div></div>
                            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-violet-900/10 border border-violet-500/20 rounded-lg">
                                <span className="text-[10px] text-violet-400 uppercase font-bold mb-1">Bonus Actuel</span>
                                {(() => {
                                    const baseUnit = selection.specializationId === 'spec_lien_spirituel' ? 40 : 10;
                                    const { enhanced } = getBoostedValue(baseUnit);
                                    const totalGain = Math.floor((selection.soulCount || 0) / 100) * enhanced;
                                    return <span className="text-xl font-bold text-white">+{totalGain}</span>;
                                })()}
                                <span className="text-[9px] text-slate-500">à toutes les stats</span>
                            </div>
                        </div>
                        {(() => {
                             const baseUnit = selection.specializationId === 'spec_lien_spirituel' ? 40 : 10;
                             const { bonus } = getBoostedValue(baseUnit);
                             return (
                                 <p className="text-[10px] text-slate-500 mt-3 italic">
                                     Gagnez +{baseUnit} {bonus > 0 && <span className="text-emerald-400 font-bold">+{bonus}</span>} stats (Vit, Spd, Dmg) toutes les 100 âmes.
                                 </p>
                             );
                        })()}
                    </div>
                </div>
            )}
        </>
    );
};
