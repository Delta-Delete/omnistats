
import { Entity, EntityType, ModifierType } from '../../../types';

export const DECKS: Entity[] = [
  {
    id: 'mastodeck', type: EntityType.ITEM, name: 'Mastodeck',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    rarity: 'epic',
    description: "Deck légendaire aux effets changeants.", 
    descriptionBlocks: [
        {
            text: `♣ : L’Arlequin perd 50% de sa vitesse et de ses dégâts, mais sa vitalité est doublée ^^ (+{{100 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^. Il peut décider de rediriger une attaque ennemie/tour sur lui.
♠ : L’Arlequin perd 100% de sa vitesse. Sa vitalité est triplée ^^ (+{{200 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^, et les attaques ennemies sont automatiquement redirigées sur lui durant les deux premiers tours. Les assaillants reçoivent par ailleurs un contrecoup de 100 ^^ ({{100 * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}) ^^ de dégâts.
♥ : L’Arlequin perd 50% de sa vitalité, mais sa vitesse et ses dégâts sont augmentées de 50% ^^ (+{{50 * (ratio_deck_spd + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}% / +{{50 * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^.
♦ : L’Arlequin perd 50% de ses dégâts, mais sa vitalité et sa vitesse sont augmentées de 50% ^^ (+{{50 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}% / +{{50 * (ratio_deck_spd + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^.
ROYAL : Invoque le Mastodonte.
Stats : 4 x vitalité de base* (hors boost) de l’Arlequin.
Dégâts : 0
Vitesse : 0
Bonus : Tant que le Mastodonte est en vie, les alliés ne peuvent subir de dégâts.`
        }
    ],
    modifiers: [
        // --- BASE STATS ---
        { id: 'masto_base_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '500' },

        // --- ♣ TRÈFLE (Club) ---
        // Vitesse -50% (Malus fixe)
        { id: 'masto_c_spd_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-50', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        // Dégâts -50% (Malus fixe)
        { id: 'masto_c_dmg_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-50', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        // Vitalité +100% -> ADDITIVE : Ratio + Mult - 1 + Boost/100
        { id: 'masto_c_vit_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '100 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_club', toggleGroup: 'arlequin_card' },

        // --- ♠ PIQUE (Spade) ---
        // Vitesse -100% (Malus fixe)
        { id: 'masto_s_spd_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-100', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        // Vitalité +200% -> ADDITIVE
        { id: 'masto_s_vit_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '200 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        
        // --- ♥ COEUR (Heart) ---
        // Vitalité -50% (Malus fixe)
        { id: 'masto_h_vit_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-50', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        // Vitesse +50% -> ADDITIVE
        { id: 'masto_h_spd_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '50 * (ratio_deck_spd + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        // Dégâts +50% -> ADDITIVE
        { id: 'masto_h_dmg_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '50 * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },

        // --- ♦ CARREAU (Diamond) ---
        // Dégâts -50% (Malus fixe)
        { id: 'masto_d_dmg_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-50', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        // Vitalité +50% -> ADDITIVE
        { id: 'masto_d_vit_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '50 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        // Vitesse +50% -> ADDITIVE
        { id: 'masto_d_spd_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '50 * (ratio_deck_spd + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
    ],
    summons: [
        {
            id: 'summ_mastodonte',
            name: 'Mastodonte',
            countValue: 'toggles.card_royal ? 1 : 0', // FIX: removed 'context.' to match flattened scope
            stats: {
                // FORMULE SPECIFIQUE (local_base_vit allows inheriting scaled base stats)
                vit: '(((local_base_vit || 0) * 4) + (summon_flat_bonus || 0)) * ((ratio_deck_vit || 1) + (effect_booster || 0)/100)',
                spd: '0',
                dmg: '0'
            }
        }
    ]
  },
  {
    id: 'tarolex_dore',
    type: EntityType.ITEM,
    name: 'Tarolex Doré',
    slotId: 'weapon_any',
    categoryId: 'weapon',
    subCategory: 'Decks',
    equipmentCost: 1,
    goldCost: 700,
    rarity: 'normal',
    description: `♣ : Les attaques des alliés (hors invocation) et de l'arlequin empoisonnent l'ennemi de **{{5 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** vitalité / tour. (cumulable 10 fois et avec d'autres poisons)
♥ : Les dégâts de l'équipe baissent par **{{10 * (config_tarolex_dore_val || 0) * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** / tour (Basé sur {{config_tarolex_dore_val || 0}} alliés).
♠ : Les dégâts de l'équipe augmentent par **{{10 * (config_tarolex_dore_val || 0) * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** / tour (Basé sur {{config_tarolex_dore_val || 0}} alliés).
♦ : les ennemis (hors invocation) perdent **{{5 * level * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** dégâts.
ROYAL : L'arlequin gagne le bonus de ce deck de son choix, et lorsqu'il réussit un Coup Critique, il regagne la moitié de ses dégâts en vitalité.`,
    userConfig: {
        type: 'slider',
        min: 0,
        max: 20,
        step: 1,
        label: "Nb Alliés (H/S)"
    },
    modifiers: [
        // Base Stats
        { id: 'taro_base_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '150' },
        { id: 'taro_base_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '50' },

        // Heart Effect (Malus DMG per turn based on Allies)
        {
            id: 'taro_h_dmg_malus',
            type: ModifierType.ALT_FLAT,
            targetStatKey: 'dmg',
            value: '-10 * (config_tarolex_dore_val || 0) * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)',
            isPerTurn: true,
            condition: "toggles.card_heart || (toggles.card_royal && toggles.toggle_tarolex_r_heart)",
            name: "Tarolex (Malus Cœur)",
            shareWithTeam: 1 // 100% Share
        },

        // Spade Effect (Bonus DMG per turn based on Allies)
        {
            id: 'taro_s_dmg_bonus',
            type: ModifierType.ALT_FLAT,
            targetStatKey: 'dmg',
            value: '10 * (config_tarolex_dore_val || 0) * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)',
            isPerTurn: true,
            condition: "toggles.card_spade || (toggles.card_royal && toggles.toggle_tarolex_r_spade)",
            name: "Tarolex (Bonus Pique)",
            shareWithTeam: 1 // 100% Share
        },

        // Royal Choice Toggles (Only visible if Royal is drawn)
        {
            id: 'taro_tog_r_c', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '0',
            toggleId: 'toggle_tarolex_r_club', toggleName: 'Royal : Choix Trèfle', toggleGroup: 'tarolex_royal',
            condition: 'toggles.card_royal'
        },
        {
            id: 'taro_tog_r_h', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '0',
            toggleId: 'toggle_tarolex_r_heart', toggleName: 'Royal : Choix Cœur', toggleGroup: 'tarolex_royal',
            condition: 'toggles.card_royal'
        },
        {
            id: 'taro_tog_r_s', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '0',
            toggleId: 'toggle_tarolex_r_spade', toggleName: 'Royal : Choix Pique', toggleGroup: 'tarolex_royal',
            condition: 'toggles.card_royal'
        },
        {
            id: 'taro_tog_r_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '0',
            toggleId: 'toggle_tarolex_r_diamond', toggleName: 'Royal : Choix Carreau', toggleGroup: 'tarolex_royal',
            condition: 'toggles.card_royal'
        }
    ]
  },
  {
    id: 'tarot_soleil_levant', type: EntityType.ITEM, name: 'Tarot du soleil levant',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    rarity: 'exotic',
    description: "L'effet varie selon la lame piochée en début de combat.",
    descriptionBlocks: [
        {
            text: `♣ : Aucun effet.
♥ : La valeur des Coups Critiques de l'équipe est augmentée de 25% ^^ (+{{25 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^.
♠ : La valeur des Coups Critiques de l'équipe est augmentée de 50% ^^ (+{{50 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^.
♦ : La valeur des Coups Critiques de l'équipe est augmentée de 75% ^^ (+{{75 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^.
ROYAL : La valeur des Coups Critiques de l'équipe est augmentée de 100% ^^ (+{{100 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%) ^^.`
        }
    ],
    modifiers: [
        // --- ♥ COEUR (Heart) : +25% ---
        { id: 'tsl_h_cp', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_heart', toggleGroup: 'arlequin_card', shareWithTeam: 1 },
        { id: 'tsl_h_cs', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '25 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_heart', toggleGroup: 'arlequin_card', shareWithTeam: 1 },

        // --- ♠ PIQUE (Spade) : +50% ---
        { id: 'tsl_s_cp', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_spade', toggleGroup: 'arlequin_card', shareWithTeam: 1 },
        { id: 'tsl_s_cs', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '50 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_spade', toggleGroup: 'arlequin_card', shareWithTeam: 1 },

        // --- ♦ CARREAU (Diamond) : +75% ---
        { id: 'tsl_d_cp', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '75 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card', shareWithTeam: 1 },
        { id: 'tsl_d_cs', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '75 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card', shareWithTeam: 1 },

        // --- ROYAL : +100% ---
        { id: 'tsl_r_cp', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '100 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_royal', toggleGroup: 'arlequin_card', shareWithTeam: 1 },
        { id: 'tsl_r_cs', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '100 * (ratio_deck_crit + weapon_effect_mult - 1 + (effect_booster || 0)/100)', toggleId: 'card_royal', toggleGroup: 'arlequin_card', shareWithTeam: 1 },
    ]
  },
  {
    id: 'deckecleon', type: EntityType.ITEM, name: 'Deckecleon',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    rarity: 'epic',
    isTungsten: true,
    description: "Deck changeant selon les tours.", 
    descriptionBlocks: [
        {
            // political_points is safe here thanks to context injection in usePlayerEngine.ts
            text: `T1 : L'Arlequin est invisible, et seuls les Coups Critiques peuvent le toucher.
T2 : Si une attaque ennemie (ou plus) vise l'Arlequin, celle-ci voit ses dommages partagés de 30% avec un ennemi choisi par l'Arlequin (un total de dégâts à 1000 sur l'Arlequin infligera 700 à celui-ci et 300 à un ennemi désigné).
T3 : Chaque ennemi touché par l'Arlequin perd **{{Math.ceil(Math.abs(political_points || 0) * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100))}}**/tour en vitalité (Poison).
T4 : Stats +10% : **+{{10 * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%** Vit / **+{{10 * (ratio_deck_spd + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%** Spd / **+{{10 * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}%** Dmg
ROYAL (Tours Pairs) : Bonus d'équipe **+{{5 * level * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** Vit / **+{{5 * level * (ratio_deck_spd + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** Spd / **+{{5 * level * (ratio_deck_dmg + weapon_effect_mult - 1 + (effect_booster || 0)/100)}}** Dmg`
        }
    ],
    modifiers: [
        // --- BASE STATS ---
        { id: 'kec_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50' },
        { id: 'kec_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '150' },
    ]
  },
  {
      id: 'carte_secrete',
      type: EntityType.ITEM,
      name: 'Carte secrète',
      slotId: 'weapon_any',
      categoryId: 'weapon',
      subCategory: 'Decks',
      equipmentCost: 1, 
      goldCost: 150,
      description: "Ajoute +100% (Additif) aux effets d'un deck équipé. Ne fonctionne pas sur les invocations.",
      modifiers: [
          { id: 'cs_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '100' }
      ]
  },
  {
      id: 'carte_cachee',
      type: EntityType.ITEM,
      name: 'Carte cachée',
      slotId: 'weapon_any',
      categoryId: 'weapon',
      subCategory: 'Decks',
      equipmentCost: 1, 
      goldCost: 100,
      description: "Si un bonus de l'Arlequin est annulé, il peut choisir de relancer une fois son Dé-Arlequin.",
      modifiers: [
          { id: 'cc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '150' },
          { id: 'cc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' }
      ]
  },
  {
      id: 'deck_arte',
      type: EntityType.ITEM,
      name: 'Deck Arte',
      slotId: 'weapon_any',
      categoryId: 'weapon',
      subCategory: 'Decks',
      equipmentCost: 1, 
      goldCost: 200,
      // Simplified ternary for robustness: ((H || D) ? 1 : (S ? -2 : -1))
      description: "Tout le monde (arlequin compris) perd **{{Math.abs(Math.ceil((5 * level * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)) * ((toggles.card_heart || toggles.card_diamond) ? 1 : toggles.card_spade ? -2 : -1)))}}** de vitalité/tour.\nSi la lame ♥ a été piochée, les alliés sont immunisés et regagnent ce montant.\nSi la lame ♦ a été piochée, les alliés regagnent ce montant.\nSi la lame ♠ a été piochée, le malus est doublé.",
      modifiers: [
          { id: 'da_vit_base', type: ModifierType.FLAT, targetStatKey: 'vit', value: '200' },
          {
              id: 'da_dot_effect',
              type: ModifierType.FLAT,
              targetStatKey: 'vit',
              // Formule ADDITIVE
              value: '(5 * level * (ratio_deck_vit + weapon_effect_mult - 1 + (effect_booster || 0)/100)) * ((toggles.card_heart || toggles.card_diamond) ? 1 : toggles.card_spade ? -2 : -1)',
              isPerTurn: true,
              name: 'Effet Arte (Tour)',
              shareWithTeam: 1 // 100% Share
          }
      ]
  },
  {
      id: 'deck_invocation',
      type: EntityType.ITEM,
      name: "Deck d'invocation",
      slotId: 'weapon_any',
      categoryId: 'weapon',
      subCategory: 'Decks',
      equipmentCost: 1,
      goldCost: 300,
      description: `Invoque un nombre de Sournoiserie selon le tour (Stats : **{{Math.ceil((100 + (summon_flat_bonus || 0)) * ((ratio_deck_vit || 1) + (effect_booster || 0)/100))}}** Vit / **{{Math.ceil((100 + (summon_flat_bonus || 0)) * ((ratio_deck_spd || 1) + (effect_booster || 0)/100))}}** Spd / **{{Math.ceil((100 + (summon_flat_bonus || 0)) * ((ratio_deck_dmg || 1) + (effect_booster || 0)/100))}}** Dmg)
Tour 1 : invoque une Sournoiserie qui combat aux côtés de l’Arlequin.
Tour 2 : invoque deux Sournoiseries qui combattent aux côtés de l’Arlequin.
Tour 3 : invoque trois Sournoiseries qui combattent aux côtés de l’Arlequin.
Tour 4 : invoque quatre Sournoiseries qui combattent aux côtés de l’Arlequin.

10 Sournoiseries maximum en même temps. Les invocations disparaissent si l’Arlequin est K.O.`,
      modifiers: [
          { id: 'di_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '50' },
          { id: 'di_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' }
      ],
      summons: [
          {
              id: 'summ_sournoiserie',
              name: 'Sournoiserie',
              countValue: '1',
              stats: {
                  // FORMULE STANDARD : (Base + Flat) * (Ratio + Boost)
                  vit: '(100 + (summon_flat_bonus || 0)) * ((ratio_deck_vit || 1) + (effect_booster || 0)/100)',
                  spd: '(100 + (summon_flat_bonus || 0)) * ((ratio_deck_spd || 1) + (effect_booster || 0)/100)',
                  dmg: '(100 + (summon_flat_bonus || 0)) * ((ratio_deck_dmg || 1) + (effect_booster || 0)/100)'
              }
          }
      ]
  }
];
