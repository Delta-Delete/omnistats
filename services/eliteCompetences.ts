
import { Entity, EntityType, ModifierType } from '../types';

export const ELITE_COMPETENCES: Entity[] = [
    // Exemple Template (Commenté)
    /*
    {
        id: 'elite_guerrier_fureur',
        type: EntityType.ELITE_COMPETENCE,
        name: 'Fureur Sanguinaire',
        parentId: 'guerriers', // ID de la classe parente
        description: "Double les dégâts mais réduit l'armure de 50%.",
        modifiers: [
            { id: 'ec_g_dmg', type: ModifierType.PERCENT_ADD, targetStatKey: 'dmg', value: '100' },
            { id: 'ec_g_arm', type: ModifierType.PERCENT_ADD, targetStatKey: 'armor', value: '-50' }
        ]
    }
    */
];
