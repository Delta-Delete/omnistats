
import { Entity, EntityType, ModifierType } from '../../../types';
import { SPECIAL_CLASS_IDS } from '../../constants';

// Génération de la chaîne pour la condition JS : 'arlequins', 'conjurateurs', ...
const SPECIAL_CLASS_IDS_STRING = SPECIAL_CLASS_IDS.map(id => `'${id}'`).join(', ');

export const STANDARD_CHESTS: Entity[] = [
  {
    id: 'chest_robe_mage',
    type: EntityType.ITEM,
    name: "Robe de mage",
    slotId: 'chest',
    categoryId: 'armor_chest',
    subCategory: 'Léger',
    // Description removed as requested
    modifiers: [
        {
            id: 'c_robe_mage_v',
            type: ModifierType.FLAT,
            targetStatKey: 'vit',
            value: '300',
            condition: "(guildIds && guildIds.includes('guild_institut_magie')) || careerId === 'career_institut'"
        }
    ]
  },
  {
    id: 'chest_essence_invocatoire',
    type: EntityType.ITEM,
    name: "Tunique d'essence invocatoire",
    slotId: 'chest',
    categoryId: 'armor_chest',
    subCategory: 'Panoplie',
    rarity: 'exotic',
    setId: 'set_essence_invocatoire',
    description: "**Exotique**. Pièce du set 'Essence invocatoire'. +100 Vit.",
    modifiers: [
      { id: 'c_ess_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' }
    ]
  },
  {
    id: 'chest_bushi', type: EntityType.ITEM, name: 'Armure du Bushi',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Intermédiaire',
    description: "Donne 800 Vit.\nSi Classe Spéciale : Augmente de 25% les effets des mécaniques de classe (Tourelles, Sceaux, Decks, Corruption, Partitions).",
    modifiers: [
        { id: 'bushi_vit_flat', type: ModifierType.FLAT, targetStatKey: 'vit', value: '800' },
        { 
            id: 'bushi_spec_mastery', 
            type: ModifierType.FLAT, 
            targetStatKey: 'special_mastery', 
            value: '25', 
            // Utilisation de la constante importée depuis constants.ts pour casser la boucle
            condition: `[${SPECIAL_CLASS_IDS_STRING}].includes(classId)`,
            name: 'Bonus Maîtrise Bushi'
        },
    ]
  },
  // PLACEHOLDERS GÉNÉRIQUES (Exemples)
  {
    id: 'chest_lourd_base', type: EntityType.ITEM, name: 'Plastron en Acier',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Lourd',
    modifiers: []
  },
  {
    id: 'chest_leger_base', type: EntityType.ITEM, name: 'Tunique de Cuir',
    slotId: 'chest', categoryId: 'armor_chest', subCategory: 'Léger',
    modifiers: [{ id: 'ch_l_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20' }]
  }
];
