
import { Entity, EntityType } from '../../types';

export const ARCHER_ELITES: Entity[] = [
    {
        id: 'elite_archers',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Archers',
        parentId: 'archers',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
