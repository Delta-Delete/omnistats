
import { Entity, EntityType, ModifierType } from '../types';

export const OTHERS: Entity[] = [
  // --- FACTIONS / SETS ---
  
  // --- C.O IDENTITY (Pure Faction) ---
  {
      id: 'fac_congregation_ombre', 
      type: EntityType.FACTION, 
      name: "La Congrégation de l'Ombre (C.O)",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea11.png', 
      description: "La Congrégation de l'Ombre est une organisation secrète d'assassins et de chasseurs de primes.",
      prestige: 5, 
      modifiers: []
  },

  // --- FACTIONS DU LORE ---
  {
      id: 'fac_milice',
      type: EntityType.FACTION,
      name: "La Milice",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea22.png',
      description: "La Milice est une faction qui peut être considérée comme l'armée des territoires du Nord.",
      prestige: 4,
      modifiers: []
  },
  {
      id: 'fac_garde_zephyr',
      type: EntityType.FACTION,
      name: "La Garde Zéphyr",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea15.png',
      description: "La nature, c'est ce que les Zéphyriens vénèrent par dessus tout. La Garde Zéphyr est une faction qui se veut indépendante de toute cité, dans leurs paroles en tout cas.",
      prestige: 6,
      modifiers: [
          // NEW: Bonus Lore Anti-Dragon
          { id: 'gz_anti_drag', type: ModifierType.FLAT, targetStatKey: 'anti_dragon_phenix', value: '20' }
      ]
  },
  {
      id: 'fac_les_gardiens',
      type: EntityType.FACTION,
      name: "Les Gardiens (Garde Royale)",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea12.png',
      description: "La Garde de Stellaraë a été instaurée pour défendre la ville-capitale des Humains, auto-proclamée capitale de Dùralas.",
      prestige: 5,
      modifiers: []
  },
  {
      id: 'fac_kazhariens',
      type: EntityType.FACTION,
      name: "Les Kazhariens",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea24.png',
      description: "Les Kazhariens sont les membres d'une faction qui se situe dans les mines de Kazhar, fondée sur une alliance entre les principaux habitants à l'alignement \"bon\" des habitants de la montagne.",
      prestige: 4,
      modifiers: []
  },
  {
      id: 'fac_pirates',
      type: EntityType.FACTION,
      name: "Les Pirates",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea23.png',
      description: "Pillards, Anarchistes, Égocentriques et Nihilistes, Les Pirates ne sont pas foncièrement mauvais, mais ils ne pensent qu'à piller dans le but de récupérer de l'argent sur des aventuriers qui s'aventureraient un peu trop près d'eux.",
      prestige: 4,
      modifiers: []
  },

  // --- C.O SET STANDARD ---
  {
      id: 'set_co_standard', 
      type: EntityType.ITEM_SET, 
      name: "Set : Équipements C.O (Standard)",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea11.png', // Same logo or variation
      modifiers: [
          {
              id: 'set_co_active',
              type: ModifierType.FLAT,
              targetStatKey: 'dmg', // Dummy stat just to show activation
              value: '0',
              condition: "countSet('set_co_standard') >= 3 && factionId === 'fac_congregation_ombre'", // Added faction check
              name: "Bonus Complet (Invocateur)"
          }
      ],
      descriptionBlocks: [
          {
              title: "Appel de l'Ombre (3 pièces)",
              text: "Invoque automatiquement le familier **Ombre Servile**.\nStats : Vitalité = Niv*100 / Vitesse = 250 / Dégâts = 250.\nIl est insensible aux boosts/nerfs de stats.\nIl disparaît si le joueur est K.O.",
              tag: "unblockable",
              condition: "countSet('set_co_standard') >= 3 && factionId === 'fac_congregation_ombre'"
          }
      ],
      summons: [
          {
              id: 'summ_co_servant',
              name: 'Ombre Servile',
              countValue: '1',
              // Condition based on set count
              condition: "countSet('set_co_standard') >= 3 && factionId === 'fac_congregation_ombre'",
              stats: {
                  vit: 'level * 100',
                  spd: '250',
                  dmg: '250'
              }
          }
      ]
  },

  // --- C.O SET HEGEMONIE ---
  {
      id: 'set_hegemony', 
      type: EntityType.ITEM_SET, 
      name: "Set : Panoplie d'Hégémonie",
      imageUrl: 'https://img.icons8.com/color/96/crown.png', // Different icon for differentiation
      descriptionBlocks: [
          {
              title: "Machiavel (3 pièces)",
              text: "Si vous portez une arme type Dague, Griffe, Arc ou Arbalète : Vos **Points Politiques** sont convertis en bonus de Dégâts (%) et en Effet d'Arme (%). (Max 200 PP considérés).",
              tag: "active",
              condition: "countSet('set_hegemony') >= 3 && factionId === 'fac_congregation_ombre'"
          }
      ],
      modifiers: [
          // Set Hégémonie - Machiavel (Requires 3 pieces + 1 Weapon from specific categories)
          // Utilisation de political_points_input pour éviter le lag de recalcul
          {
              id: 'set_heg_machiavel_dmg',
              type: ModifierType.ALT_PERCENT,
              targetStatKey: 'dmg',
              value: 'Math.min(Math.max(0, political_points_input || 0), 200)',
              // Logic: Count 3 set pieces + at least 1 weapon + FACTION CHECK
              condition: "countSet('set_hegemony') >= 3 && factionId === 'fac_congregation_ombre' && (countItems('Dagues') > 0 || countItems('Griffes') > 0 || countItems('Arcs') > 0 || countItems('Arbalètes') > 0)",
              name: "Machiavel (Dégâts)"
          },
          // Bonus Machiavel - Effets
          {
              id: 'set_heg_machiavel_eff',
              type: ModifierType.PERCENT_ADD,
              targetStatKey: 'weapon_effect_mult',
              value: 'Math.min(Math.max(0, political_points_input || 0), 200)',
              condition: "countSet('set_hegemony') >= 3 && factionId === 'fac_congregation_ombre' && (countItems('Dagues') > 0 || countItems('Griffes') > 0 || countItems('Arcs') > 0 || countItems('Arbalètes') > 0)",
              name: "Machiavel (Effets)"
          }
      ]
  },

  // --- SET GARDE ROYALE (CAPITAINE) ---
  {
      id: 'set_capitaine',
      type: EntityType.ITEM_SET,
      name: "Set : Panoplie du Capitaine",
      imageUrl: 'https://i.servimg.com/u/f89/15/07/96/16/drapea12.png',
      descriptionBlocks: [
          {
              title: "Aura Solaire (3 pièces)",
              // Affichage propre de la valeur X calculée via {{ }}
              // UTILISATION DE LA STAT 'political_points' OU de l'input fallback.
              // UTILISATION de 'toggles.toggle_capitaine_reduce' (maintenant disponible dans context)
              text: "Le Gardien est entouré d'une aura protectrice (**{{Math.floor(Math.min(2000, Math.max(0, (political_points || political_points_input || 0) * 100)) * ((toggles && toggles.toggle_capitaine_reduce) ? 0.5 : 1))}}**) (max 2000). Tant que l'aura n'est pas brisée il ne reçoit aucun dégât, mais les effets de debuff ne nécessitant pas d'atteinte de la vitalité (= ne fonctionnant pas via des coups réussis) le touchent. Lorsque l'aura est brisée par une attaque il faut l'attaquer à nouveau pour pouvoir le toucher. Les ensorceleurs peuvent réduire de 50% cette aura s'ils souhaitent bloquer cette capacité.",
              tag: "active",
              condition: "countSet('set_capitaine') >= 3 && factionId === 'fac_les_gardiens'"
          }
      ],
      modifiers: [
          {
              id: 'set_cap_aura_effect',
              type: ModifierType.FLAT,
              targetStatKey: 'aura',
              // 100 par PP, Max 2000. Réduit de 50% si le toggle est actif.
              // FIX: Utilise political_points_input pour garantir une valeur non nulle dès la première passe.
              // Utilise également une vérification sécurisée de toggles.
              value: 'Math.floor(Math.min(2000, Math.max(0, (political_points_input || 0) * 100)) * ((typeof toggles !== "undefined" && toggles.toggle_capitaine_reduce) ? 0.5 : 1))',
              condition: "countSet('set_capitaine') >= 3 && factionId === 'fac_les_gardiens'",
              name: "Aura Solaire"
          },
          // Toggler pour la réduction
          {
              id: 'set_cap_reduce_toggle',
              type: ModifierType.FLAT,
              targetStatKey: 'dmg', // Stat tampon, valeur 0
              value: '0',
              condition: "countSet('set_capitaine') >= 3 && factionId === 'fac_les_gardiens'",
              toggleId: 'toggle_capitaine_reduce',
              toggleName: "Réduction Ensorceleur (Aura -50%)"
          }
      ]
  },

  // --- GLOBAL RULES ---
  {
      id: 'rule_crit_distribution', type: EntityType.GLOBAL_RULE, name: 'Système Critique',
      description: "Applique le Bonus Critique Global.",
      modifiers: [
          { id: 'm_distrib_crit_a', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: 'crit_bonus' },
          { id: 'm_distrib_crit_b', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: 'crit_bonus' }
      ]
  },
  {
      id: 'rule_politics_sync', 
      type: EntityType.GLOBAL_RULE, 
      name: 'Système Politique',
      description: "Synchronise le choix politique avec les statistiques.",
      modifiers: [
          // IMPORTANT: Cette règle doit avoir la priorité 0 (Défini dans engine.ts)
          // Si 'political_points_input' est undefined, cela retourne 0.
          { id: 'm_pp_sync', type: ModifierType.FLAT, targetStatKey: 'political_points', value: 'political_points_input || 0' }
      ]
  },
  {
      id: 'rule_novice', type: EntityType.GLOBAL_RULE, name: 'Progression Novice / Sans Classe',
      description: "Bonus standard (+5/niv). S'applique du niveau 1 à 4, ou indéfiniment si aucune classe n'est choisie.",
      modifiers: [
          { id: 'm_nov_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'level * 5', condition: 'level < 5 || !classId' },
          { id: 'm_nov_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'level * 5', condition: 'level < 5 || !classId' },
          { id: 'm_nov_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'level * 5', condition: 'level < 5 || !classId' }
      ]
  },
  {
      id: 'rule_effect_distributor', 
      type: EntityType.GLOBAL_RULE, 
      name: 'Distribution Boost Effets & Maîtrise',
      description: "Applique le 'Boost Effets' et la 'Maîtrise Spéciale' aux compétences concernées (Tourelles, Sceaux, etc.).",
      modifiers: [
          // FIX: Intégration de la Gemme Spéluncienne dans le système
          // La stat 'gemme_spec' (provenant des objets) augmente 'effect_booster'
          { id: 'gem_to_boost', type: ModifierType.FLAT, targetStatKey: 'effect_booster', value: 'gemme_spec', name: 'Puissance Gemme Spéluncienne' },

          { id: 'red_turret', type: ModifierType.PERCENT_ADD, targetStatKey: 'turret_mult', value: 'effect_booster' },
          { id: 'red_part', type: ModifierType.PERCENT_ADD, targetStatKey: 'partition_mult', value: 'effect_booster' },
          { id: 'red_seal', type: ModifierType.PERCENT_ADD, targetStatKey: 'seal_potency', value: 'effect_booster' },
          
          { id: 'red_comp', type: ModifierType.PERCENT_ADD, targetStatKey: 'companion_scale', value: 'effect_booster' },
          { id: 'red_inv', type: ModifierType.PERCENT_ADD, targetStatKey: 'invocation_share', value: 'effect_booster' },
          { id: 'red_necro', type: ModifierType.PERCENT_ADD, targetStatKey: 'necro_pet_share', value: 'effect_booster' },
          { id: 'red_lance', type: ModifierType.PERCENT_ADD, targetStatKey: 'mult_lance_dmg', value: 'effect_booster' }, 
          
          { id: 'red_arl_d', type: ModifierType.PERCENT_ADD, targetStatKey: 'ratio_deck_dmg', value: 'effect_booster' },
          { id: 'red_arl_s', type: ModifierType.PERCENT_ADD, targetStatKey: 'ratio_deck_spd', value: 'effect_booster' },
          { id: 'red_arl_v', type: ModifierType.PERCENT_ADD, targetStatKey: 'ratio_deck_vit', value: 'effect_booster' },
          { id: 'red_arl_c', type: ModifierType.PERCENT_ADD, targetStatKey: 'ratio_deck_crit', value: 'effect_booster' },

          { id: 'red_arrow_elf', type: ModifierType.PERCENT_ADD, targetStatKey: 'arrow_elf_val', value: 'effect_booster' },
          { id: 'red_arrow_stl', type: ModifierType.PERCENT_ADD, targetStatKey: 'arrow_stl_val', value: 'effect_booster' },
          { id: 'red_arrow_fire', type: ModifierType.PERCENT_ADD, targetStatKey: 'arrow_fire_val', value: 'effect_booster' },
          { id: 'red_bolt_orc', type: ModifierType.PERCENT_ADD, targetStatKey: 'bolt_orc_val', value: 'effect_booster' },
          { id: 'red_bolt_perf', type: ModifierType.PERCENT_ADD, targetStatKey: 'bolt_perf_val', value: 'effect_booster' },
          { id: 'red_bolt_ice', type: ModifierType.PERCENT_ADD, targetStatKey: 'bolt_ice_val', value: 'effect_booster' },

          { id: 'sm_turret', type: ModifierType.PERCENT_ADD, targetStatKey: 'turret_mult', value: 'special_mastery' },
          { id: 'sm_part', type: ModifierType.PERCENT_ADD, targetStatKey: 'partition_mult', value: 'special_mastery' },
          { id: 'sm_seal', type: ModifierType.PERCENT_ADD, targetStatKey: 'seal_potency', value: 'special_mastery' },
          { id: 'sm_abs', type: ModifierType.PERCENT_ADD, targetStatKey: 'absorption', value: 'special_mastery' },
          { id: 'sm_lance', type: ModifierType.PERCENT_ADD, targetStatKey: 'mult_lance_dmg', value: 'special_mastery' },
      ]
  },
  // NEW: RULE TO DISPLAY LORE BONUSES TEXT
  {
      id: 'rule_lore_display',
      type: EntityType.GLOBAL_RULE,
      name: 'Affichages Lore',
      descriptionBlocks: [
          {
              title: 'Apaisement',
              text: "Les Dragons/Phénix perdent **{{anti_dragon_phenix}}%** à chaque stats contre vous (1v1 seulement).",
              condition: "anti_dragon_phenix > 0",
              tag: "passive"
          }
      ],
      modifiers: []
  },

  // --- PROFESSIONS (Métiers) ---
  { id: 'prof_mineur', type: EntityType.PROFESSION, name: 'Mineur', description: 'Sans bonus.', modifiers: [], hideInRecap: true },
  { id: 'prof_bucheron', type: EntityType.PROFESSION, name: 'Bûcheron', description: 'Sans bonus.', modifiers: [], hideInRecap: true },
  { id: 'prof_chasseur', type: EntityType.PROFESSION, name: 'Chasseur', description: 'Sans bonus.', modifiers: [], hideInRecap: true },
  { id: 'prof_forgeron', type: EntityType.PROFESSION, name: 'Forgeron', description: 'Sans bonus.', modifiers: [], hideInRecap: true },
  { id: 'prof_sculpteur', type: EntityType.PROFESSION, name: 'Sculpteur', description: 'Sans bonus.', modifiers: [], hideInRecap: true },
  { id: 'prof_armurier', type: EntityType.PROFESSION, name: 'Armurier', description: 'Sans bonus.', modifiers: [], hideInRecap: true },
  { id: 'prof_bricoleur', type: EntityType.PROFESSION, name: 'Bricoleur', description: 'Sans bonus.', modifiers: [], hideInRecap: true },

  // --- SUB-PROFESSIONS (Sous-Métiers) ---
  { id: 'sub_potion', type: EntityType.SUB_PROFESSION, name: 'Fabricant de potion (Potion)', description: 'Expertise en potions curatives et utilitaires.', modifiers: [], hideInRecap: true },
  { id: 'sub_poison', type: EntityType.SUB_PROFESSION, name: 'Fabricant de potion (Poison)', description: 'Expertise en poisons et toxines.', modifiers: [], hideInRecap: true },
  { id: 'sub_enchanteur', type: EntityType.SUB_PROFESSION, name: 'Enchanteur', description: 'Maîtrise des enchantements d\'équipement.', modifiers: [], hideInRecap: true },
  { id: 'sub_specialiste', type: EntityType.SUB_PROFESSION, name: 'Spécialiste', description: 'Expertise pointue dans un domaine rare.', modifiers: [], hideInRecap: true },
  { id: 'sub_fusionneur', type: EntityType.SUB_PROFESSION, name: 'Fusionneur', description: 'Art de combiner les matériaux et les essences.', modifiers: [], hideInRecap: true },
];
