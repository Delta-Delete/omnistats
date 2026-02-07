
import { Entity } from '../types';
import { FURTIVES } from './classes/furtives';
import { AVENTURIERES } from './classes/aventurieres';
import { MAGIQUES } from './classes/magiques';
import { SPECIALES } from './classes/speciales';

export const CLASSES_AND_SPECS: Entity[] = [
    ...FURTIVES,
    ...AVENTURIERES,
    ...MAGIQUES,
    ...SPECIALES
];
