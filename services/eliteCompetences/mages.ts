
import { Entity, EntityType } from '../../types';

export const MAGE_ELITES: Entity[] = [
    {
        id: 'elite_mages',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Élite Mages',
        parentId: 'mages',
        description: "Compétence d'élite (En attente de définition).",
        modifiers: []
    }
];
