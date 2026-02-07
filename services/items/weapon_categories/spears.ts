
import { Entity, EntityType, ModifierType } from '../../../types';

export const SPEARS: Entity[] = [
  {
    id: 'lance_simple', type: EntityType.ITEM, name: 'Lance de Milicien',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Lances', equipmentCost: 2,
    description: "Une lance standard. 20 Dégâts.",
    modifiers: [
        { id: 'mw_l1_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 * mult_lance_dmg' }
    ]
  }
];
