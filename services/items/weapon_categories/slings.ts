
import { Entity, EntityType, ModifierType } from '../../../types';

export const SLINGS: Entity[] = [
  {
    id: 'fronde_chasse', type: EntityType.ITEM, name: 'Fronde de Chasse',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    modifiers: [
        { id: 'mw_fronde_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' }
    ]
  }
];
