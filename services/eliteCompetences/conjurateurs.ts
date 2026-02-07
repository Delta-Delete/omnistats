
import { Entity, EntityType } from '../../types';

export const CONJURATEUR_ELITES: Entity[] = [
    {
        id: 'elite_conjurateurs',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Conjurateurs',
        parentId: 'conjurateurs',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
