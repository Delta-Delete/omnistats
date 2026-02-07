
import { Entity } from '../types';
import { RACES } from './races';
import { CLASSES_AND_SPECS } from './classes';
import { ITEMS } from './items/index';
import { OTHERS } from './others';
import { ELITE_COMPETENCES } from './eliteCompetences/index';
import { RACIAL_COMPETENCES } from './racialCompetences/index';
import { CAREERS } from './careers';
import { GUILDS } from './guilds';

// On ré-exporte tout depuis le fichier de configuration
export * from './configuration';

export const INITIAL_ENTITIES: Entity[] = [
    ...RACES,
    ...CLASSES_AND_SPECS,
    ...ITEMS,
    ...OTHERS,
    ...ELITE_COMPETENCES,
    ...RACIAL_COMPETENCES,
    ...CAREERS,
    ...GUILDS
];
