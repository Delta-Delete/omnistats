
import { Entity, EntityType, ModifierType } from '../../../types';

export const DAGGERS: Entity[] = [
  {
    id: 'daguedenovice', type: EntityType.ITEM, name: 'Dague de novice',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    modifiers: [{ id: 'mw_d1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '5' }]
  }
];
