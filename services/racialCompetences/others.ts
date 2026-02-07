
import { Entity, EntityType } from '../../types';

// Liste des IDs de races sans fichier dédié pour créer des placeholders
// 'entomothrope' a été retiré car il est maintenant géré spécifiquement
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

export const OTHER_RACIALS: Entity[] = OTHER_RACE_IDS.map(raceId => ({
    id: `racial_${raceId}`,
    type: EntityType.RACIAL_COMPETENCE,
    name: `Héritage ${RACE_LABELS[raceId] || raceId}`, // Nom plus immersif
    parentId: raceId,
    description: "Cette race dispose de capacités innées uniques liées à ses origines. (Effet narratif ou passif en attente de règles spécifiques).",
    modifiers: []
}));
