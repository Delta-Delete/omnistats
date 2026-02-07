
import { Entity, EntityType, ModifierType } from '../../../types';

export const TECHNOPHILE_ARMORS: Entity[] = [
  {
    id: 'tech_helm_1', type: EntityType.ITEM, name: 'Visière HUD',
    slotId: 'head', categoryId: 'armor_head', subCategory: 'Casque technologique',
    description: "Réservé Technophiles. +10% Dégâts Tourelles.",
    modifiers: [
        { id: 'th1_t', type: ModifierType.PERCENT_ADD, targetStatKey: 'turret_mult', value: '10', condition: "classId === 'technophiles'" }
    ]
  },
  {
    id: 'tech_armor_1', type: EntityType.ITEM, name: 'Exosquelette MK-I',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Armure technologique',
    description: "Réservé Technophiles.",
    modifiers: []
  },
  {
    id: 'tech_boots_1', type: EntityType.ITEM, name: 'Propulseurs',
    slotId: 'legs', categoryId: 'armor_legs', subCategory: 'Bottes technologiques',
    description: "Réservé Technophiles. +50 Spd.",
    modifiers: [
        { id: 'tb1_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50', condition: "classId === 'technophiles'" }
    ]
  }
];
