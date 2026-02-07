
import { Entity, EntityType, ModifierType } from '../../../types';

export const CAESTUS: Entity[] = [
  {
    id: 'ceste_nero', 
    type: EntityType.ITEM, 
    name: 'Ceste Nεrό',
    slotId: 'weapon_any', 
    categoryId: 'weapon', 
    subCategory: 'Cestes', 
    equipmentCost: 1,
    description: "Arme immergée : Octroie +30 Dégâts et +20 Vitesse par tour (Cumulatif) si dans la région 'Mers & Océans'.",
    modifiers: [
        // Base Stats
        { id: 'w_nero_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '105' },
        { id: 'w_nero_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '-30' },
        
        // Conditional Region Stats (PER TURN)
        { 
            id: 'w_nero_wet_d', 
            type: ModifierType.FLAT, 
            targetStatKey: 'dmg', 
            value: '30', 
            toggleId: 'toggle_rp_ocean', // Unified ID
            toggleName: 'RP : Mers & Océans',
            toggleGroup: 'rp_location', // Unified Group
            isPerTurn: true
        },
        { 
            id: 'w_nero_wet_s', 
            type: ModifierType.FLAT, 
            targetStatKey: 'spd', 
            value: '20', 
            toggleId: 'toggle_rp_ocean',
            toggleGroup: 'rp_location',
            isPerTurn: true
        }
    ]
  }
];
