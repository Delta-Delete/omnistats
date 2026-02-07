
import { Entity, EntityType, ModifierType } from '../types';

export const CAREERS: Entity[] = [
    {
        id: 'career_artiste',
        type: EntityType.CAREER,
        name: 'Artiste',
        // Nouvelle URL mise à jour
        imageUrl: 'https://i.servimg.com/u/f36/18/25/55/28/artist10.png', 
        description: "L'art transcende le combat. Choisissez votre inspiration du moment. (Rang progressif : Artiste -> Réputé -> Célèbre).",
        modifiers: [
            // Note: Le rang est stocké dans sliderValues['career_artist_rank'] : 0 (Base), 1 (Réputé), 2 (Célèbre).
            // Formule : Base (5) + (Rank * 2.5) -> 5, 7.5, 10.
            
            // CŒUR (Vit)
            { 
                id: 'ca_heart', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'vit', 
                value: '5 + ((career_artist_rank || 0) * 2.5)', 
                toggleId: 'career_card_heart', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Cœur (Vit)'
            },
            
            // TRÈFLE (Spd)
            { 
                id: 'ca_club', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'spd', 
                value: '5 + ((career_artist_rank || 0) * 2.5)', 
                toggleId: 'career_card_club', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Trèfle (Spd)'
            },
            
            // PIQUE (Dmg)
            { 
                id: 'ca_spade', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'dmg', 
                value: '5 + ((career_artist_rank || 0) * 2.5)', 
                toggleId: 'career_card_spade', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Pique (Dmg)'
            },
            
            // CARREAU (Stats = Vit + Spd + Dmg)
            { 
                id: 'ca_diamond_v', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'vit', 
                value: '5 + ((career_artist_rank || 0) * 2.5)', 
                toggleId: 'career_card_diamond', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Carreau (Vit)'
            },
            { 
                id: 'ca_diamond_s', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'spd', 
                value: '5 + ((career_artist_rank || 0) * 2.5)', 
                toggleId: 'career_card_diamond', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Carreau (Spd)'
            },
            { 
                id: 'ca_diamond_d', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'dmg', 
                value: '5 + ((career_artist_rank || 0) * 2.5)', 
                toggleId: 'career_card_diamond', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Carreau (Dmg)'
            },

            // ROYAL (Stats Double = Vit + Spd + Dmg)
            // Valeur = (5 + Rank*2.5) * 2 -> 10, 15, 20.
            { 
                id: 'ca_royal_v', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'vit', 
                value: '(5 + ((career_artist_rank || 0) * 2.5)) * 2', 
                toggleId: 'career_card_royal', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Royale (Vit)'
            },
            { 
                id: 'ca_royal_s', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'spd', 
                value: '(5 + ((career_artist_rank || 0) * 2.5)) * 2', 
                toggleId: 'career_card_royal', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Royale (Spd)'
            },
            { 
                id: 'ca_royal_d', 
                type: ModifierType.ALT_PERCENT, 
                targetStatKey: 'dmg', 
                value: '(5 + ((career_artist_rank || 0) * 2.5)) * 2', 
                toggleId: 'career_card_royal', 
                toggleGroup: 'career_artist_deck',
                name: 'Inspiration Royale (Dmg)'
            },
        ]
    },
    {
        id: 'career_athlete',
        type: EntityType.CAREER,
        name: 'Athlète',
        imageUrl: 'https://i.servimg.com/u/f36/15/33/58/83/athlzo11.png',
        descriptionBlocks: [
            {
                text: "Un physique sculpté pour l'effort et la résilience.",
                tag: "passive"
            },
            {
                title: "Second Souffle (Actif)",
                text: "La première fois qu'il doit être mis K.O, l'athlète peut jeter un dé – ralliement pendant son tour pour tenter de se relever (Fonctionne après les capacités permettant de se maintenir en vie) dans des combats ou des matchs dans les zones appelées [ARENE].",
                tag: "unblockable",
                // Condition : N'apparaît que si le toggle est actif
                condition: "context.toggles['career_athlete_second_wind']"
            }
        ],
        modifiers: [
            // Dummy modifier pour enregistrer l'état du toggle dans le système.
            // Pas de displayTag pour éviter le "+0 dmg".
            {
                id: 'athlete_second_wind_state',
                type: ModifierType.FLAT,
                targetStatKey: 'dmg', // Stat tampon
                value: '0',
                toggleId: 'career_athlete_second_wind',
                name: 'Second Souffle'
            }
        ]
    },
    {
        id: 'career_adventure',
        type: EntityType.CAREER,
        name: 'Aventure',
        imageUrl: 'https://i.servimg.com/u/f36/15/33/58/83/aventu11.png',
        description: "L'appel de l'inconnu. Explorez le monde et gagnez des bonus régionaux et légendaires.",
        descriptionBlocks: [
            {
                text: "Nécessite le Niveau 5 et une Classe pour être sélectionné.",
                tag: "info"
            },
            {
                title: "Bonus d'Explorateur",
                text: "Augmente vos statistiques de Pendant Régional et Pendant Duralas selon votre renommée.",
                tag: "passive"
            }
        ],
        modifiers: [
            // RANG 0 (Jeune pousse) : +0 / +0
            // RANG 1 (Explorateur) : +5 Regional / +0 Duralas
            // RANG 2 (Aguerri) : +10 Regional / +5 Duralas
            // RANG 3 (Célèbre) : +15 Regional / +10 Duralas
            
            {
                id: 'adv_regional_bonus',
                type: ModifierType.FLAT, // Use FLAT on the specific % stat
                targetStatKey: 'regional_pendant',
                value: 'career_adventure_rank == 1 ? 5 : career_adventure_rank == 2 ? 10 : career_adventure_rank == 3 ? 15 : 0',
                name: 'Bonus Régional'
            },
            {
                id: 'adv_duralas_bonus',
                type: ModifierType.FLAT, // Use FLAT on the specific % stat
                targetStatKey: 'duralas_pendant',
                value: 'career_adventure_rank == 2 ? 5 : career_adventure_rank == 3 ? 10 : 0',
                name: 'Bonus Duralas'
            },
            // STACKS AVENTURE (Vit, Spd, Dmg)
            // Chaque stack donne +5 FLAT
            {
                id: 'adv_stack_vit',
                type: ModifierType.FLAT,
                targetStatKey: 'vit',
                value: '(career_adventure_stacks || 0) * 5',
                name: 'Bonus Aventure (Stack)'
            },
            {
                id: 'adv_stack_spd',
                type: ModifierType.FLAT,
                targetStatKey: 'spd',
                value: '(career_adventure_stacks || 0) * 5',
                name: 'Bonus Aventure (Stack)'
            },
            {
                id: 'adv_stack_dmg',
                type: ModifierType.FLAT,
                targetStatKey: 'dmg',
                value: '(career_adventure_stacks || 0) * 5',
                name: 'Bonus Aventure (Stack)'
            }
        ]
    },
    {
        id: 'career_commerce',
        type: EntityType.CAREER,
        name: 'Commerce',
        imageUrl: 'https://i.servimg.com/u/f36/15/33/58/83/commer11.png', 
        description: "La voie de la richesse. Incompatible avec l'appartenance à une Faction.",
        modifiers: []
    },
    {
        id: 'career_institut',
        type: EntityType.CAREER,
        name: 'Institut de Magie',
        imageUrl: 'https://i.servimg.com/u/f36/15/33/58/83/magie110.png',
        description: "L'élite académique des arcanes. Gravissez les échelons et spécialisez-vous.",
        descriptionBlocks: [
            {
                title: "Professeur d’enchantements",
                text: "Les effets des enchantements sont augmentés de 50%.",
                tag: "passive",
                condition: "career_institut_rank == 1 && career_institut_specialty == 0"
            },
            {
                title: "Professeur de potions",
                text: "Peut utiliser deux potions par tour.",
                tag: "active",
                condition: "career_institut_rank == 1 && career_institut_specialty == 1"
            },
            {
                title: "Professeur de faune",
                text: "Peut équiper un 2e familier si le choix principal est 'Familier'. (Permet d'avoir 2 familiers, mais pas Monture + Familier).",
                tag: "special",
                condition: "career_institut_rank == 1 && career_institut_specialty == 2"
            },
            {
                title: "Professeur de Sciences Occultes",
                text: "Peut relancer le dé d'attaque une fois par combat (Garde le dernier résultat).",
                tag: "active",
                condition: "career_institut_rank == 1 && career_institut_specialty == 3"
            },
            {
                title: "Professeur Voies Arcaniques",
                text: "Peut bloquer une capacité blocable d'un ennemi ciblé.",
                tag: "active",
                condition: "career_institut_rank == 1 && career_institut_specialty == 4"
            },
            {
                title: "Directeur (Chef de maison)",
                text: "Peut lancer, une fois par combat, un dé – mage bonus en plus de ses attaques.",
                tag: "special",
                condition: "career_institut_rank == 2"
            }
        ],
        modifiers: [
            // Specialty 0: Enchantment Boost (+50% to enchantment_mult)
            {
                id: 'inst_enchant_boost',
                type: ModifierType.FLAT,
                targetStatKey: 'enchantment_mult',
                value: '0.5',
                condition: "career_institut_rank == 1 && career_institut_specialty == 0",
                name: "Maîtrise Enchantements"
            }
        ]
    },
    {
        id: 'career_religion',
        type: EntityType.CAREER,
        name: 'Religion',
        imageUrl: 'https://i.servimg.com/u/f36/15/33/58/83/religi11.png',
        description: "La foi guide vos pas. Nécessite le Niveau 10+. Confère un Objet de Culte sacré et non-retirable qui évolue avec votre rang.",
        modifiers: []
    }
];
