
import { Entity, Modifier } from '../types';
import { evaluateFormula, resolveItemPreview } from './engine';
import { STATS } from './constants';

/**
 * Calcule les stats prévisionnelles d'un objet en appliquant :
 * 1. Les formules de base (via engine)
 * 2. Les bonus d'amélioration (forge)
 * 3. Les overrides visuels spécifiques aux Classes/Spécialisations (pour que l'infobulle reflète la réalité du joueur)
 */
export const calculateEnhancedStats = (mod: Modifier, context: any, item: Entity, upgradeBonus: number = 0): { base: number, enhanced: number, bonus: number } => {
    // Sécurité : Si le contexte n'est pas encore initialisé, on renvoie une valeur neutre
    const safeContext = context || {};

    // Délégation complète au moteur engine.ts
    const { enhanced, base } = resolveItemPreview(item, mod, safeContext, upgradeBonus);

    // Application des Overrides visuels "En direct"
    let finalEnhancedValue = enhanced;
    const sub = item.subCategory || '';
    const spec = safeContext.specializationId;
    const stat = mod.targetStatKey;
    
    // Boosters calculés (si présents dans le contexte)
    const boosters = 1 + ((safeContext.effect_booster || 0)/100) + ((safeContext.special_mastery || 0)/100);

    // --- LOGIQUE VISUELLE (Hardcoded Class Mechanics) ---
    // Ces règles reflètent les bonus appliqués dynamiquement par le moteur dans engine.ts
    
    // 1. SET HÉGÉMONIE
    if (safeContext.equippedItems) {
        let setPieces = 0;
        const items = typeof safeContext.equippedItems === 'object' ? Object.values(safeContext.equippedItems) : [];
        items.forEach((id: any) => { if (['heg_chest', 'heg_head', 'heg_legs'].includes(id)) setPieces++; });

        if (setPieces >= 3 && ['Dagues', 'Griffes', 'Arcs', 'Arbalètes'].includes(sub)) {
            const rawPP = safeContext.political_points ?? safeContext.political_points_input ?? 0;
            const pp = Math.min(Math.max(0, rawPP), 200);
            if (pp > 0 && stat === STATS.DMG) {
                finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (pp / 100)));
            }
        }
    }

    // 2. ARCHERS (Base Class Bonus + Spec)
    if (stat === STATS.DMG && ['Arcs', 'Arbalètes', 'Frondes'].includes(sub)) {
        if (safeContext.classId === 'archers') {
            let archerMultiplier = 2; // +100% Base
            if (spec === 'spec_oeil_faucon') archerMultiplier += 0.25 * boosters;
            finalEnhancedValue = Math.ceil(base * archerMultiplier); 
        }
    }

    // 3. Spécialisations diverses
    if (spec === 'spec_chevalier' && stat === STATS.DMG && (sub === 'Épées' || sub === 'Lances')) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }
    if (spec === 'spec_celerite' && stat === STATS.SPD && (sub === 'Griffes' || sub === 'Frondes')) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }
    if (spec === 'spec_croise' && stat === STATS.VIT && (sub.includes('Bouclier') || sub.includes('Fléaux'))) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.25 * boosters)));
    }
    if (spec === 'spec_poing_ki' && stat === STATS.DMG && sub === 'Cestes') {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * 1.10); 
    }
    if (spec === 'spec_anticipation_sauvage' && stat === STATS.VIT && item.equipmentCost && item.equipmentCost >= 2) {
        finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.33 * boosters)));
    }
    
    // Virtuoses - Maître de l'air
    if (spec === 'spec_maitre_air' && sub.startsWith('Instrument') && [STATS.VIT, STATS.SPD, STATS.DMG].includes(stat)) {
        const capMod = item.modifiers?.find(m => m.targetStatKey === STATS.PARTITION_CAP);
        if (capMod) {
            const capVal = evaluateFormula(capMod.value, safeContext); 
            if (capVal >= 7) {
                finalEnhancedValue = Math.ceil(finalEnhancedValue * (1 + (0.5 * boosters)));
            }
        }
    }

    return { 
        base: base, 
        enhanced: finalEnhancedValue, 
        bonus: finalEnhancedValue - base 
    };
};
