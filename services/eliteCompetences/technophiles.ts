
import { Entity, EntityType } from '../../types';

export const TECHNOPHILE_ELITES: Entity[] = [
    {
        id: 'elite_technophiles',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Technophiles',
        parentId: 'technophiles',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
