
import { StatDefinition, ItemSlot, ItemCategory } from '../types';

export const TAG_OPTIONS = [
    { value: '', label: 'Aucun (Texte seul)' },
    { value: 'passive', label: 'Passif' },
    { value: 'active', label: 'Actif' },
    { value: 'special', label: 'Capacité spéciale' },
    { value: 'special_unblockable', label: 'Capacité spéciale imblocable' }, 
    { value: 'unblockable', label: 'Imblocable' }, 
    { value: 'used', label: 'Capacité spéciale utilisée' },
    { value: 'active_special', label: 'Capacité spéciale active' },
    { value: 'locked', label: 'Capacité spéciale bloquée' },
];

export const ITEM_SLOTS: ItemSlot[] = [
  { id: 'head', name: 'Heaume', acceptedCategories: ['armor_head'] },
  { id: 'head_bonus', name: 'Option Heaume', acceptedCategories: ['armor_option'] }, 
  
  { id: 'chest', name: 'Torse', acceptedCategories: ['armor_chest'] },
  { id: 'chest_bonus', name: 'Option Torse', acceptedCategories: ['armor_option'] }, 
  
  { id: 'legs', name: 'Bottes', acceptedCategories: ['armor_legs'] },
  { id: 'legs_bonus', name: 'Option Bottes', acceptedCategories: ['armor_option'] }, 
  
  { id: 'weapon_any', name: 'Main / Arme', acceptedCategories: ['weapon'] },
  
  // Slot Spécial Entomothrope (Niveau 20+)
  { id: 'tetrachire_weapon', name: 'Bras Supplémentaires (Tétrachire)', acceptedCategories: ['weapon'] },

  // Modification ici : on cible les sous-catégories spécifiques pour le filtrage
  { id: 'ench_vit', name: 'Vitalité', acceptedCategories: ['Vitalité'] },
  { id: 'ench_crit', name: 'Critique', acceptedCategories: ['Critique'] },
  { id: 'ench_res', name: 'Résistance', acceptedCategories: ['Résistance'] },
  
  { id: 'artifact', name: 'Artefact', acceptedCategories: ['artifact'] },
  { id: 'rebreather', name: 'Respirateur', acceptedCategories: ['rebreather'] },
  
  { id: 'custom_companion', name: 'Compagnon/Monture', acceptedCategories: ['mount', 'familiar', 'companion'] },
  { id: 'custom_familiar_2', name: 'Familier Secondaire', acceptedCategories: ['familiar'] }, 
  
  { id: 'vehicle', name: 'Véhicule', acceptedCategories: ['vehicle'] },
  { id: 'backpack', name: 'Sac à dos', acceptedCategories: ['backpack'] }, 
];

export const ITEM_CATEGORIES: ItemCategory[] = [
  { 
      id: 'armor_head', 
      name: 'Casque / Heaume',
      subCategories: ['Casque', 'Chapeau', 'Capuche', 'Casque technologique', 'Panoplie'] 
  },
  { 
      id: 'armor_chest', 
      name: 'Plastron / Torse', 
      subCategories: [
          'Lourd', 'Intermédiaire', 'Léger', 
          'Costume', 'Manteau', 'Armure technologique', 'Équipement sacré', 'Panoplie'
      ] 
  },
  { 
      id: 'armor_legs', 
      name: 'Jambières / Bottes',
      subCategories: ['Bottes', 'Bottes technologiques', 'Panoplie']
  },
  
  { id: 'armor_option', name: 'Options Armure' }, 
  
  { 
      id: 'weapon', 
      name: 'Arme', 
      subCategories: [
        "Dagues", "Griffes", "Cestes", "Frondes", "Arcs", "Arbalètes", 
        "Tonfas", "Fléaux d'armes", "Lances", "Épées", "Faux", "Haches", 
        "Massues", "Marteaux", "Boucliers", 
        "Boucliers technologiques", "Chaînes", "Fouets", "Decks",
        "Bâtons d’éther", "Sceptres", "Armes technologiques", 
        "Gantelets", "Anneaux", "Armes sacrées",
        "Instrument (Vent)", "Instrument (Corde)", "Instrument (Percussion)", "Instrument (Multi-type)"
      ] 
  },
  
  { id: 'partition', name: 'Partition', subCategories: ['Vent', 'Corde', 'Percussion', 'Multi-type'] },

  { id: 'enchantment', name: 'Enchantement', subCategories: ['Vitalité', 'Critique', 'Résistance'] },
  { id: 'artifact', name: 'Artefact' },
  { id: 'seal', name: 'Sceau', subCategories: ['Magique', 'Divin', 'Maudit'] }, 
  { id: 'special', name: 'Objet Spécial', subCategories: ['Gadget', 'Quest', 'Consommable'] }, 
  { id: 'rebreather', name: 'Respirateur' },
  { id: 'mount', name: 'Monture', subCategories: ['Cheval', 'Mécanique', 'Créature'] },
  { id: 'familiar', name: 'Familier', subCategories: ['Esprit', 'Magique'] },
  { id: 'companion', name: 'Compagnon', subCategories: ['Humanoïde', 'Bête'] },
  { id: 'vehicle', name: 'Véhicule', subCategories: ['Terrestre', 'Aérien'] },
  { id: 'backpack', name: 'Sac à dos', subCategories: ['Aventurier', 'Magique', 'Militaire'] }, 
  { id: 'misc', name: 'Divers / Bonus' },
];

