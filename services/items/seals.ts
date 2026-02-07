
import { Entity, EntityType, ModifierType } from '../../types';

export const CONFIGURABLE_SEALS: Entity[] = [
  // --- SCEAU DU GARDIEN (LIBRE) ---
  {
    id: 'seal_gardien',
    type: EntityType.ITEM,
    name: 'Sceau du Gardien',
    categoryId: 'seal',
    subCategory: 'Magique',
    description: "Sceau de protection ajustable. Configurez vos stats librement.",
    userConfig: { type: 'manual_stats' },
    modifiers: [
        { id: 'sg_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'config_seal_gardien_vit || 0' },
        { id: 'sg_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'config_seal_gardien_spd || 0' },
        { id: 'sg_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'config_seal_gardien_dmg || 0' }
    ]
  },
  
  // --- SCEAU DE L'AVENTURIER (LIBRE) ---
  {
    id: 'seal_aventurier',
    type: EntityType.ITEM,
    name: "Sceau de l'aventurier",
    categoryId: 'seal',
    subCategory: 'Magique',
    description: "Sceau de voyage ajustable. Configurez vos stats librement.",
    userConfig: { type: 'manual_stats' },
    modifiers: [
        { id: 'sa_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'config_seal_aventurier_vit || 0' },
        { id: 'sa_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'config_seal_aventurier_spd || 0' },
        { id: 'sa_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'config_seal_aventurier_dmg || 0' }
    ]
  },

  // --- SCEAU DU DRAGONNIER (LIBRE) ---
  {
    id: 'seal_dragonnier',
    type: EntityType.ITEM,
    name: 'Sceau du dragonnier',
    categoryId: 'seal',
    subCategory: 'Magique',
    description: "Sceau de puissance ajustable. Configurez vos stats librement.",
    userConfig: { type: 'manual_stats' },
    modifiers: [
        { id: 'sd_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'config_seal_dragonnier_vit || 0' },
        { id: 'sd_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'config_seal_dragonnier_spd || 0' },
        { id: 'sd_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'config_seal_dragonnier_dmg || 0' }
    ]
  },

  // --- SCEAU DE TSARA (LIBRE) ---
  {
    id: 'seal_tsara',
    type: EntityType.ITEM,
    name: 'Sceau de Tsara’stangarheltopek',
    categoryId: 'seal',
    subCategory: 'Maudit',
    description: "Sceau ancestral polyvalent. Configurez vos stats librement.",
    userConfig: { type: 'manual_stats' },
    modifiers: [
        { id: 'st_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'config_seal_tsara_vit || 0' },
        { id: 'st_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'config_seal_tsara_spd || 0' },
        { id: 'st_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'config_seal_tsara_dmg || 0' }
    ]
  },

  // --- SCEAU DE L'OASIS (LIBRE) ---
  {
    id: 'seal_oasis',
    type: EntityType.ITEM,
    name: "Sceau de l'oasis",
    categoryId: 'seal',
    subCategory: 'Magique',
    description: "Source de vie ajustable. Configurez vos stats librement.",
    userConfig: { type: 'manual_stats' },
    modifiers: [
        { id: 'so_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'config_seal_oasis_vit || 0' },
        { id: 'so_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'config_seal_oasis_spd || 0' },
        { id: 'so_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'config_seal_oasis_dmg || 0' }
    ]
  },

  // --- SCEAUX FIXES (Avec indicateur dans le nom) ---
  {
    id: 'seal_estival',
    type: EntityType.ITEM,
    name: 'Sceau estival (+150 Vit)',
    categoryId: 'seal',
    subCategory: 'Magique',
    description: "Un sceau rayonnant. +150 Vitalité.",
    modifiers: [
        { id: 'se_val', type: ModifierType.FLAT, targetStatKey: 'vit', value: '150' }
    ]
  },
  {
    id: 'seal_fidelite',
    type: EntityType.ITEM,
    name: 'Sceau de fidélité (+50 All)',
    categoryId: 'seal',
    subCategory: 'Divin',
    description: "Récompense de loyauté. +50 Toutes Stats.",
    modifiers: [
        { id: 'sf_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50' },
        { id: 'sf_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50' },
        { id: 'sf_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '50' }
    ]
  },

  // --- RECEPTACLE (DEJA LIBRE) ---
  {
    id: 'receptacle_convergence',
    type: EntityType.ITEM,
    name: 'Réceptacle de la Convergence',
    categoryId: 'seal',
    subCategory: 'Magique',
    description: "Un artefact capable de canaliser n'importe quelle énergie. Configurez vos stats librement.",
    userConfig: { type: 'manual_stats' },
    modifiers: [
        { id: 'rc_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: 'config_receptacle_convergence_vit || 0' },
        { id: 'rc_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: 'config_receptacle_convergence_spd || 0' },
        { id: 'rc_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: 'config_receptacle_convergence_dmg || 0' }
    ]
  }
];
