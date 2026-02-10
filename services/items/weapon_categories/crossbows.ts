
import { Entity, EntityType, ModifierType } from '../../../types';

export const CROSSBOWS: Entity[] = [
  // --- NON CRAFTABLES ---
  {
    id: 'arbalete_debutant', type: EntityType.ITEM, name: 'Arbalète de débutant',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [
        { id: 'ad_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' },
        { id: 'ad_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-16' }
    ]
  },
  {
    id: 'arbalete_pourpre', type: EntityType.ITEM, name: 'Arbalète pourpre',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [
        { id: 'ap_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '29' },
        { id: 'ap_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-24' }
    ]
  },
  {
    id: 'leuveihn_arbalete', type: EntityType.ITEM, name: "Leuveihn'arbalète",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [
        { id: 'la_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '56' },
        { id: 'la_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-32' }
    ]
  },
  {
    id: 'arbalete_orque', type: EntityType.ITEM, name: 'Arbalète orque',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: false, // Noté comme non craftable dans la liste du haut, mais craftable en bas. Je le mets ici.
    description: "+10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ dégâts si le RP est au Centre.",
    modifiers: [
        { id: 'ao_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '176' },
        { id: 'ao_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-52' },
        { 
            id: 'ao_center', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_center', 
            toggleName: 'RP : Centre', 
            toggleGroup: 'rp_location' 
        }
    ]
  },
  {
    id: 'sarbacane', type: EntityType.ITEM, name: 'Sarbacane',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "La valeur des Coups critiques est augmentée de 25%.",
    modifiers: [
        { id: 'sar_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '125' },
        { id: 'sar_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-44' },
        { id: 'sar_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'arbalete_nero', type: EntityType.ITEM, name: 'Arbalète Nεrό',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +50 dégâts ^^ +{{(50 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 50}} ^^ et +20 vitesse ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'an_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '127' },
        { id: 'an_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-41' },
        { 
            id: 'an_wet_d', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '50 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
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
            value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        }
    ]
  },
  {
    id: 'arbalete_ammos', type: EntityType.ITEM, name: 'Arbalète Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'aam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '243' },
        { id: 'aam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-61' }
    ]
  },
  {
    id: 'occit_zombie_aryl', type: EntityType.ITEM, name: "Occit-Zombie d'Aryl",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    modifiers: [
        { id: 'oza_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '0' },
        { id: 'oza_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-100' },
        {
            id: 'oza_adre',
            type: ModifierType.ALT_FLAT,
            targetStatKey: 'dmg',
            value: '(level * (classId === "archers" ? 30 : 15)) * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)',
            name: "Adrénaline (Niveau)"
        }
    ],
    descriptionBlocks: [
        {
            title: "Adrénaline",
            text: "Le joueur gagne **{{ (level * (classId === 'archers' ? 30 : 15)) * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1) }}** de dégâts (Alt Fixe) en début de combat (Niv x 15, ou x30 pour Archers). Cet effet est imblocable.",
            tag: "unblockable"
        }
    ]
  },
  {
    id: 'arbalete_tilleul_gall', type: EntityType.ITEM, name: "L'Arbalète foudroyante de Tilleul Gall (imitation)",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'atg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '360' },
        { id: 'atg_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-135' }
    ],
    descriptionBlocks: [
        {
            title: "Foudre",
            text: "Dès que la cible est touchée, elle perd 35 de vitesse/tour.",
            tag: "active"
        }
    ]
  },
  {
    id: 'arbalete_tillaume_gwell', type: EntityType.ITEM, name: "L'Arbalète foudroyante de Tillaüme Gwell",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'atgw_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '480' },
        { id: 'atgw_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-102' }
    ],
    descriptionBlocks: [
        {
            title: "Foudre",
            text: "À chaque Coup Réussi, la cible perd 150 de vitesse.",
            tag: "active"
        }
    ]
  },
  {
    id: 'ostar_arbalete', type: EntityType.ITEM, name: "Ostar'arbalète",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 2,
    rarity: 'exotic',
    isCraftable: false,
    imageUrl: 'https://i.servimg.com/u/f36/15/33/58/83/951c3410.jpg',
    modifiers: [
        { id: 'ost_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '460' },
        { id: 'ost_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-109' }
    ],
    descriptionBlocks: [
        {
            title: "Réanimation printanière",
            text: "1x pendant le combat, le propriétaire peut réanimer un allié joueur ou compagnon autre que lui tombé pendant ce tour ou au tour précédent. Le personnage ressuscité revient avec 50% de sa vitalité.",
            tag: "special"
        }
    ]
  },
  {
    id: 'gastrophete_houx', type: EntityType.ITEM, name: "Gastrophète du Houx",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 2,
    rarity: 'epic',
    isCraftable: false,
    modifiers: [
        { id: 'gh_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '751' },
        { id: 'gh_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-144' },
        { 
            id: 'gh_holly', 
            type: ModifierType.FLAT, 
            targetStatKey: 'vit', 
            value: '1000 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)',
            isPerTurn: true,
            name: "Holly (Régén/Tour)"
        }
    ],
    descriptionBlocks: [
        {
            title: "Holly",
            text: "Le joueur gagne 1000 ^^ +{{(1000 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 1000}} ^^ de vitalité à la fin de chaque tour.",
            tag: "passive"
        }
    ]
  },

  // --- CRAFTABLES ---
  {
    id: 'nenuphar_balete', type: EntityType.ITEM, name: "Nénuphar'balète",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 300,
    modifiers: [
        { id: 'nen_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '102' },
        { id: 'nen_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' }
    ]
  },
  {
    id: 'lapilazul_arbalete', type: EntityType.ITEM, name: "Lapilazul'arbalète",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'lap_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '147' },
        { id: 'lap_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-48' }
    ]
  },
  {
    id: 'lez_arbalete', type: EntityType.ITEM, name: "Léz'arbalète",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'lez_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '167' },
        { id: 'lez_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-55' }
    ]
  },
  {
    id: 'arbalete_animale', type: EntityType.ITEM, name: "Arbalète Animale",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 700,
    modifiers: [
        { id: 'aa_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '205' },
        { id: 'aa_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-56' }
    ]
  },
  {
    id: 'arbaleishi', type: EntityType.ITEM, name: "Arbaleishi",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être bénie par une divinité djöllfuline.",
    modifiers: [
        { id: 'arb_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '234' },
        { id: 'arb_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-60' }
    ]
  },
  {
    id: 'van_helzio', type: EntityType.ITEM, name: "Van H'Elzio",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'vh_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '262' },
        { id: 'vh_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-64' }
    ]
  },
  {
    id: 'mini_baliste', type: EntityType.ITEM, name: "Mini-Baliste",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1500,
    modifiers: [
        { id: 'mb_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '410' },
        { id: 'mb_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-84' }
    ]
  },
  {
    id: 'frelons_jumeaux', type: EntityType.ITEM, name: "Frelons jumeaux",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Arbalètes', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1600,
    description: "**Maraudeur** : +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ Vitesse si Armure Légère OU Familier Chien/Loup.\n+25% ^^ +{{(25 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 25}}% ^^ si les DEUX.",
    modifiers: [
        { id: 'fj_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '380' },
        { id: 'fj_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' },
        {
            id: 'fj_maraudeur',
            type: ModifierType.PERCENT_ADD,
            targetStatKey: 'spd',
            value: `((countItems('Léger') > 0 && (countItems('Chien') > 0 || countItems('Loup') > 0)) ? 25 : (countItems('Léger') > 0 || (countItems('Chien') > 0 || countItems('Loup') > 0)) ? 20 : 0) * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)`,
            name: "Bonus Maraudeur (Léger/Chien/Loup)"
        }
    ]
  }
];
