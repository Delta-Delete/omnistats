
import { Entity, EntityType, ModifierType } from '../../types';

export const CULT_ITEMS: Entity[] = [
  {
    id: 'item_cult_1',
    type: EntityType.ITEM,
    name: 'Objet de culte I',
    categoryId: 'special',
    subCategory: 'Relique',
    description: "Symbole de foi mineur. Confère +20 Vitalité, Vitesse et Dégâts.",
    modifiers: [
        { id: 'cult1_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20' },
        { id: 'cult1_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20' },
        { id: 'cult1_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20' }
    ]
  },
  {
    id: 'item_cult_2',
    type: EntityType.ITEM,
    name: 'Objet de culte II',
    categoryId: 'special',
    subCategory: 'Relique',
    description: "Symbole de foi majeur. Confère +60 Vitalité, Vitesse et Dégâts.",
    modifiers: [
        { id: 'cult2_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '60' },
        { id: 'cult2_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '60' },
        { id: 'cult2_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '60' }
    ]
  },
  {
    id: 'item_cult_3',
    type: EntityType.ITEM,
    name: 'Objet de culte III',
    categoryId: 'special',
    subCategory: 'Relique',
    description: "Relique sacrée. Confère +100 Vitalité, Vitesse et Dégâts.",
    modifiers: [
        { id: 'cult3_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        { id: 'cult3_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
        { id: 'cult3_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '100' }
    ]
  }
];
