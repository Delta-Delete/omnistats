
import { Entity, EntityType } from '../../types';

// Liste des IDs de races sans fichier dédié pour créer des placeholders
const OTHER_RACE_IDS = [
    'abyssal', 'entomothrope', 'hybride', 'djollfulin', 'geant', 
    'therianthropes', 'naga', 'nain', 'peauverte', 
    'strygeblanc', 'strygenoir', 'vampire'
];

export const OTHER_RACIALS: Entity[] = OTHER_RACE_IDS.map(raceId => ({
    id: `racial_${raceId}`,
    type: EntityType.RACIAL_COMPETENCE,
    name: `Compétence ${raceId.charAt(0).toUpperCase() + raceId.slice(1)}`,
    parentId: raceId,
    description: "Compétence raciale active (En attente de définition).",
    modifiers: []
}));
