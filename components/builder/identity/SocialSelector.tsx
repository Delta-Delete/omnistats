
import React from 'react';
import { Briefcase, PlusCircle, Activity, Zap, Sword, ShieldAlert } from 'lucide-react';
import { Entity } from '../../../types';
import { FactionSelector, GuildSelector } from '../selectors/SocialSelectors';
import { toFantasyTitle } from '../utils';

interface SocialSelectorProps {
    careerId?: string;
    factionId?: string;
    guildIds?: string[];
    guildRanks?: Record<string, string>;
    guildSecondaryRanks?: Record<string, string>;
    guildManualBonuses?: { vit?: number; spd?: number; dmg?: number; absorption?: number };
    
    careers: Entity[];
    factions: Entity[];
    guilds: Entity[];
    
    canSelectAdventure: boolean;
    canSelectReligion: boolean;
    classId?: string; // Needed for Corrompu check
    
    onUpdate: (field: string, value: any) => void;
    onManualBonusChange: (stat: 'vit' | 'spd' | 'dmg' | 'absorption', value: number) => void;
    onGuildsUpdate: (ids: string[]) => void;
    onGuildRankUpdate: (guildId: string, rankId: string) => void;
    onSecondaryGuildRankUpdate: (guildId: string, rankId: string) => void;
}

export const SocialSelector: React.FC<SocialSelectorProps> = ({
    careerId, factionId, guildIds, guildRanks, guildSecondaryRanks, guildManualBonuses,
    careers, factions, guilds,
    canSelectAdventure, canSelectReligion, classId,
    onUpdate, onManualBonusChange, onGuildsUpdate, onGuildRankUpdate, onSecondaryGuildRankUpdate
}) => {
    return (
        <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-4">
            {/* CAREER */}
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex items-center">
                    <Briefcase size={12} className="mr-1" /> Carrière
                </label>
                <select 
                    className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none" 
                    value={careerId || ''} 
                    onChange={(e) => onUpdate('careerId', e.target.value)}
                >
                    <option value="">Sélectionner</option>
                    {careers.map(o => { 
                        const isAdventure = o.id === 'career_adventure'; 
                        const isReligion = o.id === 'career_religion'; 
                        const isCommerce = o.id === 'career_commerce'; 
                        const hasFaction = !!factionId; 
                        
                        if (isAdventure && !canSelectAdventure) return <option key={o.id} value={o.id} disabled className="text-slate-500">🔒 {o.name} (Req: Niv 5 + Classe)</option>; 
                        if (isReligion && !canSelectReligion) return <option key={o.id} value={o.id} disabled className="text-slate-500">🔒 {o.name} (Req: Niv 10+)</option>; 
                        if (isCommerce && hasFaction) return <option key={o.id} value={o.id} disabled className="text-slate-500">🔒 {o.name} (Incompatible avec Faction)</option>; 
                        
                        return <option key={o.id} value={o.id}>{o.name}</option>; 
                    })}
                </select>
            </div>

            {/* FACTION & GUILDS */}
            <FactionSelector factions={factions} selectedId={factionId} onSelect={(id) => onUpdate('factionId', id)} />
            
            <GuildSelector 
                guilds={guilds} 
                selectedIds={guildIds || []} 
                onUpdate={onGuildsUpdate} 
                guildRanks={guildRanks} 
                guildSecondaryRanks={guildSecondaryRanks} 
                onRankUpdate={onGuildRankUpdate} 
                onSecondaryRankUpdate={onSecondaryGuildRankUpdate} 
            />

            {/* MANUAL GUILD BONUSES */}
            {guildIds && guildIds.length > 0 && (
                <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                        <h4 className="text-sm font-perrigord text-indigo-400 flex items-center tracking-wide">
                            <PlusCircle size={14} className="mr-1.5" /> {toFantasyTitle("Bonus de Guilde")}
                        </h4>
                        <span className="text-[9px] text-slate-500 italic">Valeurs fixes ajoutées aux stats de base</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[9px] text-emerald-500 font-bold uppercase mb-1 flex items-center"><Activity size={10} className="mr-1"/> Vitalité</label>
                            <input type="number" value={guildManualBonuses?.vit || 0} onChange={(e) => onManualBonusChange('vit', parseInt(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[9px] text-amber-500 font-bold uppercase mb-1 flex items-center"><Zap size={10} className="mr-1"/> Vitesse</label>
                            <input type="number" value={guildManualBonuses?.spd || 0} onChange={(e) => onManualBonusChange('spd', parseInt(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-amber-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[9px] text-rose-500 font-bold uppercase mb-1 flex items-center"><Sword size={10} className="mr-1"/> Dégâts</label>
                            <input type="number" value={guildManualBonuses?.dmg || 0} onChange={(e) => onManualBonusChange('dmg', parseInt(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-rose-500 outline-none" />
                        </div>
                        {classId === 'corrompu' && (
                            <div className="col-span-3 mt-1 pt-2 border-t border-slate-800 border-dashed">
                                <label className="block text-[9px] text-violet-400 font-bold uppercase mb-1 flex items-center"><ShieldAlert size={10} className="mr-1"/> Corruption (Absorption %)</label>
                                <input type="number" value={guildManualBonuses?.absorption || 0} onChange={(e) => onManualBonusChange('absorption', parseInt(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-mono focus:border-violet-500 outline-none" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
