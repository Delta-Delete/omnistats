
import { Entity, EntityType, ModifierType } from '../../../types';

export const TONFAS: Entity[] = [
  {
    id: 'tonfa_bois', type: EntityType.ITEM, name: 'Tonfa en Bois',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    modifiers: [
        { id: 'mw_ton_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '6' },
        { id: 'mw_ton_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '4' }
    ]
  }
];
