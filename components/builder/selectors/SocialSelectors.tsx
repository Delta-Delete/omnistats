
import React, { useState, useRef, useEffect } from 'react';
import { Flag, Users, Trash2, Plus, ChevronDown, Check, Star, Lock, Globe, EyeOff, Award } from 'lucide-react';
import { Entity } from '../../../types';

interface FactionSelectorProps {
    factions: Entity[];
    selectedId?: string;
    onSelect: (id: string) => void;
}

export const FactionSelector: React.FC<FactionSelectorProps> = ({ factions, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedFaction = factions.find(f => f.id === selectedId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
    };

    const renderStars = (count: number) => {
        return (
            <div className="flex space-x-0.5 ml-2" title={`Prestige: ${count}`}>
                {Array.from({ length: count }).map((_, i) => (
                    <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />
                ))}
            </div>
        );
    };

    return (
        <div className="mb-4" ref={dropdownRef}>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2 flex items-center">
                <Flag size={12} className="mr-1" /> Faction (Identité)
            </label>
            
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                        isOpen 
                        ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/50' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                >
                    <div className="flex items-center min-w-0">
                        {selectedFaction ? (
                            <>
                                {selectedFaction.imageUrl ? (
                                    <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 flex-shrink-0 mr-3 overflow-hidden flex items-center justify-center p-0.5">
                                        <img src={selectedFaction.imageUrl} alt={selectedFaction.name} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded bg-slate-800 border border-slate-700 flex-shrink-0 mr-3 flex items-center justify-center text-slate-500">
                                        <Flag size={20} />
                                    </div>
                                )}
                                <span className="text-sm font-bold text-slate-200 truncate flex items-center">
                                    {selectedFaction.name}
                                    {selectedFaction.prestige && selectedFaction.prestige > 0 && renderStars(selectedFaction.prestige)}
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded bg-slate-800 border border-slate-700 flex-shrink-0 mr-3 flex items-center justify-center text-slate-500">
                                    <Flag size={20} className="opacity-50" />
                                </div>
                                <span className="text-sm text-slate-500 italic">Sélectionner une faction...</span>
                            </>
                        )}
                    </div>
                    <ChevronDown size={16} className={`text-slate-500 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => handleSelect('')}
                            className={`w-full flex items-center p-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 ${!selectedId ? 'bg-slate-800/50' : ''}`}
                        >
                            <div className="w-12 h-12 rounded border border-slate-700 border-dashed mr-3 flex items-center justify-center text-slate-500">
                                <Trash2 size={20} />
                            </div>
                            <span className="text-sm text-slate-400">Aucune faction</span>
                            {!selectedId && <Check size={16} className="ml-auto text-slate-500" />}
                        </button>

                        {factions.map(faction => (
                            <button
                                key={faction.id}
                                onClick={() => handleSelect(faction.id)}
                                className={`w-full flex items-start p-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0 ${selectedId === faction.id ? 'bg-indigo-900/20' : ''}`}
                            >
                                <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 flex-shrink-0 mr-3 overflow-hidden flex items-center justify-center mt-0.5 p-0.5">
                                    {faction.imageUrl ? (
                                        <img src={faction.imageUrl} alt={faction.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Flag size={20} className="text-slate-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className={`text-sm font-bold truncate flex items-center ${selectedId === faction.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                                            {faction.name}
                                            {faction.prestige && faction.prestige > 0 && renderStars(faction.prestige)}
                                        </div>
                                        {selectedId === faction.id && <Check size={16} className="text-indigo-400 ml-2 flex-shrink-0" />}
                                    </div>
                                    {faction.description && (
                                        <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                                            {faction.description}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface GuildSelectorProps {
    guilds: Entity[];
    selectedIds: string[];
    onUpdate: (ids: string[]) => void;
    // NEW PROPS FOR RANKS
    guildRanks?: Record<string, string>;
    guildSecondaryRanks?: Record<string, string>; // NEW
    onRankUpdate?: (guildId: string, rankId: string) => void;
    onSecondaryRankUpdate?: (guildId: string, rankId: string) => void; // NEW
}

export const GuildSelector: React.FC<GuildSelectorProps> = ({ guilds, selectedIds, onUpdate, guildRanks, guildSecondaryRanks, onRankUpdate, onSecondaryRankUpdate }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const availableGuilds = guilds.filter(g => !selectedIds.includes(g.id));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAddOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addGuild = (id: string) => {
        onUpdate([...selectedIds, id]);
        setIsAddOpen(false);
    };

    const removeGuild = (idToRemove: string) => {
        onUpdate(selectedIds.filter(id => id !== idToRemove));
        // Optional: Clean up rank state if needed, but not strictly required
    };

    const renderStatusBadge = (status?: string) => {
        switch(status) {
            case 'OPEN':
                return <span className="flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20"><Globe size={10} className="mr-1"/> Guilde Ouverte</span>;
            case 'SEMI_OPEN':
                return <span className="flex items-center text-[9px] font-bold text-amber-400 bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-500/20"><Lock size={10} className="mr-1"/> Guilde Semi-Ouverte</span>;
            case 'SECRET':
                return <span className="flex items-center text-[9px] font-bold text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-500/20"><EyeOff size={10} className="mr-1"/> Guilde Secrète</span>;
            default:
                return null;
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2 flex items-center">
                <Users size={12} className="mr-1" /> Guildes (Multiple)
            </label>
            
            <div className="space-y-2">
                {selectedIds.map(id => {
                    const guild = guilds.find(g => g.id === id);
                    if (!guild) return null;
                    
                    const hasRanks = guild.guildRanks && guild.guildRanks.length > 0;
                    const hasSecondaryRanks = guild.secondaryGuildRanks && guild.secondaryGuildRanks.length > 0;
                    
                    const selectedRankId = guildRanks?.[guild.id] || '';
                    const selectedSecondaryRankId = guildSecondaryRanks?.[guild.id] || '';

                    return (
                        <div key={id} className="p-2 rounded-lg border bg-slate-900 border-slate-700 group hover:border-slate-600 transition-colors animate-in fade-in zoom-in-95 duration-200">
                            {/* Header: Icon + Name + Status + Remove */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center min-w-0">
                                    {guild.imageUrl ? (
                                        <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 flex-shrink-0 mr-3 overflow-hidden flex items-center justify-center p-0.5">
                                            <img src={guild.imageUrl} alt={guild.name} className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex-shrink-0 mr-3 flex items-center justify-center text-slate-500">
                                            <Users size={18} />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-xs font-bold text-slate-200">{guild.name}</div>
                                        <div className="mt-0.5">{renderStatusBadge(guild.guildStatus)}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeGuild(id)}
                                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/10 rounded transition-colors"
                                    title="Quitter la guilde"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Rank Selectors Container */}
                            <div className="space-y-2 mt-2">
                                {/* Rank Selector (Primary) */}
                                {hasRanks && onRankUpdate && (
                                    <div className="pt-2 border-t border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <Award size={14} className="text-slate-500 flex-shrink-0" />
                                            <select 
                                                value={selectedRankId}
                                                onChange={(e) => onRankUpdate(guild.id, e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                                            >
                                                <option value="">-- Choisir un Rang (Principal) --</option>
                                                {guild.guildRanks?.map(rank => (
                                                    <option key={rank.id} value={rank.id}>{rank.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Rank Selector (Secondary) */}
                                {hasSecondaryRanks && onSecondaryRankUpdate && (
                                    <div className="pt-2 border-t border-slate-800 border-dashed">
                                        <div className="flex items-center gap-2">
                                            <Award size={14} className="text-slate-500 flex-shrink-0 opacity-70" />
                                            <select 
                                                value={selectedSecondaryRankId}
                                                onChange={(e) => onSecondaryRankUpdate(guild.id, e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                                            >
                                                <option value="">-- Choisir un Rang (Secondaire) --</option>
                                                {guild.secondaryGuildRanks?.map(rank => (
                                                    <option key={rank.id} value={rank.id}>{rank.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsAddOpen(!isAddOpen)}
                        className={`w-full flex items-center justify-center p-2 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-900 hover:border-indigo-500/50 hover:text-indigo-400 text-slate-500 transition-all text-xs font-bold uppercase ${availableGuilds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={availableGuilds.length === 0}
                    >
                        <Plus size={14} className="mr-1.5" /> Ajouter une Guilde
                    </button>

                    {isAddOpen && availableGuilds.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto custom-scrollbar">
                            {availableGuilds.map(guild => (
                                <button
                                    key={guild.id}
                                    onClick={() => addGuild(guild.id)}
                                    className="w-full flex items-start p-2 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
                                >
                                    <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex-shrink-0 mr-3 overflow-hidden flex items-center justify-center p-0.5">
                                        {guild.imageUrl ? (
                                            <img src={guild.imageUrl} alt={guild.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <Users size={14} className="text-slate-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-slate-300">{guild.name}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {renderStatusBadge(guild.guildStatus)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
