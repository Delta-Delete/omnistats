
import { Entity, EntityType, ModifierType } from '../../../types';

export const FLAILS: Entity[] = [
  {
    id: 'fleau_armes', type: EntityType.ITEM, name: 'Fléau d\'Armes',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    modifiers: [{ id: 'mw_fl_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '14' }]
  },
  {
    id: 'fleau_angmar',
    type: EntityType.ITEM,
    name: "Fléau d'Angmar",
    slotId: 'weapon_any',
    categoryId: 'weapon',
    subCategory: 'Fléaux d\'armes',
    equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'angmar_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '320' },
        { id: 'angmar_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '107' },
        { id: 'angmar_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-80' }
    ]
  }
];
