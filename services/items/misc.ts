
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
    },
    {
        id: 'pendentif_zephyrien',
        type: EntityType.ITEM,
        name: 'Pendentif zéphyrien',
        categoryId: 'special', // Pour aller dans le sac "Objets Spéciaux"
        subCategory: 'Gadget',
        rarity: 'exotic',
        description: "Les stats du familier, de la monture et du compagnon sont augmentés de 50%.",
        modifiers: [
            // Boost pour le Compagnon Humanoïde (Scale)
            // Base 50 * (1 + 50/100) = 75
            { 
                id: 'pz_scale', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'companion_scale', 
                value: '50',
                name: 'Bonus Zéphyrien (+50%)'
            }
        ]
    }
];
