
import { Entity, EntityType } from '../../types';

export const PALADIN_ELITES: Entity[] = [
    {
        id: 'elite_paladins',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Paladins',
        parentId: 'paladins',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
