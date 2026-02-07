
import { Entity, EntityType, ModifierType } from '../../../types';

export const BOWS: Entity[] = [
  {
    id: 'arcbanal', type: EntityType.ITEM, name: 'Arc banal',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 2,
    modifiers: [
        { id: 'mw_a1_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' },
        { id: 'mw_a1_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-16' }
    ]
  },
  {
    id: 'arc_thym_imitation',
    type: EntityType.ITEM,
    name: 'Arc de Thym (imitation)',
    slotId: 'weapon_any',
    categoryId: 'weapon',
    subCategory: 'Arcs',
    equipmentCost: 2,
    description: "Glace : À chaque Coup Réussi, la cible perd 50 de vitesse.",
    modifiers: [
        { id: 'at_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '360' },
        { id: 'at_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-135' } 
    ]
  }
];
