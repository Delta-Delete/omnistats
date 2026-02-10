
import { Entity, EntityType, ModifierType } from '../../../types';

export const CLAWS: Entity[] = [
  {
    id: 'griffe_commune', type: EntityType.ITEM, name: 'Griffe commune',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [
        { id: 'mw_cl_com', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '5' }
    ]
  },
  {
    id: 'griffe_acier', type: EntityType.ITEM, name: 'Griffe d’acier',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [
        { id: 'mw_cl_aci', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '18' }
    ]
  },
  {
    id: 'griffe_knot', type: EntityType.ITEM, name: 'Griffe knot',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [
        { id: 'mw_cl_knot', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '32' }
    ]
  },
  {
    id: 'griffe_roses', type: EntityType.ITEM, name: 'Griffe des Roses',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 300,
    modifiers: [
        { id: 'mw_cl_ros', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '64' }
    ]
  },
  {
    id: 'tessen', type: EntityType.ITEM, name: 'Tessen',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Valeur des Coups Critiques +25%.",
    modifiers: [
        { id: 'tess_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '78' },
        { id: 'tess_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'griffe_nero', type: EntityType.ITEM, name: 'Griffe Néro',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +15 dégâts ^^ +{{(15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 15}} ^^ et +55 vitesse ^^ +{{(55 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 55}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'g_nero_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '86' },
        { id: 'g_nero_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10' },
        { 
            id: 'g_nero_wet_dmg', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Dmg/Tour)'
        },
        { 
            id: 'g_nero_wet_spd', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'spd', 
            value: '55 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        }
    ]
  },
  {
    id: 'griffe_adamantium', type: EntityType.ITEM, name: 'Griffe en adamantium',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'mw_cl_adam', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '92' }
    ]
  },
  {
    id: 'griffe_perlee', type: EntityType.ITEM, name: 'Griffe perlée',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'gp_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '100' },
        { id: 'gp_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-10' }
    ]
  },
  {
    id: 'griffe_marais', type: EntityType.ITEM, name: 'Griffe des marais',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 600,
    description: "+10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ dégâts si le RP est à l'Ouest.",
    modifiers: [
        { id: 'gm_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '110' },
        { 
            id: 'gm_west', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_west', 
            toggleName: 'RP : Ouest', 
            toggleGroup: 'rp_location' 
        }
    ]
  },
  {
    id: 'griffe_tigre', type: EntityType.ITEM, name: 'Griffe du Tigre',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 700,
    modifiers: [
        { id: 'mw_cl_tigre', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '128' }
    ]
  },
  {
    id: 'toriffe', type: EntityType.ITEM, name: 'Toriffe',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    description: "Peut être bénie par une divinité djöllfuline.",
    modifiers: [
        { id: 'tor_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '146' },
        { id: 'tor_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-15' }
    ]
  },
  {
    id: 'griffe_ammos', type: EntityType.ITEM, name: 'Griffe Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'g_ammos_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '152' },
        { id: 'g_ammos_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-25' }
    ]
  },
  {
    id: 'manus_ayus', type: EntityType.ITEM, name: 'Manus & Ayus',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'ma_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '164' },
        { id: 'ma_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-25' }
    ]
  },
  {
    id: 'griffe_ounure', type: EntityType.ITEM, name: 'Griffe Ounure (imitation)',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'go_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '225' },
        { id: 'go_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-70' }
    ],
    descriptionBlocks: [
        {
            text: "Saignement : À chaque Coup Réussi la cible perd 20 ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^ de vitalité par tour, cumulable à l’infini.",
            tag: "active"
        }
    ]
  },
  {
    id: 'griffe_futhu', type: EntityType.ITEM, name: 'Griffe Fúthu',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'gf_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '300' },
        { id: 'gf_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' }
    ],
    descriptionBlocks: [
        {
            text: "Saignement : À chaque Coup Réussi le joueur perd 75 ^^ +{{(75 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 75}} ^^ vitalité par tour, cumulable à l’infini.",
            tag: "active"
        }
    ]
  },
  {
    id: 'double_griffes_daconiques', type: EntityType.ITEM, name: 'Double-griffes Daconiques',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1500,
    modifiers: [
        { id: 'dgd_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '256' },
        { id: 'dgd_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '15' }
    ]
  },
  {
    id: 'griffes_renfir', type: EntityType.ITEM, name: 'Griffes de Renfir',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Griffes', equipmentCost: 2,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [
        { id: 'renfri_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '460' },
        { id: 'renfri_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-10' }
    ],
    descriptionBlocks: [
        {
            text: "Appel du Loup : Chaque tour le joueur peut lancer un dé thériantrope en plus de ses attaques.",
            tag: "special"
        }
    ]
  }
];
