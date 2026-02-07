
import { Entity, EntityType, ModifierType } from '../../../types';

export const DECKS: Entity[] = [
  {
    id: 'deck_basique', type: EntityType.ITEM, name: 'Deck du Flambeur',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    description: "Arme d'Arlequin.\n♠ Pique: {{w_deck_spade}}\n♣ Trèfle: {{w_deck_club}}\n♦ Carreau: {{w_deck_diamond}}\n♥ Cœur: {{w_deck_heart}}",
    modifiers: [
        { id: 'w_deck_base_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' },
        { id: 'w_deck_spade', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_club', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_heart', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_diamond', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * ratio_deck_crit', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_c', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * ratio_deck_crit', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
    ]
  }
];
