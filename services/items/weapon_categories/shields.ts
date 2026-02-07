
import { Entity, EntityType, ModifierType } from '../../../types';

export const SHIELDS: Entity[] = [
  {
    id: 'bouclier_bois', type: EntityType.ITEM, name: 'Bouclier en Bois',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Boucliers', equipmentCost: 1,
    modifiers: [
        { id: 'mw_sh_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' }
    ]
  },
  {
    id: 'pavois', type: EntityType.ITEM, name: 'Grand Pavois',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Boucliers', equipmentCost: 2,
    modifiers: [
        { id: 'mw_pav_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '120' }
    ]
  },
  {
    id: 'bouclier_eclat_dragonnier',
    type: EntityType.ITEM,
    name: "L’Éclat du Dragonnier",
    slotId: 'weapon_any',
    categoryId: 'weapon',
    subCategory: 'Boucliers',
    equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'bed_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '900' },
        { id: 'bed_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-100' }
    ]
  }
];
