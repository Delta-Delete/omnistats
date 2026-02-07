
import { Entity, EntityType, ModifierType } from '../../types';

export const FURTIVES: Entity[] = [
  // --- ARCHERS ---
  {
    id: 'archers', type: EntityType.CLASS, name: 'Archers',
    description: "Spécialiste de la distance. Une seule arme autorisée (Arc, Arbalète ou Fronde), mais maniée avec aisance même si lourde.",
    modifiers: [
      { id: 'c_arc_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_arc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 30', condition: 'level >= 5' },
      { id: 'c_arc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      
      { id: 'c_arc_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-2', name: 'Restriction Armement (1 Slot)' },
      { id: 'c_arc_hv', type: ModifierType.FLAT, targetStatKey: 'reduce_heavy_weapon_cost', value: '1', name: 'Maniement Arme Lourde' },
      { 
        id: 'c_arc_wep_bonus', 
        type: ModifierType.FLAT, 
        targetStatKey: 'dmg', 
        value: "sumItemStats('Arcs', 'dmg') + sumItemStats('Arbalètes', 'dmg') + sumItemStats('Frondes', 'dmg')", 
        name: "Maîtrise Distance (+100% Arme)" 
      },
      // NEW: Marker for UI Display (+100% base value in calculations)
      { 
        id: 'c_arc_ui_mult', 
        type: ModifierType.FLAT, 
        targetStatKey: 'ui_class_mastery_mult', 
        value: '1', 
        name: 'Indicateur Maîtrise (+100%)' 
      }
    ]
  },
  {
    id: 'spec_premier_carreau',
    type: EntityType.SPECIALIZATION,
    name: 'Premier carreau',
    parentId: 'archers',
    descriptionBlocks: [
        {
            text: "Si l'Archer est équipé d'une Arbalète, il peut utiliser un carreau spécial par tour sur sa première attaque réussie.",
            tag: "active",
            title: "Maîtrise de l'Arbalète"
        },
        {
            title: "Carreaux spéciaux",
            isCollapsible: true,
            text: "- Carreau orc : Réduit l'attaque de la cible de 25% ^^ +{{ 25 * ((effect_booster || 0)/100) }}% ^^.\n- Carreau perforant : La cible perd 20% ^^ +{{ 20 * ((effect_booster || 0)/100) }}% ^^ de sa vitalité à la fin du tour.\n- Carreau glacé : La cible perd 10% ^^ +{{ 10 * ((effect_booster || 0)/100) }}% ^^ de sa vitesse par tour.",
            tag: "special"
        }
    ],
    modifiers: [
        { id: 'sq_orc', type: ModifierType.FLAT, targetStatKey: 'bolt_orc_val', value: '25', condition: "countItems('Arbalètes') > 0" },
        { id: 'sq_perf', type: ModifierType.FLAT, targetStatKey: 'bolt_perf_val', value: '20', condition: "countItems('Arbalètes') > 0" },
        { id: 'sq_ice', type: ModifierType.FLAT, targetStatKey: 'bolt_ice_val', value: '10', condition: "countItems('Arbalètes') > 0" }
    ]
  },
  {
    id: 'spec_oeil_faucon',
    type: EntityType.SPECIALIZATION,
    name: 'Œil de faucon',
    parentId: 'archers',
    description: "Augmente les dégâts de vos armes à distance de 25% ^^ +{{25 * ((effect_booster || 0)/100)}}% ^^.",
    modifiers: [
        {
            id: 'spec_of_dmg',
            type: ModifierType.FLAT,
            targetStatKey: 'dmg',
            // Calcul réel des dégâts ajoutés au joueur : 25% = 0.25
            value: "(sumItemStats('Arcs', 'dmg') + sumItemStats('Arbalètes', 'dmg') + sumItemStats('Frondes', 'dmg')) * 0.25 * (1 + (effect_booster || 0)/100)",
            condition: 'pass_index >= 1', 
            name: 'Bonus Œil de faucon (25% Total)'
        },
        // NEW: Ajout du marqueur visuel pour l'UI (SlotSelector/ItemPicker)
        {
            id: 'spec_of_mult_ui',
            type: ModifierType.FLAT,
            targetStatKey: 'weapon_effect_mult',
            value: '0.25 * (1 + (effect_booster || 0)/100)',
            name: 'Marqueur UI (Non-Additif)'
        }
    ]
  },
  {
    id: 'spec_carquois_abondant',
    type: EntityType.SPECIALIZATION,
    name: 'Carquois abondant',
    parentId: 'archers',
    descriptionBlocks: [
        {
            text: "Si l'Archer est équipé d'un Arc, il peut utiliser une flèche spéciale par tour sur sa première attaque réussie.",
            tag: "active",
            title: "Maîtrise de l'Arc"
        },
        {
            title: "Flèches spéciales",
            isCollapsible: true,
            text: "- Flèche elfique : Dégâts +25% ^^ +{{ 25 * ((effect_booster || 0)/100) }}% ^^ sur l'attaque.\n- Flèche furtive : +20% ^^ +{{ 20 * ((effect_booster || 0)/100) }}% ^^ Vitesse (Fin de tour).\n- Flèche enflammée : Cible perd 10% ^^ +{{ 10 * ((effect_booster || 0)/100) }}% ^^ Vit/tour.",
            tag: "special"
        }
    ],
    modifiers: [
        { id: 'sq_elf', type: ModifierType.FLAT, targetStatKey: 'arrow_elf_val', value: '25', condition: "countItems('Arcs') > 0" },
        { id: 'sq_stl', type: ModifierType.FLAT, targetStatKey: 'arrow_stl_val', value: '20', condition: "countItems('Arcs') > 0" },
        { id: 'sq_fire', type: ModifierType.FLAT, targetStatKey: 'arrow_fire_val', value: '10', condition: "countItems('Arcs') > 0" }
    ]
  },

  // --- ASSASSINS ---
  {
    id: 'assassins', type: EntityType.CLASS, name: 'Assassins',
    modifiers: [
      { id: 'c_ass_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_ass_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 25', condition: 'level >= 5' },
      { id: 'c_ass_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 25', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_analyse_adversaire',
    type: EntityType.SPECIALIZATION,
    name: 'Analyse de l\'adversaire',
    parentId: 'assassins',
    descriptionBlocks: [
        {
            text: "L'assassin étudie sa cible. Si la vitalité de la cible est supérieure à la vitalité de base de l'assassin, il frappe les points vitaux avec une précision létale.",
            tag: "passive"
        },
        {
            text: "Activez ce bonus si votre cible possède plus de Vitalité que vous pour gagner +60% ^^ +{{60 * ((effect_booster || 0)/100)}}% ^^ de Dégâts Finaux.",
            tag: "conditionnel",
            title: "Dégâts Finaux"
        }
    ],
    modifiers: [
        {
            id: 'spec_aa_dmg',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: '60 * (1 + (effect_booster || 0)/100)',
            toggleId: 'cond_enemy_vit_sup',
            toggleName: 'Cible : Vit > Vit Assassin ?'
        }
    ]
  },
  {
    id: 'spec_attaque_furtive',
    type: EntityType.SPECIALIZATION,
    name: 'Attaque furtive',
    parentId: 'assassins',
    descriptionBlocks: [
        {
            text: "Au premier tour, si la vitesse de l'équipe de l'Assassin est supérieure à celle de l'ennemi, sa première attaque compte double (si l'Assassin lance deux dés au premier tour, seul le premier dé est pris en compte).",
            tag: "conditionnel",
            title: "Initiative Mortelle"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_cible_marquee',
    type: EntityType.SPECIALIZATION,
    name: 'Cible marquée',
    parentId: 'assassins',
    descriptionBlocks: [
        {
            text: "À chaque attaque réussie, l'Assassin place un marqueur de 15% ^^ +{{15 * ((effect_booster || 0)/100)}}% ^^ sur la cible (cumulable 4x). Ces marqueurs augmentent les dégâts reçus par la cible.",
            tag: "active",
            title: "Marquage d'Équipe"
        },
        {
            text: "Les effets des Poisons utilisés lors d'un combat sont augmentés de 50% ^^ +{{50 * ((effect_booster || 0)/100 + (poison_boost || 0)/100)}}% ^^.",
            tag: "passive",
            title: "Toxicologie Avancée"
        }
    ],
    modifiers: []
  },

  // --- GUETTEURS ---
  {
    id: 'guetteurs', type: EntityType.CLASS, name: 'Guetteurs',
    modifiers: [
      { id: 'c_gue_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_gue_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 45', condition: 'level >= 5' },
      { id: 'c_gue_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_celerite', type: EntityType.SPECIALIZATION, name: 'Célérité', parentId: 'guetteurs',
    description: "Si équipé d'une Griffe ou d'une Fronde, la vitesse est augmentée de 25% ^^ +{{25 * ((effect_booster || 0)/100)}}% ^^ (Final).",
    modifiers: [
        {
            id: 'm_cel_spd',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'spd',
            value: '25 * (1 + (effect_booster || 0)/100)',
            condition: "countItems('Griffes') > 0 || countItems('Frondes') > 0",
            name: "Bonus Célérité"
        }
    ]
  },
  {
    id: 'spec_prevention',
    type: EntityType.SPECIALIZATION,
    name: 'Prévention',
    parentId: 'guetteurs',
    descriptionBlocks: [
        {
            text: "Lorsque le Guetteur fait un Échec Critique sur son jet d'attaque, il anticipe la riposte.",
            tag: "passive",
            title: "Réflexe de Survie"
        },
        {
            text: "La prochaine attaque subie est réduite de 50% ^^ +{{50 * ((effect_booster || 0)/100)}}% ^^.\n(Cumulable : Si 2 Échecs Critiques, les 2 prochaines attaques sont réduites).",
            tag: "conditionnel",
            title: "Atténuation des Dégâts"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_embuscade',
    type: EntityType.SPECIALIZATION,
    name: 'Embuscade',
    parentId: 'guetteurs',
    descriptionBlocks: [
        {
            text: "Au premier tour, le Guetteur lance un dé supplémentaire sur la même cible, indépendamment de la vitesse de l'adversaire.",
            tag: "passive",
            title: "Surprise Totale"
        },
        {
            text: "Activez ce bonus lors du premier tour pour augmenter les dégâts de 20% ^^ +{{20 * ((effect_booster || 0)/100)}}% ^^ sur toutes les cibles.",
            tag: "conditionnel",
            title: "Assaut Initial"
        }
    ],
    modifiers: [
        {
            id: 'm_embuscade_dmg',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: '20 * (1 + (effect_booster || 0)/100)',
            toggleId: 'toggle_embuscade',
            toggleName: 'Premier Tour (Embuscade) ?'
        }
    ]
  },

  // --- RODEURS ---
  {
    id: 'rodeurs', type: EntityType.CLASS, name: 'Rôdeurs',
    modifiers: [
      { id: 'c_rod_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_rod_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_rod_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_leader',
    type: EntityType.SPECIALIZATION,
    name: 'Leader',
    parentId: 'rodeurs',
    descriptionBlocks: [
        {
            text: "L'équipe du Rôdeur obtient automatiquement l'initiative lors du premier tour, quelle que soit leur vitesse.",
            tag: "active",
            title: "Commandement Initial"
        },
        {
            text: "Tout le long du combat, si pendant un tour le Rôdeur n'a pas subi d'attaque, il attaquera avant tout le monde le tour suivant.",
            tag: "passive",
            title: "Opportunisme Tactique"
        },
        {
            text: "(Exception : Un Paladin avec la capacité Vigueur attaque toujours avant l'équipe du Rôdeur).",
            tag: "info"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_connaissance_terrain',
    type: EntityType.SPECIALIZATION,
    name: 'Connaissance du terrain',
    parentId: 'rodeurs',
    description: "Le Rôdeur exploite l'environnement à son avantage. Activez le bonus pour gagner +20% ^^ +{{20 * ((effect_booster || 0)/100)}}% ^^ toutes stats si vous êtes en terrain connu.",
    modifiers: [
        { 
            id: 'm_terr_vit', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'vit', 
            value: '20 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_terrain_know', 
            toggleName: 'Connaissance du terrain ?' 
        },
        { 
            id: 'm_terr_spd', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'spd', 
            value: '20 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_terrain_know' 
        },
        { 
            id: 'm_terr_dmg', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '20 * (1 + (effect_booster || 0)/100)', 
            toggleId: 'toggle_terrain_know' 
        }
    ]
  },
  {
    id: 'spec_adaptation',
    type: EntityType.SPECIALIZATION,
    name: 'Adaptation',
    parentId: 'rodeurs',
    descriptionBlocks: [
        {
            text: "Les malus de combat (saignement, poison, paralysie, dégâts reçus, contrecoup, renvoi, etc.), même magiques, n'affectent le Rôdeur que pendant un seul tour.",
            tag: "passive",
            title: "Résilience Évolutive"
        },
        {
            text: "Une fois l'effet dissipé, le Rôdeur devient invulnérable à ce type de malus spécifique pour le reste du combat. (Un nouveau type de malus l'affectera toujours une première fois).",
            tag: "passive",
            title: "Immunité Acquise"
        },
        {
            text: "L'Adaptation se réinitialise entre chaque combat.",
            tag: "info"
        }
    ],
    modifiers: []
  },

  // --- VOLEURS ---
  {
    id: 'voleurs', type: EntityType.CLASS, name: 'Voleurs',
    modifiers: [
      { id: 'c_vol_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_vol_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_vol_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 15', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_furtivite',
    type: EntityType.SPECIALIZATION,
    name: 'Furtivité',
    parentId: 'voleurs',
    descriptionBlocks: [
        {
            text: "Le voleur est invisible au premier tour d'un combat et ne peut donc pas être touché.",
            tag: "active",
            title: "Invisibilité Initiale"
        },
        {
            text: "Cette capacité peut être annulée par un Ensorceleur/Conjurateur ou un Coup Critique.",
            tag: "info",
            title: "Contre-mesures"
        },
        {
            title: "Actions",
            isCollapsible: true,
            text: "- Taper normalement un adversaire.\n- Faire sauter un tour à un adversaire sans lui infliger de dégâts (effet réussi seulement avec un CR ou CC)\n- Fuir un combat quelconque sans prendre de malus.",
            tag: "special"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_pickpocket',
    type: EntityType.SPECIALIZATION,
    name: 'Pickpocket',
    parentId: 'voleurs',
    descriptionBlocks: [
        {
            text: "À chaque Coup Critique, le voleur vole et absorbe 20% ^^ +{{20 * ((effect_booster || 0)/100)}}% ^^ de la vitalité du plus puissant adversaire encore vivant.",
            tag: "passive",
            title: "Dextérité Malhonnête"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_roublardise',
    type: EntityType.SPECIALIZATION,
    name: 'Roublardise',
    parentId: 'voleurs',
    descriptionBlocks: [
        {
            text: "En début de combat, le Voleur choisit un type de poison qui reste actif tout le combat.",
            tag: "active",
            title: "Maître Empoisonneur"
        },
        {
            title: "Les poisons (Ratios Final)",
            isCollapsible: true,
            text: "- Poison mortel : À chaque Coup Réussi, l'adversaire touché perd l'équivalent de 10% ^^ +{{ 10 * ((effect_booster || 0)/100 + (poison_boost || 0)/100) }}% ^^ de son Or (max 1000) en Vitalité.\n- Poison paralysant : Perte de 5% ^^ +{{ 5 * ((effect_booster || 0)/100 + (poison_boost || 0)/100) }}% ^^ de son Or (max 500) en Vitesse.\n- Poison douloureux : Perte de 5% ^^ +{{ 5 * ((effect_booster || 0)/100 + (poison_boost || 0)/100) }}% ^^ de son Or (max 500) en Dégâts.",
            tag: "special"
        }
    ],
    modifiers: [
        {
            id: 'm_poi_mortel',
            type: ModifierType.FLAT,
            targetStatKey: 'dmg',
            value: '0',
            toggleId: 'poi_mortel',
            toggleName: 'Poison Mortel',
            toggleGroup: 'Les poisons'
        },
        {
            id: 'm_poi_para',
            type: ModifierType.FLAT,
            targetStatKey: 'dmg',
            value: '0',
            toggleId: 'poi_para',
            toggleName: 'Poison Paralysant',
            toggleGroup: 'Les poisons'
        },
        {
            id: 'm_poi_doul',
            type: ModifierType.FLAT,
            targetStatKey: 'dmg',
            value: '0',
            toggleId: 'poi_doul',
            toggleName: 'Poison Douloureux',
            toggleGroup: 'Les poisons'
        }
    ]
  }
];
