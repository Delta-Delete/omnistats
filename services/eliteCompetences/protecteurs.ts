
import { Entity, EntityType } from '../../types';

export const PROTECTEUR_ELITES: Entity[] = [
    {
        id: 'elite_protecteurs',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Protecteurs',
        parentId: 'protecteurs',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
