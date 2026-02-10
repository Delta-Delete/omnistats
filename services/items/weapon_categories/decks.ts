
import { Entity, EntityType, ModifierType } from '../../../types';

export const DECKS: Entity[] = [
  {
    id: 'deck_basique', type: EntityType.ITEM, name: 'Deck du Flambeur',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    // Note: Utilisation de (croupier_mult || 1) pour gérer le cas où le joueur n'est pas Croupier
    description: "Arme d'Arlequin.\n♠ Pique: {{30 * ratio_deck_dmg * (croupier_mult || 1)}}\n♣ Trèfle: {{40 * ratio_deck_spd * (croupier_mult || 1)}}\n♦ Carreau: {{25 * ratio_deck_crit * (croupier_mult || 1)}}\n♥ Cœur: {{50 * ratio_deck_vit * (croupier_mult || 1)}}",
    modifiers: [
        { id: 'w_deck_base_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' },
        { id: 'w_deck_spade', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg * (croupier_mult || 1)', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_club', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd * (croupier_mult || 1)', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_heart', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit * (croupier_mult || 1)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_diamond', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * ratio_deck_crit * (croupier_mult || 1)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg * (croupier_mult || 1)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd * (croupier_mult || 1)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit * (croupier_mult || 1)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_c', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * ratio_deck_crit * (croupier_mult || 1)', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
    ]
  },
  {
    id: 'mastodeck', type: EntityType.ITEM, name: 'Mastodeck',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    rarity: 'epic',
    description: "Le Deck ultime. Ses effets varient selon la carte tirée.",
    descriptionBlocks: [
        {
            text: "♣ Trèfle : Vit +{{100 * (croupier_mult || 1)}}%, Dégâts/Vit -{{50 * (croupier_mult || 1)}}%. Peut rediriger 1 attaque/tour sur lui.",
            tag: "active",
            condition: "isToggled('card_club')"
        },
        {
            text: "♠ Pique : Vit +{{200 * (croupier_mult || 1)}}%, Vitesse -{{100 * (croupier_mult || 1)}}%. Redirection auto pendant 2 tours. Contrecoup : {{100 * (croupier_mult || 1)}} Dégâts.",
            tag: "active",
            condition: "isToggled('card_spade')"
        },
        {
            text: "♥ Cœur : Vit -{{50 * (croupier_mult || 1)}}%, Spd +{{50 * (croupier_mult || 1)}}%, Dmg +{{50 * (croupier_mult || 1)}}%.",
            tag: "active",
            condition: "isToggled('card_heart')"
        },
        {
            text: "♦ Carreau : Dmg -{{50 * (croupier_mult || 1)}}%, Vit +{{50 * (croupier_mult || 1)}}%, Spd +{{50 * (croupier_mult || 1)}}%.",
            tag: "active",
            condition: "isToggled('card_diamond')"
        },
        {
            title: "Royal : Mastodonte",
            text: "Invoque le Mastodonte. Sa Vitalité est égale à **4x la Vitalité de base** de l'Arlequin. Il ne possède ni vitesse, ni dégâts. Les alliés sont invulnérables tant qu'il vit.",
            tag: "special_unblockable",
            condition: "isToggled('card_royal')"
        }
    ],
    modifiers: [
        // Base Stats
        { id: 'masto_base_vit', type: ModifierType.FLAT, targetStatKey: 'vit', value: '500' },

        // ♣ Trèfle : Vit +100%, Spd -50%, Dmg -50% (x Multiplier)
        { id: 'masto_cl_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '100 * (croupier_mult || 1)', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        { id: 'masto_cl_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-50 * (croupier_mult || 1)', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        { id: 'masto_cl_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-50 * (croupier_mult || 1)', toggleId: 'card_club', toggleGroup: 'arlequin_card' },

        // ♠ Pique : Vit +200%, Spd -100% (x Multiplier). Contrecoup dans la description.
        { id: 'masto_sp_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '200 * (croupier_mult || 1)', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        { id: 'masto_sp_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-100 * (croupier_mult || 1)', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },

        // ♥ Cœur : Vit -50%, Spd +50%, Dmg +50% (x Multiplier)
        { id: 'masto_he_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-50 * (croupier_mult || 1)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        { id: 'masto_he_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '50 * (croupier_mult || 1)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        { id: 'masto_he_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '50 * (croupier_mult || 1)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },

        // ♦ Carreau : Dmg -50%, Vit +50%, Spd +50% (x Multiplier)
        { id: 'masto_di_d', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-50 * (croupier_mult || 1)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        { id: 'masto_di_v', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '50 * (croupier_mult || 1)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        { id: 'masto_di_s', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '50 * (croupier_mult || 1)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
    ],
    summons: [
        {
            id: 'summ_mastodonte',
            name: 'Mastodonte',
            countValue: '1',
            // Condition : Carte Royale active
            condition: "isToggled('card_royal')",
            stats: {
                // Formule ajustée : 'ratio_deck_vit' contient déjà la base de 1.
                // Donc on ne fait plus (1 + ratio...), mais directement (ratio...)
                vit: '((vit_base || 0) + (summon_flat_bonus || 0)) * (4 * ((ratio_deck_vit || 0) + ((croupier_mult || 1) - 1) + ((weapon_effect_mult || 1) - 1) + (effect_booster || 0)/100 + (summon_mult_bonus || 0)/100))',
                
                // Vitesse : 0
                spd: '0',
                
                // Dégâts : 0
                dmg: '0'
            }
        }
    ]
  }
];
