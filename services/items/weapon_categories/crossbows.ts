
import { Entity, EntityType, ModifierType } from '../../../types';

export const CROSSBOWS: Entity[] = [
  {
    id: 'arbalete_legere', type: EntityType.ITEM, name: 'Arbalète Légère',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    modifiers: [
        { id: 'mw_arb_1h', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '15' }
    ]
  },
  {
    id: 'arbalete_lourde', type: EntityType.ITEM, name: 'Arbalète Lourde',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 2,
    modifiers: [
        { id: 'mw_arb_2h', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '35' }
    ]
  }
];
