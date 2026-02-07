
import { Entity, EntityType, ModifierType } from '../../../types';

export const SACRED_WEAPONS: Entity[] = [
  {
    id: 'relique_sacree', type: EntityType.ITEM, name: 'Relique Sacrée',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Armes sacrées', equipmentCost: 1,
    modifiers: [
        { id: 'mw_sac_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '12' },
        { id: 'mw_sac_res', type: ModifierType.FLAT, targetStatKey: 'res', value: '15' }
    ]
  }
];
