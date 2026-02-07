
import { Entity, EntityType, ModifierType } from '../../types';

export const SPECIALES: Entity[] = [
  // --- ARLEQUINS ---
  {
    id: 'arlequins', type: EntityType.CLASS, name: 'Arlequins',
    description: "Maître du hasard. Vos cartes activent des effets d'arme et boostent les ratios.\n♠ Pique (+Dmg, +Rat Dmg)\n♣ Trèfle (+Spd, +Rat Spd)\n♥ Cœur (+Vit, +Rat Vit)\n♦ Carreau (+Crit, +Tout Ratio)\n★ ROYAL: Tout !",
    modifiers: [
      { id: 'c_arl_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_arl_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_arl_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      
      // Card Effects
      // NOTE: Arlequin Ratios get 'Effect Booster' from Global Rules.
      // We add Special Mastery locally to the base FLAT value.
      { id: 'arl_s_rat', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_dmg', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
      { id: 'arl_c_rat', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_spd', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
      { id: 'arl_h_rat', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_vit', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
      
      { id: 'arl_d_rd', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_dmg', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
      { id: 'arl_d_rs', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_spd', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
      { id: 'arl_d_rv', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_vit', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
      { id: 'arl_d_rc', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_crit', value: '0.2 * (1 + (special_mastery || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
      
      { id: 'arl_r_rv', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_vit', value: '0.5 * (1 + (special_mastery || 0)/100)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
      { id: 'arl_r_rs', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_spd', value: '0.5 * (1 + (special_mastery || 0)/100)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
      { id: 'arl_r_rd', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_dmg', value: '0.5 * (1 + (special_mastery || 0)/100)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
      { id: 'arl_r_rc', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_crit', value: '0.5 * (1 + (special_mastery || 0)/100)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
    ]
  },
  {
      id: 'spec_croupier', type: EntityType.SPECIALIZATION, name: 'Croupier', parentId: 'arlequins',
      description: "Le maître du jeu. Augmente l'efficacité des effets de cartes de 50% ^^ +{{50 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^.",
      modifiers: [
          { id: 'sc_rat_d', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_dmg', value: '0.5 * (1 + (special_mastery || 0)/100)' },
          { id: 'sc_rat_c', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_crit', value: '0.5 * (1 + (special_mastery || 0)/100)' },
          { id: 'sc_rat_s', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_spd', value: '0.5 * (1 + (special_mastery || 0)/100)' },
          { id: 'sc_rat_v', type: ModifierType.FLAT, targetStatKey: 'ratio_deck_vit', value: '0.5 * (1 + (special_mastery || 0)/100)' },
      ]
  },
  {
      id: 'spec_cartomancie', type: EntityType.SPECIALIZATION, name: 'Cartomancie', parentId: 'arlequins',
      descriptionBlocks: [
          {
              text: "L'Arlequin choisit un symbole de son dé en début de combat (peut être différent de la lame tirée). A chaque tentative d'attaque (donc 2x dans le tour s'il a la rapidité), il lance son dé - arlequin. A chaque fois que le symbole sélectionné sort il active le bonus.",
              tag: "active",
              title: "Tirage Continu"
          },
          {
              title: "Liste des bonus selon le symbole",
              isCollapsible: true,
              tag: "info",
              text: "♥ : +20% ^^ +{{20 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ de vitalité\n♣ : +20% ^^ +{{20 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ de vitesse\n♠ : +25% ^^ +{{25 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ de dégâts\n♦ : +15% ^^ +{{15 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ toutes stats\n★ ROYAL : (Joker) Active le symbole choisi"
          }
      ],
      modifiers: []
  },
  {
      id: 'spec_bluff', type: EntityType.SPECIALIZATION, name: 'Bluff', parentId: 'arlequins',
      descriptionBlocks: [
          {
              text: "L'Arlequin ne peut pas mourir tant qu'il a au moins une invocation de deck active dans le combat.",
              tag: "passive",
              title: "Immortalité Conditionnelle"
          },
          {
              text: "Cette spécialisation n'est plus active à la fin du 3e tour.",
              tag: "info",
              title: "Durée Limitée"
          }
      ],
      modifiers: []
  },

  // --- CONJURATEURS ---
  {
    id: 'conjurateurs', type: EntityType.CLASS, name: 'Conjurateurs',
    description: "Invocateur. Augmente la puissance des Sceaux de 50% ^^ +{{50 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^.",
    modifiers: [
      { id: 'c_con_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 7', condition: 'level >= 5' },
      { id: 'c_con_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 7', condition: 'level >= 5' },
      { id: 'c_con_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 7', condition: 'level >= 5' },
      
      // 'seal_potency' gets EB and SM via Global Rules. Clean value here.
      { id: 'c_con_seal', type: ModifierType.FLAT, targetStatKey: 'seal_potency', value: '50', name: 'Maîtrise des Sceaux' }
    ]
  },
  {
      id: 'spec_aura_inquisitoriale', type: EntityType.SPECIALIZATION, name: 'Aura Inquisitoriale', parentId: 'conjurateurs',
      description: "Vos lances sont imprégnées de magie sacrée. Elles infligent +25% ^^ +{{25 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ de dégâts supplémentaires.",
      modifiers: [
        // 'mult_lance_dmg' gets SM via Global Rule. Added EB Global Rule in this patch. Clean value here.
        {
          id: 'spec_inq_lance_bonus',
          type: ModifierType.FLAT, 
          targetStatKey: 'mult_lance_dmg', 
          value: "0.25", 
          condition: 'pass_index >= 1', 
          name: "Bonus Lances (+25%)"
        }
      ]
  },
  {
      id: 'spec_chasseur_religieux',
      type: EntityType.SPECIALIZATION,
      name: 'Chasseur Religieux',
      parentId: 'conjurateurs',
      description: "Si équipé d'une Arbalète et d'une Chaîne (ou 2 de l'une ou l'autre), Critique +100 (Fixe).",
      modifiers: [
          {
              id: 'spec_cr_crit_p',
              type: ModifierType.FLAT,
              targetStatKey: 'crit_primary',
              value: '100',
              condition: "sumOriginalItemCost('Arbalètes') + sumOriginalItemCost('Chaînes') >= 2",
              name: 'Critique Sacré (+100 Fixe)'
          },
          {
              id: 'spec_cr_crit_s',
              type: ModifierType.FLAT,
              targetStatKey: 'crit_secondary',
              value: '100',
              condition: "sumOriginalItemCost('Arbalètes') + sumOriginalItemCost('Chaînes') >= 2",
              name: 'Critique Sacré Max (+100 Fixe)'
          }
      ]
  },
  {
    id: 'spec_delivrez_mal',
    type: EntityType.SPECIALIZATION,
    name: 'Délivrez-nous du Mal',
    parentId: 'conjurateurs',
    description: "Augmente vos caractéristiques primaires de 5% ^^ +{{5 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ (Multiplicatif Final).",
    modifiers: [
        // Apply (1 + EB + SM) to the modifier itself so the 5% becomes 5.5% etc.
        { id: 'm_deliv_vit', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '5 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)' },
        { id: 'm_deliv_spd', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '5 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)' },
        { id: 'm_deliv_dmg', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '5 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)' }
    ]
  },

  // --- CORROMPUS ---
  {
    id: 'corrompu', type: EntityType.CLASS, name: 'Corrompus',
    description: "Utilise sa propre force vitale pour attaquer. Absorption = % de vie converti en dégâts (1% par niveau).",
    modifiers: [
      { id: 'c_cor_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
      { id: 'c_cor_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      { 
        id: 'c_cor_abs_lvl', 
        type: ModifierType.FLAT, 
        targetStatKey: 'absorption', 
        value: 'level', 
        condition: 'level >= 5',
        name: 'Croissance Corruption (1%/lvl)' 
      },
      { 
          id: 'c_cor_dmg_convert', 
          type: ModifierType.OVERRIDE, 
          targetStatKey: 'dmg', 
          // Logic for Organ (Heart) boost inside the formula
          value: '(Math.floor(vit / (1 + ((context.toggles && context.toggles.organ_heart ? (20 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)) : 0) / 100)))) * (absorption / 100)', 
          name: 'Conversion Sanglante (Vit -> Dmg)' 
      }
    ]
  },
  {
    id: 'spec_malediction',
    type: EntityType.SPECIALIZATION,
    name: 'Malédiction',
    parentId: 'corrompu',
    description: "Augmente l'Absorption de 5% ^^ +{{5 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ de base. Des pactes de sang permettent de monter jusqu'à 25% ^^ +{{25 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ en sacrifiant votre vitesse.",
    modifiers: [
        // Absorption handled by Global Rule (EB & SM are PERCENT_ADD to Absorption).
        // So a FLAT '5' here will be boosted by the global +% rule. Correct.
        { id: 'm_curse_base', type: ModifierType.FLAT, targetStatKey: 'absorption', value: '5' },
        { id: 'curse_l1_abs', type: ModifierType.FLAT, targetStatKey: 'absorption', value: '5', toggleId: 'curse_lvl_1', toggleGroup: 'curse_pact' },
        { id: 'curse_l1_spd', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-50', toggleId: 'curse_lvl_1', toggleGroup: 'curse_pact' },
        { id: 'curse_l2_abs', type: ModifierType.FLAT, targetStatKey: 'absorption', value: '10', toggleId: 'curse_lvl_2', toggleGroup: 'curse_pact' },
        { id: 'curse_l2_spd', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-66.66', toggleId: 'curse_lvl_2', toggleGroup: 'curse_pact' },
        { id: 'curse_l3_abs', type: ModifierType.FLAT, targetStatKey: 'absorption', value: '20', toggleId: 'curse_lvl_3', toggleGroup: 'curse_pact' },
        { id: 'curse_l3_spd', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-75', toggleId: 'curse_lvl_3', toggleGroup: 'curse_pact' },
    ]
  },
  {
      id: 'spec_thanatopracteur', type: EntityType.SPECIALIZATION, name: 'Thanatopracteur', parentId: 'corrompu',
      descriptionBlocks: [
          {
              text: "Boucher des âmes. Peut consommer un organe en début de combat pour un bonus massif.",
              tag: "active"
          },
          {
              title: "Cœur",
              text: "+20% ^^ +{{20 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ Vitalité (Pas de gain Dégâts).",
              tag: "passive"
          },
          {
              title: "Poumon",
              text: "+20% ^^ +{{20 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ Vitesse.",
              tag: "passive"
          },
          {
              title: "Foie",
              text: "+10% ^^ +{{10 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ Absorption.",
              tag: "passive"
          }
      ],
      modifiers: [
          // Primary Stats: Apply modifiers locally so the "20%" itself scales.
          { 
              id: 'th_heart', 
              type: ModifierType.ALT_PERCENT, 
              targetStatKey: 'vit', 
              value: '20 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
              toggleId: 'organ_heart', 
              toggleGroup: 'thanato_organ',
              name: 'Bonus Coeur (Vit)' 
          },
          { 
              id: 'th_lung', 
              type: ModifierType.ALT_PERCENT, 
              targetStatKey: 'spd', 
              value: '20 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
              toggleId: 'organ_lung', 
              toggleGroup: 'thanato_organ',
              name: 'Bonus Poumon (Spd)' 
          },
          // Absorption: Handled by Global Rule. Keep FLAT.
          { 
              id: 'th_liver', 
              type: ModifierType.FLAT, 
              targetStatKey: 'absorption', 
              value: '10', 
              toggleId: 'organ_liver', 
              toggleGroup: 'thanato_organ',
              name: 'Bonus Foie (Abs)'
          }
      ]
  },
  {
      id: 'spec_transfusion_impie', type: EntityType.SPECIALIZATION, name: 'Transfusion impie', parentId: 'corrompu',
      descriptionBlocks: [
          {
              text: "Durant le combat, après une attaque réussie, le Corrompu peut choisir de distribuer à un de ses alliés la vie absorbée de cette attaque.",
              tag: "active",
              title: "Don de Sang"
          },
          {
              text: "Il peut également choisir de distribuer 50% de l'absorption de cette attaque et de prendre les autres 50%.",
              tag: "active",
              title: "Partage Vital"
          }
      ],
      modifiers: [
          {
              id: 'toggle_transfusion',
              type: ModifierType.FLAT,
              targetStatKey: 'dmg',
              value: '0',
              toggleId: 'transfusion_active',
              toggleName: 'Mode Transfusion Actif'
          }
      ]
  },

  // --- TECHNOPHILES ---
  {
    id: 'technophiles', type: EntityType.CLASS, name: 'Technophiles',
    description: "Armes limitées (Armes technologiques, Boucliers technologiques uniquement).",
    modifiers: [
      { id: 'c_tec_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_tec_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 5', condition: 'level >= 5' },
      { id: 'c_tec_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 20', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_maitre_tourelles',
    type: EntityType.SPECIALIZATION,
    name: 'Maître des Tourelles',
    parentId: 'technophiles',
    description: "Expertise en déploiement automatisé. Augmente de 25% ^^ +{{25 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ les stats (Dégâts, Vitesse, Vitalité) conférées par toutes les Tourelles.",
    modifiers: [
        // 'turret_mult' handled by Global Rule. Clean Value.
        { 
            id: 'spec_mt_boost', 
            type: ModifierType.FLAT, 
            targetStatKey: 'turret_mult', 
            value: "0.25",
            condition: 'pass_index >= 1',
            name: "Bonus Maîtrise (+25%)"
        }
    ]
  },
  {
    id: 'spec_defense_piquante', 
    type: EntityType.SPECIALIZATION, 
    name: 'Défense Piquante', 
    parentId: 'technophiles',
    description: "Spécialisation défensive. Renvoie 33% ^^ +{{33 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ des dégâts reçus. Si équipé d'une arme à deux mains, +500 Vitalité.",
    modifiers: [
        // Renvois: Local calculation required (no global rule for renvois).
        { 
            id: 'spec_dp_ref', 
            type: ModifierType.FLAT, 
            targetStatKey: 'renvois_degats', 
            value: '33 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)',
            name: "Renvois Natif"
        },
        { 
            id: 'spec_dp_vit', 
            type: ModifierType.ALT_FLAT, 
            targetStatKey: 'vit', 
            value: '500', 
            condition: "maxOriginalItemCost('weapon') >= 2",
            name: "Bonus Arme Lourde"
        }
    ]
  },
  {
      id: 'spec_barriere_anti_magie',
      type: EntityType.SPECIALIZATION,
      name: 'Barrière anti-magie',
      parentId: 'technophiles',
      descriptionBlocks: [
        {
          text: "Pour chaque arme technophile (hors tourelle) et chaque bouclier (technologique ou standard) équipé, le Technophile gagne 10% de dégâts.",
          tag: "passive",
          title: "Arsenal Défensif"
        },
        {
          text: "Si le Technophile est face à une Classe spéciale ou une Classe magique, ses stats augmentent de 15% ^^ +{{15 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ (Non-cumulable).",
          tag: "active",
          title: "Adaptation Arcanique"
        }
      ],
      modifiers: [
        {
          id: 'spec_bam_dmg',
          type: ModifierType.ALT_PERCENT, 
          targetStatKey: 'dmg',
          value: '((countItems(\'Armes technologiques\') - countItems(\'Tourelle\')) + countItems(\'Boucliers technologiques\') + countItems(\'Boucliers\')) * 10',
          condition: 'pass_index >= 1',
          name: 'Bonus Arsenal Techno (Final)'
        },
        // Primary Stats: Scale locally for correct "15% becomes 16.5%" behavior.
        {
            id: 'spec_bam_adap_v',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'vit',
            value: '15 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)',
            toggleId: 'toggle_adap_arcanique',
            toggleName: 'Face à Classe Spéciale/Magique ?'
        },
        {
            id: 'spec_bam_adap_s',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'spd',
            value: '15 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)',
            toggleId: 'toggle_adap_arcanique'
        },
        {
            id: 'spec_bam_adap_d',
            type: ModifierType.ALT_PERCENT,
            targetStatKey: 'dmg',
            value: '15 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)',
            toggleId: 'toggle_adap_arcanique'
        }
      ]
  },

  // --- VIRTUOSES ---
  {
    id: 'virtuoses', type: EntityType.CLASS, name: 'Virtuoses',
    description: "Armes limitées (Instruments uniquement) et 1 slot max (3 - 2).",
    modifiers: [
      { id: 'wc_vir', type: ModifierType.FLAT, targetStatKey: 'weapon_cap', value: '-2' }, // Base 3 - 2 = 1 Total
      { id: 'c_vir_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_vir_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
      { id: 'c_vir_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20 + (level - 4 - Math.floor(level / 10)) * 10', condition: 'level >= 5' },
    ]
  },
  {
    id: 'spec_maitre_air',
    type: EntityType.SPECIALIZATION,
    name: 'Maître de l\'air',
    parentId: 'virtuoses',
    description: "Si équipé d'un Instrument offrant 7 partitions ou plus, +50% ^^ +{{50 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ Vitalité, Vitesse et Dégâts.",
    modifiers: [
        // Primary Stats: Scale locally.
        { 
            id: 'spec_ma_vit', 
            type: ModifierType.PERCENT_ADD, 
            targetStatKey: 'vit', 
            value: '50 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
            condition: "bestItemStat('Instrument', 'partition_cap') >= 7",
            name: "Bonus Maître Air (Vit)"
        },
        { 
            id: 'spec_ma_spd', 
            type: ModifierType.PERCENT_ADD, 
            targetStatKey: 'spd', 
            value: '50 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
            condition: "bestItemStat('Instrument', 'partition_cap') >= 7",
            name: "Bonus Maître Air (Spd)"
        },
        { 
            id: 'spec_ma_dmg', 
            type: ModifierType.PERCENT_ADD, 
            targetStatKey: 'dmg', 
            value: '50 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
            condition: "bestItemStat('Instrument', 'partition_cap') >= 7",
            name: "Bonus Maître Air (Dmg)"
        }
    ]
  },
  {
    id: 'spec_cri_guerre',
    type: EntityType.SPECIALIZATION,
    name: 'Cri de guerre',
    parentId: 'virtuoses',
    description: "Nécessite un Instrument à Percussion et 4 Partitions actives. Augmente Vitalité et Dégâts de 60% ^^ +{{60 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ (Multiplicatif).",
    modifiers: [
        // Primary Stats: Scale locally.
        { 
            id: 'spec_cg_vit', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'vit', 
            value: '60 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
            condition: "countItems('Instrument (Percussion)') >= 1 && countItems('partition') >= 4",
            name: "Cri de Guerre (Vit)"
        },
        { 
            id: 'spec_cg_dmg', 
            type: ModifierType.ALT_PERCENT, 
            targetStatKey: 'dmg', 
            value: '60 * (1 + (effect_booster || 0)/100 + (special_mastery || 0)/100)', 
            condition: "countItems('Instrument (Percussion)') >= 1 && countItems('partition') >= 4",
            name: "Cri de Guerre (Dmg)"
        }
    ]
  },
  {
    id: 'spec_melomane',
    type: EntityType.SPECIALIZATION,
    name: 'Mélomane',
    parentId: 'virtuoses',
    description: "Augmente de 50% ^^ +{{50 * ((effect_booster || 0)/100 + (special_mastery || 0)/100)}}% ^^ la puissance des effets inscrits sur vos Partitions.",
    modifiers: [
        // 'partition_mult' handled by Global Rule. Clean Value.
        { 
            id: 'spec_melomane_boost', 
            type: ModifierType.FLAT, 
            targetStatKey: 'partition_mult', 
            value: '0.5', 
            name: "Oreille Absolue"
        }
    ]
  },
];
