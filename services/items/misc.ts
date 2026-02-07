
import { Entity, EntityType, ModifierType } from '../../types';

export const MISC_ITEMS: Entity[] = [
    {
        id: 'ecusson_royal',
        type: EntityType.ITEM,
        name: 'Écusson royal',
        categoryId: 'misc',
        description: "Le possesseur gagne {{political_points}} dégâts par tour.",
        modifiers: [
            {
                id: 'ecusson_royal_dmg',
                type: ModifierType.FLAT,
                targetStatKey: 'dmg',
                value: 'political_points',
                isPerTurn: true
            }
        ]
    }
];
