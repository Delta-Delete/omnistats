
import { Entity, EntityType, ModifierType } from '../../../types';

export const PALADIN_ARMORS: Entity[] = [
  {
    id: 'pal_chest_1', type: EntityType.ITEM, name: 'Cuirasse Bénie',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Équipement sacré',
    description: "Réservé Paladins. +300 Vit.",
    modifiers: [
        { id: 'pc1_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '300', condition: "classId === 'paladins'" }
    ]
  }
];
