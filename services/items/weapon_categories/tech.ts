
import { Entity, EntityType, ModifierType } from '../../../types';

export const TECH_WEAPONS: Entity[] = [
  {
    id: 'tourelle_ciblage', type: EntityType.ITEM, name: 'Tourelle de Ciblage',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Armes technologiques', equipmentCost: 1,
    description: "Une unité statique. Dégâts {{30 * turret_mult}}. Donne {{100 * turret_mult}} or par kill.",
    modifiers: [
        { id: 't_cib_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * turret_mult' },
        { id: 't_cib_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10 * turret_mult' }
    ]
  },
  {
    id: 'tourelle_def', type: EntityType.ITEM, name: 'Tourelle de Défense',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Armes technologiques', equipmentCost: 2,
    description: "Bouclier projeté. Vitalité {{50 * turret_mult}}.",
    modifiers: [
        { id: 't_def_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * turret_mult' }
    ]
  }
];
