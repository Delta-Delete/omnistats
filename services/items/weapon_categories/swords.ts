
import { Entity, EntityType, ModifierType } from '../../../types';

export const SWORDS: Entity[] = [
  {
    id: 'epee_courte', type: EntityType.ITEM, name: 'Épée Courte',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Épées', equipmentCost: 1,
    modifiers: [{ id: 'mw_sw_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' }]
  },
  {
    id: 'epee_longue', type: EntityType.ITEM, name: 'Épée Longue',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Épées', equipmentCost: 2,
    modifiers: [{ id: 'mw_sw_2', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' }]
  },
  {
    id: 'epee_excalibur',
    type: EntityType.ITEM,
    name: 'Excalibur',
    slotId: 'weapon_any',
    categoryId: 'weapon',
    subCategory: 'Épées',
    equipmentCost: 1,
    rarity: 'epic',
    description: "**Flamme ardente** : Les dégâts sont augmentés de 20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ contre les Abominations, Démons, Squelettes, Morts-vivants, Vampires, Corrompus.",
    modifiers: [
        { id: 'excal_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '722' },
        { id: 'excal_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-154' },
        { 
            id: 'excal_bane', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_excalibur_bane', 
            toggleName: 'Cible : Ténèbres/Corrompu' 
        }
    ]
  },
  {
    id: 'epee_gram',
    type: EntityType.ITEM,
    name: 'Gram',
    slotId: 'weapon_any',
    categoryId: 'weapon',
    subCategory: 'Épées',
    equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'gram_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '394' },
        { id: 'gram_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-96' }
    ]
  }
];
