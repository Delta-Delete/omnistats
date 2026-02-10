
import { Entity, EntityType, ModifierType } from '../../../types';

export const SLINGS: Entity[] = [
  {
    id: 'lance_pierre', type: EntityType.ITEM, name: 'Lance-pierre',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [
        { id: 'lp_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '6' },
        { id: 'lp_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-7' }
    ]
  },
  {
    id: 'fronde_ishtarienne', type: EntityType.ITEM, name: 'Fronde ishtarienne',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [
        { id: 'fi_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '22' },
        { id: 'fi_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-14' }
    ]
  },
  {
    id: 'dracaufronde', type: EntityType.ITEM, name: 'Dracaufronde',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [
        { id: 'drac_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '42' },
        { id: 'drac_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-21' }
    ]
  },
  {
    id: 'fronde_boisier', type: EntityType.ITEM, name: "Fronde'boisier",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 300,
    modifiers: [
        { id: 'fb_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '84' },
        { id: 'fb_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-28' }
    ]
  },
  {
    id: 'shogue', type: EntityType.ITEM, name: 'Shogue',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "La valeur des Coups critiques est augmentée de 25%.",
    modifiers: [
        { id: 'sho_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '103' },
        { id: 'sho_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-32' },
        { id: 'sho_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'fronde_nero', type: EntityType.ITEM, name: 'Fronde Nεrό',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +30 dégâts ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}} ^^ et +20 vitesse ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'fn_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '105' },
        { id: 'fn_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-30' },
        { 
            id: 'fn_wet_d', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Dmg/Tour)'
        },
        { 
            id: 'fn_wet_s', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'spd', 
            value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        }
    ]
  },
  {
    id: 'lanceur_topaze', type: EntityType.ITEM, name: 'Lanceur de topaze',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'lt_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '121' },
        { id: 'lt_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-35' }
    ]
  },
  {
    id: 'fustibale_forestiere', type: EntityType.ITEM, name: 'Fustibale forestière',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'ff_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '141' },
        { id: 'ff_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-41' }
    ]
  },
  {
    id: 'frelonde', type: EntityType.ITEM, name: 'Frelonde',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 700,
    modifiers: [
        { id: 'fre_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '169' },
        { id: 'fre_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-42' }
    ]
  },
  {
    id: 'frondora', type: EntityType.ITEM, name: 'Frondora',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être bénie par une divinité djöllfuline.",
    modifiers: [
        { id: 'fro_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '181' },
        { id: 'fro_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-44' }
    ]
  },
  {
    id: 'fronde_ammos', type: EntityType.ITEM, name: 'Fronde Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'fam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '200' },
        { id: 'fam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-46' }
    ]
  },
  {
    id: 'frond_onsake', type: EntityType.ITEM, name: "Frond'Onsaké",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'fo_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '216' },
        { id: 'fo_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-48' }
    ]
  },
  {
    id: 'mini_trebuchet', type: EntityType.ITEM, name: "Mini-trébuchet de poche",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1500,
    modifiers: [
        { id: 'mt_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '338' },
        { id: 'mt_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-63' }
    ]
  },
  {
    id: 'projette_tronc_lug', type: EntityType.ITEM, name: "Projette-tronc de Lug",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'ptl_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '396' },
        { id: 'ptl_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-77' }
    ],
    descriptionBlocks: [
        {
            title: "Chute d'arbre",
            text: "L'attaque du propriétaire ne peut pas être réduite, ni annulée par la pierre de résurrection.",
            tag: "special_unblockable"
        }
    ]
  },
  {
    id: 'tregleipnir', type: EntityType.ITEM, name: "Tregleipnir",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Frondes', equipmentCost: 2,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [
        { id: 'trg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '620' },
        { id: 'trg_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-116' }
    ],
    descriptionBlocks: [
        {
            title: "Entrave",
            text: "La première fois que la cible est touchée par le joueur elle devient entravée jusqu'à la fin du combat. Elle doit lancer en premier un dé de race (thérianthrope pour le bestiaire) en plus de ses attaques et doit faire un CR ou un CC pour que les autres attaques fonctionnent.",
            tag: "special_unblockable"
        }
    ]
  }
];
