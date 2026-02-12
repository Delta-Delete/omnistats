
import { Entity, EntityType, ModifierType } from '../../types';

export const MAGIQUES: Entity[] = [
  // --- ANIMISTES ---
  {
    id: 'animistes', type: EntityType.CLASS, name: 'Animistes',
    description: "Invocateur. Meute: 1(Lvl 5-9), 2(Lvl 10-19), 3(Lvl 20-29), 4(Lvl 30-39), 5(Lvl 40+). Partage 50% ^^ +{{(50 * ((effect_booster || 0)/100))}}% ^^ stats/meute. Armes limitées (Sceptres, Épées, Tonfas, Dagues, Fouets, Boucliers) et 2 slots max. Compagnon interdit (Monture/Familier seulement).",
    descriptionBlocks: [
        {
            text: "Peut invoquer jusqu'à {{invocation_count}} invocations qui se répartissent 50% des stats du joueur.",
            tag: "unblockable"
        },
        {
            text: "Intouchable tant que des invocations sont vivantes."
            // tag removed
        }
    ],
    // NOUVELLE CONFIGURATION DATA-DRIVEN
    summonConfig: {
        mode: 'SHARED_POOL',
        sourceName: 'Animiste',
        unitName: "Meute d'Invocations",
        countValue: 'invocation_count', // Utilise la stat calculée par les modifiers ci-dessous
        shareValue: 'invocation_share', // Utilise la stat calculée (incluant les boosts)
        stats: ['vit', 'spd', 'dmg']
    },
    modifiers: [
      { id: 'c_ani_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_ani_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_ani_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      
      // Restriction: 2 Slots (Base 3 - 1 = 2)
      { id: 'c_ani_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' },

      // CALCULATION LOGIC (Still needed to compute the count based on level)
      { 
        id: 'c_ani_inv_cnt', type: ModifierType.FLAT, targetStatKey: 'invocation_count', 
        value: 'level >= 40 ? 5 : level >= 30 ? 4 : level >= 20 ? 3 : level >= 10 ? 2 : level >= 5 ? 1 : 0',
        name: 'Taille de la Meute'
      },
      // Note: invocation_share is boosted by Global Rule (others.ts), no need to add formula here.
      { id: 'c_ani_inv_shr', type: ModifierType.FLAT, targetStatKey: 'invocation_share', value: '50', name: 'Partage de Stats' },
      
      // NEW SYSTEM: Soul Harvester (Base)
      // APPLIED BOOST HERE: Base 10 is now affected by effect_booster
      { id: 'ani_soul_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'Math.floor(soul_count / 100) * 10 * (1 + (effect_booster || 0)/100)', name: 'Récolte d\'âmes (Base)' },
      { id: 'ani_soul_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'Math.floor(soul_count / 100) * 10 * (1 + (effect_booster || 0)/100)', name: 'Récolte d\'âmes (Base)' },
      { id: 'ani_soul_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'Math.floor(soul_count / 100) * 10 * (1 + (effect_booster || 0)/100)', name: 'Récolte d\'âmes (Base)' },
    ]
  },
  {
      id: 'spec_necromancer', type: EntityType.SPECIALIZATION, name: 'Nécromant', parentId: 'animistes',
      description: "Invoque un Serviteur Macabre supplémentaire. Ce serviteur possède 20% ^^ +{{(20 * ((effect_booster || 0)/100))}}% ^^ de vos stats (partage indépendant).",
      // NOUVELLE CONFIGURATION DATA-DRIVEN
      summonConfig: {
          mode: 'FIXED_PER_UNIT',
          sourceName: 'Nécromant',
          unitName: "Serviteur Macabre",
          countValue: 'necro_pet_count',
          shareValue: 'necro_pet_share',
          stats: ['vit', 'spd', 'dmg']
      },
      modifiers: [
          { id: 'spec_nec_c', type: ModifierType.FLAT, targetStatKey: 'necro_pet_count', value: '1', name: 'Serviteur Macabre (+1)' },
          // necro_pet_share is boosted by Global Rule
          { id: 'spec_nec_s', type: ModifierType.FLAT, targetStatKey: 'necro_pet_share', value: '20', name: 'Puissance Serviteur (20%)' }
      ]
  },
  {
      id: 'spec_lien_spirituel', type: EntityType.SPECIALIZATION, name: 'Lien Spirituel', parentId: 'animistes',
      // Description displays the TOTAL impact (40 base + boosted part of 40)
      description: "Intensifie le lien avec les âmes récoltées. Le bonus du Récolteur d'âmes est multiplié par quatre (+40 ^^ +{{(40 * ((effect_booster || 0)/100))}} ^^ stats / 100 âmes).",
      modifiers: [
          // Base is 10 (Boosted in Class). Spec adds 30 (Boosted here). Total 40 (Boosted).
          { id: 'spec_lien_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'Math.floor(soul_count / 100) * 30 * (1 + (effect_booster || 0)/100)', name: 'Bonus Lien Spirituel (+30)' },
          { id: 'spec_lien_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'Math.floor(soul_count / 100) * 30 * (1 + (effect_booster || 0)/100)', name: 'Bonus Lien Spirituel (+30)' },
          { id: 'spec_lien_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'Math.floor(soul_count / 100) * 30 * (1 + (effect_booster || 0)/100)', name: 'Bonus Lien Spirituel (+30)' }
      ]
  },
  {
      id: 'spec_vaudou', type: EntityType.SPECIALIZATION, name: 'Vaudou', parentId: 'animistes',
      description: "Pratiquez le Rituel de Sang. Sacrifiez 30% de Vitalité pour augmenter le partage de stats des invocations de 10% ^^ +{{(10 * ((effect_booster || 0)/100))}}% ^^.",
      modifiers: [
          { id: 'v_rit_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-30', toggleId: 'vaudou_ritual', toggleName: 'Rituel de Sang', name: 'Sacrifice Rituel (-30%)' },
          { id: 'v_rit_s1', type: ModifierType.FLAT, targetStatKey: 'invocation_share', value: '10 * (1 + (effect_booster || 0)/100)', toggleId: 'vaudou_ritual', name: 'Bonus Partage Meute (+10)' },
          { id: 'v_rit_s2', type: ModifierType.FLAT, targetStatKey: 'necro_pet_share', value: '10 * (1 + (effect_booster || 0)/100)', toggleId: 'vaudou_ritual', name: 'Bonus Partage Serviteur (+10)' }
      ]
  },

  // --- ENSORCELEURS ---
  {
    id: 'ensorceleurs', type: EntityType.CLASS, name: 'Ensorceleurs',
    description: "Armes limitées (Sceptres, Épées, Tonfas, Dagues, Fouets, Boucliers) et 2 slots max.",
    modifiers: [
      { id: 'c_ens_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_ens_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_ens_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      // Restriction: 2 Slots
      { id: 'c_ens_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' },
    ]
  },
  {
    id: 'spec_arcanes_sombres',
    type: EntityType.SPECIALIZATION,
    name: 'Arcanes sombres',
    parentId: 'ensorceleurs',
    description: "Pour chaque bonus annulé (allié/ennemi), vous gagnez 10% ^^ +{{(10 * ((effect_booster || 0)/100))}}% ^^ de Vitalité, Vitesse et Dégâts (Max 6 stacks).",
    modifiers: [
        { 
            id: 'spec_as_vit', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'vit', 
            value: '10 * Math.min(arcane_sacrifice_count || 0, 6) * (1 + (effect_booster || 0)/100)', 
            name: "Sacrifice Arcanique (Vit)"
        },
        { 
            id: 'spec_as_spd', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'spd', 
            value: '10 * Math.min(arcane_sacrifice_count || 0, 6) * (1 + (effect_booster || 0)/100)', 
            name: "Sacrifice Arcanique (Spd)"
        },
        { 
            id: 'spec_as_dmg', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '10 * Math.min(arcane_sacrifice_count || 0, 6) * (1 + (effect_booster || 0)/100)', 
            name: "Sacrifice Arcanique (Dmg)"
        }
    ]
  },
  {
    id: 'spec_dephasage',
    type: EntityType.SPECIALIZATION,
    name: 'Déphasage',
    parentId: 'ensorceleurs',
    descriptionBlocks: [
        {
            text: "Lorsque l'Ensorceleur fait un Échec Critique, il passe dans une autre dimension.",
            tag: "passive",
            title: "Réflexe Dimensionnel"
        },
        {
            text: "Il est immunisé des attaques directes jusqu'au prochain tour.",
            tag: "unblockable",
            title: "Intouchable"
        },
        {
            text: "Néanmoins, les malus, poisons et dégâts indirects agissent normalement sur lui.",
            tag: "info",
            title: "Vulnérabilité Indirecte"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_neant_distordu',
    type: EntityType.SPECIALIZATION,
    name: 'Néant distordu',
    parentId: 'ensorceleurs',
    descriptionBlocks: [
        {
            text: "Annule jusqu'à 2 bonus pour chaque monstre ou adversaire.",
            tag: "active",
            title: "Dissipation du Néant"
        },
        {
            text: "L'Ensorceleur peut annuler le malus météo s'il le souhaite.",
            tag: "active",
            title: "Contrôle Atmosphérique"
        }
    ],
    modifiers: []
  },

  // --- GUERISSEURS ---
  {
    id: 'guerisseurs', type: EntityType.CLASS, name: 'Guérisseurs',
    description: "Armes limitées (Sceptres, Épées, Tonfas, Dagues, Fouets, Boucliers) et 2 slots max.",
    modifiers: [
      { id: 'c_gue3_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_gue3_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_gue3_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      // Restriction: 2 Slots
      { id: 'c_gue3_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' },
    ]
  },
  {
    id: 'spec_maitrise_divine',
    type: EntityType.SPECIALIZATION,
    name: 'Maîtrise divine',
    parentId: 'guerisseurs',
    descriptionBlocks: [
        {
            text: "Si la vitesse du Guérisseur est 2x supérieure à la vitesse de l'ennemi (au lieu de 3x standard), il peut lancer un dé d'attaque ET un dé de soin.",
            tag: "conditionnel",
            title: "Double Action Divine"
        },
        {
            text: "Le dé de soin peut être appliqué sur les personnes de son choix.",
            tag: "info"
        }
    ],
    modifiers: []
  },
  {
    id: 'spec_salvateur',
    type: EntityType.SPECIALIZATION,
    name: 'Salvateur',
    parentId: 'guerisseurs',
    descriptionBlocks: [
        {
            text: "En cas d'Échec Critique, le Guérisseur voit sa prochaine attaque reçue réduite de 50% ^^ +{{(50 * ((effect_booster || 0)/100))}}% ^^.",
            tag: "passive",
            title: "Protection Miraculeuse"
        },
        {
            text: "Les effets des Remèdes utilisés lors d'un combat sont augmentés de 50% ^^ +{{(50 * ((effect_booster || 0)/100))}}% ^^.",
            tag: "passive",
            title: "Apothicaire Divin"
        }
    ],
    modifiers: [
        {
            id: 'spec_salv_val',
            type: ModifierType.FLAT,
            targetStatKey: 'val_salvateur',
            value: '50 * (1 + (effect_booster || 0)/100)',
            name: "Base Salvateur (Réduction %)"
        }
    ]
  },
  {
    id: 'spec_force_nature',
    type: EntityType.SPECIALIZATION,
    name: 'Force de la nature',
    parentId: 'guerisseurs',
    descriptionBlocks: [
        {
            text: "À chaque fois que le Guérisseur fait un Coup Critique, tous les membres de son équipe voient leur vitalité augmenter de 25% ^^ +{{(25 * ((effect_booster || 0)/100))}}% ^^.",
            tag: "active",
            title: "Vitalité Partagée"
        }
    ],
    modifiers: []
  },

  // --- MAGES ---
  {
    id: 'mages', type: EntityType.CLASS, name: 'Mages',
    description: "Armes limitées (Sceptres, Épées, Tonfas, Dagues, Fouets, Boucliers) et 2 slots max.",
    modifiers: [
      { id: 'c_mag_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_mag_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_mag_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      // Restriction: 2 Slots
      { id: 'c_mag_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' },
    ]
  },
  {
    id: 'spec_arcanes_protectrices',
    type: EntityType.SPECIALIZATION,
    name: 'Arcanes protectrices',
    parentId: 'mages',
    description: "Bonus de 33% ^^ +{{(33 * ((effect_booster || 0)/100))}}% ^^ sur la magie de soutien (guérison, vitesse, dégâts) bénéfique aux alliés.",
    modifiers: []
  },
  {
    id: 'spec_arcanes_destructrices',
    type: EntityType.SPECIALIZATION,
    name: 'Arcanes destructrices',
    parentId: 'mages',
    description: "Bonus de 25% ^^ +{{(25 * ((effect_booster || 0)/100))}}% ^^ sur la magie de destruction bénéfique aux alliés.",
    modifiers: []
  },
  {
    id: 'spec_magie_lames',
    type: EntityType.SPECIALIZATION,
    name: 'Magie des lames',
    parentId: 'mages',
    descriptionBlocks: [
        {
            text: "Si le Mage est équipé d'une épée, un effet aléatoire accompagnera l'élément tiré.",
            tag: "conditionnel",
            title: "Lame Élémentaire"
        },
        {
            title: "Liste des effets (Valeurs Boostées)",
            isCollapsible: true,
            text: "- Pyrokinésie : l'adversaire perd 10% ^^ +{{(10 * ((effect_booster || 0)/100))}}% ^^ de vitalité.\n- Elektrokinésie : l'adversaire perd 10% ^^ +{{(10 * ((effect_booster || 0)/100))}}% ^^ de vitesse.\n- Géokinésie : l'adversaire perd 5% ^^ +{{(5 * ((effect_booster || 0)/100))}}% ^^ de dégâts et le lanceur en gagne 5% ^^ +{{(5 * ((effect_booster || 0)/100))}}% ^^.\n- Hydromancie : le lanceur gagne 10% ^^ +{{(10 * ((effect_booster || 0)/100))}}% ^^ de vitalité.\n- Aérokinésie : le lanceur gagne 10% ^^ +{{(10 * ((effect_booster || 0)/100))}}% ^^ de vitesse.",
            tag: "info"
        }
    ],
    modifiers: []
  },

  // --- PUGILISTES ---
  {
    id: 'pugilistes', type: EntityType.CLASS, name: 'Pugilistes',
    description: "Arts Martiaux. Armes: Griffes, Cestes, Tonfas, Bâtons d'éther. 2 Slots.",
    modifiers: [
      { id: 'c_pug_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_pug_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_pug_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_pug_cap', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-1', name: 'Restriction Armement (2 Slots)' },

      // STANCES (Toggle Groups defined in ClassMechanics.tsx)
      // Mante: Vit x2, Spd -10%
      { id: 'pos_man_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '100', toggleId: 'pos_mante', toggleGroup: 'pugilist_stance', name: 'Posture Mante (Vit x2)' },
      { id: 'pos_man_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-10', toggleId: 'pos_mante', toggleGroup: 'pugilist_stance', name: 'Posture Mante (Spd -10%)' },

      // Serpent: Spd x2, Dmg -10%
      { id: 'pos_ser_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '100', toggleId: 'pos_serpent', toggleGroup: 'pugilist_stance', name: 'Posture Serpent (Spd x2)' },
      { id: 'pos_ser_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-10', toggleId: 'pos_serpent', toggleGroup: 'pugilist_stance', name: 'Posture Serpent (Dmg -10%)' },

      // Lievre: Dmg x2, Vit -10%
      { id: 'pos_lie_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '100', toggleId: 'pos_lievre', toggleGroup: 'pugilist_stance', name: 'Posture Lièvre (Dmg x2)' },
      { id: 'pos_lie_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-10', toggleId: 'pos_lievre', toggleGroup: 'pugilist_stance', name: 'Posture Lièvre (Vit -10%)' },

      // Singe: Tout -10%
      { id: 'pos_sin_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-10', toggleId: 'pos_singe', toggleGroup: 'pugilist_stance', name: 'Posture Singe' },
      { id: 'pos_sin_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-10', toggleId: 'pos_singe', toggleGroup: 'pugilist_stance', name: 'Posture Singe' },
      { id: 'pos_sin_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-10', toggleId: 'pos_singe', toggleGroup: 'pugilist_stance', name: 'Posture Singe' },
    ]
  },
  {
    id: 'spec_poing_ki', type: EntityType.SPECIALIZATION, name: 'Poing de Ki', parentId: 'pugilistes',
    description: "Vos Cestes sont une extension de votre énergie vitale. Leur puissance est augmentée de 10% (Pre-Multiplicatif).",
    modifiers: [
      {
        id: 'spec_ki_dmg',
        type: ModifierType.PERCENT_MULTI_PRE, 
        targetStatKey: 'dmg',
        value: '10',
        condition: "countItems('Cestes') > 0",
        name: 'Bonus Poing de Ki'
      }
    ]
  },
  {
    id: 'spec_lutteur', type: EntityType.SPECIALIZATION, name: 'Lutteur', parentId: 'pugilistes',
    description: "Si vous combattez à mains nues (aucune arme), l'effet de vos postures est augmenté de 20% ^^ +{{(20 * ((effect_booster || 0)/100))}}% ^^.",
    modifiers: [
      { id: 'lutteur_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '20 * (1 + (effect_booster || 0)/100)', toggleId: 'toggle_lutteur_unarmed', condition: "countItems('weapon') === 0" },
      { id: 'lutteur_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '20 * (1 + (effect_booster || 0)/100)', toggleId: 'toggle_lutteur_unarmed', condition: "countItems('weapon') === 0" },
      { id: 'lutteur_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '20 * (1 + (effect_booster || 0)/100)', toggleId: 'toggle_lutteur_unarmed', condition: "countItems('weapon') === 0" }
    ]
  },
  {
    id: 'spec_zenitude', type: EntityType.SPECIALIZATION, name: 'Zénitude', parentId: 'pugilistes',
    description: "Méditation de combat. Réduit les dégâts reçus de 45% mais vous empêche d'attaquer.",
    modifiers: [
      { id: 'zen_red', type: ModifierType.FLAT, targetStatKey: 'dmg_reduct_pct', value: '45', toggleId: 'toggle_zenitude' }
    ]
  },
];
