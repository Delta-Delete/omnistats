
import { Entity, EntityType } from '../../types';

export const VOLEUR_ELITES: Entity[] = [
    {
        id: 'elite_voleurs',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Voleurs',
        parentId: 'voleurs',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
