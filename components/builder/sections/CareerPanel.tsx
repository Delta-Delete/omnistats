
import React from 'react';
import { Briefcase, Star, Award, Crown, Palette, Dumbbell, Trophy, Activity, HeartPulse, Compass, Map, Flag, Sprout, Tent, Backpack, Coins, Gem, BadgeCent, GraduationCap, BookOpen, FlaskConical, Cat, Scroll, Sparkles, Lock, Cross, Sun, Moon } from 'lucide-react';
import { PlayerSelection, Entity } from '../../../types';
import { toFantasyTitle } from '../utils';

interface CareerPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    entities: Entity[];
}

export const CareerPanel: React.FC<CareerPanelProps> = ({ selection, setSelection, entities }) => {
    // Return null if no career selected
    if (!selection.careerId) return null;

    const currentCareer = entities.find(e => e.id === selection.careerId);
    if (!currentCareer) return null;

    const toggleEffect = (id: string, groupName: string) => { 
        setSelection(prev => { 
            const newToggles = { ...prev.toggles }; 
            // Clear entire group before setting new one (Mutual Exclusion)
            if (groupName === 'career_artist_deck') {
                ['career_card_heart', 'career_card_club', 'career_card_spade', 'career_card_diamond', 'career_card_royal'].forEach(k => delete newToggles[k]);
            }
            // Toggle logic: if clicking same, it turns off. If clicking new, it turns on.
            const wasActive = prev.toggles[id];
            
            if (groupName === 'simple_toggle') {
                 newToggles[id] = !wasActive;
            } else {
                 if (!wasActive) newToggles[id] = true;
            }
            
            return { ...prev, toggles: newToggles }; 
        }); 
    };

    const handleRankChange = (key: string, val: number) => {
        setSelection(prev => ({
            ...prev,
            sliderValues: { ...(prev.sliderValues || {}), [key]: val }
        }));
    };

    // --- INSTITUT DE MAGIE LOGIC ---
    if (selection.careerId === 'career_institut') {
        const currentRank = selection.sliderValues?.['career_institut_rank'] || 0;
        const currentSpecialty = selection.sliderValues?.['career_institut_specialty'] || 0;
        const hasFaction = !!selection.factionId;

        const ranks = [
            { val: 0, label: "Personnel de l'Uni.", icon: BookOpen },
            { val: 1, label: "Professeur", icon: GraduationCap },
            { val: 2, label: "Directeur", icon: Crown, requiresNoFaction: true },
        ];

        const specialties = [
            { val: 0, label: "Enchantements", icon: Sparkles, desc: "Effets enchantements +50%." },
            { val: 1, label: "Potions & Alchimie", icon: FlaskConical, desc: "2 potions par tour." },
            { val: 2, label: "Faune & Flore", icon: Cat, desc: "2ème familier autorisé." },
            { val: 3, label: "Sciences Occultes", icon: Scroll, desc: "Relance d'attaque 1x/combat." },
            { val: 4, label: "Voies Arcaniques", icon: Activity, desc: "Bloque une capacité ennemie." },
        ];

        return (
            <div className="mt-6 bg-slate-900 border border-purple-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                {/* HEADER / BANNER AREA */}
                {currentCareer.imageUrl ? (
                    <div className="mb-5 relative z-10 flex justify-center w-full">
                        <img 
                            src={currentCareer.imageUrl} 
                            alt={currentCareer.name} 
                            className="w-full max-w-[300px] h-auto max-h-[100px] object-contain rounded drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        <div className="hidden">
                             <h4 className="text-lg font-perrigord text-purple-300 flex items-center tracking-wide">
                                <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="text-lg font-perrigord text-purple-300 flex items-center tracking-wide">
                            <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                        </h4>
                        <GraduationCap size={20} className="text-purple-500/50" />
                    </div>
                )}

                {/* RANK SELECTOR */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 relative z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Statut Académique</span>
                    </div>
                    <div className="flex gap-2">
                        {ranks.map(rank => {
                            const isActive = currentRank === rank.val;
                            const Icon = rank.icon;
                            // Disable logic: Director forbidden if faction equipped
                            const disabled = rank.requiresNoFaction && hasFaction;

                            return (
                                <button 
                                    key={rank.val} 
                                    onClick={() => !disabled && handleRankChange('career_institut_rank', rank.val)}
                                    disabled={disabled}
                                    className={`flex-1 flex flex-col items-center p-3 rounded-lg border transition-all duration-300 relative ${
                                        isActive 
                                        ? `bg-purple-900/40 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]` 
                                        : disabled
                                            ? 'bg-slate-950 border-slate-800 text-slate-700 cursor-not-allowed'
                                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                                    }`}
                                >
                                    <Icon size={20} className={`mb-1 ${disabled ? 'opacity-50' : ''}`} />
                                    <span className="text-[10px] font-bold uppercase text-center">{rank.label}</span>
                                    {disabled && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                            <Lock size={16} className="text-red-500" />
                                        </div>
                                    )}
                                    {disabled && <span className="text-[7px] text-red-500 font-bold uppercase mt-1">Incompatible Faction</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* SPECIALTY SELECTOR (Only if Professeur) */}
                {currentRank === 1 && (
                    <div className="bg-slate-950/50 border border-purple-900/30 rounded-lg p-3 relative z-10 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between text-[10px] text-purple-400 uppercase font-bold mb-2">
                            <span>Chaire d'Enseignement (Spécialité)</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {specialties.map(spec => {
                                const isActive = currentSpecialty === spec.val;
                                const Icon = spec.icon;
                                return (
                                    <button 
                                        key={spec.val} 
                                        onClick={() => handleRankChange('career_institut_specialty', spec.val)}
                                        className={`flex items-center p-2 rounded-lg border text-left transition-all duration-200 ${
                                            isActive 
                                            ? 'bg-purple-600 text-white border-purple-400' 
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`p-1.5 rounded mr-3 ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-bold uppercase">{spec.label}</div>
                                            <div className={`text-[9px] leading-tight ${isActive ? 'text-purple-100' : 'text-slate-600'}`}>{spec.desc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
            </div>
        );
    }

    // --- RELIGION LOGIC ---
    if (selection.careerId === 'career_religion') {
        const currentRank = selection.sliderValues?.['career_religion_rank'] || 0;
        
        const ranks = [
            { val: 0, label: 'Frère / Sœur', icon: Cross, bonus: '+20' },
            { val: 1, label: 'Père / Mère', icon: Sun, bonus: '+60' },
            { val: 2, label: 'Patriarche / Matriarche', icon: Moon, bonus: '+100' },
        ];

        return (
            <div className="mt-6 bg-slate-900 border border-sky-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                {/* HEADER / BANNER AREA */}
                {currentCareer.imageUrl ? (
                    <div className="mb-5 relative z-10 flex justify-center w-full">
                        <img 
                            src={currentCareer.imageUrl} 
                            alt={currentCareer.name} 
                            className="w-full max-w-[300px] h-auto max-h-[100px] object-contain rounded drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        <div className="hidden">
                             <h4 className="text-lg font-perrigord text-sky-300 flex items-center tracking-wide">
                                <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="text-lg font-perrigord text-sky-300 flex items-center tracking-wide">
                            <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                        </h4>
                        <Cross size={20} className="text-sky-500/50" />
                    </div>
                )}

                {/* RANK SELECTOR */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 relative z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Hiérarchie Ecclésiastique</span>
                    </div>
                    <div className="flex gap-2">
                        {ranks.map(rank => {
                            const isActive = currentRank === rank.val;
                            const Icon = rank.icon;
                            return (
                                <button 
                                    key={rank.val} 
                                    onClick={() => handleRankChange('career_religion_rank', rank.val)}
                                    className={`flex-1 flex flex-col items-center p-3 rounded-lg border transition-all duration-300 relative ${
                                        isActive 
                                        ? `bg-sky-900/40 border-sky-500 text-sky-200 shadow-[0_0_15px_rgba(14,165,233,0.2)]` 
                                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                                    }`}
                                >
                                    <Icon size={20} className="mb-1" />
                                    <span className="text-[9px] font-bold uppercase text-center leading-tight mb-1">{rank.label}</span>
                                    <div className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${isActive ? 'bg-sky-500 text-black' : 'bg-slate-800 text-slate-600'}`}>
                                        {rank.bonus} Vit/Dmg/Spd
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="p-3 bg-slate-950/50 rounded border border-slate-800 text-center relative z-10">
                    <p className="text-[10px] text-slate-400 italic">
                        L'Objet de Culte correspondant à votre rang est automatiquement ajouté à vos bonus actifs. (Non retirable)
                    </p>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
            </div>
        );
    }

    // --- COMMERCE LOGIC ---
    if (selection.careerId === 'career_commerce') {
        const currentRank = selection.sliderValues?.['career_commerce_rank'] || 0;
        
        const ranks = [
            { val: 0, label: 'Marchand(e)', icon: Coins, color: 'text-amber-300' },
            { val: 1, label: 'Bourgeois(e)', icon: BadgeCent, color: 'text-amber-400' },
            { val: 2, label: 'Haut-Bourgeois(e)', icon: Gem, color: 'text-yellow-300' },
        ];

        return (
            <div className="mt-6 bg-slate-900 border border-amber-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                {/* HEADER / BANNER AREA */}
                {currentCareer.imageUrl ? (
                    <div className="mb-5 relative z-10 flex justify-center w-full">
                        <img 
                            src={currentCareer.imageUrl} 
                            alt={currentCareer.name} 
                            className="w-full max-w-[300px] h-auto max-h-[100px] object-contain rounded drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        {/* Fallback Header if image hides itself on error */}
                        <div className="hidden">
                             <h4 className="text-lg font-perrigord text-amber-300 flex items-center tracking-wide">
                                <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="text-lg font-perrigord text-amber-300 flex items-center tracking-wide">
                            <Coins size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                        </h4>
                        <span className="text-[10px] text-amber-500/70 font-mono font-bold uppercase border border-amber-900/50 px-2 py-0.5 rounded bg-slate-950">Fortune & Statut</span>
                    </div>
                )}

                {/* RANK SELECTOR */}
                <div className="bg-slate-950/50 border border-amber-900/30 rounded-lg p-3 relative z-10">
                    <div className="flex justify-between text-[10px] text-amber-500/60 uppercase font-bold mb-2">
                        <span>Rang Social</span>
                    </div>
                    <div className="flex gap-2">
                        {ranks.map(rank => {
                            const isActive = currentRank === rank.val;
                            const Icon = rank.icon;
                            return (
                                <button 
                                    key={rank.val} 
                                    onClick={() => handleRankChange('career_commerce_rank', rank.val)}
                                    className={`flex-1 flex flex-col items-center p-3 rounded-lg border transition-all duration-300 ${
                                        isActive 
                                        ? `bg-gradient-to-b from-amber-900/40 to-slate-900 border-amber-400 ${rank.color} shadow-[0_0_15px_rgba(251,191,36,0.2)]` 
                                        : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-amber-700/50 hover:text-amber-500/50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-full mb-1 transition-all ${isActive ? 'bg-amber-500/20' : 'bg-slate-800'}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-center">{rank.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* BACKGROUND DECORATION */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none text-amber-500">
                    <Coins size={180} />
                </div>
            </div>
        );
    }

    // --- ADVENTURE LOGIC ---
    if (selection.careerId === 'career_adventure') {
        const currentRank = selection.sliderValues?.['career_adventure_rank'] || 0;
        const currentStacks = selection.sliderValues?.['career_adventure_stacks'] || 0;
        
        // Ranks Definition
        const ranks = [
            { val: 0, label: 'Jeune Pousse', icon: Sprout, reg: '+0%', dur: '+0%' },
            { val: 1, label: 'Explorateur', icon: Compass, reg: '+5%', dur: '+0%' },
            { val: 2, label: 'Aguerri', icon: Map, reg: '+10%', dur: '+5%' },
            { val: 3, label: 'Célèbre', icon: Flag, reg: '+15%', dur: '+10%' },
        ];

        const activeRank = ranks.find(r => r.val === currentRank) || ranks[0];

        return (
            <div className="mt-6 bg-slate-900 border border-emerald-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden">
                {/* HEADER / BANNER AREA */}
                {currentCareer.imageUrl ? (
                    <div className="mb-5 relative z-10 flex justify-center w-full">
                        <img 
                            src={currentCareer.imageUrl} 
                            alt={currentCareer.name} 
                            className="w-full max-w-[300px] h-auto max-h-[100px] object-contain rounded drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        <div className="hidden">
                             <h4 className="text-lg font-perrigord text-emerald-300 flex items-center tracking-wide">
                                <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="text-lg font-perrigord text-emerald-300 flex items-center tracking-wide">
                            <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                        </h4>
                        <Tent size={20} className="text-emerald-500/50" />
                    </div>
                )}

                {/* RANK SELECTOR */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 relative z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Rang de Carrière</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {ranks.map(rank => {
                            const isActive = currentRank === rank.val;
                            const Icon = rank.icon;
                            return (
                                <button 
                                    key={rank.val} 
                                    onClick={() => handleRankChange('career_adventure_rank', rank.val)}
                                    className={`flex flex-col items-center p-2 rounded-lg border transition-all ${isActive ? `bg-emerald-900/30 border-emerald-500 text-emerald-400` : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                                >
                                    <Icon size={18} className="mb-1" />
                                    <span className="text-[8px] font-bold uppercase truncate w-full text-center">{rank.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* STACKS SLIDER (NEW) */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <label className="flex items-center text-[10px] uppercase font-bold text-slate-500">
                            <Backpack size={14} className="mr-1.5" /> Nombre d'entraînements
                        </label>
                        <div className="flex items-center">
                            <div className="text-[9px] text-emerald-600 font-mono mr-2">
                                +{currentStacks * 5} Vit/Spd/Dmg
                            </div>
                            <div className="flex items-center justify-center text-xs font-mono font-bold px-1.5 py-0.5 rounded border transition-colors focus-within:ring-1 focus-within:ring-opacity-50 bg-slate-900 border-slate-700 text-emerald-400 focus-within:ring-emerald-500">
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    value={currentStacks} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') handleRankChange('career_adventure_stacks', 0);
                                        else {
                                            const num = parseInt(val, 10);
                                            if (!isNaN(num) && num >= 0) handleRankChange('career_adventure_stacks', num);
                                        }
                                    }}
                                    className="bg-transparent outline-none w-8 appearance-none m-0 p-0 font-inherit text-center"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative h-4 flex items-center">
                        <div className="absolute w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 h-full bg-emerald-700/50" style={{ width: `${Math.min(100, (currentStacks / 20) * 100)}%` }}></div>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="20" 
                            value={Math.min(20, currentStacks)} 
                            onChange={(e) => handleRankChange('career_adventure_stacks', parseInt(e.target.value, 10))} 
                            className="w-full h-2 appearance-none bg-transparent relative z-10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:bg-emerald-500" 
                        />
                    </div>
                </div>

                {/* ACTIVE BONUSES DISPLAY */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded-lg flex flex-col items-center">
                        <span className="text-[9px] uppercase font-bold text-emerald-600 mb-1">Pendant Régional</span>
                        <span className="text-xl font-bold text-emerald-300">{activeRank.reg}</span>
                    </div>
                    <div className="bg-teal-900/10 border border-teal-500/20 p-3 rounded-lg flex flex-col items-center">
                        <span className="text-[9px] uppercase font-bold text-teal-600 mb-1">Pendant Duralas</span>
                        <span className="text-xl font-bold text-teal-300">{activeRank.dur}</span>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                    <Compass size={150} />
                </div>
            </div>
        );
    }

    // --- ATHLETE LOGIC ---
    if (selection.careerId === 'career_athlete') {
        const currentRank = selection.sliderValues?.['career_athlete_rank'] || 0;
        const isSecondWindActive = selection.toggles['career_athlete_second_wind'];

        const ranks = [
            { val: 0, label: 'Athlète', icon: Dumbbell, color: 'text-orange-400' },
            { val: 1, label: 'Athlète Célèbre', icon: Trophy, color: 'text-amber-400' },
        ];

        return (
            <div className="mt-6 bg-slate-900 border border-orange-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden">
                {/* HEADER / BANNER AREA */}
                {currentCareer.imageUrl ? (
                    <div className="mb-5 relative z-10 flex justify-center w-full">
                        <img 
                            src={currentCareer.imageUrl} 
                            alt={currentCareer.name} 
                            className="w-full max-w-[300px] h-auto max-h-[100px] object-contain rounded drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        {/* Fallback Header (Hidden unless image fails) */}
                        <div className="hidden">
                             <h4 className="text-lg font-perrigord text-orange-300 flex items-center tracking-wide">
                                <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="text-lg font-perrigord text-orange-300 flex items-center tracking-wide">
                            <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                        </h4>
                        <Activity size={20} className="text-orange-500/50" />
                    </div>
                )}

                {/* RANK SELECTOR */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 relative z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Rang de Carrière</span>
                    </div>
                    <div className="flex gap-2">
                        {ranks.map(rank => {
                            const isActive = currentRank === rank.val;
                            const Icon = rank.icon;
                            return (
                                <button 
                                    key={rank.val} 
                                    onClick={() => handleRankChange('career_athlete_rank', rank.val)}
                                    className={`flex-1 flex flex-col items-center p-3 rounded-lg border transition-all ${isActive ? `bg-orange-900/30 border-orange-500 ${rank.color}` : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                                >
                                    <Icon size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">{rank.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* SECOND WIND EFFECT */}
                <div className={`relative z-10 border rounded-lg p-3 transition-colors ${isSecondWindActive ? 'bg-orange-900/20 border-orange-500/50' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSecondWindActive ? 'text-orange-400' : 'text-slate-500'}`}>
                            Capacité : Second Souffle
                        </span>
                        <button 
                            onClick={() => toggleEffect('career_athlete_second_wind', 'simple_toggle')}
                            className={`text-[9px] font-bold uppercase px-2 py-1 rounded border transition-colors ${isSecondWindActive ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'}`}
                        >
                            {isSecondWindActive ? 'ACTIF' : 'ACTIVER'}
                        </button>
                    </div>
                    
                    <div className="flex items-start gap-2">
                        <HeartPulse size={16} className={`flex-shrink-0 mt-0.5 ${isSecondWindActive ? 'text-orange-400 animate-pulse' : 'text-slate-600'}`} />
                        <div className={`text-[10px] leading-relaxed italic ${isSecondWindActive ? 'text-orange-100' : 'text-slate-500'}`}>
                            <span className="font-bold not-italic bg-orange-900/40 px-1 rounded text-orange-300 mr-1">IMBLOCABLE</span>
                            La première fois qu'il doit être mis K.O, l'athlète peut jeter un <span className="font-bold text-white">dé – ralliement</span> pendant son tour pour tenter de se relever (Fonctionne après les capacités permettant de se maintenir en vie) dans des combats ou des matchs dans les zones appelées <span className="font-bold text-white">[ARENE]</span> (arène, dépotoir, glima, stadium…).
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none"></div>
            </div>
        );
    }

    // --- ARTISTE LOGIC ---
    if (selection.careerId === 'career_artiste') {
        const currentRank = selection.sliderValues?.['career_artist_rank'] || 0;
        
        // Calculate base bonus: 5% + (Rank * 2.5%) => 5, 7.5, 10
        const baseBonus = 5 + (currentRank * 2.5);
        
        const ranks = [
            { val: 0, label: 'Artiste', bonus: '5%', icon: Star, color: 'text-indigo-400' },
            { val: 1, label: 'Réputé', bonus: '7.5%', icon: Award, color: 'text-amber-400' },
            { val: 2, label: 'Célèbre', bonus: '10%', icon: Crown, color: 'text-yellow-400' },
        ];

        const cards = [
            { id: 'career_card_spade', label: 'Pique', icon: '♠', color: 'text-slate-300', bg: 'bg-slate-800', bonus: `+${baseBonus}% Dmg` },
            { id: 'career_card_club', label: 'Trèfle', icon: '♣', color: 'text-emerald-400', bg: 'bg-slate-900', bonus: `+${baseBonus}% Spd` },
            { id: 'career_card_diamond', label: 'Carreau', icon: '♦', color: 'text-amber-400', bg: 'bg-slate-900', bonus: `+${baseBonus}% Stats` },
            { id: 'career_card_heart', label: 'Cœur', icon: '♥', color: 'text-rose-500', bg: 'bg-slate-900', bonus: `+${baseBonus}% Vit` },
            { id: 'career_card_royal', label: 'Royal', icon: '★', color: 'text-yellow-400', bg: 'bg-indigo-950', bonus: `+${baseBonus * 2}% Stats` },
        ];

        return (
            <div className="mt-6 bg-slate-900 border border-indigo-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden">
                {/* HEADER / BANNER AREA */}
                {currentCareer.imageUrl ? (
                    <div className="mb-5 relative z-10 flex justify-center w-full">
                        <img 
                            src={currentCareer.imageUrl} 
                            alt={currentCareer.name} 
                            className="w-full max-w-[300px] h-auto max-h-[100px] object-contain rounded drop-shadow-[0_0_10px_rgba(79,70,229,0.3)]" 
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        {/* Fallback Header (Hidden unless image fails/is missing via logic above, but handy to have just in case) */}
                        <div className="hidden">
                             <h4 className="text-lg font-perrigord text-indigo-300 flex items-center tracking-wide">
                                <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="text-lg font-perrigord text-indigo-300 flex items-center tracking-wide">
                            <Briefcase size={20} className="mr-2" /> {toFantasyTitle("Carrière")} : {toFantasyTitle(currentCareer.name)}
                        </h4>
                        <Palette size={20} className="text-indigo-500/50" />
                    </div>
                )}

                {/* RANK SELECTOR */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 relative z-10">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-2">
                        <span>Rang de Carrière</span>
                    </div>
                    <div className="flex gap-2">
                        {ranks.map(rank => {
                            const isActive = currentRank === rank.val;
                            const Icon = rank.icon;
                            return (
                                <button 
                                    key={rank.val} 
                                    onClick={() => handleRankChange('career_artist_rank', rank.val)}
                                    className={`flex-1 flex flex-col items-center p-2 rounded-lg border transition-all ${isActive ? `bg-indigo-900/30 border-indigo-500 ${rank.color}` : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                                >
                                    <Icon size={16} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">{rank.label}</span>
                                    <span className="text-[9px] opacity-70">Base {rank.bonus}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ARTIST DECK */}
                <div className="relative z-10">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between">
                        <span>Inspiration (1 Active)</span>
                        <span className="text-indigo-400">Alt Multi</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        {cards.map(card => {
                            const isActive = selection.toggles[card.id];
                            return (
                                <button 
                                    key={card.id} 
                                    onClick={() => toggleEffect(card.id, 'career_artist_deck')} 
                                    className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border-2 transition-all duration-200 transform ${
                                        isActive 
                                        ? `${card.bg} border-current ${card.color} shadow-[0_0_10px_currentColor] scale-105` 
                                        : `border-slate-800 bg-slate-900/50 ${card.color} opacity-60 hover:opacity-100 hover:scale-105 hover:border-slate-600`
                                    }`}
                                >
                                    <span className={`text-xl leading-none mb-1 ${isActive && card.id === 'career_card_royal' ? 'animate-spin-slow' : ''}`}>
                                        {card.icon}
                                    </span>
                                    <span className="text-[8px] font-bold uppercase tracking-wider">{card.bonus}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
            </div>
        );
    }

    return null;
};
