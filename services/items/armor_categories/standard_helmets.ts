
import { Entity, EntityType, ModifierType } from '../../../types';

export const STANDARD_HELMETS: Entity[] = [
  {
    id: 'helm_essence_invocatoire',
    type: EntityType.ITEM,
    name: "Chapeau d'essence invocatoire",
    slotId: 'head',
    categoryId: 'armor_head',
    subCategory: 'Panoplie',
    rarity: 'exotic',
    setId: 'set_essence_invocatoire',
    description: "Les invocations gagnent +50 à toutes les stats (Vit/Spd/Dmg). Fait partie du set 'Essence invocatoire'.",
    modifiers: [
      { id: 'h_ess_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '330' },
      { id: 'h_ess_sum_flat', type: ModifierType.FLAT, targetStatKey: 'summon_flat_bonus', value: '50' }
    ]
  },
  {
    id: 'helm_sorcier', 
    type: EntityType.ITEM, 
    name: "Chapeau de sorcier",
    slotId: 'head', 
    categoryId: 'armor_head',
    subCategory: 'Casque',
    description: "333 Vitalité.\n**Enchanteur** : les effets des enchantements portés sont multipliés par deux. {Réservé à l'Institut de magie}",
    isCraftable: true,
    modifiers: [
      { 
          id: 'h_sorc_vit', 
          type: ModifierType.FLAT, 
          targetStatKey: 'vit', 
          value: '333',
          // Condition ajoutée pour le verrouillage complet (Red Lock)
          condition: "(guildIds && guildIds.includes('guild_institut_magie')) || careerId === 'career_institut'"
      },
      { 
        id: 'h_sorc_ench_boost', 
        type: ModifierType.FLAT, 
        targetStatKey: 'enchantment_mult', 
        value: '1', 
        condition: "(guildIds && guildIds.includes('guild_institut_magie')) || careerId === 'career_institut'",
        name: "Enchanteur (x2 Enchantements)"
      }
    ]
  },
  {
    id: 'helm_amplificator', 
    type: EntityType.ITEM, 
    name: "Heaume de l'Amplificateur",
    slotId: 'head', 
    categoryId: 'armor_head',
    subCategory: 'Casque',
    description: "Un casque parcouru de runes vibrantes. Augmente l'efficacité de tous vos effets spéciaux de 10% (Boost Effets).",
    modifiers: [
      { 
        id: 'h_amp_val', 
        type: ModifierType.FLAT, 
        targetStatKey: 'effect_booster', 
        value: '10', 
        name: "Amplification (+10%)" 
      }
    ]
  },
  {
    id: 'helm_soldat', type: EntityType.ITEM, name: 'Casque de Soldat',
    slotId: 'head', categoryId: 'armor_head', subCategory: 'Casque',
    modifiers: []
  }
];
