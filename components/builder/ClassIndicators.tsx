
import React from 'react';
import { Wind, Heart, Sword, Shield, ShieldCheck, Music, Megaphone } from 'lucide-react';
import { Entity, EntityType } from '../../types';

export const CeleriteIndicator: React.FC<{ activeEntities: Entity[] }> = ({ activeEntities }) => {
    const isActive = activeEntities.some(e => {
        if (!e.type || e.type !== EntityType.ITEM) return false;
        const sub = (e.subCategory || '').toLowerCase();
        return sub.includes('griffe') || sub.includes('fronde');
    });

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isActive ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Wind size={20} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase ${isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isActive ? 'Célérité Active' : 'Célérité Inactive'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {isActive ? '+25% Vitesse appliqué' : 'Requiert: Griffe ou Fronde'}
                    </p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isActive ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                {isActive ? 'ON' : 'OFF'}
            </div>
        </div>
    );
};

export const AnticipationIndicator: React.FC<{ activeEntities: Entity[] }> = ({ activeEntities }) => {
    const isActive = activeEntities.some(e => {
        if (!e.type || e.type !== EntityType.ITEM) return false;
        return e.categoryId === 'weapon' && (e.equipmentCost || 0) >= 2;
    });

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isActive ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Heart size={20} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase ${isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isActive ? 'Anticipation Active' : 'Anticipation Inactive'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {isActive ? '+33% Vitalité (Final) appliqué' : 'Requiert: Arme à 2 mains'}
                    </p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isActive ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                {isActive ? 'ON' : 'OFF'}
            </div>
        </div>
    );
};

export const ChevalierIndicator: React.FC<{ activeEntities: Entity[] }> = ({ activeEntities }) => {
    const isActive = activeEntities.some(e => {
        if (!e.type || e.type !== EntityType.ITEM) return false;
        const sub = e.subCategory || '';
        return sub === 'Épées' || sub === 'Lances';
    });

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isActive ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Sword size={20} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase ${isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isActive ? 'Chevalier Actif' : 'Chevalier Inactif'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {isActive ? '+25% Dégâts appliqué' : 'Requiert: Épée ou Lance'}
                    </p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isActive ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                {isActive ? 'ON' : 'OFF'}
            </div>
        </div>
    );
};

export const CroiseIndicator: React.FC<{ activeEntities: Entity[] }> = ({ activeEntities }) => {
    const isActive = activeEntities.some(e => {
        if (!e.type || e.type !== EntityType.ITEM) return false;
        const sub = (e.subCategory || '').toLowerCase();
        return sub.includes('bouclier') || sub.includes('fléaux');
    });

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isActive ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${isActive ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Shield size={20} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase ${isActive ? 'text-yellow-300' : 'text-red-300'}`}>
                        {isActive ? 'Croisé Actif' : 'Bonus Inactif'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {isActive ? '+25% Vitalité (Final) appliqué' : 'Requiert : Bouclier ou Fléau'}
                    </p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isActive ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                {isActive ? 'ON' : 'OFF'}
            </div>
        </div>
    );
};

export const ParadesParfaitesIndicator: React.FC<{ level: number; modifierResults: Record<string, number> }> = ({ level, modifierResults }) => {
    const isActive = level >= 10;
    const tier = level >= 30 ? '100%' : level >= 20 ? '75%' : level >= 10 ? '50%' : '0%';
    const bonusVal = modifierResults['spec_pp_vit'] || 0;

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-sky-900/20 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.1)]' : 'bg-slate-900 border-slate-800 opacity-75'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
            <div className="flex items-center relative z-10">
                <div className={`p-2.5 rounded-lg mr-3 flex-shrink-0 transition-colors ${isActive ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-600'}`}>
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wide flex items-center ${isActive ? 'text-sky-300' : 'text-slate-500'}`}>
                        {isActive ? 'Parades Parfaites' : 'Parades Inactives'}
                    </h4>
                    <div className="text-[10px] mt-1 space-y-0.5">
                        <div className={isActive ? 'text-slate-300' : 'text-slate-600'}>
                            Bonus Actif : <span className={`font-mono font-bold ${isActive ? 'text-sky-400' : 'text-slate-600'}`}>{tier}</span> des Dégâts de l'arme
                        </div>
                        {isActive && (
                            <div className="text-sky-200/60 italic">
                                Basé sur votre meilleure arme
                            </div>
                        )}
                        {!isActive && (
                            <div className="text-red-400/60 italic">
                                Requiert Niveau 10+
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end relative z-10 pl-4 border-l border-slate-700/50 ml-4">
                <span className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Gain Vitalité</span>
                <span className={`text-xl font-bold font-mono ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                    +{Math.ceil(bonusVal)}
                </span>
            </div>
        </div>
    );
};

export const MaitreAirIndicator: React.FC<{ partitionCap: number; booster: number; mastery: number }> = ({ partitionCap, booster, mastery }) => {
    const isActive = partitionCap >= 7;
    
    // Calcul de la valeur boostée
    const baseValue = 50;
    const totalBoost = 1 + (booster/100) + (mastery/100);
    // FIX: Utilisation de parseFloat et toFixed(2) pour corriger les erreurs de flottant (ex: 55.0000001 -> 55)
    const rawValue = baseValue * totalBoost;
    const finalValue = Math.ceil(parseFloat(rawValue.toFixed(2)));
    const bonus = finalValue - baseValue;

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isActive ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Music size={20} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase ${isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isActive ? 'Maître de l\'Air Actif' : 'Maître de l\'Air Inactif'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {isActive ? (
                            <span>
                                +{baseValue}% {bonus > 0 && <span className="text-emerald-400 font-bold">(+{bonus}%)</span>} All Stats appliqué
                            </span>
                        ) : (
                            'Requiert: Instrument avec Capacité 7+'
                        )}
                    </p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isActive ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                {isActive ? 'ON' : 'OFF'}
            </div>
        </div>
    );
};

export const CriGuerreIndicator: React.FC<{ activeEntities: Entity[]; booster: number; mastery: number }> = ({ activeEntities, booster, mastery }) => {
    const hasPercussion = activeEntities.some(e => {
        if (!e.type || e.type !== EntityType.ITEM) return false;
        const sub = (e.subCategory || '').toLowerCase();
        return sub.includes('percussion') || (sub.includes('multi-type'));
    });
    
    const partitionCount = activeEntities.filter(e => e.categoryId === 'partition').length;
    const isActive = hasPercussion && partitionCount >= 4;

    // Calcul de la valeur boostée
    const baseValue = 60;
    const totalBoost = 1 + (booster/100) + (mastery/100);
    // FIX: Correction précision flottante
    const rawValue = baseValue * totalBoost;
    const finalValue = Math.ceil(parseFloat(rawValue.toFixed(2)));
    const bonus = finalValue - baseValue;

    return (
        <div className={`mt-4 rounded-xl border p-4 flex items-center justify-between transition-colors duration-300 ${isActive ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Megaphone size={20} />
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase ${isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isActive ? 'Cri de Guerre Actif' : 'Cri de Guerre Inactif'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {isActive ? (
                            <span>
                                +{baseValue}% {bonus > 0 && <span className="text-emerald-400 font-bold">(+{bonus}%)</span>} Vit/Dmg appliqué
                            </span>
                        ) : (
                            `Requiert: Percussion + 4 Partitions (${partitionCount}/4)`
                        )}
                    </p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isActive ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
                {isActive ? 'ON' : 'OFF'}
            </div>
        </div>
    );
};
