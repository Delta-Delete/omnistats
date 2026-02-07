
import { Entity, EntityType, ModifierType } from '../../../types';

export const RINGS: Entity[] = [
  {
    id: 'anneau_vigueur', type: EntityType.ITEM, name: 'Anneau de Vigueur',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Anneaux', equipmentCost: 1,
    description: 'Arme secondaire. Augmente la vitalité.',
    modifiers: [{ id: 'mw_rng_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' }]
  }
];
