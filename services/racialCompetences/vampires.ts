
import { Entity, EntityType } from '../../types';

export const VAMPIRE_RACIALS: Entity[] = [
    {
        id: 'racial_vampire',
        type: EntityType.RACIAL_COMPETENCE,
        name: 'Soif de Sang',
        parentId: 'vampire',
        description: "Compétence raciale active (En attente de définition).",
        modifiers: []
    }
];
