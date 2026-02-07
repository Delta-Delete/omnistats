
import { Entity, EntityType, ModifierType } from '../../../types';

export const SCYTHES: Entity[] = [
  {
    id: 'faux_agricole', type: EntityType.ITEM, name: 'Faux de Paysan',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Faux', equipmentCost: 2,
    modifiers: [{ id: 'mw_scy_2', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '22' }]
  }
];
