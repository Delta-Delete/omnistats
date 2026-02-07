
import { Entity, EntityType } from '../../types';

export const GUETTEUR_ELITES: Entity[] = [
    {
        id: 'elite_guetteurs',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Guetteurs',
        parentId: 'guetteurs',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
