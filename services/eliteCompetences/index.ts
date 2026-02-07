
import { Entity } from '../../types';

import { ARCHER_ELITES } from './archers';
import { ASSASSIN_ELITES } from './assassins';
import { GUETTEUR_ELITES } from './guetteurs';
import { RODEUR_ELITES } from './rodeurs';
import { VOLEUR_ELITES } from './voleurs';
import { BARBARE_ELITES } from './barbares';
import { GUERRIER_ELITES } from './guerriers';
import { MAITRE_ARMES_ELITES } from './maitresdarmes';
import { PALADIN_ELITES } from './paladins';
import { PROTECTEUR_ELITES } from './protecteurs';
import { ANIMISTE_ELITES } from './animistes';
import { ENSORCELEUR_ELITES } from './ensorceleurs';
import { GUERISSEUR_ELITES } from './guerisseurs';
import { MAGE_ELITES } from './mages';
import { PUGILISTE_ELITES } from './pugilistes';
import { ARLEQUIN_ELITES } from './arlequins';
import { CONJURATEUR_ELITES } from './conjurateurs';
import { CORROMPU_ELITES } from './corrompus';
import { TECHNOPHILE_ELITES } from './technophiles';
import { VIRTUOSE_ELITES } from './virtuoses';

export const ELITE_COMPETENCES: Entity[] = [
    ...ARCHER_ELITES,
    ...ASSASSIN_ELITES,
    ...GUETTEUR_ELITES,
    ...RODEUR_ELITES,
    ...VOLEUR_ELITES,
    ...BARBARE_ELITES,
    ...GUERRIER_ELITES,
    ...MAITRE_ARMES_ELITES,
    ...PALADIN_ELITES,
    ...PROTECTEUR_ELITES,
    ...ANIMISTE_ELITES,
    ...ENSORCELEUR_ELITES,
    ...GUERISSEUR_ELITES,
    ...MAGE_ELITES,
    ...PUGILISTE_ELITES,
    ...ARLEQUIN_ELITES,
    ...CONJURATEUR_ELITES,
    ...CORROMPU_ELITES,
    ...TECHNOPHILE_ELITES,
    ...VIRTUOSE_ELITES
];
