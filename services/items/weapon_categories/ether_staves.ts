
import { Entity, EntityType, ModifierType } from '../../../types';

export const ETHER_STAVES: Entity[] = [
  {
    id: 'baton_ether_simple', type: EntityType.ITEM, name: 'Bâton d\'Éther Simple',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Bâtons d’éther', equipmentCost: 2,
    modifiers: [
        { id: 'mw_eth_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '15' },
        { id: 'mw_eth_res', type: ModifierType.FLAT, targetStatKey: 'res', value: '10' }
    ]
  }
];
