
import { Entity, EntityType } from '../../types';

export const ENTOMOTHROPE_RACIALS: Entity[] = [
    {
        id: 'racial_entomothrope',
        type: EntityType.RACIAL_COMPETENCE,
        name: 'Tétrachire',
        parentId: 'entomothrope',
        description: "A partir du niveau 20 (2000 d'expérience), l'entomothrope peut porter, si sa classe lui permet, 1 arme à une main bonus parmi les armes standards (hors bâton et arme spéciale, bouclier inclus). L'arme bonus portée peut être une arme à deux mains (non-fusionnée) si la compétence racial est débloquée.",
        modifiers: []
    }
];
