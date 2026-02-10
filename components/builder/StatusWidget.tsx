
import React, { useMemo, useState } from 'react';
import { Flag, Package, Zap, Users, Info, Shield, Sword, Activity, Skull, Music, Lock, Globe, EyeOff, Ghost } from 'lucide-react';
import { PlayerSelection, Entity, EntityType, ActiveSummon } from '../../types';

interface StatusWidgetProps {
    selection: PlayerSelection;
    activeEntities: Entity[];
    activeSummons: ActiveSummon[]; // New prop to track summons
    onClick: () => void;
}

// Helper pour les icônes de buffs
const getBuffIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('rage') || lower.includes('colère')) return <Zap size={14} />;
    if (lower.includes('peur') || lower.includes('protection')) return <Shield size={14} />;
    if (lower.includes('sang') || lower.includes('pacte')) return <Skull size={14} />;
    if (lower.includes('musique') || lower.includes('partition')) return <Music size={14} />;
    if (lower.includes('posture')) return <Activity size={14} />;
    return <Zap size={14} />;
};

export const StatusWidget: React.FC<StatusWidgetProps> = ({ selection, activeEntities, activeSummons, onClick }) => {
    
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const data = useMemo(() => {
        // A. Identity
        const faction = activeEntities.find(e => e.type === EntityType.FACTION);
        
        // Filter out virtual guild entities created by the engine to strictly show valid guilds in UI
        const guilds = activeEntities.filter(e => 
            e.type === EntityType.GUILD && 
            !e.id.startsWith('virtual_') && 
            !e.id.includes('manual')
        );

        // B. Sets
        const sets: { name: string, count: number, active: boolean, icon?: string }[] = [];
        const setEntities = activeEntities.filter(e => e.type === EntityType.ITEM_SET);
        const factionLegacySets = activeEntities.filter(e => e.type === EntityType.FACTION && e.modifiers && e.modifiers.length > 0);
        
        [...setEntities, ...factionLegacySets].forEach(set => {
            const isLegacy = set.type === EntityType.FACTION;
            const count = activeEntities.filter(e => e.type === EntityType.ITEM && (isLegacy ? e.factionId === set.id : e.setId === set.id)).length;
            if (count > 0) {
                const isActive = count >= 2; 
                sets.push({ name: set.name.replace('Set : ', '').replace('Panoplie ', ''), count, active: isActive, icon: set.imageUrl });
            }
        });

        // C. Buffs / Toggles
        const buffs: { id: string, label: string, active: boolean }[] = [];
        let availableToggleCount = 0; // Compteur pour savoir si on doit afficher le widget même si inactif
        const seenToggles = new Set<string>();

        activeEntities.forEach(ent => {
            (ent.modifiers || []).forEach(mod => {
                if (mod.toggleId) {
                    // Exclusions : Mécaniques de classes gérées ailleurs (Panneau Identité)
                    if (mod.toggleGroup === 'arlequin_card') return; 
                    if (mod.toggleGroup === 'career_artist_deck') return; 
                    if (mod.toggleGroup === 'thanato_organ') return; 
                    if (mod.toggleGroup === 'pugilist_stance') return; 
                    if (mod.toggleId === 'guild_rank_bonus') return;
                    
                    if (!seenToggles.has(mod.toggleId)) {
                        seenToggles.add(mod.toggleId);
                        availableToggleCount++; // Il y a un toggle disponible

                        let label = mod.toggleName || mod.toggleId;
                        label = label.replace('Posture ', '').replace('Inspiration ', '');
                        
                        // On n'ajoute à la liste visuelle (icônes) que si c'est ACTIF
                        if (selection.toggles[mod.toggleId]) {
                            buffs.push({ id: mod.toggleId, label, active: true });
                        }
                    }
                }
            });
        });

        // Sliders as Buffs (Comptent comme actifs et disponibles)
        if ((selection.sliderValues?.['rage_stacks'] || 0) > 0) {
             buffs.push({ id: 'rage', label: `Rage x${selection.sliderValues!['rage_stacks']}`, active: true });
             availableToggleCount++;
        }
        if ((selection.sliderValues?.['sans_peur_stacks'] || 0) > 0) {
             buffs.push({ id: 'peur', label: `Sans Peur x${selection.sliderValues!['sans_peur_stacks']}`, active: true });
             availableToggleCount++;
        }
        if ((selection.sliderValues?.['colere_vive_stacks'] || 0) > 0) {
             buffs.push({ id: 'colere', label: `Colère x${selection.sliderValues!['colere_vive_stacks']}`, active: true });
             availableToggleCount++;
        }

        return { faction, guilds, sets, buffs, availableToggleCount };
    }, [activeEntities, selection]);

    // Le widget s'affiche s'il y a une faction, une guilde, un set, un buff actif OU simplement des toggles disponibles
    const hasContent = data.faction || 
                       data.guilds.length > 0 || 
                       data.sets.length > 0 || 
                       data.buffs.length > 0 || 
                       data.availableToggleCount > 0 ||
                       activeSummons.length > 0; // SHOW IF SUMMONS ARE ACTIVE

    if (!hasContent) return null;

    return (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3">
            {/* TOOLTIP AREA (Dynamic) */}
            {hoveredItem && (
                <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-lg shadow-xl text-xs text-white whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 pointer-events-none z-50">
                    {hoveredItem}
                </div>
            )}

            {/* HUD CONTAINER */}
            <div className="flex items-center bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:border-slate-600 gap-2">
                
                {/* 1. FACTION (Major Icon) */}
                {data.faction && (
                    <div 
                        className="relative w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden cursor-help group"
                        onMouseEnter={() => setHoveredItem(data.faction?.name || '')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {data.faction.imageUrl ? (
                            <img src={data.faction.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                        ) : (
                            <Flag size={18} className="text-indigo-400" />
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full"></div>
                    </div>
                )}

                {/* Separator if needed */}
                {data.faction && (data.sets.length > 0 || data.buffs.length > 0 || activeSummons.length > 0) && (
                    <div className="w-px h-6 bg-slate-800"></div>
                )}

                {/* 2. SETS (Square Badges) */}
                {data.sets.map((set, idx) => (
                    <div 
                        key={idx}
                        className={`relative w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-help ${set.active ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-900 border-slate-700 grayscale opacity-70'}`}
                        onMouseEnter={() => setHoveredItem(`${set.name} (${set.count} pcs)`)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={onClick} // Open full panel on click
                    >
                        {set.icon ? (
                            <img src={set.icon} className="w-6 h-6 object-contain" alt="" />
                        ) : (
                            <Package size={14} className={set.active ? 'text-emerald-400' : 'text-slate-500'} />
                        )}
                        {/* Count Badge */}
                        <div className="absolute -top-1 -right-1 bg-black text-[8px] font-bold text-white px-1 rounded-full border border-slate-700 shadow-sm leading-tight">
                            {set.count}
                        </div>
                    </div>
                ))}

                {/* Separator */}
                {data.sets.length > 0 && (data.buffs.length > 0 || activeSummons.length > 0) && (
                    <div className="w-px h-6 bg-slate-800"></div>
                )}

                {/* 3. SUMMONS (Visual indicator for Mastodonte etc.) */}
                {activeSummons.length > 0 && (
                    <div
                        className="relative w-8 h-8 rounded-full bg-emerald-900/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in cursor-help hover:bg-emerald-900/40 hover:text-white transition-colors"
                        onMouseEnter={() => setHoveredItem(`${activeSummons.length} Invocations Actives`)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={onClick}
                    >
                        <Ghost size={14} />
                        <div className="absolute -top-1 -right-1 bg-emerald-900 text-[8px] font-bold text-emerald-100 px-1.5 rounded-full border border-emerald-500 shadow-sm leading-tight">
                            {activeSummons.reduce((acc, s) => acc + s.count, 0)}
                        </div>
                    </div>
                )}

                {/* 4. BUFFS (Circular Icons) */}
                {data.buffs.map((buff) => (
                    <div 
                        key={buff.id}
                        className="w-8 h-8 rounded-full bg-indigo-900/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)] animate-in fade-in zoom-in cursor-help hover:bg-indigo-900/40 hover:text-white transition-colors"
                        onMouseEnter={() => setHoveredItem(buff.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {getBuffIcon(buff.label)}
                    </div>
                ))}

                {/* GUILDS (Mini Icons) */}
                {data.guilds.length > 0 && (
                    <>
                        <div className="w-px h-6 bg-slate-800"></div>
                        <div className="flex -space-x-2">
                            {data.guilds.map(g => (
                                <div 
                                    key={g.id}
                                    className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden hover:z-10 hover:scale-110 transition-transform cursor-help"
                                    onMouseEnter={() => setHoveredItem(`Guilde : ${g.name}`)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {g.imageUrl ? <img src={g.imageUrl} className="w-full h-full object-cover" alt=""/> : <Users size={10} className="text-slate-500"/>}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* OPEN FULL PANEL BUTTON */}
                <button 
                    onClick={onClick}
                    className={`ml-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        // Highlight button if there are available toggles but no active buffs shown
                        data.availableToggleCount > 0 && data.buffs.length === 0 
                        ? 'bg-indigo-600 text-white animate-pulse' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                    title="Ouvrir la gestion des effets"
                >
                    <Info size={12} />
                </button>

            </div>
        </div>
    );
};
