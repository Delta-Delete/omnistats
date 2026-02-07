
import { Entity, EntityType, ModifierType } from '../../../types';

export const DAGGERS: Entity[] = [
  {
    id: 'daguedenovice', type: EntityType.ITEM, name: 'Dague de novice',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    modifiers: [{ id: 'mw_d1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '5' }]
  },
  {
    id: 'dague_assassin', type: EntityType.ITEM, name: 'Dague de l’assassin',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    modifiers: [{ id: 'da_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '18' }]
  },
  {
    id: 'dague_argnan', type: EntityType.ITEM, name: 'Dague d’Argnan',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    modifiers: [{ id: 'darg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '32' }]
  },
  {
    id: 'dague_camelia', type: EntityType.ITEM, name: 'Dague Camélia',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
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
    description: "Arme immergée : Octroie +10 dégâts ^^ +{{10 * ((effect_booster || 0)/100)}} ^^ et +60 vitesse ^^ +{{60 * ((effect_booster || 0)/100)}} ^^ par tour si région Mers & Océans.",
    modifiers: [
        { id: 'nero_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '86' },
        { id: 'nero_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10' },
        { 
            id: 'nero_wet_dmg', 
            type: ModifierType.FLAT, 
            targetStatKey: 'dmg', 
            value: '10 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            name: 'Bonus Océan'
        },
        { 
            id: 'nero_wet_spd', 
            type: ModifierType.FLAT, 
            targetStatKey: 'spd', 
            value: '60 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Gain Vitesse / Tour (Océan)'
        }
    ]
  },
  {
    id: 'dague_emeraude', type: EntityType.ITEM, name: 'Dague Émeraude',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [{ id: 'dem_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '92' }]
  },
  {
    id: 'dague_adamantium', type: EntityType.ITEM, name: 'Dague en adamantium',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [
        { id: 'dad_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '100' },
        { id: 'dad_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-10' }
    ]
  },
  {
    id: 'poignard_vampirique', type: EntityType.ITEM, name: 'Poignard vampirique',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    description: "+10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ dégâts si le RP est au Sud.",
    modifiers: [
        { id: 'pvam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '110' },
        { 
            id: 'pvam_sud', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '10 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_rp_south', 
            toggleName: 'RP : Sud', 
            toggleGroup: 'rp_location' 
        }
    ]
  },
  {
    id: 'dague_bestiale', type: EntityType.ITEM, name: 'Dague Bestiale',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [{ id: 'dbes_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '128' }]
  },
  {
    id: 'daguishi', type: EntityType.ITEM, name: 'Daguishi',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    description: "Peut être béni par une divinité djöllfuline.",
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
    description: "Anti-vampires : Dégâts contre les vampires +20% ^^ +{{20 * ((effect_booster || 0)/100)}}% ^^.",
    modifiers: [
        { id: 'pieu_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '150' },
        { 
            id: 'pieu_vamp', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '20 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_target_vampire', 
            toggleName: 'Cible : Vampire'
        }
    ]
  },
  {
    id: 'dague_ammos', type: EntityType.ITEM, name: 'Dague Ammos',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée. Non réalisable dans la région Mers & Océans.",
    modifiers: [
        { id: 'ammos_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '152' },
        { id: 'ammos_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-25' }
    ],
    descriptionBlocks: [
        {
            text: "À chaque coup, réduit les dégâts de la cible de 10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ (Max -30% ^^ +{{30 * ((effect_booster || 0)/100)}}% ^^).",
            tag: "active"
        }
    ]
  },
  {
    id: 'dague_taki', type: EntityType.ITEM, name: 'Dague de Taki',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [
        { id: 'taki_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '164' },
        { id: 'taki_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-25' }
    ]
  },
  {
    id: 'karambiture', type: EntityType.ITEM, name: 'Karambiture',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    isCraftable: false,
    description: "Nécessite le Plan de la Karambiture.",
    modifiers: [
        { id: 'karam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '146' },
        { id: 'karam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-17' }
    ],
    descriptionBlocks: [
        {
            text: "Saignement : La cible perd 40 ^^ +{{40 * ((effect_booster || 0)/100)}} ^^ Vitalité/tour, cumulable à chaque Coup Réussi.",
            tag: "active"
        },
        {
            text: "Contrecoup : En cas d'Échec Critique, vous vous infligez le même saignement.",
            tag: "passive",
            title: "Lame à Double Tranchant"
        }
    ]
  },
  {
    id: 'stylet_shtar_imitation', type: EntityType.ITEM, name: 'Le Stylet des Shtär (imitation)',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: true,
    modifiers: [
        { id: 'ssi_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '225' },
        { id: 'ssi_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-70' }
    ],
    descriptionBlocks: [
        {
            text: "Poison : Dès que la cible est touchée, elle perd 50 ^^ +{{50 * ((effect_booster || 0)/100)}} ^^ Vitalité/tour.",
            tag: "active"
        }
    ]
  },
  {
    id: 'stylet_ishtar', type: EntityType.ITEM, name: 'Le Stylet d’Ishtar',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: true,
    modifiers: [
        { id: 'si_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '300' },
        { id: 'si_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' }
    ],
    descriptionBlocks: [
        {
            text: "Poison : Dès que la cible est touchée, elle perd 150 ^^ +{{150 * ((effect_booster || 0)/100)}} ^^ Vitalité/tour.",
            tag: "active"
        }
    ]
  },
  {
    id: 'al_enstae', type: EntityType.ITEM, name: "L’Al’Enstaë",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    description: "Valeur des Coups Critiques +50% ^^ +{{50 * ((effect_booster || 0)/100)}}% ^^.",
    modifiers: [
        { id: 'ale_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '310' },
        { id: 'ale_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-50' },
        { id: 'ale_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '50 * (1 + (effect_booster || 0)/100)' }
    ]
  },
  {
    id: 'double_dagues_catharsis', type: EntityType.ITEM, name: 'Double-dagues de Catharsis',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1, 
    isCraftable: false,
    modifiers: [
        { id: 'ddc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '256' },
        { id: 'ddc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '15' }
    ]
  },
  {
    id: 'couteau_niflheim', type: EntityType.ITEM, name: 'Couteau du Niflheim',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Dagues', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    modifiers: [
        { id: 'cn_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '460' },
        { id: 'cn_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-10' }
    ],
    descriptionBlocks: [
        {
            text: "Brouillard : À chaque CC, l’utilisateur devient intangible. Les dégâts et effets subis sont réduits de 75% (non modifiable) pendant 1 tour (cumulable par CC).",
            tag: "special"
        }
    ]
  }
];
