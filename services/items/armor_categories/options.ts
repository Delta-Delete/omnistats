
import { Entity, EntityType, ModifierType } from '../../../types';

export const ARMOR_OPTIONS: Entity[] = [
  {
    id: 'opt_head_vit', type: EntityType.ITEM, name: 'Doublure de Vitalité',
    slotId: 'head_bonus', categoryId: 'armor_option',
    description: 'Renfort interne pour le casque.',
    modifiers: [{ id: 'opt_h_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' }]
  },
  {
    id: 'opt_chest_vit', type: EntityType.ITEM, name: 'Renfort de Vitalité',
    slotId: 'chest_bonus', categoryId: 'armor_option',
    description: 'Plaques additionnelles pour le torse.',
    modifiers: [{ id: 'opt_c_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' }]
  },
  {
    id: 'opt_legs_spd', type: EntityType.ITEM, name: 'Servomoteurs de Vitesse',
    slotId: 'legs_bonus', categoryId: 'armor_option',
    description: 'Assistance mécanique pour les jambes.',
    modifiers: [{ id: 'opt_l_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50' }]
  }
];