export const INITIAL_STATS: StatDefinition[] = [
  { id: 's_abs', key: 'absorption', label: 'Absorption', baseValue: 0, group: 'Primary', description: '% de la Vitalité converti en Dégâts (Classe Corrompu)' },

  { id: 's1', key: 'vit', label: 'Vitalité (HP)', baseValue: 0, group: 'Primary' }, 
  { id: 's2', key: 'spd', label: 'Vitesse (SPD)', baseValue: 0, group: 'Primary' },
  { id: 's3', key: 'dmg', label: 'Dégâts (DMG)', baseValue: 0, group: 'Primary' },
  
  { id: 's4', key: 'aura', label: 'Aura', baseValue: 0, group: 'Secondary' },
  { id: 's6', key: 'res', label: 'Résistance', baseValue: 0, group: 'Secondary' },
  { id: 's7', key: 'dmg_reduct_pct', label: 'Réduc. Dégâts %', baseValue: 0, max: 100, group: 'Secondary' },
  { id: 's_reflect', key: 'renvois_degats', label: 'Renvois Dégâts %', baseValue: 0, group: 'Combat', max: 100 },
  
  { 
    id: 's5_source', key: 'crit_bonus', label: 'Bonus Crit Global', 
    baseValue: 0, group: 'Hidden', 
    description: 'Statistique tampon.' 
  },
  { 
    id: 's5_a', key: 'crit_primary', label: 'Critique (Dégâts)', 
    baseValue: 0, group: 'Combat', 
    description: 'Anciennement CRIT_DMG.' 
  },
  { 
    id: 's5_b', key: 'crit_secondary', label: 'Critique (Max)', 
    baseValue: 0, group: 'Combat', 
    description: 'Anciennement CRIT_DMG_MAX.' 
  },
  
  { 
    id: 'stat_pp', key: 'political_points', label: 'Points Politiques', 
    baseValue: 0, min: -300, max: 300, group: 'Secondary',
    description: "Influence politique (-300 à +300). Affecte certains objets et dialogues."
  },
  
  {
    id: 'stat_adv_reg', key: 'regional_pendant', label: 'Pendant Régional (%)', 
    baseValue: 0, group: 'Secondary', 
    description: "Bonus d'aventure lié à la région."
  },
  {
    id: 'stat_adv_dur', key: 'duralas_pendant', label: 'Pendant Duralas (%)', 
    baseValue: 0, group: 'Secondary', 
    description: "Bonus d'aventure avancé (Duralas)."
  },

  { id: 'h1', key: 'weapon_cap', label: 'Capacité Arme', baseValue: 3, group: 'Hidden', description: 'Points max' },
  { id: 'h1_b', key: 'reduce_heavy_weapon_cost', label: 'Réduc Coût Arme Lourde', baseValue: 0, group: 'Hidden', description: 'Si > 0, les armes coûtant 2 points n\'en coûtent que 1.' },

  { id: 'h_eff_boost', key: 'effect_booster', label: 'Boost Effets (%)', baseValue: 0, group: 'Hidden', description: 'Pourcentage ajouté à tous les effets spéciaux.' },
  { id: 'h_spec_mast', key: 'special_mastery', label: 'Maîtrise Spé.', baseValue: 0, group: 'Hidden', description: 'Booste spécifiquement les mécaniques des classes spéciales (Arlequins, etc.).' },
  
  { id: 'h_poison', key: 'poison_boost', label: 'Boost Poison (%)', baseValue: 0, group: 'Hidden', description: 'Augmente l\'efficacité des poisons et effets toxiques.' },

  { id: 'h2', key: 'seal_potency', label: 'Puissance Sceau (Interne)', baseValue: 0, group: 'Hidden' },
  { id: 'h3', key: 'crit_mult', label: 'Mult. Critique (Objets)', baseValue: 1, group: 'Hidden', precision: 2 },
  { id: 'h4', key: 'companion_scale', label: 'Échelle Compagnon', baseValue: 50, group: 'Hidden' },
  { id: 'h5', key: 'partition_cap', label: 'Capacité Pupitre', baseValue: 0, group: 'Hidden', description: 'Nb de partitions actives' },
  
  { id: 'h6', key: 'partition_mult', label: 'Mult. Partitions', baseValue: 1, group: 'Hidden', description: 'Multiplicateur puissance partitions (Mélomane)', precision: 2 },
  { id: 'h7', key: 'mult_lance_dmg', label: 'Mult. Lances', baseValue: 1, group: 'Hidden', description: 'Multiplicateur dégâts lances', precision: 2 },
  { id: 'h8', key: 'weapon_effect_mult', label: 'Mult. Effets Arme', baseValue: 1, group: 'Hidden', precision: 2, description: 'Multiplicateur pour Œil de faucon' },
  { id: 'h9', key: 'ui_class_mastery_mult', label: 'Mult. Classe UI', baseValue: 0, group: 'Hidden', description: 'Facteur de duplication arme (ex: Archer = 1 pour +100%)' },
  
  { id: 'h10', key: 'enchantment_mult', label: 'Mult. Enchantement', baseValue: 1, group: 'Hidden', precision: 2, description: 'Multiplicateur de puissance des enchantements' },

  { id: 'rd1', key: 'ratio_deck_dmg', label: 'Ratio Deck (Dmg)', baseValue: 1, group: 'Hidden', precision: 2 },
  { id: 'rd2', key: 'ratio_deck_crit', label: 'Ratio Deck (Crit)', baseValue: 1, group: 'Hidden', precision: 2 },
  { id: 'rd3', key: 'ratio_deck_spd', label: 'Ratio Deck (Spd)', baseValue: 1, group: 'Hidden', precision: 2 },
  { id: 'rd4', key: 'ratio_deck_vit', label: 'Ratio Deck (Vit)', baseValue: 1, group: 'Hidden', precision: 2 },

  { id: 'mt1', key: 'turret_mult', label: 'Mult. Tourelles', baseValue: 1, group: 'Hidden', description: 'Multiplicateur global pour les effets de tourelles', precision: 2 },

  { id: 'inv_c', key: 'invocation_count', label: 'Nb Invocations', baseValue: 0, group: 'Hidden' },
  { id: 'inv_s', key: 'invocation_share', label: '% Partage Invoc', baseValue: 0, group: 'Hidden' },
  { id: 'sum_flat', key: 'summon_flat_bonus', label: 'Bonus Flat Invoc', baseValue: 0, group: 'Hidden', description: 'Bonus fixe ajouté à toutes les stats de chaque invocation' },
  
  { id: 'nec_c', key: 'necro_pet_count', label: 'Nb Invoc Nécromant', baseValue: 0, group: 'Hidden' },
  { id: 'nec_s', key: 'necro_pet_share', label: '% Partage Nécromant', baseValue: 0, group: 'Hidden' },

  { id: 'arrow_1', key: 'arrow_elf_val', label: 'Val. Flèche Elfique', baseValue: 0, group: 'Hidden' },
  { id: 'arrow_2', key: 'arrow_stl_val', label: 'Val. Flèche Furtive', baseValue: 0, group: 'Hidden' },
  { id: 'arrow_3', key: 'arrow_fire_val', label: 'Val. Flèche Enflammée', baseValue: 0, group: 'Hidden' },

  { id: 'bolt_1', key: 'bolt_orc_val', label: 'Val. Carreau Orc', baseValue: 0, group: 'Hidden' },
  { id: 'bolt_2', key: 'bolt_perf_val', label: 'Val. Carreau Perforant', baseValue: 0, group: 'Hidden' },
  { id: 'bolt_3', key: 'bolt_ice_val', label: 'Val. Carreau Glacé', baseValue: 0, group: 'Hidden' },

  { id: 'val_prev', key: 'val_prevision', label: 'Prévision (Réduction %)', baseValue: 0, group: 'Hidden', description: 'Valeur de réduction des premières attaques (Paladin)' },
  { id: 'val_vig', key: 'val_vigueur_dmg', label: 'Vigueur (Dégâts %)', baseValue: 0, group: 'Hidden', description: 'Bonus dégâts conditionnel si Vit > 3000 (Paladin)' },
  { id: 'val_ec', key: 'val_esprit_contradiction', label: 'Esprit Contradiction (%)', baseValue: 0, group: 'Hidden', description: 'Bonus Vitalité si altéré (Protecteur)' },
  { id: 'val_salv', key: 'val_salvateur', label: 'Salvateur (Réduction %)', baseValue: 0, group: 'Hidden', description: 'Valeur de réduction des dégâts après EC (Guérisseur)' },

  { id: 'stat_anti_drag', key: 'anti_dragon_phenix', label: 'Malus Dragon/Phénix (%)', baseValue: 0, group: 'Hidden', description: 'Pourcentage de réduction stats adverses Dragons/Phénix' },
  
  { id: 'stat_gemme_spel', key: 'gemme_spec', label: 'Puissance Gemme Spel.', baseValue: 0, group: 'Hidden', description: 'Bonus aux effets positifs joueur/familier' },

  { id: 'stat_malus_aqua', key: 'malus_aqua', label: 'Malus Aqua (%)', baseValue: 0, group: 'Secondary', description: 'Malus de terrain aquatique en pourcentage.' }
];
