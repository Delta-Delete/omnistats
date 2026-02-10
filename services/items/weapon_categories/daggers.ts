
import { Entity, EntityType, ModifierType } from '../../../types';

export const DAGGERS: Entity[] = [
  {
    id: 'daguedenovice', type: EntityType.ITEM, name: 'Dague de novice',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [{ id: 'mw_d1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '5' }]
  },
  {
    id: 'dague_assassin', type: EntityType.ITEM, name: 'Dague de l’assassin',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [{ id: 'da_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '18' }]
  },
  {
    id: 'dague_argnan', type: EntityType.ITEM, name: 'Dague d’Argnan',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [{ id: 'darg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '32' }]
  },
  {
    id: 'dague_camelia', type: EntityType.ITEM, name: 'Dague Camélia',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    goldCost: 300,
    modifiers: [{ id: 'dcam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '64' }]
  },
  {
    id: 'wakizachi', type: EntityType.ITEM, name: 'Wakizachi',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Valeur des Coups Critiques +25%.",
    modifiers: [
        { id: 'waki_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '78' },
        { id: 'waki_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'dague_nero', type: EntityType.ITEM, name: 'Dague Néro',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +10 dégâts ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}} ^^ et +60 vitesse ^^ +{{(60 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 60}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'nero_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '86' },
        { id: 'nero_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10' },
        { 
            id: 'nero_wet_dmg', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            isPerTurn: true, 
            name: 'Bonus Océan (Dmg/Tour)'
        },
        { 
            id: 'nero_wet_spd', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'spd', 
            value: '60 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        }
    ]
  },
  {
    id: 'dague_emeraude', type: EntityType.ITEM, name: 'Dague Émeraude',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [{ id: 'dem_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '92' }]
  },
  {
    id: 'dague_adamantium', type: EntityType.ITEM, name: 'Dague en adamantium',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'dad_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '100' },
        { id: 'dad_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-10' }
    ]
  },
  {
    id: 'poignard_vampirique', type: EntityType.ITEM, name: 'Poignard vampirique',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    goldCost: 600,
    description: "+10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ dégâts si le RP est au Sud.",
    modifiers: [
        { id: 'pvam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '110' },
        { 
            id: 'pvam_sud', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_south', 
            toggleName: 'RP : Sud', 
            toggleGroup: 'rp_location' 
        }
    ]
  },
  {
    id: 'dague_bestiale', type: EntityType.ITEM, name: 'Dague Bestiale',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    goldCost: 700,
    modifiers: [{ id: 'dbes_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '128' }]
  },
  {
    id: 'daguishi', type: EntityType.ITEM, name: 'Daguishi',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être bénie par une divinité djöllfuline.",
    modifiers: [
        { id: 'dagui_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '146' },
        { id: 'dagui_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-15' }
    ]
  },
  {
    id: 'pieu', type: EntityType.ITEM, name: 'Pieu',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Anti-vampires : Dégâts contre les vampires +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^.",
    modifiers: [
        { id: 'pieu_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '150' },
        { 
            id: 'pieu_vamp', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_target_vampire', 
            toggleName: 'Cible : Vampire'
        }
    ]
  },
  {
    id: 'dague_ammos', type: EntityType.ITEM, name: 'Dague Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'ammos_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '152' },
        { id: 'ammos_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-25' }
    ]
  },
  {
    id: 'dague_taki', type: EntityType.ITEM, name: 'Dague de Taki',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'taki_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '164' },
        { id: 'taki_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-25' }
    ]
  },
  {
    id: 'karambiture', type: EntityType.ITEM, name: 'Karambiture',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1200,
    modifiers: [
        { id: 'karam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '146' },
        { id: 'karam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-17' }
    ]
  },
  {
    id: 'stylet_shtar_imitation', type: EntityType.ITEM, name: 'Le Stylet des Shtär (imitation)',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: true,
    isTungsten: true,
    modifiers: [
        { id: 'ssi_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '225' },
        { id: 'ssi_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-70' }
    ],
    descriptionBlocks: [
        {
            text: "Poison : Dès que la cible est touchée, elle perd 50 ^^ +{{(50 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 50}} ^^ de vitalité/tour.",
            tag: "active"
        }
    ]
  },
  {
    id: 'stylet_ishtar', type: EntityType.ITEM, name: 'Le Stylet d’Ishtar',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: true,
    isTungsten: true,
    modifiers: [
        { id: 'si_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '300' },
        { id: 'si_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' }
    ],
    descriptionBlocks: [
        {
            text: "Poison : Dès que la cible est touchée, elle perd 150 ^^ +{{(150 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 150}} ^^ de vitalité/tour.",
            tag: "active"
        }
    ]
  },
  {
    id: 'al_enstae', type: EntityType.ITEM, name: "L’Al’Enstaë",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    description: "Valeur des Coups Critiques +50%.",
    modifiers: [
        { id: 'ale_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '310' },
        { id: 'ale_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-50' },
        { id: 'ale_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '50' }
    ]
  },
  {
    id: 'double_dagues_catharsis', type: EntityType.ITEM, name: 'Double-dagues de Catharsis',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 2, 
    isCraftable: true,
    goldCost: 1500,
    modifiers: [
        { id: 'ddc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '256' },
        { id: 'ddc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '15' }
    ]
  },
  {
    id: 'couteau_niflheim', type: EntityType.ITEM, name: 'Couteau du Niflheim',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 2,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [
        { id: 'cn_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '460' },
        { id: 'cn_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-10' }
    ],
    descriptionBlocks: [
        {
            text: "Brouillard : A chaque CC, l'utilisateur devient intangible. Les dégâts et effets subis sont alors réduits de 75% pendant 1 tour (tour cumulable/CC)",
            tag: "special"
        }
    ]
  }
];
