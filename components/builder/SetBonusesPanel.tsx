
import React, { useMemo } from 'react';
import { Package, Unlock, Lock, Scale, Info } from 'lucide-react';
import { Entity, EntityType, Modifier } from '../../types';
import { evaluateFormula } from '../../services/engine';
import { getTagColor, getTagLabel, toFantasyTitle } from './utils';
import { parseRichText } from '../ui/RichText';
import { CollapsibleCard } from '../ui/Card';
import { processDynamicText } from '../../services/processing'; // IMPORT

interface SetBonusesPanelProps {
    activeEntities: Entity[];
    allItems: Entity[];
    context: any;
}

// Structure des détails d'un tier
interface TierDetail {
    reqCount: number;
    isActive: boolean;
    modifiers: { mod: Modifier; valueDisplay: string; usesPP?: boolean }[];
    texts: { title?: string; text: string; tag?: string }[];
}

interface SetDetail {
    set: Entity;
    equippedCount: number;
    totalCount: number;
    tiers: TierDetail[];
}

export const SetBonusesPanel: React.FC<SetBonusesPanelProps> = ({ activeEntities, allItems, context }) => {
    
    // Helper local pour compter les objets (nécessaire pour eval conditions complexes)
    const countItemsLocal = (categoryOrSub: string) => {
        const lowerTarget = categoryOrSub.toLowerCase();
        return activeEntities.filter(e => {
            if (e.type !== EntityType.ITEM) return false;
            if (e.categoryId?.toLowerCase() === lowerTarget) return true;
            if (e.subCategory?.toLowerCase() === lowerTarget) return true;
            if (e.tags && e.tags.some(t => t.toLowerCase() === lowerTarget)) return true;
            return false;
        }).length;
    };

    // Helper pour évaluer une condition JS
    const checkCondition = (condition: string, ctx: any) => {
        if (!condition) return true;
        try {
            const keys = Object.keys(ctx);
            const values = Object.values(ctx);
            // eslint-disable-next-line
            const func = new Function(...keys, `return ${condition};`);
            return func(...values);
        } catch(e) { return false; }
    };

    // Helper pour extraire le nombre de pièces requis depuis une chaîne de condition
    const extractReqCount = (conditionStr?: string): number => {
        if (!conditionStr) return 0;
        // Cherche "countSet(...) >= X" ou "countFaction(...) >= X"
        const countMatch = conditionStr.match(/(?:countSet|countFaction).*?>=\s*(\d+)/);
        return countMatch ? parseInt(countMatch[1], 10) : 0;
    };

    // UPDATED: Use centralized processor
    const processText = (text: string, ctx: any) => {
        return processDynamicText(text, ctx);
    };

    const activeSetsDetails = useMemo(() => {
        const details: SetDetail[] = [];
        
        const equippedItems = activeEntities.filter(e => e.type === EntityType.ITEM);
        const activeSets = activeEntities.filter(e => e.type === EntityType.ITEM_SET);
        const legacyFactionSets = activeEntities.filter(e => e.type === EntityType.FACTION && e.modifiers && e.modifiers.length > 0);

        const allCandidates = [...activeSets, ...legacyFactionSets];

        allCandidates.forEach(set => {
            const isLegacy = set.type === EntityType.FACTION;
            const equippedCount = equippedItems.filter(i => isLegacy ? i.factionId === set.id : i.setId === set.id).length;
            // Pour le total, on regarde la DB globale (allItems)
            const totalCount = allItems.filter(i => isLegacy ? i.factionId === set.id : i.setId === set.id).length;

            if (equippedCount > 0) {
                // Map pour regrouper par "requis" (ex: 2, 3, 4 pièces)
                const tiersMap = new Map<number, TierDetail>();

                const getTier = (count: number) => {
                    if (!tiersMap.has(count)) {
                        tiersMap.set(count, { reqCount: count, isActive: false, modifiers: [], texts: [] });
                    }
                    return tiersMap.get(count)!;
                };

                // Context d'éval local
                const evalContext = { 
                    ...context, 
                    countSet: (id: string) => id === set.id ? equippedCount : 0, 
                    countItems: countItemsLocal, 
                    countFaction: (id: string) => id === set.id ? equippedCount : 0 
                };

                // 1. Process Modifiers
                (set.modifiers || []).forEach(mod => {
                    const req = extractReqCount(mod.condition);
                    const tier = getTier(req);
                    
                    // Calcul de la valeur et formatage du label
                    let valDisplay = '';
                    let hasSignificantValue = false;

                    try {
                        const val = evaluateFormula(mod.value, context);
                        if (!isNaN(val)) {
                            // SI LA VALEUR EST 0, ON NE L'AFFICHE PAS (Sauf si c'est vraiment important, mais pour les toggles dummies c'est mieux)
                            if (Math.abs(val) > 0) {
                                hasSignificantValue = true;
                                // Détection si c'est un pourcentage
                                const isPercent = mod.type.includes('PERCENT') || ['weapon_effect_mult', 'special_mastery', 'effect_booster'].includes(mod.targetStatKey);
                                const suffix = isPercent ? '%' : '';
                                const prefix = val > 0 ? '+' : '';
                                
                                // Mapping des noms de stats pour affichage propre
                                const statLabels: Record<string, string> = {
                                    dmg: 'Dégâts',
                                    vit: 'Vitalité',
                                    spd: 'Vitesse',
                                    weapon_effect_mult: "Effet d'Arme",
                                    political_points: 'PP',
                                    special_mastery: 'Maîtrise Spé.',
                                    effect_booster: 'Boost Effets'
                                };

                                const label = statLabels[mod.targetStatKey] || mod.targetStatKey.substring(0,3).toUpperCase();
                                valDisplay = `${prefix}${Math.ceil(val)}${suffix} ${label}`;
                            }
                        }
                    } catch (e) { valDisplay = '?'; hasSignificantValue = true; }

                    if (hasSignificantValue) {
                        const usesPP = mod.value.includes('political_points');
                        tier.modifiers.push({ mod, valueDisplay: valDisplay, usesPP });
                    }
                    
                    // Check if active (basé sur la condition réelle, pas juste le tier map)
                    if (mod.condition) {
                        // Remplacement pour simplifier l'éval si nécessaire
                        const cond = mod.condition.replace(/(?:countSet|countFaction)\(['"](.*?)['"]\)/g, (_, id) => id === set.id ? equippedCount.toString() : '0');
                        tier.isActive = checkCondition(cond, evalContext);
                    } else {
                        tier.isActive = true;
                    }
                });

                // 2. Process Description Blocks (Nouveau)
                if (set.descriptionBlocks) {
                    set.descriptionBlocks.forEach(block => {
                        const req = extractReqCount(block.condition);
                        const tier = getTier(req);
                        
                        tier.texts.push({
                            title: block.title,
                            text: processText(block.text, evalContext), // Application de l'évaluation dynamique
                            tag: block.tag
                        });

                        // Check activity for text block
                        if (block.condition) {
                            const cond = block.condition.replace(/(?:countSet|countFaction)\(['"](.*?)['"]\)/g, (_, id) => id === set.id ? equippedCount.toString() : '0');
                            if (checkCondition(cond, evalContext)) {
                                tier.isActive = true; // Si le texte est actif, le tier est considéré actif
                            } else {
                                if (req > equippedCount) tier.isActive = false;
                            }
                        } else {
                            tier.isActive = true;
                        }
                    });
                }

                // Convert Map to Array & Sort
                const tiers = Array.from(tiersMap.values()).sort((a, b) => a.reqCount - b.reqCount);
                
                details.push({ set, equippedCount, totalCount, tiers });
            }
        });

        return details;
    }, [activeEntities, allItems, context]);

    if (activeSetsDetails.length === 0) return null;

    return (
        <CollapsibleCard 
            id="set_bonuses_panel"
            title={toFantasyTitle("Bonus de Panoplie")} 
            icon={Package}
        >
            <div className="space-y-6">
                {activeSetsDetails.map((det, idx) => (
                    <div key={idx} className="bg-slate-950/30 rounded-xl border border-slate-800 overflow-hidden">
                        {/* Header du Set */}
                        <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-slate-800/50">
                            <div className="flex items-center">
                                {det.set.imageUrl ? (
                                    <img src={det.set.imageUrl} className="w-8 h-8 object-contain mr-3 opacity-90 bg-slate-900 rounded p-1 border border-slate-800" alt="Icon" />
                                ) : (<Package size={20} className="mr-3 text-slate-500" />)}
                                <div>
                                    <div className="text-xs font-bold text-slate-200">{det.set.name}</div>
                                    <div className="text-[9px] text-slate-500 mt-0.5">Bonus cumulatifs</div>
                                </div>
                            </div>
                            <div className={`text-[10px] font-mono px-2 py-1 rounded border font-bold ${
                                det.equippedCount >= det.totalCount && det.totalCount > 0
                                ? 'bg-green-900/20 text-green-400 border-green-500/20'
                                : 'bg-slate-900 text-indigo-300 border-indigo-500/20'
                            }`}>
                                {det.equippedCount} / {det.totalCount > 0 ? det.totalCount : '?'} pcs
                            </div>
                        </div>

                        {/* Paliers (Tiers) */}
                        <div className="p-3 space-y-3">
                            {det.tiers.map((tier, tIdx) => (
                                <div key={tIdx} className={`relative pl-4 border-l-2 transition-all ${tier.isActive ? 'border-green-500/50' : 'border-slate-700/30 opacity-60'}`}>
                                    {/* Tier Header (ex: 3 Pièces) */}
                                    <div className="flex items-center mb-1.5">
                                        <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 ${tier.isActive ? 'bg-slate-900 border-green-500' : 'bg-slate-900 border-slate-700'}`}></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider mr-2 ${tier.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                                            {tier.reqCount} Pièces
                                        </span>
                                        {tier.isActive ? <Unlock size={10} className="text-green-500" /> : <Lock size={10} className="text-slate-600" />}
                                    </div>

                                    {/* Stats List */}
                                    {tier.modifiers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tier.modifiers.map((bonus, mIdx) => (
                                                <div key={mIdx} className={`flex items-center text-[10px] px-1.5 py-0.5 rounded border ${tier.isActive ? 'bg-green-900/10 border-green-500/20 text-green-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                                                    {bonus.usesPP && <Scale size={10} className="mr-1 text-amber-500" />}
                                                    <span className="font-mono font-bold whitespace-nowrap">{bonus.valueDisplay}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Text Effects List */}
                                    {tier.texts.length > 0 && (
                                        <div className="space-y-2 mt-1">
                                            {tier.texts.map((txt, txtIdx) => (
                                                <div 
                                                    key={txtIdx} 
                                                    className={`text-[10px] p-3 rounded border transition-colors ${
                                                        tier.isActive 
                                                        ? 'bg-slate-800/80 border-slate-600 text-slate-200 shadow-sm' // ACTIF: Fond plus clair, texte quasi blanc
                                                        : 'bg-slate-900/40 border-slate-800 text-slate-400' // INACTIF: Fond sombre mais texte gris moyen (lisible)
                                                    }`}
                                                >
                                                    <div className="flex items-center mb-1.5">
                                                        {txt.tag && (
                                                            <span className={`${getTagColor(txt.tag)} text-[9px] mr-2 font-bold uppercase`}>
                                                                {getTagLabel(txt.tag)}
                                                            </span>
                                                        )}
                                                        {txt.title && <span className={`font-bold text-xs ${tier.isActive ? 'text-white' : 'text-slate-400'}`}>{txt.title}</span>}
                                                    </div>
                                                    <div className="italic leading-relaxed whitespace-pre-line text-xs font-medium">
                                                        {parseRichText(txt.text)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </CollapsibleCard>
    );
};
