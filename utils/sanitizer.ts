
/**
 * SANITIZER DE SÉCURITÉ
 * Vérifie que les données importées ne contiennent pas de code malveillant évident.
 * On garde la flexibilité des formules (maths, conditions simples) mais on bloque l'accès au DOM/Network.
 */

// Mots-clés interdits dans les chaînes de caractères évaluables (value, condition)
const BLACKLIST_KEYWORDS = [
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'cookie',
    'fetch',
    'XMLHttpRequest',
    'eval',
    'alert',
    'prompt',
    'confirm',
    'debugger',
    'function', // On évite les déclarations de fonctions anonymes imbriquées
    '=>', // On évite les arrow functions
    'process.env',
    'import',
    'require'
];

// Vérifie si une chaîne est "sûre"
const isSafeString = (str: string): boolean => {
    if (!str) return true;
    const lowerStr = str.toLowerCase();
    
    // Vérification basique des mots-clés
    for (const keyword of BLACKLIST_KEYWORDS) {
        // On cherche le mot clé entouré de délimiteurs ou tel quel
        // Une regex simple pour éviter les faux positifs (ex: "evaluation" contient "eval")
        // On cherche le mot entier ou suivi de ( . [
        const regex = new RegExp(`\\b${keyword}\\b|${keyword}\\s*\\(|${keyword}\\s*\\.|${keyword}\\s*\\[`);
        if (regex.test(lowerStr)) {
            console.warn(`[Sanitizer] Blocked potential XSS: Found keyword "${keyword}" in "${str}"`);
            return false;
        }
    }
    return true;
};

// Parcourt récursivement l'objet pour valider toutes les strings
const validateObject = (obj: any): boolean => {
    if (typeof obj === 'string') {
        // On ne valide que si la string ressemble à une formule (contient des opérateurs ou variables)
        // Pour être sûr, on valide tout ce qui est importé.
        return isSafeString(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.every(item => validateObject(item));
    }
    
    if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).every(key => validateObject(obj[key]));
    }
    
    return true; // Nombres, booléens, null sont sûrs
};

export const validateImportData = (data: any): { valid: boolean; error?: string } => {
    try {
        if (!data || typeof data !== 'object') {
            return { valid: false, error: "Format de fichier invalide." };
        }

        // 1. Validation de la sélection actuelle
        if (data.selection) {
            if (!validateObject(data.selection)) {
                return { valid: false, error: "Code malveillant détecté dans les données de sélection active." };
            }
        }

        // 2. Validation des objets personnalisés
        if (data.customItems) {
            if (!validateObject(data.customItems)) {
                return { valid: false, error: "Code malveillant détecté dans les objets personnalisés." };
            }
        }

        // 3. Validation des Presets (Loadouts)
        if (data.presets) {
            if (!Array.isArray(data.presets)) {
                return { valid: false, error: "Format des presets invalide." };
            }
            if (!validateObject(data.presets)) {
                return { valid: false, error: "Code malveillant détecté dans les loadouts sauvegardés." };
            }
        }

        // 4. Validation des Configs Items (Just in case)
        if (data.selection && data.selection.itemConfigs) {
             if (!validateObject(data.selection.itemConfigs)) {
                 return { valid: false, error: "Code malveillant détecté dans les configurations d'objets." };
             }
        }

        return { valid: true };
    } catch (e) {
        console.error("Sanitizer Error:", e);
        return { valid: false, error: "Erreur critique lors de l'analyse de sécurité." };
    }
};
