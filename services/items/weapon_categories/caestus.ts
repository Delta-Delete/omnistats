
import { Entity, EntityType, ModifierType } from '../../../types';

export const CAESTUS: Entity[] = [
  {
    id: 'ceste_classique', type: EntityType.ITEM, name: 'Ceste classique',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 30,
    modifiers: [
        { id: 'cc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '6' },
        { id: 'cc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-7' }
    ]
  },
  {
    id: 'ceste_pugiliste', type: EntityType.ITEM, name: 'Ceste de pugiliste',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 65,
    modifiers: [
        { id: 'cp_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '22' },
        { id: 'cp_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-14' }
    ]
  },
  {
    id: 'cest_oplasma', type: EntityType.ITEM, name: 'Cest\'oplasma',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: false,
    goldCost: 100,
    modifiers: [
        { id: 'co_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '42' },
        { id: 'co_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-21' }
    ]
  },
  {
    id: 'cestrum', type: EntityType.ITEM, name: 'Cestrum',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 300,
    modifiers: [
        { id: 'cm_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '84' },
        { id: 'cm_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-28' }
    ]
  },
  {
    id: 'yugake', type: EntityType.ITEM, name: 'Yugake',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Valeur des Coups Critiques +25%.",
    modifiers: [
        { id: 'yug_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '103' },
        { id: 'yug_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-32' },
        { id: 'yug_crit', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25' }
    ]
  },
  {
    id: 'ceste_nero', 
    type: EntityType.ITEM, 
    name: 'Ceste Néro',
    slotId: 'weapon_any', 
    categoryId: 'weapon', 
    subCategory: 'Cestes', 
    equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme immergée : Octroie +30 dégâts ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}} ^^ et +20 vitesse ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}} ^^ **par tour** si région Mers & Océans.",
    modifiers: [
        { id: 'w_nero_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '105' },
        { id: 'w_nero_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-30' },
        { 
            id: 'w_nero_wet_d', 
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
            id: 'w_nero_wet_s', 
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
    id: 'le_sestercet', type: EntityType.ITEM, name: 'Le Sestercet',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'ses_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '121' },
        { id: 'ses_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-35' }
    ]
  },
  {
    id: 'cestival', type: EntityType.ITEM, name: 'Cestival',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 500,
    modifiers: [
        { id: 'ces_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '141' },
        { id: 'ces_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-41' }
    ]
  },
  {
    id: 'droitelet', type: EntityType.ITEM, name: 'Droitelet',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 700,
    modifiers: [
        { id: 'dro_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '169' },
        { id: 'dro_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-42' }
    ]
  },
  {
    id: 'cestushi', type: EntityType.ITEM, name: 'Cestushi',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: true,
    description: "Peut être bénie par une divinité djöllfuline.",
    modifiers: [
        { id: 'cstu_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '181' },
        { id: 'cstu_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-44' }
    ]
  },
  {
    id: 'ceste_ammos', type: EntityType.ITEM, name: 'Ceste Ámmoς',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    rarity: 'exotic',
    isCraftable: false,
    description: "Arme ensablée : Réduit les dégâts de la cible de 10% ^^ +{{(10 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 10}}% ^^ (-30% ^^ +{{(30 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 30}}% ^^ maximum). Non réalisable dans la région des \"Mers & Océans\".",
    modifiers: [
        { id: 'c_ammos_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '200' },
        { id: 'c_ammos_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-46' }
    ]
  },
  {
    id: 'wane_paunsh_mane', type: EntityType.ITEM, name: 'Wane Paunsh Mane',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    isCraftable: true,
    goldCost: 1000,
    modifiers: [
        { id: 'wpm_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '216' },
        { id: 'wpm_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-48' }
    ]
  },
  {
    id: 'grant_orimo', type: EntityType.ITEM, name: "Grant'Orimo",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 1,
    rarity: 'epic',
    isCraftable: false,
    isTungsten: true,
    modifiers: [
        { id: 'go_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '396' },
        { id: 'go_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-77' }
    ],
    descriptionBlocks: [
        {
            title: "Un pour tous",
            text: "À chaque attaque réussie le joueur obtient un marqueur de 20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ (25% ^^ +{{(25 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 25}}% ^^ si CC), cumulable jusqu’à 75% ^^ +{{(75 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 75}}% ^^.",
            tag: "active"
        },
        {
            text: "Le joueur peut activer ses marqueurs à n’importe quel tour ; la prochaine attaque est augmentée du pourcentage des marqueurs stockés.",
            tag: "active"
        }
    ]
  },
  {
    id: 'poings_duralassiens', type: EntityType.ITEM, name: 'Poings Duralassiens',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 2,
    rarity: 'exotic',
    isCraftable: false,
    description: "Dégâts +50% ^^ +{{(50 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 50}}% ^^ en début de combat sur le continent (hors Wystéria et \"Mers & Océans\").",
    modifiers: [
        { id: 'pd_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '282' },
        { id: 'pd_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-56' },
        { 
            id: 'pd_bonus', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '50 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)',
            toggleId: 'toggle_continent_bonus',
            toggleName: 'Sur le Continent (Début)'
        }
    ]
  },
  {
    id: 'poignes_cristal', type: EntityType.ITEM, name: 'Poignes de cristal',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1500,
    modifiers: [
        { id: 'pc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '338' },
        { id: 'pc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-63' }
    ]
  },
  {
    id: 'marrons_glaces', type: EntityType.ITEM, name: 'Marrons glacés',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 2,
    isCraftable: true,
    goldCost: 1500,
    description: "**Maître** : +20% ^^ +{{(20 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 20}}% ^^ Dégâts si Armure Intermédiaire OU Compagnon.\n+25% ^^ +{{(25 * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)) - 25}}% ^^ si les DEUX.",
    modifiers: [
        { id: 'mg_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '300' },
        { id: 'mg_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-73' },
        { id: 'mg_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        {
            id: 'mg_maitre',
            type: ModifierType.PERCENT_ADD, // S'ajoute aux autres bonus %
            targetStatKey: 'dmg',
            // Condition : Check Armure Intermediaire AND (Monture OR Familier OR Compagnon)
            value: `((countItems('Intermédiaire') > 0 && (countItems('mount') > 0 || countItems('familiar') > 0 || countItems('companion') > 0)) ? 25 : (countItems('Intermédiaire') > 0 || (countItems('mount') > 0 || countItems('familiar') > 0 || countItems('companion') > 0)) ? 20 : 0) * (1 + (effect_booster || 0)/100) * (weapon_effect_mult || 1)`,
            name: "Bonus Maître (Armure/Comp)"
        }
    ]
  },
  {
    id: 'frappe_jotnar', type: EntityType.ITEM, name: "Frappe des Jötnar",
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Cestes', equipmentCost: 2,
    rarity: 'epic',
    isCraftable: true,
    modifiers: [
        { id: 'fj_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '620' },
        { id: 'fj_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-116' }
    ],
    descriptionBlocks: [
        {
            title: "Amnésie",
            text: "Peut annuler une capacité blocable au choix de la cible à chaque attaque réussie.",
            tag: "active"
        }
    ]
  }
];
