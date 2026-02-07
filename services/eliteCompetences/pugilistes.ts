
import { Entity, EntityType } from '../../types';

export const PUGILISTE_ELITES: Entity[] = [
    {
        id: 'elite_pugilistes',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Pugilistes',
        parentId: 'pugilistes',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
