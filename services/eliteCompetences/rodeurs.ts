
import { Entity, EntityType } from '../../types';

export const RODEUR_ELITES: Entity[] = [
    {
        id: 'elite_rodeurs',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Rôdeurs',
        parentId: 'rodeurs',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
