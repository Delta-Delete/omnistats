
import { Entity, EntityType, ModifierType } from '../../../types';

export const SCEPTRES: Entity[] = [
  {
    id: 'sceptre_apprenti', type: EntityType.ITEM, name: 'Sceptre d\'Apprenti',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Sceptres', equipmentCost: 1,
    modifiers: [{ id: 'mw_scp_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' }]
  }
];
