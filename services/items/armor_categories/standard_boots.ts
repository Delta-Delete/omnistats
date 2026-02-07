
import { Entity, EntityType, ModifierType } from '../../../types';

export const STANDARD_BOOTS: Entity[] = [
  {
    id: 'boots_cuir', type: EntityType.ITEM, name: 'Bottes en Cuir',
    slotId: 'legs', categoryId: 'armor_legs', subCategory: 'Bottes',
    modifiers: [{ id: 'b_cuir_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10' }]
  }
];
