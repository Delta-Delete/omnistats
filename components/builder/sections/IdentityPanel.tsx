
import React, { useEffect, useState } from 'react';
import { User, Lock, Scale, Info, Footprints, Check, Briefcase, PlusCircle, Activity, Zap, Sword, ShieldAlert, Hammer, FlaskConical, Sparkles, Combine, GraduationCap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Entity, EntityType, PlayerSelection } from '../../../types';
import { FactionSelector, GuildSelector } from '../selectors/SocialSelectors';
import { toFantasyTitle } from '../utils';

interface IdentityPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    entities: Entity[];
}

export const IdentityPanel: React.FC<IdentityPanelProps> = ({ selection, setSelection, entities }) => {
    // Local state for toggling sub-professions visibility
    const [isSubProfOpen, setIsSubProfOpen] = useState(false);

    const races = entities.filter(e => e.type === EntityType.RACE && !e.parentId);
    
    const availableSubRaces = selection.raceId 
        ? entities.filter(e => e.type === EntityType.RACE && e.parentId === selection.raceId)
        : [];

    const classes = entities.filter(e => e.type === EntityType.CLASS);
    
    // --- PROFESSION FILTERING ---
    const mainProfessions = entities.filter(e => e.type === EntityType.PROFESSION);
    const subProfessions = entities.filter(e => e.type === EntityType.SUB_PROFESSION);

    const careers = entities.filter(e => e.type === EntityType.CAREER);
    
    const factions = entities.filter(e => e.type === EntityType.FACTION);
    const guilds = entities.filter(e => e.type === EntityType.GUILD);

    const availableSpecs = entities.filter(e => e.type === EntityType.SPECIALIZATION && e.parentId === selection.classId);
    
    const isClassLocked = selection.level < 5;
    const isSpecLocked = selection.level < 15;
    
    const politicalPoints = selection.sliderValues?.['political_points_input'] || 0;

    const canSelectAdventure = selection.level >= 5 && !!selection.classId;
    const canSelectReligion = selection.level >= 10;

    const activeSubCount = Object.keys(selection.subProfessions || {}).length;

    // --- EFFECTS ---
    useEffect(() => {
        if (selection.careerId === 'career_adventure' && !canSelectAdventure) {
            setSelection(prev => ({ ...prev, careerId: undefined }));
        }
    }, [selection.level, selection.classId, selection.careerId, canSelectAdventure, setSelection]);

    useEffect(() => {
        if (selection.careerId === 'career_religion' && !canSelectReligion) {
            setSelection(prev => ({ ...prev, careerId: undefined }));
        }
    }, [selection.level, selection.careerId, canSelectReligion, setSelection]);

    useEffect(() => {
        if (selection.specializationId && isSpecLocked) {
            setSelection(prev => ({ ...prev, specializationId: undefined }));
        }
    }, [selection.level, isSpecLocked, selection.specializationId, setSelection]);

    useEffect(() => {
        if (selection.classId && isClassLocked) {
            setSelection(prev => ({ 
                ...prev, 
                classId: undefined,
                specializationId: undefined, 
                eliteCompetenceActive: false 
            }));
        }
    }, [selection.level, isClassLocked, selection.classId, setSelection]);

    // --- HANDLERS ---
    const handleSliderChange = (key: string, value: number) => { 
        setSelection(prev => ({ ...prev, sliderValues: { ...(prev.sliderValues || {}), [key]: value } })); 
    };

    const handleGuildsUpdate = (newIds: string[]) => {
        setSelection(prev => ({ ...prev, guildIds: newIds }));
    };

    const handleGuildRankUpdate = (guildId: string, rankId: string) => {
        setSelection(prev => ({
            ...prev,
            guildRanks: { ...(prev.guildRanks || {}), [guildId]: rankId }
        }));
    };

    const handleSecondaryGuildRankUpdate = (guildId: string, rankId: string) => {
        setSelection(prev => ({
            ...prev,
            guildSecondaryRanks: { ...(prev.guildSecondaryRanks || {}), [guildId]: rankId }
        }));
    };

    const handleFactionSelect = (id: string) => {
        let newCareerId = selection.careerId;
        const isInstituteDirector = selection.careerId === 'career_institut' && selection.sliderValues?.['career_institut_rank'] === 2;

        if (id && (selection.careerId === 'career_commerce' || isInstituteDirector)) {
            newCareerId = undefined;
        }
        setSelection(prev => ({ ...prev, factionId: id, careerId: newCareerId }));
    };

    const handleManualBonusChange = (stat: 'vit' | 'spd' | 'dmg' | 'absorption', value: number) => {
        setSelection(prev => ({
            ...prev,
            guildManualBonuses: {
                ...(prev.guildManualBonuses || { vit: 0, spd: 0, dmg: 0, absorption: 0 }),
                [stat]: value
            }
        }));
    };

    // --- PROFESSION HANDLERS ---
    const handleMainProfessionSelect = (profId: string) => {
        setSelection(prev => ({
            ...prev,
            professionId: profId,
            professionRank: profId ? 'Novice' : undefined // Default to Novice if selected, else clear
        }));
    };

    const handleSubProfessionToggle = (subProfId: string) => {
        setSelection(prev => {
            const currentSubs = { ...(prev.subProfessions || {}) };
            if (currentSubs[subProfId]) {
                delete currentSubs[subProfId];
            } else {
                // Determine default rank
                let defaultRank = 'Débutant';
                if (subProfId === 'sub_enchanteur') defaultRank = 'Disciple';
                if (subProfId === 'sub_specialiste' || subProfId === 'sub_fusionneur') defaultRank = 'Actif';
                
                currentSubs[subProfId] = defaultRank;
            }
            return { ...prev, subProfessions: currentSubs };
        });
    };

    const handleSubProfessionRankChange = (subProfId: string, rank: string) => {
        setSelection(prev => ({
            ...prev,
            subProfessions: { ...(prev.subProfessions || {}), [subProfId]: rank }
        }));
    };

    // --- CONSTANTS FOR RANKS ---
    const MAIN_RANKS = ['Novice', 'Apprenti', 'Compagnon', 'Maître', 'Maître Absolu'];
    const POTION_POISON_RANKS = ['Débutant', 'Confirmé', 'Maître'];
    const ENCHANTER_RANKS = ['Disciple', 'Initié(e)', 'Adepte-en-chef', 'Chef de maison/professeur', 'Enchanteur suprême'];

    const getSubProfRanks = (id: string) => {
        if (id.includes('potion') || id.includes('poison')) return POTION_POISON_RANKS;
        if (id.includes('enchanteur')) return ENCHANTER_RANKS;
        return [];
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            {/* TITRE AVEC POLICE PERRIGORD */}
            <h3 className="text-xl font-perrigord text-white flex items-center mb-4 tracking-wider">
                <User size={20} className="mr-2 text-indigo-400" /> 
                {toFantasyTitle("Identité & Classe")}
            </h3>
            
            <div className="mb-4">
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nom du Personnage</label>
                <div className="relative">
                    <input
                        type="text"
                        value={selection.characterName || ''}
                        onChange={(e) => setSelection({...selection, characterName: e.target.value})}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 pl-9 text-sm focus:border-indigo-500 outline-none placeholder-slate-600 transition-colors"
                        placeholder="Entrez un nom..."
                    />
                    <User size={16} className="absolute left-3 top-2.5 text-slate-500" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* LEVEL SLIDER */}
                <div className="col-span-2">
                    <label className="flex justify-between text-xs uppercase font-bold text-slate-500 mb-1">
                        <span>Niveau</span><span className="text-indigo-400">{selection.level}</span>
                    </label>
                    <input 
                        type="range" min="0" max="60" value={selection.level} 
                        onChange={(e) => setSelection({...selection, level: parseInt(e.target.value, 10)})} 
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                </div>
                
                {/* RACE SELECT */}
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Race</label>
                    <select 
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none" 
                        value={selection.raceId || ''} 
                        onChange={(e) => setSelection({...selection, raceId: e.target.value, subRaceId: undefined, toggles: {}, racialCompetenceActive: false })}
                    >
                        <option value="">Sélectionner</option>
                        {races.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                </div>
                
                {/* SUBRACE SELECT */}
                {availableSubRaces.length > 0 ? (
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Sous-Race</label>
                        <select 
                            className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none" 
                            value={selection.subRaceId || ''} 
                            onChange={(e) => setSelection({...selection, subRaceId: e.target.value, racialCompetenceActive: false })}
                        >
                            <option value="">Sélectionner Variété</option>
                            {availableSubRaces.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                ) : (<div></div>)}

                {/* CLASS SELECT */}
                <div className="relative">
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex justify-between">
                        Classe
                        {isClassLocked && <span className="text-yellow-500 flex items-center"><Lock size={10} className="mr-1"/> Niv 5+</span>}
                    </label>
                    <select 
                        className={`w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none ${isClassLocked ? 'opacity-50 text-slate-400' : ''}`} 
                        value={selection.classId || ''} 
                        onChange={(e) => setSelection({...selection, classId: e.target.value, specializationId: undefined, toggles: {}, eliteCompetenceActive: false })}
                        disabled={isClassLocked}
                    >
                        <option value="">Sélectionner</option>
                        {classes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                </div>

                {/* SPECIALIZATION SELECT */}
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex justify-between">
                        Spécialisation
                        {isSpecLocked && <span className="text-yellow-500 flex items-center"><Lock size={10} className="mr-1"/> Niv 15+</span>}
                    </label>
                    <select 
                        className={`w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none ${isSpecLocked ? 'opacity-50 text-slate-400' : ''}`} 
                        value={selection.specializationId || ''} 
                        onChange={(e) => setSelection({...selection, specializationId: e.target.value})} 
                        disabled={!selection.classId || isClassLocked || isSpecLocked}
                    >
                        <option value="">Sélectionner</option>
                        {availableSpecs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                </div>

                {/* PROFESSION SECTION (COMPACT REDESIGN) */}
                <div className="col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3">
                    <div className="flex items-center text-sm text-slate-400 border-b border-slate-800 pb-2">
                        <Hammer size={12} className="mr-2" /> 
                        <span className="font-perrigord tracking-wide">{toFantasyTitle("Métiers & Artisanat")}</span>
                    </div>
                    
                    {/* Main Profession Row */}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Métier Principal</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-2 py-1.5 text-xs focus:border-indigo-500 outline-none" 
                                value={selection.professionId || ''} 
                                onChange={(e) => handleMainProfessionSelect(e.target.value)}
                            >
                                <option value="">-- Aucun --</option>
                                {mainProfessions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {selection.professionId && (
                            <div className="w-1/3">
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Rang</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 text-indigo-300 rounded-md px-2 py-1.5 text-xs focus:border-indigo-500 outline-none font-bold"
                                    value={selection.professionRank || 'Novice'}
                                    onChange={(e) => setSelection(prev => ({ ...prev, professionRank: e.target.value }))}
                                >
                                    {MAIN_RANKS.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Sub Professions Grid (Compact & Collapsible) */}
                    <div>
                        <button 
                            onClick={() => setIsSubProfOpen(!isSubProfOpen)}
                            className="flex items-center justify-between w-full text-[10px] text-slate-500 uppercase font-bold mb-1.5 hover:text-slate-300 transition-colors group"
                        >
                            <span className="flex items-center">
                                Spécialisations (Optionnels)
                                {activeSubCount > 0 && !isSubProfOpen && (
                                    <span className="ml-2 bg-indigo-900/50 text-indigo-300 px-1.5 rounded text-[9px] border border-indigo-500/30">
                                        {activeSubCount} Active{activeSubCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </span>
                            {isSubProfOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        
                        {isSubProfOpen && (
                            <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {subProfessions.map(sub => {
                                    const isChecked = !!selection.subProfessions?.[sub.id];
                                    const ranks = getSubProfRanks(sub.id);
                                    const hasRanks = ranks.length > 0;
                                    const currentRank = selection.subProfessions?.[sub.id];

                                    return (
                                        <div 
                                            key={sub.id} 
                                            onClick={() => handleSubProfessionToggle(sub.id)}
                                            className={`p-2 rounded border transition-all cursor-pointer relative overflow-hidden group ${isChecked ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-900 border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-bold leading-tight ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                                                    {sub.name.replace('Fabricant de potion', 'Potions')}
                                                </span>
                                                {isChecked && <Check size={10} className="text-indigo-400" />}
                                            </div>
                                            
                                            {/* Rank Selector Embedded */}
                                            {isChecked && hasRanks && (
                                                <div className="mt-1.5" onClick={e => e.stopPropagation()}>
                                                    <select 
                                                        value={currentRank} 
                                                        onChange={(e) => handleSubProfessionRankChange(sub.id, e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-700 text-[9px] rounded px-1 py-0.5 text-indigo-300 outline-none focus:border-indigo-500"
                                                    >
                                                        {ranks.map(r => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                            {isChecked && !hasRanks && (
                                                <div className="mt-1 text-[8px] text-emerald-500 uppercase font-bold tracking-wide">Actif</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* CAREER SELECT */}
                <div className="col-span-2">
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex items-center"><Briefcase size={12} className="mr-1" /> Carrière</label>
                    <select 
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none" 
                        value={selection.careerId || ''} 
                        onChange={(e) => {
                            const newToggles = { ...selection.toggles };
                            ['career_card_heart', 'career_card_club', 'career_card_spade', 'career_card_diamond', 'career_card_royal'].forEach(k => delete newToggles[k]);
                            setSelection({...selection, careerId: e.target.value, toggles: newToggles});
                        }}
                    >
                        <option value="">Sélectionner</option>
                        {careers.map(o => {
                            const isAdventure = o.id === 'career_adventure';
                            const isReligion = o.id === 'career_religion';
                            const isCommerce = o.id === 'career_commerce';
                            const hasFaction = !!selection.factionId;

                            if (isAdventure && !canSelectAdventure) {
                                return <option key={o.id} value={o.id} disabled className="text-slate-500">🔒 {o.name} (Req: Niv 5 + Classe)</option>;
                            }
                            if (isReligion && !canSelectReligion) {
                                return <option key={o.id} value={o.id} disabled className="text-slate-500">🔒 {o.name} (Req: Niv 10+)</option>;
                            }
                            if (isCommerce && hasFaction) {
                                return <option key={o.id} value={o.id} disabled className="text-slate-500">🔒 {o.name} (Incompatible avec Faction)</option>;
                            }
                            return <option key={o.id} value={o.id}>{o.name}</option>;
                        })}
                    </select>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
                <FactionSelector 
                    factions={factions} 
                    selectedId={selection.factionId} 
                    onSelect={handleFactionSelect} 
                />
                
                <GuildSelector 
                    guilds={guilds} 
                    selectedIds={selection.guildIds || []} 
                    onUpdate={handleGuildsUpdate} 
                    guildRanks={selection.guildRanks}
                    guildSecondaryRanks={selection.guildSecondaryRanks} 
                    onRankUpdate={handleGuildRankUpdate}
                    onSecondaryRankUpdate={handleSecondaryGuildRankUpdate} 
                />

                {/* MANUAL GUILD BONUS PANEL */}
                {selection.guildIds && selection.guildIds.length > 0 && (
                    <div className="mt-4 bg-slate-950 border border-slate-700 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                            <h4 className="text-sm font-perrigord text-indigo-400 flex items-center tracking-wide">
                                <PlusCircle size={14} className="mr-1.5" /> {toFantasyTitle("Bonus de Guilde")}
                            </h4>
                            <span className="text-[9px] text-slate-500 italic">Valeurs fixes ajoutées aux stats de base</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[9px] text-emerald-500 font-bold uppercase mb-1 flex items-center"><Activity size={10} className="mr-1"/> Vitalité</label>
                                <input 
                                    type="number" 
                                    value={selection.guildManualBonuses?.vit || 0} 
                                    onChange={(e) => handleManualBonusChange('vit', parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] text-amber-500 font-bold uppercase mb-1 flex items-center"><Zap size={10} className="mr-1"/> Vitesse</label>
                                <input 
                                    type="number" 
                                    value={selection.guildManualBonuses?.spd || 0} 
                                    onChange={(e) => handleManualBonusChange('spd', parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] text-rose-500 font-bold uppercase mb-1 flex items-center"><Sword size={10} className="mr-1"/> Dégâts</label>
                                <input 
                                    type="number" 
                                    value={selection.guildManualBonuses?.dmg || 0} 
                                    onChange={(e) => handleManualBonusChange('dmg', parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-rose-500 outline-none"
                                />
                            </div>
                            {selection.classId === 'corrompu' && (
                                <div className="col-span-3 mt-1 pt-2 border-t border-slate-800 border-dashed">
                                    <label className="block text-[9px] text-violet-400 font-bold uppercase mb-1 flex items-center"><ShieldAlert size={10} className="mr-1"/> Corruption (Absorption %)</label>
                                    <input 
                                        type="number" 
                                        value={selection.guildManualBonuses?.absorption || 0} 
                                        onChange={(e) => handleManualBonusChange('absorption', parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-violet-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center text-xs uppercase font-bold text-slate-500">
                        <Scale size={14} className="mr-1.5" /> Influence Politique
                    </label>
                    <div className={`flex items-center justify-center text-xs font-mono font-bold px-1.5 py-0.5 rounded border transition-colors focus-within:ring-1 focus-within:ring-opacity-50 ${
                        politicalPoints < 0 ? 'bg-red-900/30 border-red-500/20 text-red-400 focus-within:ring-red-500' : 
                        politicalPoints > 0 ? 'bg-indigo-900/30 border-indigo-500/20 text-indigo-300 focus-within:ring-indigo-500' : 
                        'bg-slate-800 border-slate-700 text-slate-400 focus-within:ring-slate-500'
                    }`}>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            value={politicalPoints > 0 ? `+${politicalPoints}` : politicalPoints} 
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || val === '-' || val === '+') {
                                     handleSliderChange('political_points_input', 0);
                                } else {
                                     const cleanVal = val.replace('+', '');
                                     const num = parseInt(cleanVal, 10);
                                     if (!isNaN(num) && num >= -300 && num <= 300) {
                                         handleSliderChange('political_points_input', num);
                                     }
                                }
                            }}
                            className="bg-transparent outline-none w-10 appearance-none m-0 p-0 font-inherit text-center"
                        />
                    </div>
                </div>
                <div className="relative h-6 flex items-center">
                    <div className="absolute w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-900/50 to-slate-800"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-900/50 to-slate-800"></div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 -translate-x-1/2"></div>
                    </div>
                    <input 
                        type="range" 
                        min="-300" 
                        max="300" 
                        value={politicalPoints} 
                        onChange={(e) => handleSliderChange('political_points_input', parseInt(e.target.value, 10))} 
                        className={`w-full h-2 appearance-none bg-transparent relative z-10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 ${
                            politicalPoints < 0 ? '[&::-webkit-slider-thumb]:bg-red-500' : 
                            politicalPoints > 0 ? '[&::-webkit-slider-thumb]:bg-indigo-500' : 
                            '[&::-webkit-slider-thumb]:bg-slate-400'
                        }`} 
                    />
                </div>
                <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1 px-1">
                    <span>-300 (Rebelle)</span>
                    <span>Neutre</span>
                    <span>+300 (Loyal)</span>
                </div>
            </div>

            {selection.level < 5 && (<div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg flex items-start animate-pulse"><Info size={16} className="text-indigo-400 mt-0.5 mr-2 flex-shrink-0" /><div className="text-xs text-indigo-200"><span className="font-bold block mb-1">Phase Novice (Niveau 1-4)</span><span>Vous gagnez +5 stats par niveau. Au niveau 5, votre Classe prendra le relais.</span></div></div>)}
            {selection.level >= 5 && selection.classId && (<div className="mt-4 p-2 bg-slate-800 border border-slate-700 rounded text-[10px] text-green-400 flex items-center"><Check size={12} className="mr-2 flex-shrink-0" /><span>Phase Classe Active : Vous gagnez désormais des stats spécifiques à votre classe.</span></div>)}
            {selection.level >= 5 && !selection.classId && (<div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded flex items-start"><Footprints size={16} className="text-slate-400 mt-0.5 mr-2 flex-shrink-0" /><div className="text-xs text-slate-300"><span className="font-bold block mb-1 text-slate-200">Vagabond (Sans Classe)</span><span>Vous continuez à gagner +5 stats par niveau indéfiniment. Sélectionnez une classe pour débloquer des gains supérieurs.</span></div></div>)}
        </div>
    );
};
