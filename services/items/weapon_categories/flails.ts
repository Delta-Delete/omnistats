
import { Entity, EntityType, ModifierType } from '../../../types';

export const FLAILS: Entity[] = [
  // --- BASIQUE ---
  {
    id: 'fleau_armes', type: EntityType.ITEM, name: 'Fléau d\'Armes',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    modifiers: [{ id: 'mw_fl_1', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '14' }]
  },

  // --- LISTE UTILISATEUR ---
  {
    id: 'fleau_paladin', type: EntityType.ITEM, name: 'Fléau du paladin',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 30,
    modifiers: [
        { id: 'fp_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '8' },
        { id: 'fp_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '4' },
        { id: 'fp_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-20' }
    ]
  },
  {
    id: 'goupillon', type: EntityType.ITEM, name: 'Goupillon',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 65,
    modifiers: [
        { id: 'gou_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '36' },
        { id: 'gou_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '15' },
        { id: 'gou_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-30' }
    ]
  },
  {
    id: 'fleau_satueur', type: EntityType.ITEM, name: 'Fléau Satueur',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 100,
    modifiers: [
        { id: 'fs_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '65' },
        { id: 'fs_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '22' },
        { id: 'fs_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-40' }
    ]
  },
  {
    id: 'fle_haur_tensia', type: EntityType.ITEM, name: "Flé'Haur'Tensia",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 300,
    isCraftable: true,
    modifiers: [
        { id: 'fht_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '120' },
        { id: 'fht_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '41' },
        { id: 'fht_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-50' }
    ]
  },
  {
    id: 'nunchaku', type: EntityType.ITEM, name: 'Nunchaku',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    rarity: 'exotic',
    description: "La valeur des Coups critiques est augmentée de 25%.",
    modifiers: [
        { id: 'nun_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '150' },
        { id: 'nun_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '51' },
        { id: 'nun_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-55' },
        { id: 'nun_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'fleau_nero', type: EntityType.ITEM, name: 'Fléau Nεrό',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    rarity: 'exotic',
    description: "Arme immergée : Octroie +35 dégâts ^^ +{{(35 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 35}} ^^, +20 vitesse ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^ et +15 vitalité ^^ +{{(15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 15}} ^^ **par tour**. Fonctionne seulement dans la région \"Mers & Océans\".",
    modifiers: [
        { id: 'fne_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '155' },
        { id: 'fne_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '5' },
        { id: 'fne_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-52' },
        { 
            id: 'fne_wet_d', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'dmg', 
            value: '35 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Dmg/Tour)' 
        },
        { 
            id: 'fne_wet_s', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'spd', 
            value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Spd/Tour)'
        },
        { 
            id: 'fne_wet_v', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'vit', 
            value: '15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true,
            name: 'Bonus Océan (Vit/Tour)'
        }
    ]
  },
  {
    id: 'fleosse_doray', type: EntityType.ITEM, name: 'Fléosse Doray',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 500,
    isCraftable: true,
    modifiers: [
        { id: 'fd_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '180' },
        { id: 'fd_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '61' },
        { id: 'fd_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-60' }
    ]
  },
  {
    id: 'morgenstern', type: EntityType.ITEM, name: 'Morgenstern',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 500,
    isCraftable: true,
    modifiers: [
        { id: 'morg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '205' },
        { id: 'morg_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '70' },
        { id: 'morg_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-68' }
    ]
  },
  {
    id: 'buffleo', type: EntityType.ITEM, name: 'Buffléo',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 700,
    isCraftable: true,
    modifiers: [
        { id: 'buf_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '250' },
        { id: 'buf_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '85' },
        { id: 'buf_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-70' }
    ]
  },
  {
    id: 'flehishui', type: EntityType.ITEM, name: 'Fléhishui',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être béni par une divinité djöllfuline.",
    modifiers: [
        { id: 'fhi_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '285' },
        { id: 'fhi_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '96' },
        { id: 'fhi_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-75' }
    ]
  },
  {
    id: 'fleau_ammos', type: EntityType.ITEM, name: 'Fléau Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    rarity: 'exotic',
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'fa_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '297' },
        { id: 'fa_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        { id: 'fa_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-77' }
    ]
  },
  {
    id: 'fleau_angmar', type: EntityType.ITEM, name: "Fléau d'Angmar",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 1000,
    isCraftable: true,
    modifiers: [
        { id: 'angmar_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '320' },
        { id: 'angmar_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '107' },
        { id: 'angmar_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-80' }
    ]
  },
  {
    id: 'fleau_frande', type: EntityType.ITEM, name: "Fléau Frande",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    goldCost: 1000,
    isCraftable: true,
    modifiers: [
        { id: 'ffr_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '400' },
        { id: 'ffr_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '-180' },
        { id: 'ffr_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '120' }
    ]
  },
  {
    id: 'fleau_orme', type: EntityType.ITEM, name: "Fléau d'orme (imitation)",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    rarity: 'exotic',
    isTungsten: true,
    descriptionBlocks: [
        {
            title: "Pointes de feu",
            text: "Chaque attaque réussie augmente les dégâts du porteur de 35 ^^ +{{(35 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 35}} ^^. De plus, les cibles touchées par le porteur du fléau sont marquées et reçoivent 20 ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^ de dégâts supplémentaires de sa part.",
            tag: "active"
        }
    ],
    modifiers: [
        { id: 'fo_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '440' },
        { id: 'fo_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '95' },
        { id: 'fo_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-150' },
        {
            id: 'fo_boost',
            type: ModifierType.ALT_FLAT,
            targetStatKey: 'dmg',
            value: '35 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)',
            toggleId: 'toggle_fleau_orme_hit',
            toggleName: 'Attaque Réussie (+35 Dmg)'
        }
    ]
  },
  {
    id: 'fleau_armagyar', type: EntityType.ITEM, name: "Fléau d'armagyar",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 1,
    rarity: 'epic',
    isTungsten: true,
    descriptionBlocks: [
        {
            title: "Pointes de feu",
            text: "- Chaque Coup Réussi augmente la vitalité du porteur de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^.\n- Chaque attaque subie augmente les dégâts du porteur de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^.\n- En cas de coup critique, les stats du porteur sont augmentées de 15% ^^ +{{(15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 15}}% ^^.",
            tag: "active"
        }
    ],
    modifiers: [
        { id: 'farm_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '586' },
        { id: 'farm_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '135' },
        { id: 'farm_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-128' },
        
        { id: 'farm_hit_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_armagyar_hit', toggleName: 'Coup Réussi (+10% Vit)' },
        { id: 'farm_hit_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_armagyar_taken', toggleName: 'Coup Subi (+10% Dmg)' },
        
        { id: 'farm_crit_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_armagyar_crit', toggleName: 'Coup Critique (+15% All)' },
        { id: 'farm_crit_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_armagyar_crit' },
        { id: 'farm_crit_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '15 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_armagyar_crit' }
    ]
  },
  {
    id: 'ecrabouilleur_croise', type: EntityType.ITEM, name: "L'Ecrabouilleur du Croisé",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 2,
    goldCost: 1500,
    isCraftable: true,
    modifiers: [
        { id: 'ec_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '500' },
        { id: 'ec_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '166' },
        { id: 'ec_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-105' }
    ]
  },
  {
    id: 'fleau_tritheiste', type: EntityType.ITEM, name: "Fléau trithéiste djöllfulin",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Fléaux d\'armes', equipmentCost: 2,
    rarity: 'epic',
    description: "Bénédiction : Peut demander une bénédiction en début de combat à une des trois divinités.",
    descriptionBlocks: [
        {
            title: "Choix Divin",
            text: "- Kar'Maghûl : +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ Vitalité.\n- Urgaal'Mar : +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ Vitesse.\n- Lagmarù : +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ Dégâts.",
            tag: "active"
        }
    ],
    modifiers: [
        { id: 'ftd_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '879' },
        { id: 'ftd_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '188' },
        { id: 'ftd_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-192' },
        
        { id: 'ftd_ben_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_trith_vit', toggleName: "Bénédiction Kar'Maghûl (Vit)", toggleGroup: 'tritheiste_blessing' },
        { id: 'ftd_ben_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_trith_spd', toggleName: "Bénédiction Urgaal'Mar (Spd)", toggleGroup: 'tritheiste_blessing' },
        { id: 'ftd_ben_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)', toggleId: 'toggle_trith_dmg', toggleName: "Bénédiction Lagmarù (Dmg)", toggleGroup: 'tritheiste_blessing' }
    ]
  }
];
