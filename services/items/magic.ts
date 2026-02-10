
import { Entity, EntityType, ModifierType } from '../../types';

export const MAGIC_ITEMS: Entity[] = [
  // --- VÉHICULES ---
  {
    id: 'veh_balai',
    type: EntityType.ITEM,
    name: 'Balai volant',
    slotId: 'vehicle',
    categoryId: 'vehicle',
    subCategory: 'Aérien',
    description: "Un balai enchanté pour voyager dans les airs.",
    modifiers: [
        { id: 'bal_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        { id: 'bal_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
        { id: 'bal_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '200' }
    ],
    descriptionBlocks: [
        {
            title: 'Sabbat',
            text: "La première fois que l'adversaire est touché par un CR ou un CC des joueurs véhiculés, il devient Maudit. Ce statut empêche la cible de recevoir des buffs (soin, gains de vitesse ou de dégâts) jusqu'à la fin du combat.",
            tag: 'unblockable'
        }
    ]
  },

  // --- FAMILIERS ---
  {
    id: 'fam_hydro_cyno',
    type: EntityType.ITEM,
    name: "Hydro Cyno",
    slotId: 'custom_companion', // Uses the companion slot
    categoryId: 'familiar',
    subCategory: 'Esprit',
    rarity: 'exotic',
    companionAllowed: true,
    modifiers: [
        { id: 'hc_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '150' },
        { id: 'hc_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '150' }
    ],
    descriptionBlocks: [
        {
            title: "Régénération",
            text: "Une fois pendant le combat, si la vitalité du maître de ce familier descend en dessous de 25%, sa vie est totalement régénérée. Ne marche pas si le joueur meurt avant.",
            tag: "special"
        }
    ]
  },

  // --- OBJETS ARLEQUINS (DÉMO) ---
  {
    id: 'sceptre_joker',
    type: EntityType.ITEM,
    name: "Sceptre du Joker",
    categoryId: 'special',
    subCategory: 'Magique',
    rarity: 'epic',
    description: "Invoque un Pantin qui copie votre tirage de cartes.\nSes stats de base (1000/200/100) sont multipliées par vos ratios de cartes (Cœur=Vit, Pique=Dmg, etc.).",
    modifiers: [],
    summons: [
        {
            id: 'summ_joker_pantin',
            name: 'Pantin Joker',
            countValue: '1',
            stats: {
                // Utilisation de (X || 1) pour garantir une valeur par défaut si le ratio n'est pas encore calculé
                vit: '1000 * (ratio_deck_vit || 1)',
                spd: '200 * (ratio_deck_spd || 1)',
                dmg: '100 * (ratio_deck_dmg || 1)'
            }
        }
    ]
  },

  // --- ENCHANTEMENTS (CRITIQUE) ---
  {
    id: 'e_crit_1', type: EntityType.ITEM, name: 'Ench. Critique I (+5%)',
    slotId: 'ench_crit', categoryId: 'enchantment', subCategory: 'Critique',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_c1', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '5 * enchantment_mult' }]
  },
  {
    id: 'e_crit_2', type: EntityType.ITEM, name: 'Ench. Critique II (+10%)',
    slotId: 'ench_crit', categoryId: 'enchantment', subCategory: 'Critique',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_c2', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '10 * enchantment_mult' }]
  },
  {
    id: 'e_crit_3', type: EntityType.ITEM, name: 'Ench. Critique III (+15%)',
    slotId: 'ench_crit', categoryId: 'enchantment', subCategory: 'Critique',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_c3', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '15 * enchantment_mult' }]
  },
  {
    id: 'e_crit_4', type: EntityType.ITEM, name: 'Ench. Critique IV (+20%)',
    slotId: 'ench_crit', categoryId: 'enchantment', subCategory: 'Critique',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_c4', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '20 * enchantment_mult' }]
  },
  {
    id: 'e_crit_5', type: EntityType.ITEM, name: 'Ench. Critique V (+25%)',
    slotId: 'ench_crit', categoryId: 'enchantment', subCategory: 'Critique',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_c5', type: ModifierType.FLAT, targetStatKey: 'crit_bonus', value: '25 * enchantment_mult' }]
  },

  // --- ENCHANTEMENTS (RÉSISTANCE) ---
  {
    id: 'e_res_1', type: EntityType.ITEM, name: 'Ench. Résistance I (+5%)',
    slotId: 'ench_res', categoryId: 'enchantment', subCategory: 'Résistance',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_r1', type: ModifierType.FLAT, targetStatKey: 'res', value: '5 * enchantment_mult' }]
  },
  {
    id: 'e_res_2', type: EntityType.ITEM, name: 'Ench. Résistance II (+10%)',
    slotId: 'ench_res', categoryId: 'enchantment', subCategory: 'Résistance',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_r2', type: ModifierType.FLAT, targetStatKey: 'res', value: '10 * enchantment_mult' }]
  },
  {
    id: 'e_res_3', type: EntityType.ITEM, name: 'Ench. Résistance III (+15%)',
    slotId: 'ench_res', categoryId: 'enchantment', subCategory: 'Résistance',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_r3', type: ModifierType.FLAT, targetStatKey: 'res', value: '15 * enchantment_mult' }]
  },
  {
    id: 'e_res_4', type: EntityType.ITEM, name: 'Ench. Résistance IV (+20%)',
    slotId: 'ench_res', categoryId: 'enchantment', subCategory: 'Résistance',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_r4', type: ModifierType.FLAT, targetStatKey: 'res', value: '20 * enchantment_mult' }]
  },
  {
    id: 'e_res_5', type: EntityType.ITEM, name: 'Ench. Résistance V (+25%)',
    slotId: 'ench_res', categoryId: 'enchantment', subCategory: 'Résistance',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_r5', type: ModifierType.FLAT, targetStatKey: 'res', value: '25 * enchantment_mult' }]
  },

  // --- ENCHANTEMENTS (VITALITÉ) ---
  {
    id: 'e_vit_1', type: EntityType.ITEM, name: 'Ench. Vitalité I (+5%)',
    slotId: 'ench_vit', categoryId: 'enchantment', subCategory: 'Vitalité',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_v1', type: ModifierType.PERCENT_ADD, targetStatKey: 'vit', value: '5 * enchantment_mult' }]
  },
  {
    id: 'e_vit_2', type: EntityType.ITEM, name: 'Ench. Vitalité II (+10%)',
    slotId: 'ench_vit', categoryId: 'enchantment', subCategory: 'Vitalité',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_v2', type: ModifierType.PERCENT_ADD, targetStatKey: 'vit', value: '10 * enchantment_mult' }]
  },
  {
    id: 'e_vit_3', type: EntityType.ITEM, name: 'Ench. Vitalité III (+15%)',
    slotId: 'ench_vit', categoryId: 'enchantment', subCategory: 'Vitalité',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_v3', type: ModifierType.PERCENT_ADD, targetStatKey: 'vit', value: '15 * enchantment_mult' }]
  },
  {
    id: 'e_vit_4', type: EntityType.ITEM, name: 'Ench. Vitalité IV (+20%)',
    slotId: 'ench_vit', categoryId: 'enchantment', subCategory: 'Vitalité',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_v4', type: ModifierType.PERCENT_ADD, targetStatKey: 'vit', value: '20 * enchantment_mult' }]
  },
  {
    id: 'e_vit_5', type: EntityType.ITEM, name: 'Ench. Vitalité V (+25%)',
    slotId: 'ench_vit', categoryId: 'enchantment', subCategory: 'Vitalité',
    isCraftable: true, companionAllowed: false,
    modifiers: [{ id: 'me_v5', type: ModifierType.PERCENT_ADD, targetStatKey: 'vit', value: '25 * enchantment_mult' }]
  },

  // --- SEALS (SCEAUX) ---
  {
    id: 'seal_vitality_starter',
    type: EntityType.ITEM,
    name: 'Sceau de vitalité',
    categoryId: 'seal',
    subCategory: 'Magique',
    // description: REMOVED as requested
    hideInRecap: true,
    modifiers: [
        { id: 'sv_l10', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100 * (1 + seal_potency / 100)', condition: 'level >= 10' },
        { id: 'sv_l20', type: ModifierType.FLAT, targetStatKey: 'vit', value: '200 * (1 + seal_potency / 100)', condition: 'level >= 20' },
        { id: 'sv_l30', type: ModifierType.FLAT, targetStatKey: 'vit', value: '300 * (1 + seal_potency / 100)', condition: 'level >= 30' },
        { id: 'sv_l40', type: ModifierType.FLAT, targetStatKey: 'vit', value: '400 * (1 + seal_potency / 100)', condition: 'level >= 40' },
        { id: 'sv_l50', type: ModifierType.FLAT, targetStatKey: 'vit', value: '500 * (1 + seal_potency / 100)', condition: 'level >= 50' },
        { id: 'sv_l60', type: ModifierType.FLAT, targetStatKey: 'vit', value: '600 * (1 + seal_potency / 100)', condition: 'level >= 60' }
    ]
  },

  // --- PARTITIONS (SHEET MUSIC) ---
  {
    id: 'part_hymne', type: EntityType.ITEM, name: 'Partition: Hymne de Guerre',
    categoryId: 'partition', subCategory: 'Vent',
    description: "Chant galvanisant. +{{20 * partition_mult}} Dégâts.",
    modifiers: [
        { id: 'part_h_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 * partition_mult' }
    ]
  },
  {
    id: 'part_sonate', type: EntityType.ITEM, name: 'Partition: Sonate Apaisante',
    categoryId: 'partition', subCategory: 'Corde',
    description: "Musique douce. +{{100 * partition_mult}} Vitalité.",
    modifiers: [
        { id: 'part_s_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100 * partition_mult' }
    ]
  },
  {
    id: 'part_requiem', type: EntityType.ITEM, name: 'Partition: Requiem',
    categoryId: 'partition', subCategory: 'Multi-type',
    description: "Un chant funèbre. Inflige {{50 * partition_mult}} dégâts pendant 3 tours.",
    modifiers: [
        { id: 'part_req_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '50 * partition_mult' }
    ]
  },

  // --- RESPIRATEURS ---
  {
    id: 'resp_menpo',
    type: EntityType.ITEM,
    name: 'Menpō',
    slotId: 'rebreather',
    categoryId: 'rebreather',
    rarity: 'exotic',
    description: "**Aqua-respirateur parfait** : Une fois activé (sous l'eau), confère ses stats et transforme les malus aquatiques en bonus.",
    modifiers: [
        // STATS DE BASE : Conditionnées par le toggle générique respirateur (Bouton Inventaire)
        { 
            id: 'menpo_base_v', 
            type: ModifierType.FLAT, 
            targetStatKey: 'vit', 
            value: '500', 
            toggleId: 'toggle_respirator_active', 
            toggleName: 'Respirateur Actif' 
        },
        { 
            id: 'menpo_base_s', 
            type: ModifierType.FLAT, 
            targetStatKey: 'spd', 
            value: '200', 
            toggleId: 'toggle_respirator_active' 
        },
        
        // EFFET SPECIAL : Conditionné par un toggle distinct (Bouton Situationnel)
        {
            id: 'menpo_effect_v',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'vit',
            value: '2 * (malus_aqua || 0)',
            toggleId: 'toggle_menpo_effect',
            toggleName: 'Menpō : Inversion Courants'
        },
        {
            id: 'menpo_effect_s',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'spd',
            value: '2 * (malus_aqua || 0)',
            toggleId: 'toggle_menpo_effect'
        },
        {
            id: 'menpo_effect_d',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: '2 * (malus_aqua || 0)',
            toggleId: 'toggle_menpo_effect'
        }
    ]
  },

  // --- BACKPACKS ---
  {
    id: 'bag_voyageur', type: EntityType.ITEM, name: "Sac de Voyageur",
    slotId: 'backpack', categoryId: 'backpack', subCategory: 'Aventurier',
    description: "Un sac en cuir robuste permettant de transporter le nécessaire de survie.",
    modifiers: [
        { id: 'bag_voy_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '10' }
    ]
  },

  // --- ARTEFACTS ---
  {
    id: 'art_sire_ummen',
    type: EntityType.ITEM,
    name: "Bague de Sire Ümmen",
    slotId: 'artifact',
    categoryId: 'artifact',
    description: "Les ennemis ayant au moins 2 capacités spéciales (activées ou pas), perdent {{15 * (1 + (effect_booster || 0)/100)}}% de toutes leurs statistiques par tour.",
    modifiers: [], // Pas de bonus stat pour le joueur
    descriptionBlocks: [
        {
            text: "Les ennemis ayant au moins 2 capacités spéciales (activées ou pas), perdent **{{15 * (1 + (effect_booster || 0)/100)}}%** de toutes leurs statistiques par tour.",
            tag: "passive"
        }
    ]
  },
  {
    id: 'art_pendentif_hivernal',
    type: EntityType.ITEM,
    name: "Pendentif hivernal",
    slotId: 'artifact',
    categoryId: 'artifact',
    description: "Un flocon éternel. +10% de stats si le RP se déroule dans l'Est.",
    modifiers: [
        { id: 'ph_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '10', toggleId: 'toggle_rp_east', toggleName: 'RP : Est', toggleGroup: 'rp_location' },
        { id: 'ph_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '10', toggleId: 'toggle_rp_east', toggleGroup: 'rp_location' },
        { id: 'ph_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '10', toggleId: 'toggle_rp_east', toggleGroup: 'rp_location' }
    ]
  }
];
