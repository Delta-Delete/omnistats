
import { Entity } from '../../types';
import { HUMAIN_RACIALS } from './humains';
import { ELFE_RACIALS } from './elfes';
// import { ABYSSAL_RACIALS } from './abyssals'; // Remplacé par OTHER
import { ENTOMOTHROPE_RACIALS } from './entomothropes';
// ... Les fichiers spécifiques vides ont été remplacés par la factory 'others' pour simplifier la maintenance
// On garde ceux qui ont des vraies stats, on utilise OTHER pour les placeholders.

import { OTHER_RACIALS } from './others';

export const RACIAL_COMPETENCES: Entity[] = [
    ...HUMAIN_RACIALS,
    ...ELFE_RACIALS,
    ...ENTOMOTHROPE_RACIALS,
    
    // On injecte toutes les autres races via le générateur générique
    // Cela couvre: Abyssal, Hybride, Djollfulin, Geant, Therian, Naga, Nain, Peauverte, Stryges, Vampire
    ...OTHER_RACIALS
];
