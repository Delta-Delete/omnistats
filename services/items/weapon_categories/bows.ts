
import { Entity, EntityType, ModifierType } from '../../../types';

export const BOWS: Entity[] = [
  // --- NON CRAFTABLES ---
  {
    id: 'arc_banal', type: EntityType.ITEM, name: 'Arc banal',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [
        { id: 'ab_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' },
        { id: 'ab_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-16' }
    ]
  },
  {
    id: 'arc_elfique', type: EntityType.ITEM, name: 'Arc elfique',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [
        { id: 'ae_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '29' },
        { id: 'ae_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-24' }
    ]
  },
  {
    id: 'psykokwarc', type: EntityType.ITEM, name: "Psykokw'arc",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [
        { id: 'psy_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '56' },
        { id: 'psy_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-32' }
    ]
  },
  {
    id: 'han_kyu', type: EntityType.ITEM, name: 'Han Kyu',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "La valeur des Coups critiques est augmentée de 25%.",
    modifiers: [
        { id: 'hk_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '125' },
        { id: 'hk_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-44' },
        { id: 'hk_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'arc_nero', type: EntityType.ITEM, name: 'Arc Nεrό',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +40 dégâts ^^ +{{(40 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 40}} ^^ et +30 vitesse ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'an_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '127' },
        { id: 'an_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-41' },
        { 
            id: 'an_wet_d', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '40 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Dmg/Tour)'
        },
        { 
            id: 'an_wet_s', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'spd', 
            value: '30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        }
    ]
  },
  {
    id: 'arc_ammos', type: EntityType.ITEM, name: 'Arc Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'aam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '243' },
        { id: 'aam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-61' }
    ]
  },
  {
    id: 'arc_thym', type: EntityType.ITEM, name: "L'Arc de Thym (imitation)",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'ath_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '360' },
        { id: 'ath_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-135' }
    ],
    descriptionBlocks: [
        {
            title: "Glace",
            text: "À chaque Coup Réussi, la cible perd 50 de vitesse.",
            tag: "active"
        }
    ]
  },
  {
    id: 'arc_thrym', type: EntityType.ITEM, name: "L'Arc de Thrym",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    isTungsten: true,
    description: "Cette arme possède actuellement un propriétaire.",
    modifiers: [
        { id: 'athr_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '480' },
        { id: 'athr_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-102' }
    ],
    descriptionBlocks: [
        {
            title: "Glace",
            text: "À chaque Coup Réussi, le joueur perd 200 de vitesse.",
            tag: "active"
        }
    ]
  },

  // --- CRAFTABLES ---
  {
    id: 'arc_cestrum', type: EntityType.ITEM, name: 'Cestrum',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'acm_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '84' },
        { id: 'acm_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-28' }
    ]
  },
  {
    id: 'arc_le_sesterce', type: EntityType.ITEM, name: 'Le Sesterce',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'als_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '121' },
        { id: 'als_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-35' }
    ]
  },
  {
    id: 'arc_cestival', type: EntityType.ITEM, name: 'Cestival',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'act_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '141' },
        { id: 'act_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-41' }
    ]
  },
  {
    id: 'arc_droitelet', type: EntityType.ITEM, name: 'Droitelet',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'adr_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '169' },
        { id: 'adr_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-42' }
    ]
  },
  {
    id: 'arc_cestushi', type: EntityType.ITEM, name: 'Cestushi',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être bénie par une divinité djöllfuline.",
    modifiers: [
        { id: 'acs_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '181' },
        { id: 'acs_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-44' }
    ]
  },
  {
    id: 'arc_wane_peunshe_mane', type: EntityType.ITEM, name: 'Wane Peunshe Mane',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    modifiers: [
        { id: 'awpm_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '216' },
        { id: 'awpm_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-48' }
    ]
  },
  {
    id: 'arc_poignes_cristal', type: EntityType.ITEM, name: 'Poignes de cristal',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 2,
    isCraftable: true,
    modifiers: [
        { id: 'apc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '338' },
        { id: 'apc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-63' }
    ]
  },
  {
    id: 'arc_marrons_glaces', type: EntityType.ITEM, name: 'Marrons glacés',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 2,
    isCraftable: true,
    description: "**Maître** : +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ Dégâts si Armure Intermédiaire OU Compagnon.\n+25% ^^ +{{(25 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 25}}% ^^ si les DEUX.",
    modifiers: [
        { id: 'amg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '300' },
        { id: 'amg_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-73' },
        { id: 'amg_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        {
            id: 'amg_maitre',
            type: ModifierType.PERCENT_ADD,
            targetStatKey: 'dmg',
            value: `((countItems('Intermédiaire') > 0 && (countItems('mount') > 0 || countItems('familiar') > 0 || countItems('companion') > 0)) ? 25 : (countItems('Intermédiaire') > 0 || (countItems('mount') > 0 || countItems('familiar') > 0 || countItems('companion') > 0)) ? 20 : 0) * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)`,
            name: "Bonus Maître (Armure/Comp)"
        }
    ]
  },
  {
    id: 'arc_de_link', type: EntityType.ITEM, name: 'Arc de Link',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arcs', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'link_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '262' },
        { id: 'link_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-64' }
    ]
  }
];
