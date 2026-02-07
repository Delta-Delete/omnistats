
import { Entity, EntityType, ModifierType } from '../../../types';

export const BLUNT: Entity[] = [
  {
    id: 'massue_bois', type: EntityType.ITEM, name: 'Massue en Bois',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Massues', equipmentCost: 1,
    modifiers: [{ id: 'mw_cl_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' }]
  },
  {
    id: 'marteau_guerre', type: EntityType.ITEM, name: 'Marteau de Guerre',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Marteaux', equipmentCost: 2,
    modifiers: [{ id: 'mw_hm_2', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30' }]
  }
];
