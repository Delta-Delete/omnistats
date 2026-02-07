
import { Entity } from '../../types';

import { STANDARD_CHESTS } from './armor_categories/standard_chests';
import { STANDARD_HELMETS } from './armor_categories/standard_helmets';
import { STANDARD_BOOTS } from './armor_categories/standard_boots';
import { ARMOR_OPTIONS } from './armor_categories/options';

import { ARLEQUIN_ARMORS } from './armor_categories/class_arlequin';
import { CORROMPU_ARMORS } from './armor_categories/class_corrompu';
import { TECHNOPHILE_ARMORS } from './armor_categories/class_technophile';
import { PALADIN_ARMORS } from './armor_categories/class_paladin';

export const ARMORS: Entity[] = [
  ...STANDARD_CHESTS,
  ...STANDARD_HELMETS,
  ...STANDARD_BOOTS,
  ...ARMOR_OPTIONS,
  ...ARLEQUIN_ARMORS,
  ...CORROMPU_ARMORS,
  ...TECHNOPHILE_ARMORS,
  ...PALADIN_ARMORS
];
