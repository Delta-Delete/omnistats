
import { Entity, EntityType, ModifierType } from '../../../types';

export const CHAINS: Entity[] = [
  {
    id: 'chaine_combat', type: EntityType.ITEM, name: 'Chaîne de Combat',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Chaînes', equipmentCost: 1,
    modifiers: [{ id: 'mw_chn_1h', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '12' }]
  }
];
