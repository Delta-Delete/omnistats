
import { Entity, EntityType, ModifierType } from '../../../types';

export const TECH_SHIELDS: Entity[] = [
  {
    id: 'bouclier_energetique', type: EntityType.ITEM, name: 'Bouclier Énergétique',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Boucliers technologiques', equipmentCost: 1,
    modifiers: [
        { id: 'mw_tsh_res', type: ModifierType.FLAT, targetStatKey: 'res', value: '20' },
        { id: 'mw_tsh_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '40' }
    ]
  }
];
