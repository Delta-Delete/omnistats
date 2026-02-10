
import React, { useEffect, useState } from 'react';
import { User, Info, Check, Footprints } from 'lucide-react';
import { EntityType, PlayerSelection, Entity } from '../../../types';
import { toFantasyTitle } from '../utils';
import { useGameData } from '../../../context/GameDataContext';
import { CollapsibleCard } from '../../ui/Card';
import { ClassMechanicsPanel } from './ClassMechanicsPanel';

// Sub-components Import
import { IdentityHeader } from '../identity/IdentityHeader';
import { OriginSelector } from '../identity/OriginSelector';
import { ProfessionSelector } from '../identity/ProfessionSelector';
import { SocialSelector } from '../identity/SocialSelector';
import { PoliticsSelector } from '../identity/PoliticsSelector';

interface IdentityPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    activeEntities?: Entity[];
    allItems?: Entity[];
    context?: any;
    result?: any;
}

export const IdentityPanel: React.FC<IdentityPanelProps> = ({ selection, setSelection, activeEntities = [], allItems = [], context = {} as any, result = {} as any }) => {
    const { entities } = useGameData();

    // LOCAL DISPLAY STATES (For Real-time Slider Feedback)
    const [displayLevel, setDisplayLevel] = useState(selection.level);
    const [displayPP, setDisplayPP] = useState(selection.sliderValues?.['political_points_input'] || 0);

    // Sync local display when selection changes externally (e.g. Reset, Load Preset)
    useEffect(() => { setDisplayLevel(selection.level); }, [selection.level]);
    useEffect(() => { setDisplayPP(selection.sliderValues?.['political_points_input'] || 0); }, [selection.sliderValues]);

    const races = entities.filter(e => e.type === EntityType.RACE && !e.parentId);
    const availableSubRaces = selection.raceId ? entities.filter(e => e.type === EntityType.RACE && e.parentId === selection.raceId) : [];
    const classes = entities.filter(e => e.type === EntityType.CLASS);
    const mainProfessions = entities.filter(e => e.type === EntityType.PROFESSION);
    const subProfessions = entities.filter(e => e.type === EntityType.SUB_PROFESSION);
    const careers = entities.filter(e => e.type === EntityType.CAREER);
    const factions = entities.filter(e => e.type === EntityType.FACTION);
    const guilds = entities.filter(e => e.type === EntityType.GUILD);
    const availableSpecs = entities.filter(e => e.type === EntityType.SPECIALIZATION && e.parentId === selection.classId);
    
    const isClassLocked = selection.level < 5;
    const isSpecLocked = selection.level < 15;
    
    const canSelectAdventure = selection.level >= 5 && !!selection.classId;
    const canSelectReligion = selection.level >= 10;

    // --- EFFECTS ---
    useEffect(() => { if (selection.careerId === 'career_adventure' && !canSelectAdventure) setSelection(prev => ({ ...prev, careerId: undefined })); }, [selection.level, selection.classId, selection.careerId, canSelectAdventure, setSelection]);
    useEffect(() => { if (selection.careerId === 'career_religion' && !canSelectReligion) setSelection(prev => ({ ...prev, careerId: undefined })); }, [selection.level, selection.careerId, canSelectReligion, setSelection]);
    useEffect(() => { if (selection.specializationId && isSpecLocked) setSelection(prev => ({ ...prev, specializationId: undefined })); }, [selection.level, isSpecLocked, selection.specializationId, setSelection]);
    useEffect(() => { if (selection.classId && isClassLocked) setSelection(prev => ({ ...prev, classId: undefined, specializationId: undefined, eliteCompetenceActive: false })); }, [selection.level, isClassLocked, selection.classId, setSelection]);

    // --- HANDLERS ---
    const updateSelectionField = (field: string, value: any) => {
        setSelection(prev => ({ ...prev, [field]: value }));
        // Reset Logic for Race/Class changes
        if (field === 'raceId') setSelection(prev => ({ ...prev, subRaceId: undefined, racialCompetenceActive: false }));
        if (field === 'classId') setSelection(prev => ({ ...prev, specializationId: undefined, eliteCompetenceActive: false }));
        if (field === 'subRaceId') setSelection(prev => ({ ...prev, racialCompetenceActive: false }));
        // Reset Career toggles
        if (field === 'careerId') {
            setSelection(prev => {
                const newToggles = { ...prev.toggles };
                ['career_card_heart', 'career_card_club', 'career_card_spade', 'career_card_diamond', 'career_card_royal'].forEach(k => delete newToggles[k]);
                return { ...prev, toggles: newToggles };
            });
        }
    };

    const handleSliderChange = (key: string, value: number) => { 
        setSelection(prev => ({ ...prev, sliderValues: { ...(prev.sliderValues || {}), [key]: value } })); 
    };

    const handleGuildsUpdate = (newIds: string[]) => setSelection(prev => ({ ...prev, guildIds: newIds }));
    const handleGuildRankUpdate = (guildId: string, rankId: string) => setSelection(prev => ({ ...prev, guildRanks: { ...(prev.guildRanks || {}), [guildId]: rankId } }));
    const handleSecondaryGuildRankUpdate = (guildId: string, rankId: string) => setSelection(prev => ({ ...prev, guildSecondaryRanks: { ...(prev.guildSecondaryRanks || {}), [guildId]: rankId } }));
    
    const handleManualBonusChange = (stat: 'vit' | 'spd' | 'dmg' | 'absorption', value: number) => {
        setSelection(prev => ({ ...prev, guildManualBonuses: { ...(prev.guildManualBonuses || { vit: 0, spd: 0, dmg: 0, absorption: 0 }), [stat]: value } }));
    };

    const handleMainProfessionSelect = (profId: string) => setSelection(prev => ({ ...prev, professionId: profId, professionRank: profId ? 'Novice' : undefined }));
    
    const handleSubProfessionToggle = (subProfId: string) => {
        setSelection(prev => {
            const currentSubs = { ...(prev.subProfessions || {}) };
            if (currentSubs[subProfId]) delete currentSubs[subProfId];
            else {
                let defaultRank = 'Débutant';
                if (subProfId === 'sub_enchanteur') defaultRank = 'Disciple';
                if (subProfId === 'sub_specialiste' || subProfId === 'sub_fusionneur') defaultRank = 'Actif';
                currentSubs[subProfId] = defaultRank;
            }
            return { ...prev, subProfessions: currentSubs };
        });
    };
    const handleSubProfessionRankChange = (subProfId: string, rank: string) => setSelection(prev => ({ ...prev, subProfessions: { ...(prev.subProfessions || {}), [subProfId]: rank } }));

    const handleFactionSelect = (id: string) => {
        let newCareerId = selection.careerId;
        const isInstituteDirector = selection.careerId === 'career_institut' && selection.sliderValues?.['career_institut_rank'] === 2;
        if (id && (selection.careerId === 'career_commerce' || isInstituteDirector)) newCareerId = undefined;
        setSelection(prev => ({ ...prev, factionId: id, careerId: newCareerId }));
    };

    // -- Summary for header --
    const raceName = races.find(r => r.id === selection.raceId)?.name || 'Race';
    const className = classes.find(c => c.id === selection.classId)?.name || 'Classe';
    const specName = availableSpecs.find(s => s.id === selection.specializationId)?.name;
    const summaryText = `Niv : ${selection.level} - ${className} - ${raceName}${specName ? ` - ${specName}` : ''}`;

    return (
        <CollapsibleCard 
            id="identity_panel" 
            title={toFantasyTitle("Identité")} 
            icon={User}
            headerActions={<span className="text-[10px] font-medium text-slate-300">{summaryText}</span>}
        >
            <div className="space-y-4">
                <IdentityHeader 
                    characterName={selection.characterName || ''}
                    level={selection.level}
                    displayLevel={displayLevel}
                    onNameChange={(val) => setSelection(prev => ({ ...prev, characterName: val }))}
                    onLevelChange={(val) => setSelection(prev => ({ ...prev, level: val }))}
                    onLevelInput={setDisplayLevel}
                />
                
                <OriginSelector 
                    raceId={selection.raceId}
                    subRaceId={selection.subRaceId}
                    classId={selection.classId}
                    specializationId={selection.specializationId}
                    races={races}
                    availableSubRaces={availableSubRaces}
                    classes={classes}
                    availableSpecs={availableSpecs}
                    isClassLocked={isClassLocked}
                    isSpecLocked={isSpecLocked}
                    onUpdate={updateSelectionField}
                />
                
                {/* --- CLASS & RACE MECHANICS (DELEGATED) --- */}
                <ClassMechanicsPanel 
                    selection={selection}
                    setSelection={setSelection}
                    entities={entities}
                    activeEntities={activeEntities}
                    allItems={allItems}
                    context={context}
                    result={result}
                />

                <ProfessionSelector 
                    professionId={selection.professionId}
                    professionRank={selection.professionRank}
                    subProfessions={selection.subProfessions}
                    mainProfessions={mainProfessions}
                    subProfessionsList={subProfessions}
                    onMainUpdate={handleMainProfessionSelect}
                    onRankUpdate={(rank) => setSelection(prev => ({ ...prev, professionRank: rank }))}
                    onSubToggle={handleSubProfessionToggle}
                    onSubRankUpdate={handleSubProfessionRankChange}
                />

                <SocialSelector 
                    careerId={selection.careerId}
                    factionId={selection.factionId}
                    guildIds={selection.guildIds}
                    guildRanks={selection.guildRanks}
                    guildSecondaryRanks={selection.guildSecondaryRanks}
                    guildManualBonuses={selection.guildManualBonuses}
                    careers={careers}
                    factions={factions}
                    guilds={guilds}
                    canSelectAdventure={canSelectAdventure}
                    canSelectReligion={canSelectReligion}
                    classId={selection.classId}
                    onUpdate={(field, val) => {
                        if (field === 'factionId') handleFactionSelect(val);
                        else updateSelectionField(field, val);
                    }}
                    onManualBonusChange={handleManualBonusChange}
                    onGuildsUpdate={handleGuildsUpdate}
                    onGuildRankUpdate={handleGuildRankUpdate}
                    onSecondaryGuildRankUpdate={handleSecondaryGuildRankUpdate}
                />

                <PoliticsSelector 
                    ppValue={selection.sliderValues?.['political_points_input'] || 0}
                    displayPP={displayPP}
                    onDisplayUpdate={setDisplayPP}
                    onUpdate={(val) => handleSliderChange('political_points_input', val)}
                />

                {/* STATUS BANNERS */}
                {selection.level < 5 && (
                    <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg flex items-start animate-pulse">
                        <Info size={16} className="text-indigo-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-xs text-indigo-200">
                            <span className="font-bold block mb-1">Phase Novice (Niveau 1-4)</span>
                            <span>Vous gagnez +5 stats par niveau. Au niveau 5, votre Classe prendra le relais.</span>
                        </div>
                    </div>
                )}
                {selection.level >= 5 && selection.classId && (
                    <div className="mt-4 p-2 bg-slate-800 border border-slate-700 rounded text-[10px] text-green-400 flex items-center">
                        <Check size={12} className="mr-2 flex-shrink-0" />
                        <span>Phase Classe Active : Vous gagnez désormais des stats spécifiques à votre classe.</span>
                    </div>
                )}
                {selection.level >= 5 && !selection.classId && (
                    <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded flex items-start">
                        <Footprints size={16} className="text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-xs text-slate-300">
                            <span className="font-bold block mb-1 text-slate-200">Vagabond (Sans Classe)</span>
                            <span>Vous continuez à gagner +5 stats par niveau indéfiniment. Sélectionnez une classe pour débloquer des gains supérieurs.</span>
                        </div>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
};
