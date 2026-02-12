
import { evaluateFormula } from './engine';

/**
 * Remplace les formules entre {{ }} par leur valeur calculée.
 * @param text Le texte contenant des {{formules}}
 * @param context Le contexte d'évaluation pour les formules
 * @param modifierResults (Optionnel) Un dictionnaire de résultats pré-calculés (ex: provenant de usePlayerEngine)
 */
export const processDynamicText = (
    text: string, 
    context: any, 
    modifierResults?: Record<string, number>
): string => {
    if (!text) return '';
    
    return text.replace(/\{\{(.*?)\}\}/g, (_, content) => { 
        const trimmed = content.trim(); 
        
        // 1. Essayer de récupérer une valeur pré-calculée (Optimisation)
        if (modifierResults && modifierResults[trimmed] !== undefined) {
            const val = modifierResults[trimmed];
            if (typeof val === 'number') return Math.ceil(val).toString();
        }

        // 2. Sinon, évaluer la formule à la volée
        try { 
            const evaluated = evaluateFormula(trimmed, context); 
            return Math.ceil(evaluated).toString(); 
        } catch (err) { 
            return '?'; 
        } 
    });
};

/**
 * Aplatit les configurations d'objets pour qu'elles soient lisibles par le moteur de règles.
 * Ex: { item_1: { val: 10 } } devient { config_item_1_val: 10 }
 */
export const flattenItemConfigs = (configs: Record<string, any> | undefined): Record<string, number> => {
    const flattened: Record<string, number> = {};
    if (!configs) return flattened;
    Object.entries(configs).forEach(([itemId, values]) => {
        if (values.val !== undefined) flattened[`config_${itemId}_val`] = values.val;
        if (values.vit !== undefined) flattened[`config_${itemId}_vit`] = values.vit;
        if (values.spd !== undefined) flattened[`config_${itemId}_spd`] = values.spd;
        if (values.dmg !== undefined) flattened[`config_${itemId}_dmg`] = values.dmg;
    });
    return flattened;
};

/**
 * Fusionne intelligemment les configs du joueur vers le compagnon.
 * Hérite des valeurs (sliders) mais nettoie les ciblages (Secret Card) pour éviter les conflits.
 */
export const mergeCompanionConfigs = (playerConfigs: Record<string, any> | undefined, compConfigs: Record<string, any> | undefined) => {
    const rawConfigs: Record<string, any> = {};
    const pConfigs = playerConfigs || {};
    const cConfigs = compConfigs || {};

    // A. Inherit Safe Values from Player
    Object.entries(pConfigs).forEach(([k, v]) => {
         // Destructure to remove specific targeting keys to prevent auto-targeting player slots
         const { targetSlotIndex, targetSubName, ...safeValues } = v as any;
         rawConfigs[k] = { ...safeValues };
    });

    // B. Apply Companion Specifics (Overwrite)
    Object.entries(cConfigs).forEach(([key, conf]) => {
        if (!rawConfigs[key]) {
            rawConfigs[key] = { ...(conf as any) };
        } else {
            // Merge: Companion values win
            rawConfigs[key] = { ...rawConfigs[key], ...(conf as any) };
        }
    });
    
    // Remap keys to include both original and _comp suffix
    const remappedConfigs: Record<string, any> = {};
    Object.entries(rawConfigs).forEach(([k, v]) => {
        remappedConfigs[k] = v;
        remappedConfigs[`${k}_comp`] = v;
    });

    return { rawConfigs, remappedConfigs };
};
