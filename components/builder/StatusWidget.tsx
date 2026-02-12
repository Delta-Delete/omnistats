import React, { useEffect, useRef, useState } from 'react';
import { Flag, Package, Zap, Users, Info, Shield, Music, Activity, Skull } from 'lucide-react';
import { PlayerSelection, Entity } from '../../types';
import { useStatusLogic } from '../../hooks/useStatusLogic';

interface StatusWidgetProps {
    selection: PlayerSelection;
    activeEntities: Entity[];
    onClick: () => void;
    context?: any;
    setSelection?: any; 
}

// Helper pour les icônes de buffs
const getBuffIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('rage') || lower.includes('colère')) return <Zap size={16} />;
    if (lower.includes('peur') || lower.includes('protection')) return <Shield size={16} />;
    if (lower.includes('sang') || lower.includes('pacte')) return <Skull size={16} />;
    if (lower.includes('musique') || lower.includes('partition')) return <Music size={16} />;
    if (lower.includes('posture')) return <Activity size={16} />;
    return <Zap size={16} />;
};

export const StatusWidget: React.FC<StatusWidgetProps> = ({ selection, activeEntities, onClick, context, setSelection }) => {
    
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [hasNotification, setHasNotification] = useState(false);
    
    // Ref pour stocker l'empreinte précédente des données et détecter les changements
    const prevDataHash = useRef<string>('');

    // Utilisation du Hook Centralisé
    const { widgetData } = useStatusLogic({ 
        selection, 
        setSelection: setSelection || (() => {}), 
        activeEntities, 
        context: context || {} 
    });

    const data = widgetData;

    // DETECTION DE CHANGEMENTS (Notification Visuelle)
    useEffect(() => {
        // Construction d'une signature unique basée sur le contenu important pour le HUD
        const factionPart = data.faction?.id || '';
        const guildsPart = data.guilds.map(g => g.id).sort().join(',');
        const setsPart = data.sets.map(s => `${s.name}:${s.count}:${s.active}`).sort().join(',');
        const buffsPart = data.buffs.map(b => `${b.id}:${b.active}`).sort().join(',');
        
        // On inclut aussi les entités qui apportent des Invocations (souvent invisible dans le widget mais important)
        const summonProviders = activeEntities.filter(e => (e.summons && e.summons.length > 0) || e.summonConfig).map(e => e.id).sort().join(',');

        const currentHash = `${factionPart}|${guildsPart}|${setsPart}|${buffsPart}|${summonProviders}`;

        // Si ce n'est pas le premier rendu (prevDataHash non vide) et que ça a changé
        if (prevDataHash.current !== '' && prevDataHash.current !== currentHash) {
            setHasNotification(true);
            const timer = setTimeout(() => setHasNotification(false), 4000);
            return () => clearTimeout(timer);
        }

        prevDataHash.current = currentHash;
    }, [data, activeEntities]);

    // Masquer le widget s'il est vide (optionnel, ici on le garde pour l'accès rapide au Panel)
    const isEmpty = !data.faction && data.sets.length === 0 && data.buffs.length === 0 && data.guilds.length === 0;

    return (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3">
            {/* TOOLTIP AREA (Dynamic) */}
            {hoveredItem && (
                <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-lg shadow-xl text-xs text-white whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 pointer-events-none z-50">
                    {hoveredItem}
                </div>
            )}

            {/* HUD CONTAINER */}
            <div className="flex items-center bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full sm:p-2 p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:border-slate-600 gap-2">
                
                {/* 1. FACTION (Major Icon) */}
                {data.faction && (
                    <div 
                        className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden cursor-help group"
                        onMouseEnter={() => setHoveredItem(data.faction?.name || '')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {data.faction.imageUrl ? (
                            <img src={data.faction.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                        ) : (
                            <Flag size={20} className="text-indigo-400 sm:scale-150" />
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full"></div>
                    </div>
                )}

                {/* Separator if needed */}
                {data.faction && (data.sets.length > 0 || data.buffs.length > 0 || data.guilds.length > 0) && (
                    <div className="w-px h-6 sm:h-10 bg-slate-800"></div>
                )}

                {/* 2. SETS (Square Badges) */}
                {data.sets.map((set, idx) => (
                    <div 
                        key={idx}
                        className={`relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border transition-all cursor-help ${set.active ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-900 border-slate-700 grayscale opacity-70'}`}
                        onMouseEnter={() => setHoveredItem(`${set.name} (${set.count} pcs)`)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={onClick}
                    >
                        {set.icon ? (
                            <img src={set.icon} className="w-6 h-6 sm:w-10 sm:h-10 object-contain" alt="" />
                        ) : (
                            <Package size={16} className={set.active ? 'text-emerald-400 sm:scale-150' : 'text-slate-500 sm:scale-150'} />
                        )}
                        {/* Count Badge */}
                        <div className="absolute -top-1 -right-1 bg-black text-[8px] sm:text-[10px] font-bold text-white px-1 sm:px-1.5 rounded-full border border-slate-700 shadow-sm leading-tight">
                            {set.count}
                        </div>
                    </div>
                ))}

                {/* Separator */}
                {data.sets.length > 0 && data.buffs.length > 0 && (
                    <div className="w-px h-6 sm:h-10 bg-slate-800"></div>
                )}

                {/* 3. BUFFS (Circular Icons) */}
                {data.buffs.map((buff) => (
                    <div 
                        key={buff.id}
                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-indigo-900/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)] animate-in fade-in zoom-in cursor-help hover:bg-indigo-900/40 hover:text-white transition-colors"
                        onMouseEnter={() => setHoveredItem(buff.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <div className="sm:scale-125">{getBuffIcon(buff.label)}</div>
                    </div>
                ))}

                {/* GUILDS (Mini Icons) */}
                {data.guilds.length > 0 && (
                    <>
                        <div className="w-px h-6 sm:h-10 bg-slate-800"></div>
                        <div className="flex -space-x-2">
                            {data.guilds.map(g => (
                                <div 
                                    key={g.id}
                                    className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden hover:z-10 hover:scale-110 transition-transform cursor-help"
                                    onMouseEnter={() => setHoveredItem(`Guilde : ${g.name}`)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {g.imageUrl ? <img src={g.imageUrl} className="w-full h-full object-cover" alt=""/> : <Users size={12} className="text-slate-500 sm:scale-150"/>}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* OPEN FULL PANEL BUTTON (Always Visible) */}
                <button 
                    onClick={onClick}
                    className={`ml-1 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
                        hasNotification
                        ? 'bg-yellow-600 text-white shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse-slow' // Notification Style
                        : (data.availableToggleCount > 0 && data.buffs.length === 0)
                            ? 'bg-indigo-600 text-white animate-pulse' // Reminder Style (Unused toggles)
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400' // Default
                    }`}
                    title="Ouvrir la gestion des effets"
                >
                    <Info size={16} className={`sm:scale-150 relative z-10 transition-transform ${hasNotification ? 'scale-110' : ''}`} />
                    
                    {/* Ripple effect for notification */}
                    {hasNotification && (
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                    )}
                </button>

            </div>
        </div>
    );
};