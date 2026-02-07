
import { Entity, EntityType, ModifierType } from '../../../types';

export const CORROMPU_ARMORS: Entity[] = [
  {
    id: 'corr_hood_1', type: EntityType.ITEM, name: 'Capuche Purulente',
    slotId: 'head', categoryId: 'armor_head', subCategory: 'Capuche',
    description: "Réservé Corrompus. +1% Absorption.",
    modifiers: [
        { id: 'ch1_a', type: ModifierType.FLAT, targetStatKey: 'absorption', value: '1', condition: "classId === 'corrompu'" }
    ]
  },
  {
    id: 'corr_mantle_1', type: EntityType.ITEM, name: 'Manteau de Peau',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Manteau',
    description: "Réservé Corrompus. +200 Vit.",
    modifiers: [
        { id: 'cm1_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '200', condition: "classId === 'corrompu'" }
    ]
  },
  {
    id: 'corr_boots_1', type: EntityType.ITEM, name: 'Bottes d\'Os',
    slotId: 'legs', categoryId: 'armor_legs', subCategory: 'Bottes de Corrompus',
    description: "Réservé Corrompus. +20 Spd.",
    modifiers: [
        { id: 'cb1_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20', condition: "classId === 'corrompu'" }
    ]
  }
];
