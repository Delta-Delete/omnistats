
import { Entity, EntityType, ModifierType } from '../../../types';

export const STANDARD_BOOTS: Entity[] = [
  {
    id: 'boots_sept_lieues',
    type: EntityType.ITEM,
    name: "Bottes de sept lieues",
    slotId: 'legs',
    categoryId: 'armor_legs',
    subCategory: 'Bottes',
    modifiers: [
        { id: 'b_7l_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '144' }
    ]
  },
  {
    id: 'boots_essence_invocatoire',
    type: EntityType.ITEM,
    name: "Chausses d'essence invocatoire",
    slotId: 'legs',
    categoryId: 'armor_legs',
    subCategory: 'Panoplie',
    rarity: 'exotic',
    setId: 'set_essence_invocatoire',
    description: "**Exotique**. Pièce du set 'Essence invocatoire'. +20 Spd.",
    modifiers: [
      { id: 'b_ess_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '20' }
    ]
  },
  {
    id: 'boots_cuir', type: EntityType.ITEM, name: 'Bottes en Cuir',
    slotId: 'legs', categoryId: 'armor_legs', subCategory: 'Bottes',
    modifiers: [{ id: 'b_cuir_spd', type: ModifierType.FLAT, targetStatKey: 'spd', value: '10' }]
  }
];
