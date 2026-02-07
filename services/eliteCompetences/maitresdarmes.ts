
import { Entity, EntityType } from '../../types';

export const MAITRE_ARMES_ELITES: Entity[] = [
    {
        id: 'elite_maitresdarmes',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Maîtres d\'armes',
        parentId: 'maîtresdarmes',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
