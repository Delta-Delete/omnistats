
import { Entity, EntityType, ModifierType } from '../types';

export const GUILDS: Entity[] = [
    {
        id: 'guild_confrerie_corbeau',
        type: EntityType.GUILD,
        name: 'La Confrérie du Corbeau',
        imageUrl: 'https://i.servimg.com/u/f80/19/49/05/36/c2195e10.jpg',
        guildStatus: 'SECRET',
        description: "La Confrérie du Corbeau est une guilde qui aurait été fondée quelque part dans la Perracie.",
        hideInRecap: true, // Lore hidden
        modifiers: [],
        guildRanks: [
            { id: 'cc_ruffian', name: 'Ruffian' },
            { id: 'cc_maitre_fosse', name: 'Maître de la Fosse' },
            { id: 'cc_tolier', name: 'Tôlier / Tôliere' },
            { id: 'cc_espion', name: 'Espion' },
            { id: 'cc_maitre_espion', name: 'Maître espion' },
            { 
                id: 'cc_garde_noir', 
                name: 'Garde Noir',
                modifiers: [
                    { id: 'cc_gn_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '10', toggleId: 'toggle_cc_gn', toggleName: 'Bonus Garde Noir' },
                    { id: 'cc_gn_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '10', toggleId: 'toggle_cc_gn' },
                    { id: 'cc_gn_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '10', toggleId: 'toggle_cc_gn' },
                ]
            },
            { 
                id: 'cc_corneille', 
                name: 'Corneille',
                modifiers: [
                    { id: 'cc_co_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '10', toggleId: 'toggle_cc_co', toggleName: 'Bonus Corneille' },
                    { id: 'cc_co_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '10', toggleId: 'toggle_cc_co' },
                    { id: 'cc_co_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '10', toggleId: 'toggle_cc_co' },
                ]
            },
            { id: 'cc_lame', name: 'La Lame' },
            { id: 'cc_corbeau', name: 'Le Corbeau' },
        ]
    },
    {
        id: 'guild_institut_magie',
        type: EntityType.GUILD,
        name: "L'Institut de Magie",
        imageUrl: 'https://i.postimg.cc/Wb3scR4F/blason10.jpg',
        guildStatus: 'SEMI_OPEN',
        description: "L'Institut de magie est une école où les magiciens peuvent confronter leurs différentes magies, apprendre à s'en servir, et également découvrir des nouvelles facettes de ces mêmes magies.",
        hideInRecap: true, // Lore hidden
        modifiers: [],
        guildRanks: [
            { id: 'im_disciple', name: 'Disciple' },
            { id: 'im_initie', name: 'Initié' },
            { id: 'im_adepte_chef', name: 'Adepte-en-chef' },
            { id: 'im_chef_maison', name: 'Chef de maison' },
            { id: 'im_professeur', name: 'Professeur' },
            { id: 'im_enchanteur_sup', name: 'Enchanteur Suprême' },
        ]
    },
    {
        id: 'guild_dragonniers',
        type: EntityType.GUILD,
        name: "La guilde des Dragonniers",
        imageUrl: 'https://i.servimg.com/u/f56/20/12/86/42/dragon11.png',
        guildStatus: 'OPEN',
        description: "Les Dragonniers sont les représentants d'une guilde qui prône la justice et la paix dans le monde.",
        hideInRecap: true, // Lore hidden
        modifiers: [],
        guildRanks: [
            { 
                id: 'gd_bronze', name: 'Dragonnier de bronze',
                modifiers: [{ id: 'gd_b_bonus', type: ModifierType.FLAT, targetStatKey: 'anti_dragon_phenix', value: '20' }] 
            },
            { 
                id: 'gd_argent', name: 'Dragonnier d\'argent',
                modifiers: [{ id: 'gd_a_bonus', type: ModifierType.FLAT, targetStatKey: 'anti_dragon_phenix', value: '20' }] 
            },
            { 
                id: 'gd_or', name: 'Dragonnier d\'or',
                modifiers: [{ id: 'gd_o_bonus', type: ModifierType.FLAT, targetStatKey: 'anti_dragon_phenix', value: '20' }] 
            },
            { 
                id: 'gd_maitre', name: 'Maître Dragonnier',
                modifiers: [{ id: 'gd_m_bonus', type: ModifierType.FLAT, targetStatKey: 'anti_dragon_phenix', value: '20' }] 
            },
            { 
                id: 'gd_aio', name: 'L\'Aìotœlärh',
                modifiers: [{ id: 'gd_aio_bonus', type: ModifierType.FLAT, targetStatKey: 'anti_dragon_phenix', value: '20' }] 
            },
        ]
    },
    // --- LE CIRQUE DE L'ECLIPSE ---
    {
        id: 'guild_cirque_eclipse',
        type: EntityType.GUILD,
        name: "Le Cirque de l'Eclipse",
        imageUrl: 'https://i.pinimg.com/originals/65/62/a4/6562a4e2b44d7b50c33f2d65c0e3186e.png',
        guildStatus: 'SEMI_OPEN',
        description: "Le Cirque de l'Eclipse connait sa renommé devant grâce à spectacle qui touche les hommes en pleins cœur.",
        hideInRecap: true,
        modifiers: [],
        // BRANCHE ARTISTIQUE (Primary)
        guildRanks: [
            { id: 'ce_art_apprenti', name: 'Artiste - Apprenti(e)' },
            { id: 'ce_art_nouveau', name: 'Artiste - Nouveau/Nouvelle venu(e)' },
            { id: 'ce_art_etoile', name: 'Artiste - Étoile montante' },
            { id: 'ce_art_pensionnaire', name: 'Artiste - Pensionnaire' },
            { id: 'ce_art_tete', name: 'Artiste - Tête d\'affiche' },
        ],
        // BRANCHE PERSONNEL (Secondary)
        secondaryGuildRanks: [
            { id: 'ce_pers_poly', name: 'Personnel - Homme/femme à tout faire' },
            { id: 'ce_pers_accueil', name: 'Personnel - Chargé d\'accueil' },
            { id: 'ce_pers_infirmier', name: 'Personnel - Infirmier/Infirmière' },
            { id: 'ce_pers_recrut', name: 'Personnel - Responsable du recrutement' },
            { id: 'ce_pers_tresorier', name: 'Personnel - Trésorier' },
            { id: 'ce_pers_chef', name: 'Personnel - Chef du triumvirat' },
        ]
    },
    // --- AMANTS DE LA FORTUNE ---
    {
        id: 'guild_amants_fortune',
        type: EntityType.GUILD,
        name: "Amants de la Fortune",
        imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F2img.net%2Fimage.noelshack.com%2Ffichiers%2F2017%2F51%2F2%2F1513699466-dame-etoileeb.png&f=1&nofb=1&ipt=cfc69c1deea85c5b31e235245261eabcfd697e1a5ee785bf29cb357ab828c1e2',
        guildStatus: 'SECRET',
        description: "Ceux qui cherchent la chance et la fortune.",
        hideInRecap: true,
        modifiers: [],
        guildRanks: [
            { id: 'af_dame', name: 'Dame de la Fortune' }
        ]
    },
    // --- LES CROCS DE SPELUNCA ---
    {
        id: 'guild_crocs_spelunca',
        type: EntityType.GUILD,
        name: "Les Crocs de Spelunca",
        imageUrl: 'https://i.ibb.co/LdHLNt6/Blason-2.jpg',
        guildStatus: 'SEMI_OPEN',
        description: "Les Crocs de Spelunca est une guilde locale qui a élu domicile au sein des montagnes de Spélunca.",
        hideInRecap: true,
        modifiers: [],
        // RANGS PRINCIPAUX
        guildRanks: [
            { id: 'croc_recrue', name: 'Recrue' },
            { id: 'croc_chevalier', name: 'Chevalier Speluncien' },
            { id: 'croc_haut_grade', name: 'Haut-Gradé de Spelunca' },
        ],
        // RANGS SECONDAIRES (RÉPUTATION)
        secondaryGuildRanks: [
            { 
                id: 'croc_rep_ennemi', 
                name: 'Réputation : Ennemi des deux couronnes',
                modifiers: [
                    { id: 'croc_malus_1', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-10', toggleId: 'toggle_croc_malus_1', toggleName: 'Malus Ennemi I (-10%)' },
                    { id: 'croc_malus_1s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-10', toggleId: 'toggle_croc_malus_1' },
                    { id: 'croc_malus_1d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-10', toggleId: 'toggle_croc_malus_1' },
                    
                    { id: 'croc_malus_2', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-20', toggleId: 'toggle_croc_malus_2', toggleName: 'Malus Ennemi II (-20%)' },
                    { id: 'croc_malus_2s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-20', toggleId: 'toggle_croc_malus_2' },
                    { id: 'croc_malus_2d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-20', toggleId: 'toggle_croc_malus_2' }
                ]
            },
            { id: 'croc_rep_criminel', name: 'Réputation : Criminel' },
            { id: 'croc_rep_suspect', name: 'Réputation : Suspect' },
            { id: 'croc_rep_neutre', name: 'Réputation : Neutre' },
            { id: 'croc_rep_sympathisant', name: 'Réputation : Sympathisant' }, // Force Gemme +25%
            { id: 'croc_rep_allie', name: 'Réputation : Allié' }, // Force Gemme +25%
            { id: 'croc_rep_ami', name: 'Réputation : Ami' }, // Force Gemme +25%
            { id: 'croc_rep_fidele', name: 'Réputation : Fidèle de la Lune de Sang' }, // Force Gemme +50%
        ]
    },
    // --- OPHIUCHUS ---
    {
        id: 'guild_ophiuchus',
        type: EntityType.GUILD,
        name: "Ophiúchus",
        imageUrl: 'https://i.servimg.com/u/f61/19/16/80/70/blason10.png',
        guildStatus: 'SECRET',
        description: "Fondée par un ancêtre naga dont le nom s’est perdu dans la brume des âges, l'Ophiúchus est institution nobiliaire, respectée autant que redoutée.",
        hideInRecap: true,
        modifiers: [],
        guildRanks: [
            { id: 'oph_ophiuchus', name: "L'Ophiuchus" }
        ]
    }
];
