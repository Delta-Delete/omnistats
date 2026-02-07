
import { Entity, EntityType } from '../../types';

export const GUERISSEUR_ELITES: Entity[] = [
    {
        id: 'elite_guerisseurs',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Guérisseurs',
        parentId: 'guerisseurs',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
