
import { Entity, EntityType } from '../types';

// --- DÉFINITIONS SPÉCIFIQUES ---

const HUMAIN_RACIALS: Entity[] = [
    {
        id: 'racial_humain',
        type: EntityType.RACIAL_COMPETENCE,
        name: 'Esprit Humain',
        parentId: 'humain',
        description: "Compétence raciale active (En attente de définition).",
        modifiers: []
    }
];

const ELFE_RACIALS: Entity[] = [
    {
        id: 'racial_elfe',
        type: EntityType.RACIAL_COMPETENCE,
        name: 'Transe Elfique',
        parentId: 'elfe',
        description: "Compétence raciale active (En attente de définition).",
        modifiers: []
    }
];

const ENTOMOTHROPE_RACIALS: Entity[] = [
    {
        id: 'racial_entomothrope',
        type: EntityType.RACIAL_COMPETENCE,
        name: 'Tétrachire',
        parentId: 'entomothrope',
        description: "A partir du niveau 20 (2000 d'expérience), l'entomothrope peut porter, si sa classe lui permet, 1 arme à une main bonus parmi les armes standards (hors bâton et arme spéciale, bouclier inclus). L'arme bonus portée peut être une arme à deux mains (non-fusionnée) si la compétence racial est débloquée.",
        modifiers: []
    }
];

// --- DÉFINITIONS GÉNÉRIQUES (PLACEHOLDERS) ---

const OTHER_RACE_IDS = [
    'abyssal', 'hybride', 'djollfulin', 'geant', 
    'therianthropes', 'naga', 'nain', 'peauverte', 
    'strygeblanc', 'strygenoir', 'vampire'
];

const RACE_LABELS: Record<string, string> = {
    'abyssal': 'des Profondeurs',
    'hybride': 'du Sang Mêlé',
    'djollfulin': 'du Petit Peuple',
    'geant': 'des Titans',
    'therianthropes': 'de la Bête',
    'naga': 'des Ondes',
    'nain': 'de la Montagne',
    'peauverte': 'Tribal',
    'strygeblanc': 'Céleste',
    'strygenoir': 'Nocturne',
    'vampire': 'Immortel'
};

const OTHER_RACIALS: Entity[] = OTHER_RACE_IDS.map(raceId => ({
    id: `racial_${raceId}`,
    type: EntityType.RACIAL_COMPETENCE,
    name: `Héritage ${RACE_LABELS[raceId] || raceId}`,
    parentId: raceId,
    description: "Cette race dispose de capacités innées uniques liées à ses origines. (Effet narratif ou passif en attente de règles spécifiques).",
    modifiers: []
}));

// --- EXPORT GLOBAL ---

export const RACIAL_COMPETENCES: Entity[] = [
    ...HUMAIN_RACIALS,
    ...ELFE_RACIALS,
    ...ENTOMOTHROPE_RACIALS,
    ...OTHER_RACIALS
];
