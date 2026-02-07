
import { Entity, EntityType, ModifierType } from '../../../types';

export const ARLEQUIN_ARMORS: Entity[] = [
  {
    id: 'arl_hat_1', type: EntityType.ITEM, name: 'Chapeau à Grelots',
    slotId: 'head', categoryId: 'armor_head', subCategory: 'Chapeau',
    description: "Réservé Arlequins. +5% Ratio Deck.",
    modifiers: [
        { id: 'ah1_r', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_dmg', value: '0.05', condition: "classId === 'arlequins'" }
    ]
  },
  {
    id: 'arl_costume_1', type: EntityType.ITEM, name: 'Costume de Scène',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Costume',
    description: "Réservé Arlequins. +100 Vit, +10 Spd.",
    modifiers: [
        { id: 'ac1_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100', condition: "classId === 'arlequins'" },
        { id: 'ac1_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10', condition: "classId === 'arlequins'" }
    ]
  }
];
