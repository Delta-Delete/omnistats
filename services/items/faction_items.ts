
import { Entity, EntityType, ModifierType } from '../../types';

export const FACTION_ITEMS: Entity[] = [
  // --- CONGRÉGATION DE L'OMBRE (C.O) ---
  {
    id: 'co_hood', 
    type: EntityType.ITEM, 
    name: "Capuche de la C.O",
    slotId: 'head', 
    categoryId: 'armor_head',
    subCategory: 'Panoplie', 
    factionId: 'fac_congregation_ombre',
    setId: 'set_co_standard', // LINKED TO SET
    description: "Une capuche sombre dissimulant le visage. Fait partie du set 'Équipements standards de la C.O'.",
    modifiers: [
      { id: 'co_h_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '115' },
      { id: 'co_h_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '15' }
    ]
  },
  {
    id: 'co_cape', 
    type: EntityType.ITEM, 
    name: "Capes de l'Ombre",
    slotId: 'chest', 
    categoryId: 'armor_chest', 
    subCategory: 'Panoplie',
    factionId: 'fac_congregation_ombre',
    setId: 'set_co_standard', // LINKED TO SET
    description: "Tissu absorbant la lumière. Fait partie du set 'Équipements standards de la C.O'.",
    modifiers: [
      { id: 'co_c_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '140' },
      { id: 'co_c_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '60' }
    ]
  },
  {
    id: 'co_boots', 
    type: EntityType.ITEM, 
    name: "Chausses de l'assassin",
    slotId: 'legs', 
    categoryId: 'armor_legs', 
    subCategory: 'Panoplie',
    factionId: 'fac_congregation_ombre',
    setId: 'set_co_standard', // LINKED TO SET
    description: "Semelles silencieuses. Fait partie du set 'Équipements standards de la C.O'.",
    modifiers: [
      { id: 'co_b_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '95' }
    ]
  },
  {
    id: 'co_poison_vial', 
    type: EntityType.ITEM, 
    name: 'Fioles de poison (C.O)',
    slotId: 'artifact', 
    categoryId: 'special', 
    subCategory: 'Consommable',
    factionId: 'fac_congregation_ombre',
    description: "Un poison virulent. -5 Vitalité par tour. Ne compte pas dans le set C.O.",
    modifiers: [
        {
            id: 'co_poi_dot', type: ModifierType.FLAT, targetStatKey: 'vit', value: '-5',
            isPerTurn: true, name: 'Poison C.O (Base)'
        }
    ]
  },
  
  // --- NOUVEAUX ITEMS C.O (Hégémonie) ---
  {
    id: 'heg_chest',
    type: EntityType.ITEM,
    name: "Galons d'apparat [Panoplie d'Hégémonie]",
    slotId: 'chest',
    categoryId: 'armor_chest',
    subCategory: 'Panoplie', // Changed from Intermédiaire
    factionId: 'fac_congregation_ombre',
    setId: 'set_hegemony', // LINKED TO SET
    description: "Symbole de pouvoir au sein de la Congrégation. Requiert l'appartenance à la faction.",
    modifiers: [
        { 
            id: 'heg_c_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '860',
            condition: "factionId === 'fac_congregation_ombre'"
        },
        { 
            id: 'heg_c_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '235',
            condition: "factionId === 'fac_congregation_ombre'"
        }
    ]
  },
  {
    id: 'heg_head',
    type: EntityType.ITEM,
    name: "Masque sophistiqué [Panoplie d'Hégémonie]",
    slotId: 'head',
    categoryId: 'armor_head',
    subCategory: 'Panoplie', // Changed from Casque
    factionId: 'fac_congregation_ombre',
    setId: 'set_hegemony', // LINKED TO SET
    description: "Masque dissimulant les émotions. Requiert l'appartenance à la faction.",
    modifiers: [
        { 
            id: 'heg_h_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '290',
            condition: "factionId === 'fac_congregation_ombre'"
        }
    ]
  },
  {
    id: 'heg_legs',
    type: EntityType.ITEM,
    name: "Bottes idéales [Panoplie d'Hégémonie]",
    slotId: 'legs',
    categoryId: 'armor_legs',
    subCategory: 'Panoplie', // Changed from Bottes
    factionId: 'fac_congregation_ombre',
    setId: 'set_hegemony', // LINKED TO SET
    description: "Pour une marche impérieuse. Requiert l'appartenance à la faction.",
    modifiers: [
        { 
            id: 'heg_l_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '295',
            condition: "factionId === 'fac_congregation_ombre'"
        }
    ]
  },
  {
    id: 'item_lotus_badge',
    type: EntityType.ITEM,
    name: "Insigne du Lotus",
    slotId: 'artifact', 
    categoryId: 'special',
    subCategory: 'Gadget',
    factionId: 'fac_congregation_ombre',
    // Not part of a set
    description: "Les effets des potions type 'poison' sont augmentés de moitié (50%).",
    modifiers: [
        { 
            id: 'lotus_poison', type: ModifierType.FLAT, targetStatKey: 'poison_boost', value: '50',
            displayTag: 'unblockable'
        }
    ]
  },

  // --- GARDE ROYALE (LES GARDIENS) - SET CAPITAINE ---
  {
    id: 'helm_royal_cap',
    type: EntityType.ITEM,
    name: "Heaume royal [Panoplie du capitaine]",
    slotId: 'head',
    categoryId: 'armor_head',
    subCategory: 'Panoplie',
    factionId: 'fac_les_gardiens',
    setId: 'set_capitaine',
    description: "Heaume orné d'or. Requiert Faction: Les Gardiens.",
    modifiers: [
        { id: 'h_rc_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '300', condition: "factionId === 'fac_les_gardiens'" },
        { id: 'h_rc_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '50', condition: "factionId === 'fac_les_gardiens'" },
        { id: 'h_rc_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50', condition: "factionId === 'fac_les_gardiens'" }
    ]
  },
  {
    id: 'chest_royal_cap',
    type: EntityType.ITEM,
    name: "Plastron de justice [Panoplie du capitaine]",
    slotId: 'chest',
    categoryId: 'armor_chest',
    subCategory: 'Panoplie',
    factionId: 'fac_les_gardiens',
    setId: 'set_capitaine',
    description: "Armure étincelante. Requiert Faction: Les Gardiens.",
    modifiers: [
        { id: 'c_rc_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '1150', condition: "factionId === 'fac_les_gardiens'" },
        { id: 'c_rc_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '25', condition: "factionId === 'fac_les_gardiens'" },
        { id: 'c_rc_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '50', condition: "factionId === 'fac_les_gardiens'" }
    ]
  },
  {
    id: 'boots_royal_cap',
    type: EntityType.ITEM,
    name: "Fers du capitaine [Panoplie du capitaine]",
    slotId: 'legs',
    categoryId: 'armor_legs',
    subCategory: 'Panoplie',
    factionId: 'fac_les_gardiens',
    setId: 'set_capitaine',
    description: "Bottes renforcées. Requiert Faction: Les Gardiens.",
    modifiers: [
        { id: 'l_rc_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '200', condition: "factionId === 'fac_les_gardiens'" }
    ]
  },

  // --- GEMMES SPELUNCIENNES (Crocs de Spelunca) ---
  {
    id: 'item_gemme_spel_1', type: EntityType.ITEM, name: "Gemme Speluncienne (Éclat)",
    categoryId: 'special', subCategory: 'Gemme',
    description: "Une faible lueur émane de cette pierre. +5 Puissance Gemme.",
    modifiers: [{ id: 'gem_sp_1', type: ModifierType.FLAT, targetStatKey: 'gemme_spec', value: '5' }]
  },
  {
    id: 'item_gemme_spel_2', type: EntityType.ITEM, name: "Gemme Speluncienne (Brute)",
    categoryId: 'special', subCategory: 'Gemme',
    description: "Une pierre pulsante. +10 Puissance Gemme.",
    modifiers: [{ id: 'gem_sp_2', type: ModifierType.FLAT, targetStatKey: 'gemme_spec', value: '10' }]
  },
  {
    id: 'item_gemme_spel_3', type: EntityType.ITEM, name: "Gemme Speluncienne (Taillée)",
    categoryId: 'special', subCategory: 'Gemme',
    description: "Une pierre raffinée. +15 Puissance Gemme.",
    modifiers: [{ id: 'gem_sp_3', type: ModifierType.FLAT, targetStatKey: 'gemme_spec', value: '15' }]
  },
  {
    id: 'item_gemme_spel_5', type: EntityType.ITEM, name: "Gemme Speluncienne (Royale)",
    categoryId: 'special', subCategory: 'Gemme',
    description: "Le summum de la cristallisation sanguine. +25 Puissance Gemme.",
    modifiers: [{ id: 'gem_sp_5', type: ModifierType.FLAT, targetStatKey: 'gemme_spec', value: '25' }]
  }
];
