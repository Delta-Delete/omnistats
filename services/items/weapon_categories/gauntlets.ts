
import { Entity, EntityType, ModifierType } from '../../../types';

export const GAUNTLETS: Entity[] = [
  {
    id: 'gantelet_fer', type: EntityType.ITEM, name: 'Gantelet de Fer',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Gantelets', equipmentCost: 1,
    description: 'Arme secondaire. Augmente l\'absorption.',
    modifiers: [{ id: 'mw_gnt_abs', type: ModifierType.FLAT, targetStatKey: 'absorption', value: '2' }]
  }
];
