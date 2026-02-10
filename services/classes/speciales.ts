
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
      description: "Le maître du jeu. Augmente l'efficacité des effets de cartes de 50% (x1.5).",
      modifiers: [
          // NEW ARCHITECTURE: Just defines the multiplier
          { 
              id: 'spec_croupier_mult', 
              type: ModifierType.FLAT, 
              targetStatKey: 'croupier_mult', // Nouvelle stat cachée utilisée par les items
              value: '1.5', 
              name: "Multiplicateur Croupier"
          }
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
              text: "♥ : +20% ^^ +{{(20 * ((effect_booster || 0)/100 + (special_mastery || 0)/100))}}% ^^ de vitalité\n♣ : +20% ^^ +{{(20 * ((effect_booster || 0)/100 + (special_mastery || 0)/100))}}% ^^ de vitesse\n♠ : +25% ^^ +{{(25 * ((effect_booster || 0)/100 + (special_mastery || 0)/100))}}% ^^ de dégâts\n♦ : +15% ^^ +{{(15 * ((effect_booster || 0)/100 + (special_mastery || 0)/100))}}% ^^ toutes stats\n★ ROYAL : (Joker) Active le symbole choisi"
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
  }
];
