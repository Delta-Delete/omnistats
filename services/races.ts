
import { Entity, EntityType, ModifierType } from '../types';

export const RACES: Entity[] = [
  {
    id: 'humain', type: EntityType.RACE, name: 'Humain', 
    description: 'HP {{r_hum_hp}}, SPD {{r_hum_spd}}, DMG {{r_hum_dmg}}, CRIT {{r_hum_crit}}',
    modifiers: [
        { id: 'r_hum_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        { id: 'r_hum_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
        { id: 'r_hum_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' },
        { id: 'r_hum_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' }
    ]
  },
  {
    id: 'elfe', type: EntityType.RACE, name: 'Elfe',
    description: 'HP {{r_elf_hp}}, SPD {{r_elf_spd}}, DMG {{r_elf_dmg}}, CRIT {{r_elf_crit}}',
    modifiers: [
        { id: 'r_elf_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
        { id: 'r_elf_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
        { id: 'r_elf_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' },
        { id: 'r_elf_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' }
    ]
  },
  {
    id: 'abyssal', type: EntityType.RACE, name: 'Abyssal',
    description: 'HP {{m_aby_hp}}, SPD {{m_aby_spd}}, DMG {{m_aby_dmg}}, CRIT {{m_aby_crit}}',
    modifiers: [
      { id: 'm_aby_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '65' },
      { id: 'm_aby_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '110' },
      { id: 'm_aby_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' },
      { id: 'm_aby_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25' }
    ]
  },
  {
    id: 'entomothrope', type: EntityType.RACE, name: 'Entomothrope',
    description: 'Race insectoïde. CRIT {{m_ento_crit}}, CRIT MAX {{m_ento_crit_m}}. Sélectionnez une sous-race.',
    descriptionBlocks: [
        {
            title: "Tétrachire (Niv 20+)",
            text: "Peut porter une arme à une main supplémentaire (Standard, hors spécial/tech, bouclier inclus).",
            tag: "passive",
            condition: "level >= 20"
        }
    ],
    modifiers: [
        { id: 'm_ento_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25' },
        { id: 'm_ento_crit_m', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '50' }
    ]
  },
  {
      id: 'ento_chitineux', type: EntityType.RACE, name: 'Chitineux', parentId: 'entomothrope',
      description: 'HP {{m_ento_chi_hp}}, SPD {{m_ento_chi_spd}}, DMG {{m_ento_chi_dmg}}',
      modifiers: [
          { id: 'm_ento_chi_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
          { id: 'm_ento_chi_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50' },
          { id: 'm_ento_chi_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' }
      ]
  },
  {
      id: 'ento_volant', type: EntityType.RACE, name: 'Volant', parentId: 'entomothrope',
      description: 'HP {{m_ento_vol_hp}}, SPD {{m_ento_vol_spd}}, DMG {{m_ento_vol_dmg}}',
      modifiers: [
          { id: 'm_ento_vol_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' },
          { id: 'm_ento_vol_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '75' },
          { id: 'm_ento_vol_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' }
      ]
  },
  {
      id: 'ento_arachneen', type: EntityType.RACE, name: 'Arachnéen', parentId: 'entomothrope',
      description: 'HP {{m_ento_ara_hp}}, SPD {{m_ento_ara_spd}}, DMG {{m_ento_ara_dmg}}',
      modifiers: [
          { id: 'm_ento_ara_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' },
          { id: 'm_ento_ara_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50' },
          { id: 'm_ento_ara_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '50' }
      ]
  },
  {
      id: 'ento_inclassable', type: EntityType.RACE, name: 'Inclassable', parentId: 'entomothrope',
      description: 'HP {{m_ento_inc_hp}}, SPD {{m_ento_inc_spd}}, DMG {{m_ento_inc_dmg}}',
      modifiers: [
          { id: 'm_ento_inc_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '75' },
          { id: 'm_ento_inc_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50' },
          { id: 'm_ento_inc_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' }
      ]
  },
  {
      id: 'hybride', type: EntityType.RACE, name: 'Hybride',
      description: 'HP {{m_hyb_hp}}, SPD {{m_hyb_spd}}, DMG {{m_hyb_dmg}}, CRIT {{m_hyb_crit}}',
      modifiers: [
          { id: 'm_hyb_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '105' },
          { id: 'm_hyb_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '105' },
          { id: 'm_hyb_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20' },
          { id: 'm_hyb_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' }
      ]
  },
  {
      id: 'djollfulin', type: EntityType.RACE, name: 'Djöllfulin',
      description: 'HP {{m_djo_hp}}, DMG {{m_djo_dmg}}, SPD {{m_djo_spd}}, CRIT {{m_djo_crit}}',
      modifiers: [
          { id: 'm_djo_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '75' },
          { id: 'm_djo_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '110' },
          { id: 'm_djo_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' },
          { id: 'm_djo_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' }
      ]
  },
  {
      id: 'geant', type: EntityType.RACE, name: 'Géant',
      description: 'HP {{m_gea_hp}}, DMG {{m_gea_dmg}}, SPD {{m_gea_spd}}, CRIT {{m_gea_crit}}, CRIT MAX {{m_gea_crit_m}}',
      modifiers: [
          { id: 'm_gea_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '115' },
          { id: 'm_gea_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '85' },
          { id: 'm_gea_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30' },
          { id: 'm_gea_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' },
          { id: 'm_gea_crit_m', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '100' }
      ]
  },
  {
      id: 'therianthropes', type: EntityType.RACE, name: 'Thérianthropes',
      description: 'HP {{m_the_hp}}, SPD {{m_the_spd}}, DMG {{m_the_dmg}}, CRIT {{m_the_crit}}',
      modifiers: [
          { id: 'm_the_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
          { id: 'm_the_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '105' },
          { id: 'm_the_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30' },
          { id: 'm_the_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '75' }
      ]
  },
  {
      id: 'naga', type: EntityType.RACE, name: 'Naga',
      description: 'HP {{m_nag_hp}}, SPD {{m_nag_spd}}, DMG {{m_nag_dmg}}, CRIT {{m_nag_crit}}, CRIT MAX {{m_nag_crit_m}}',
      modifiers: [
          { id: 'm_nag_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '80' },
          { id: 'm_nag_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
          { id: 'm_nag_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '40' },
          { id: 'm_nag_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25' },
          { id: 'm_nag_crit_m', type: ModifierType.FLAT, targetStatKey: 'crit_secondary', value: '50' }
      ]
  },
  {
      id: 'nain', type: EntityType.RACE, name: 'Nain',
      description: 'HP {{m_nai_hp}}, DMG {{m_nai_dmg}}, SPD {{m_nai_spd}}, CRIT {{m_nai_crit}}',
      modifiers: [
          { id: 'm_nai_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '115' },
          { id: 'm_nai_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '95' },
          { id: 'm_nai_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20' },
          { id: 'm_nai_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' }
      ]
  },
  {
      id: 'peauverte', type: EntityType.RACE, name: 'Peau-verte',
      description: 'HP {{m_pea_hp}}, SPD {{m_pea_spd}}, DMG {{m_pea_dmg}}, CRIT {{m_pea_crit}}',
      modifiers: [
          { id: 'm_pea_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '105' },
          { id: 'm_pea_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '95' },
          { id: 'm_pea_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25' },
          { id: 'm_pea_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '75' }
      ]
  },
  {
      id: 'strygeblanc', type: EntityType.RACE, name: 'Stryge Blanc',
      description: 'HP {{m_stb_hp}}, SPD {{m_stb_spd}}, DMG {{m_stb_dmg}}, CRIT {{m_stb_crit}}',
      modifiers: [
          { id: 'm_stb_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '105' },
          { id: 'm_stb_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
          { id: 'm_stb_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '15' },
          { id: 'm_stb_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25' }
      ]
  },
  {
      id: 'strygenoir', type: EntityType.RACE, name: 'Stryge Noir',
      description: 'HP {{m_stn_hp}}, SPD {{m_stn_spd}}, DMG {{m_stn_dmg}}, CRIT {{m_stn_crit}}',
      modifiers: [
          { id: 'm_stn_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '100' },
          { id: 'm_stn_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '100' },
          { id: 'm_stn_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '20' },
          { id: 'm_stn_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25' }
      ]
  },
  {
      id: 'vampire', type: EntityType.RACE, name: 'Vampire',
      description: 'HP {{m_vam_hp}}, SPD {{m_vam_spd}}, DMG {{m_vam_dmg}}, CRIT {{m_vam_crit}}',
      modifiers: [
          { id: 'm_vam_hp', type: ModifierType.FLAT, targetStatKey: 'vit', value: '105' },
          { id: 'm_vam_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '115' },
          { id: 'm_vam_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '15' },
          { id: 'm_vam_crit', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '50' }
      ]
  }
];
