
import { Entity, EntityType, ModifierType } from '../../../types';

export const WHIPS: Entity[] = [
  {
    id: 'fouet_cuir', type: EntityType.ITEM, name: 'Fouet en Cuir',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fouets', equipmentCost: 1,
    modifiers: [{ id: 'mw_whp_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' }]
  }
];
