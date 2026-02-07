
import { Entity, EntityType, ModifierType } from '../../types';

export const AVENTURIERES: Entity[] = [
  // --- BARBARES ---
  {
    id: 'barbares', type: EntityType.CLASS, name: 'Barbares',
    description: "Force titanesque. Vous maniez les armes à 2 mains comme si elles n'en coûtaient qu'une seule. Seulement 2 slots d'arme.",
    modifiers: [
      { id: 'c_bar_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_bar_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      { id: 'c_bar_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 30', condition: 'level >= 5' },
      // NEW: Reduces 2-handed cost to 1
      { id: 'c_bar_2h_red', type: ModifierType.FLAT, targetStatKey: 'reduce_heavy_weapon_cost', value: '1', name: 'Force Titanesque' },
      // Restriction: 2 Slots
      { id: 'c_bar_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' }
    ]
  },
  {
    id: 'spec_colere_vive',
    type: EntityType.SPECIALIZATION,
    name: 'Colère vive',
    parentId: 'barbares',
    descriptionBlocks: [
        {
            text: "La frustration de l'échec alimente votre puissance physique.",
            tag: "passive",
            title: "Rage Ascendante"
        },
        {
            text: "À chaque fois que le Barbare fait un Échec Critique, sa Vitalité et sa Vitesse augmentent de 10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ par cumul.",
            tag: "conditionnel",
            title: "Colère vive"
        }
    ],
    modifiers: [
        {
            id: 'spec_cv_vit',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'vit',
            value: '10 * (colere_vive_stacks || 0) * (1 + (effect_booster || 0)/100)',
            name: 'Colère Vive (Vit)'
        },
        {
            id: 'spec_cv_spd',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'spd',
            value: '10 * (colere_vive_stacks || 0) * (1 + (effect_booster || 0)/100)',
            name: 'Colère Vive (Spd)'
        }
    ]
  },
  {
      id: 'spec_anticipation_sauvage', type: EntityType.SPECIALIZATION, name: 'Anticipation sauvage', parentId: 'barbares',
      description: "Instinct de survie. Si vous maniez une arme à deux mains, votre Vitalité est multipliée par 1.33 (+33% ^^ +{{33 * ((effect_booster || 0)/100)}}% ^^).",
      modifiers: [
          {
              id: 'spec_as_vit',
              type: ModifierType.ALT_PERCENT,
              targetStatKey: 'vit',
              value: '33 * (1 + (effect_booster || 0)/100)',
              condition: "maxOriginalItemCost('weapon') >= 2",
              name: "Bonus Anticipation"
          }
      ]
  },
  {
      id: 'spec_rage_decuplee',
      type: EntityType.SPECIALIZATION,
      name: 'Rage décuplée',
      parentId: 'barbares',
      descriptionBlocks: [
          {
              text: "La douleur alimente votre fureur. Chaque coup reçu renforce vos attaques pour le reste du combat.",
              tag: "passive",
              title: "Berserk Réactif"
          },
          {
              text: "À chaque attaque subie, les dégâts du Barbare augmentent de 10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ par cumul.",
              tag: "conditionnel",
              title: "Montée de Rage"
          }
      ],
      modifiers: [
          {
              id: 'spec_rage_dmg',
              type: ModifierType.ALT_PERCENT,
              targetStatKey: 'dmg',
              value: '10 * (rage_stacks || 0) * (1 + (effect_booster || 0)/100)',
              name: 'Rage Décuplée (Cumul)'
          }
      ]
  },

  // --- GUERRIERS ---
  {
    id: 'guerriers', type: EntityType.CLASS, name: 'Guerriers',
    modifiers: [
      { id: 'c_gue2_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_gue2_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      { id: 'c_gue2_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 45', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_colere_noire',
    type: EntityType.SPECIALIZATION,
    name: 'Colère noire',
    parentId: 'guerriers',
    descriptionBlocks: [
        {
            text: "La fureur du combat vous envahit lorsque vous êtes acculé.",
            tag: "passive",
            title: "Instinct de Survie"
        },
        {
            text: "Si le Guerrier voit sa vitalité descendre en dessous de 50% et qu'il n'est pas mort, sa vitesse et ses dégâts augmentent de 33% ^^ +{{33 * ((effect_booster || 0)/100)}}% ^^ pour toute la durée du combat (non-cumulable).",
            tag: "conditionnel",
            title: "Colère noire"
        }
    ],
    modifiers: [
        {
            id: 'spec_cn_spd',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'spd',
            value: '33 * (1 + (effect_booster || 0)/100)',
            toggleId: 'toggle_colere_noire',
            toggleName: 'Colère Noire (PV < 50%)'
        },
        {
            id: 'spec_cn_dmg',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: '33 * (1 + (effect_booster || 0)/100)',
            toggleId: 'toggle_colere_noire'
        }
    ]
  },
  {
    id: 'spec_chevalier',
    type: EntityType.SPECIALIZATION,
    name: 'Chevalier',
    parentId: 'guerriers',
    description: "Si le Guerrier équipe au moins une arme de type Épée ou Lance, ses dégâts sont augmentés de 25% ^^ +{{25 * ((effect_booster || 0)/100)}}% ^^.",
    modifiers: [
        {
            id: 'spec_chev_dmg',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: '25 * (1 + (effect_booster || 0)/100)',
            condition: "countItems('Épées') > 0 || countItems('Lances') > 0",
            name: "Bonus Chevalier"
        }
    ]
  },
  {
    id: 'spec_force_brute',
    type: EntityType.SPECIALIZATION,
    name: 'Force brute',
    parentId: 'guerriers',
    description: "Vos attaques sont lourdes et brutales. Augmente vos chances de critique de 25% ^^ +{{25 * ((effect_booster || 0)/100)}}% ^^ (s'applique aux deux types de critique).",
    modifiers: [
        { id: 's_fb_cp', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * (1 + (effect_booster || 0)/100)' },
        { id: 's_fb_cs', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '25 * (1 + (effect_booster || 0)/100)' }
    ]
  },

  // --- MAITRES D'ARMES ---
  {
    id: 'maîtresdarmes', type: EntityType.CLASS, name: 'Maîtres d\'armes',
    description: "Maîtrise absolue. Vous disposez de 5 emplacements d'armes.",
    modifiers: [
      { id: 'c_mai_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 15', condition: 'level >= 5' },
      { id: 'c_mai_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_mai_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      // Bonus: 5 Slots (Base 3 + 2)
      { id: 'c_mai_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '2', name: 'Maîtrise Armement (5 Slots)' },
    ]
  },
  {
    id: 'spec_maitrise_parfaite',
    type: EntityType.SPECIALIZATION,
    name: 'Maîtrise parfaite',
    parentId: 'maîtresdarmes',
    descriptionBlocks: [
        {
            text: "Votre première attaque est dévastatrice, profitant de tout votre arsenal.",
            tag: "active",
            title: "Ouverture Mortelle"
        },
        {
            text: "La première attaque réussie gagne 10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ de dégâts pour chaque arme dans l'inventaire.",
            tag: "conditionnel"
        },
        {
            text: "Bonus supplémentaire de 10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ si vous possédez une arme de Forge Personnelle.",
            tag: "conditionnel"
        }
    ],
    modifiers: [
        {
            id: 'spec_mp_dmg',
            type: ModifierType.ALT_PERCENT, // Final Multiplier
            targetStatKey: 'dmg',
            // Corrected: Applies booster to both the weapon count bonus AND the custom item bonus
            value: '((countItems(\'weapon\') * 10) + (countCustomItems() > 0 ? 10 : 0)) * (1 + (effect_booster || 0)/100)',
            toggleId: 'toggle_mp_first_hit',
            toggleName: 'Première Attaque (Maîtrise)'
        }
    ]
  },
  {
    id: 'spec_force_naturelle',
    type: EntityType.SPECIALIZATION,
    name: 'Force naturelle',
    parentId: 'maîtresdarmes',
    description: "Vous ignorez le poids de votre équipement. Vous disposez de 2 points pour annuler les malus de vitesse de vos objets (Torse: 1pt, Arme 1M: 1pt, Arme 2M: 2pt).",
    modifiers: []
  },
  {
    id: 'spec_parades_parfaites',
    type: EntityType.SPECIALIZATION,
    name: 'Parades parfaites',
    parentId: 'maîtresdarmes',
    descriptionBlocks: [
        {
            text: "L'arme la plus puissante renforce votre vitalité. (Effet boosté par l'équipement)",
            tag: "passive",
            title: "Défense Offensive"
        },
        {
            title: "Gain de vitalité (Basé sur Dégâts Arme)",
            isCollapsible: true,
            text: "- Niveau 10 à 19 : +50% ^^ +{{50 * ((effect_booster || 0)/100)}}% ^^ des dégâts.\n- Niveau 20 à 29 : +75% ^^ +{{75 * ((effect_booster || 0)/100)}}% ^^ des dégâts.\n- Niveau 30 et + : +100% ^^ +{{100 * ((effect_booster || 0)/100)}}% ^^ des dégâts.",
            tag: "info"
        }
    ],
    modifiers: [
        {
            id: 'spec_pp_vit',
            type: ModifierType.FLAT,
            targetStatKey: 'vit',
            value: "bestItemStat('weapon', 'dmg') * (level >= 30 ? 1 : level >= 20 ? 0.75 : level >= 10 ? 0.5 : 0) * (1 + (effect_booster || 0)/100)",
            name: "Bonus Parade (Max Arme)"
        }
    ]
  },

  // --- PALADINS ---
  {
    id: 'paladins', type: EntityType.CLASS, name: 'Paladins',
    modifiers: [
      { id: 'c_pal_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 45', condition: 'level >= 5' },
      { id: 'c_pal_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      { id: 'c_pal_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_croise', 
    type: EntityType.SPECIALIZATION, 
    name: 'Croisé', 
    parentId: 'paladins',
    description: "Expert du combat lourd. +25% ^^ +{{25 * ((effect_booster || 0)/100)}}% ^^ Vitalité (Final) si équipé d'un Bouclier ou d'un Fléau d'armes.",
    modifiers: [
        {
            id: 'spec_cro_vit',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'vit',
            value: '25 * (1 + (effect_booster || 0)/100)',
            condition: "countItems('Boucliers') > 0 || countItems(\"Fléaux d'armes\") > 0",
            name: "Foi du Croisé"
        }
    ]
  },
  {
    id: 'spec_prevision',
    type: EntityType.SPECIALIZATION,
    name: 'Prévision',
    parentId: 'paladins',
    descriptionBlocks: [
        {
            text: "Les premières attaques subies lors d'un tour quelconque sont réduites de 50% ^^ +{{50 * ((effect_booster || 0)/100)}}% ^^.",
            tag: "active",
            title: "Anticipation Divine"
        }
    ],
    modifiers: [
        {
            id: 'spec_prev_val',
            type: ModifierType.FLAT,
            targetStatKey: 'val_prevision',
            value: '50 * (1 + (effect_booster || 0)/100)',
            name: "Base Prévision (Réduction %)"
        }
    ]
  },
  {
    id: 'spec_vigueur',
    type: EntityType.SPECIALIZATION,
    name: 'Vigueur',
    parentId: 'paladins',
    descriptionBlocks: [
        {
            text: "Si la vitalité du Paladin est supérieure à 3000, il attaque en premier au début du combat (Priorité absolue sur la vitesse).",
            tag: "active",
            title: "Initiative Divine"
        },
        {
            text: "Son attaque est augmentée de 20% ^^ +{{20 * ((effect_booster || 0)/100)}}% ^^. En cas d'Échec Critique (EC), ce bonus est perdu.",
            tag: "conditionnel",
            title: "Frappe Vigoureuse"
        }
    ],
    modifiers: [
        {
            id: 'spec_vig_base',
            type: ModifierType.FLAT,
            targetStatKey: 'val_vigueur_dmg',
            value: '20 * (1 + (effect_booster || 0)/100)',
            name: "Base Vigueur (Dégâts %)"
        },
        {
            id: 'spec_vig_dmg',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: 'val_vigueur_dmg',
            condition: 'vit > 3000',
            toggleId: 'toggle_vigueur_active',
            toggleName: 'Vigueur Active (Début/Sans EC)'
        }
    ]
  },

  // --- PROTECTEURS ---
  {
    id: 'protecteurs', type: EntityType.CLASS, name: 'Protecteurs',
    descriptionBlocks: [
        {
            text: "Si vous prenez cette classe, les dégâts des attaques subies seront réduits de moitié. Seulement 2 slots d'arme.",
            tag: "unblockable"
        },
        {
            text: "Vous pouvez choisir au début de chaque tour une personne dont vous subirez la première attaque subie à sa place.",
            tag: ""
        }
    ],
    modifiers: [
      { id: 'c_pro_base', type: ModifierType.FLAT, targetStatKey: 'dmg_reduct_pct', value: '50' }, // Base class bonus
      { id: 'c_pro_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 15', condition: 'level >= 5' },
      { id: 'c_pro_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      { id: 'c_pro_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      // Restriction: 2 Slots
      { id: 'c_pro_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' },
    ]
  },
  {
    id: 'spec_corps_acier',
    type: EntityType.SPECIALIZATION,
    name: "Corps d'acier",
    parentId: 'protecteurs',
    descriptionBlocks: [
        {
            text: "Votre constitution exceptionnelle brise le rythme des assauts ennemis.",
            tag: "passive",
            title: "Forteresse Vivante"
        },
        {
            text: "Empêche les adversaires de lancer plusieurs dés contre le Protecteur durant les deux premiers tours.",
            tag: "unblockable",
            title: "Mur d'Acier"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_esprit_contradiction',
    type: EntityType.SPECIALIZATION,
    name: 'Esprit de contradiction',
    parentId: 'protecteurs',
    descriptionBlocks: [
        {
            text: "Votre nature rebelle vous renforce face à l'adversité.",
            tag: "passive",
            title: "Résilience Rebelle"
        },
        {
            text: "Si la vitalité du Protecteur est altérée en mal ou qu'il est paralysé, sa vitalité augmente de 30% ^^ +{{30 * ((effect_booster || 0)/100)}}% ^^ (Une seule fois par combat).",
            tag: "conditionnel",
            title: "Sursaut de Contradiction"
        }
    ],
    modifiers: [
        {
            id: 'spec_ec_base',
            type: ModifierType.FLAT,
            targetStatKey: 'val_esprit_contradiction',
            value: '30 * (1 + (effect_booster || 0)/100)',
            name: "Base Esprit Contradiction (%)"
        },
        {
            id: 'spec_ec_effect',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'vit',
            value: 'val_esprit_contradiction',
            toggleId: 'toggle_esprit_actif',
            toggleName: 'État Altéré / Paralysé'
        }
    ]
  },
  {
    id: 'spec_sans_peur',
    type: EntityType.SPECIALIZATION,
    name: 'Sans peur',
    parentId: 'protecteurs',
    descriptionBlocks: [
        {
            text: "Vous encaissez les coups pour vos alliés et en tirez de la force.",
            tag: "passive",
            title: "Protecteur Héroïque"
        },
        {
            text: "À chaque attaque subie, les dégâts du Protecteur augmentent de 10% ^^ +{{10 * ((effect_booster || 0)/100)}}% ^^ par cumul.",
            tag: "conditionnel",
            title: "Retour de flamme"
        },
        {
            text: "Chaque tour, vous pouvez choisir de protéger un allié et recevoir les dégâts à sa place.",
            tag: "active",
            title: "Sacrifice"
        }
    ],
    modifiers: [
        {
            id: 'spec_sp_dmg',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            // Uses the generic slider value 'sans_peur_stacks' set by the UI
            value: '10 * (sans_peur_stacks || 0) * (1 + (effect_booster || 0)/100)',
            name: 'Bonus Sans Peur (Cumul)'
        }
    ]
  }
];
