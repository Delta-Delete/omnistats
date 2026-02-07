
import { Entity } from '../../types';
import { WEAPONS } from './weapons';
import { ARMORS } from './armors';
import { MAGIC_ITEMS } from './magic';
import { CULT_ITEMS } from './cult';
import { FACTION_ITEMS } from './faction_items';
import { CONFIGURABLE_SEALS } from './seals'; // Import Seals
import { MISC_ITEMS } from './misc'; // Import Misc

export const ITEMS: Entity[] = [
  ...WEAPONS,
  ...ARMORS,
  ...MAGIC_ITEMS,
  ...CULT_ITEMS,
  ...FACTION_ITEMS,
  ...CONFIGURABLE_SEALS,
  ...MISC_ITEMS
];
