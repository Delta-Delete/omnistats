
import { Entity, EntityType, ModifierType } from '../../../types';

export const AXES: Entity[] = [
  {
    id: 'hache_guerre', type: EntityType.ITEM, name: 'Hache de Guerre',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Haches', equipmentCost: 2,
    modifiers: [{ id: 'mw_ax_2', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '28' }]
  }
];
