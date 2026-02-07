
import { Entity, EntityType, ModifierType } from '../../../types';

export const INSTRUMENTS: Entity[] = [
  {
    id: 'luth_barde', type: EntityType.ITEM, name: 'Luth du Voyageur',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Instrument (Corde)', equipmentCost: 1,
    description: "Un instrument simple. Débloque 2 emplacements de partitions.",
    modifiers: [
        { id: 'w_luth_cap', type: ModifierType.FLAT, targetStatKey: 'partition_cap', value: '2' },
        { id: 'w_luth_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' }
    ]
  }
];
