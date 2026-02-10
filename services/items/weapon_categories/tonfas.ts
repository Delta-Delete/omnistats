
import { Entity, EntityType, ModifierType } from '../../../types';

export const TONFAS: Entity[] = [
  {
    id: 'tonfa_bois', type: EntityType.ITEM, name: 'Tonfa en bois',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [
        { id: 'tb_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' },
        { id: 'tb_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '4' },
        { id: 'tb_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-20' }
    ]
  },
  {
    id: 'tonfa_paysan', type: EntityType.ITEM, name: 'Tonfa du paysan',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [
        { id: 'tp_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '36' },
        { id: 'tp_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '15' },
        { id: 'tp_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-30' }
    ]
  },
  {
    id: 'zigza_tonfa', type: EntityType.ITEM, name: 'Zigza Tonfa',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [
        { id: 'zt_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '65' },
        { id: 'zt_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '22' },
        { id: 'zt_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' }
    ]
  },
  {
    id: 'tonfatsia', type: EntityType.ITEM, name: 'TonFatsia',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    goldCost: 300,
    modifiers: [
        { id: 'tf_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '120' },
        { id: 'tf_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '41' },
        { id: 'tf_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-50' }
    ]
  },
  {
    id: 'tonfa_ninja', type: EntityType.ITEM, name: 'Tonfa Ninja',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "La valeur des Coups critiques est augmentée de 25%.",
    modifiers: [
        { id: 'tn_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '150' },
        { id: 'tn_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '51' },
        { id: 'tn_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-55' },
        { id: 'tn_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'tonfa_nero', type: EntityType.ITEM, name: 'Tonfa Nεrό',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +20 dégâts ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^, +15 vitesse ^^ +{{(15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 15}} ^^ et +35 vitalité ^^ +{{(35 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 35}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'tne_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '155' },
        { id: 'tne_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '5' },
        { id: 'tne_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-52' },
        { 
            id: 'tne_wet_d', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Dmg/Tour)' 
        },
        { 
            id: 'tne_wet_s', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'spd', 
            value: '15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        },
        { 
            id: 'tne_wet_v', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'vit', 
            value: '35 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Vit/Tour)'
        }
    ]
  },
  {
    id: 'tonfamazonite', type: EntityType.ITEM, name: 'Tonfamazonite',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'tamaz_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '180' },
        { id: 'tamaz_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '61' },
        { id: 'tamaz_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-60' }
    ]
  },
  {
    id: 'tonfaience', type: EntityType.ITEM, name: 'Tonfaïence',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'tfai_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '205' },
        { id: 'tfai_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '70' },
        { id: 'tfai_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-68' }
    ]
  },
  {
    id: 'thon_fha', type: EntityType.ITEM, name: "Thon'Fha",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    goldCost: 700,
    modifiers: [
        { id: 'thf_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '250' },
        { id: 'thf_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '85' },
        { id: 'thf_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-70' }
    ]
  },
  {
    id: 'tonfishui', type: EntityType.ITEM, name: 'Tonfishui',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être béni par une divinité djöllfuline.",
    modifiers: [
        { id: 'tfh_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '285' },
        { id: 'tfh_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '96' },
        { id: 'tfh_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-75' }
    ]
  },
  {
    id: 'tonfa_ammos', type: EntityType.ITEM, name: 'Tonfa Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'tam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '297' },
        { id: 'tam_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        { id: 'tam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-77' }
    ]
  },
  {
    id: 'kazama', type: EntityType.ITEM, name: 'Kazama',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'kaz_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '320' },
        { id: 'kaz_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '107' },
        { id: 'kaz_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-80' }
    ]
  },
  {
    id: 'tonfa_sacrifice', type: EntityType.ITEM, name: 'Tonfa du sacrifice',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'tsac_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '400' },
        { id: 'tsac_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '-180' },
        { id: 'tsac_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '120' }
    ]
  },
  {
    id: 'dryusdan_tonfa', type: EntityType.ITEM, name: "Dryusdan'Tonfa (imitation)",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'dt_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '440' },
        { id: 'dt_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '95' },
        { id: 'dt_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-150' },
        { 
            id: 'dt_shield', 
            type: ModifierType.FLAT, 
            targetStatKey: 'dmg_reduct_pct', 
            value: '5', 
            toggleId: 'toggle_aqueous_shield', 
            toggleName: 'Bouclier Aqueux (Tour Pair)',
            name: 'Réduction Dégâts Reçus' 
        }
    ],
    descriptionBlocks: [
        {
            title: "Bouclier aqueux",
            text: "Les dégâts directs subis par toute l'équipe sont réduits de 5% tous les tours pairs.",
            tag: "active"
        }
    ]
  },
  {
    id: 'nadsuhydr_tonfa', type: EntityType.ITEM, name: "Nadsuhydr'Tonfa",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'nt_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '586' },
        { id: 'nt_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '135' },
        { id: 'nt_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-128' },
        { 
            id: 'nt_shield', 
            type: ModifierType.FLAT, 
            targetStatKey: 'dmg_reduct_pct', 
            value: '15', 
            toggleId: 'toggle_aqueous_shield_epic', 
            toggleName: 'Bouclier Aqueux (Actif)',
            name: 'Réduction Dégâts Reçus' 
        }
    ],
    descriptionBlocks: [
        {
            title: "Bouclier aqueux",
            text: "Les dégâts directs subis par toute l'équipe sont réduits de 15%.",
            tag: "active"
        }
    ]
  },
  {
    id: 'les_caducees', type: EntityType.ITEM, name: 'Les Caducées',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1500,
    modifiers: [
        { id: 'cad_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '500' },
        { id: 'cad_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '166' },
        { id: 'cad_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-105' }
    ]
  },
  {
    id: 'wotatane', type: EntityType.ITEM, name: "Wotatane",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Tonfas', equipmentCost: 2,
    rarity: 'epic',
    isCraftable: false,
    descriptionBlocks: [
        {
            title: "Harangue du Jarl",
            text: "Invoque 3 Jarls (Vitalité : {{750 * (1 + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100)}} / Vitesse : {{500 * (1 + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100)}} / Dégâts : {{250 * (1 + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100)}}) qui combattent aux côtés du joueur. Disparaissent si le joueur est K.O.",
            tag: "unblockable"
        }
    ],
    modifiers: [
        { id: 'wot_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '879' },
        { id: 'wot_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '188' },
        { id: 'wot_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-192' }
    ],
    summons: [
        {
            id: 'summ_jarl',
            name: 'Jarl',
            countValue: '3',
            stats: {
                vit: '750 * (1 + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100)',
                spd: '500 * (1 + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100)',
                dmg: '250 * (1 + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100)'
            }
        }
    ]
  }
];