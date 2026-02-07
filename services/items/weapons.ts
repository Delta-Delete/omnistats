
import { Entity } from '../../types';

import { INSTRUMENTS } from './weapon_categories/instruments';
import { DECKS } from './weapon_categories/decks';
import { DAGGERS } from './weapon_categories/daggers';
import { BOWS } from './weapon_categories/bows';
import { SPEARS } from './weapon_categories/spears';
import { CROSSBOWS } from './weapon_categories/crossbows';
import { CHAINS } from './weapon_categories/chains';
import { SLINGS } from './weapon_categories/slings';
import { CAESTUS } from './weapon_categories/caestus';
import { TECH_WEAPONS } from './weapon_categories/tech';
import { SWORDS } from './weapon_categories/swords';
import { AXES } from './weapon_categories/axes';
import { BLUNT } from './weapon_categories/blunt';
import { SHIELDS } from './weapon_categories/shields';
import { TECH_SHIELDS } from './weapon_categories/tech_shields';
import { CLAWS } from './weapon_categories/claws';
import { SCYTHES } from './weapon_categories/scythes';
import { WHIPS } from './weapon_categories/whips';
import { FLAILS } from './weapon_categories/flails';
import { TONFAS } from './weapon_categories/tonfas';
import { ETHER_STAVES } from './weapon_categories/ether_staves';
import { SCEPTRES } from './weapon_categories/sceptres';
import { GAUNTLETS } from './weapon_categories/gauntlets';
import { RINGS } from './weapon_categories/rings';
import { SACRED_WEAPONS } from './weapon_categories/sacred';

export const WEAPONS: Entity[] = [
    ...INSTRUMENTS,
    ...DECKS,
    ...DAGGERS,
    ...BOWS,
    ...SPEARS,
    ...CROSSBOWS,
    ...CHAINS,
    ...SLINGS,
    ...CAESTUS,
    ...TECH_WEAPONS,
    ...SWORDS,
    ...AXES,
    ...BLUNT,
    ...SHIELDS,
    ...TECH_SHIELDS,
    ...CLAWS,
    ...SCYTHES,
    ...WHIPS,
    ...FLAILS,
    ...TONFAS,
    ...ETHER_STAVES,
    ...SCEPTRES,
    ...GAUNTLETS,
    ...RINGS,
    ...SACRED_WEAPONS
];
