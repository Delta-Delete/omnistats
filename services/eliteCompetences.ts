
import { Entity, EntityType } from '../types';

// Helper pour créer rapidement les placeholders
const createElitePlaceholder = (classId: string, className: string): Entity => ({
    id: `elite_${classId}`,
    type: EntityType.ELITE_COMPETENCE,
    name: `Élite ${className}`,
    parentId: classId,
    description: "Compétence d'élite (En attente de définition).",
    modifiers: []
});

export const ELITE_COMPETENCES: Entity[] = [
    createElitePlaceholder('archers', 'Archers'),
    createElitePlaceholder('assassins', 'Assassins'),
    createElitePlaceholder('guetteurs', 'Guetteurs'),
    createElitePlaceholder('rodeurs', 'Rôdeurs'),
    createElitePlaceholder('voleurs', 'Voleurs'),
    
    createElitePlaceholder('barbares', 'Barbares'),
    createElitePlaceholder('guerriers', 'Guerriers'),
    createElitePlaceholder('maîtresdarmes', "Maîtres d'armes"),
    createElitePlaceholder('paladins', 'Paladins'),
    createElitePlaceholder('protecteurs', 'Protecteurs'),
    
    createElitePlaceholder('animistes', 'Animistes'),
    createElitePlaceholder('ensorceleurs', 'Ensorceleurs'),
    createElitePlaceholder('guerisseurs', 'Guérisseurs'),
    createElitePlaceholder('mages', 'Mages'),
    
    createElitePlaceholder('pugilistes', 'Pugilistes'),
    createElitePlaceholder('arlequins', 'Arlequins'),
    createElitePlaceholder('conjurateurs', 'Conjurateurs'),
    createElitePlaceholder('corrompu', 'Corrompus'),
    createElitePlaceholder('technophiles', 'Technophiles'),
    createElitePlaceholder('virtuoses', 'Virtuoses'),
];
