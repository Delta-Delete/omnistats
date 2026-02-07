
import { Entity, EntityType, ModifierType } from '../../../types';

export const CLAWS: Entity[] = [
  {
    id: 'griffes_acier', type: EntityType.ITEM, name: 'Griffes d\'Acier',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    modifiers: [
        { id: 'mw_clw_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' },
        { id: 'mw_clw_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '5' }
    ]
  }
];
