
import { Entity } from '../../types';
import { HUMAIN_RACIALS } from './humains';
import { ELFE_RACIALS } from './elfes';
import { ABYSSAL_RACIALS } from './abyssals';
import { ENTOMOTHROPE_RACIALS } from './entomothropes';
import { HYBRIDE_RACIALS } from './hybrides';
import { DJOLLFULIN_RACIALS } from './djollfulins';
import { GEANT_RACIALS } from './geants';
import { THERIANTHROPE_RACIALS } from './therianthropes';
import { NAGA_RACIALS } from './nagas';
import { NAIN_RACIALS } from './nains';
import { PEAUVERTE_RACIALS } from './peauvertes';
import { STRYGEBLANC_RACIALS } from './strygesblancs';
import { STRYGENOIR_RACIALS } from './strygesnoirs';
import { VAMPIRE_RACIALS } from './vampires';

export const RACIAL_COMPETENCES: Entity[] = [
    ...HUMAIN_RACIALS,
    ...ELFE_RACIALS,
    ...ABYSSAL_RACIALS,
    ...ENTOMOTHROPE_RACIALS,
    ...HYBRIDE_RACIALS,
    ...DJOLLFULIN_RACIALS,
    ...GEANT_RACIALS,
    ...THERIANTHROPE_RACIALS,
    ...NAGA_RACIALS,
    ...NAIN_RACIALS,
    ...PEAUVERTE_RACIALS,
    ...STRYGEBLANC_RACIALS,
    ...STRYGENOIR_RACIALS,
    ...VAMPIRE_RACIALS
];
