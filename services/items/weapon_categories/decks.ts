
import { Entity, EntityType, ModifierType } from '../../../types';

export const DECKS: Entity[] = [
  {
    id: 'deck_basique', type: EntityType.ITEM, name: 'Deck du Flambeur',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    description: "Arme d'Arlequin.\n♠ Pique: {{w_deck_spade}}\n♣ Trèfle: {{w_deck_club}}\n♦ Carreau: {{w_deck_dia_d}} / {{w_deck_dia_s}} / {{w_deck_dia_v}}\n♥ Cœur: {{w_deck_heart}}",
    modifiers: [
        { id: 'w_deck_base_dmg', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '10' },
        
        // PIQUE (Dmg)
        { id: 'w_deck_spade', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        
        // TRÈFLE (Spd)
        { id: 'w_deck_club', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd', toggleId: 'card_club', toggleGroup: 'arlequin_card' },
        
        // CŒUR (Vit)
        { id: 'w_deck_heart', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        
        // CARREAU (All Stats - Pas de Crit)
        { id: 'w_deck_dia_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_dia_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_dia_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        
        // ROYAL (All Stats + Crit)
        { id: 'w_deck_royal_d', type: ModifierType.FLAT, targetStatKey: 'dmg', value: '30 * ratio_deck_dmg', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_s', type: ModifierType.FLAT, targetStatKey: 'spd', value: '40 * ratio_deck_spd', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_v', type: ModifierType.FLAT, targetStatKey: 'vit', value: '50 * ratio_deck_vit', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
        { id: 'w_deck_royal_c', type: ModifierType.FLAT, targetStatKey: 'crit_primary', value: '25 * ratio_deck_crit', toggleId: 'card_royal', toggleGroup: 'arlequin_card' },
    ]
  },
  {
    id: 'mastodeck', type: EntityType.ITEM, name: 'Mastodeck',
    slotId: 'weapon_any', categoryId: 'weapon', subCategory: 'Decks', equipmentCost: 2,
    rarity: 'epic',
    description: "♠ : L’Arlequin perd 100% de sa vitesse. Sa vitalité est triplée (^^ +{{200 * (ratio_deck_vit + weapon_effect_mult - 1)}}% ^^), et les attaques ennemies sont automatiquement redirigées sur lui durant les deux premiers tours. Les assaillants reçoivent par ailleurs un contrecoup de ^^ {{100 * (ratio_deck_dmg + weapon_effect_mult - 1)}} ^^ dégâts.\n♥ : L’Arlequin perd 50% de sa vitalité, mais sa vitesse et ses dégâts sont augmentés de ^^ +{{50 * (ratio_deck_spd + weapon_effect_mult - 1)}}% ^^ / ^^ +{{50 * (ratio_deck_dmg + weapon_effect_mult - 1)}}% ^^.\n♦ : L’Arlequin perd 50% de ses dégâts, mais sa vitalité et sa vitesse sont augmentées de ^^ +{{50 * (ratio_deck_vit + weapon_effect_mult - 1)}}% ^^ / ^^ +{{50 * (ratio_deck_spd + weapon_effect_mult - 1)}}% ^^.\n★ ROYAL : Invoque le Mastodonte.",
    descriptionBlocks: [
        {
            title: "Mastodonte (Royal)",
            text: "Alliés invulnérables tant qu'il est en vie.\nPV : **{{(((base_vit || 0) * 4) + (summon_flat_bonus || 0)) * (ratio_deck_vit + weapon_effect_mult - 1)}}** / Dmg : 0 / Spd : 0",
            tag: "special_unblockable",
            condition: "context.toggles.card_royal"
        }
    ],
    modifiers: [
        // --- ♠ PIQUE ---
        // Vitesse -100%
        { id: 'masto_s_spd_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '-100', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        // Vitalité +200% (Additive Multipliers: Ratio + WeaponEffect - 1)
        { id: 'masto_s_vit_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '200 * (ratio_deck_vit + weapon_effect_mult - 1)', toggleId: 'card_spade', toggleGroup: 'arlequin_card' },
        
        // --- ♥ COEUR ---
        // Vitalité -50%
        { id: 'masto_h_vit_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '-50', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        // Vitesse +50%
        { id: 'masto_h_spd_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '50 * (ratio_deck_spd + weapon_effect_mult - 1)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },
        // Dégâts +50%
        { id: 'masto_h_dmg_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '50 * (ratio_deck_dmg + weapon_effect_mult - 1)', toggleId: 'card_heart', toggleGroup: 'arlequin_card' },

        // --- ♦ CARREAU ---
        // Dégâts -50%
        { id: 'masto_d_dmg_malus', type: ModifierType.ALT_PERCENT, targetStatKey: 'dmg', value: '-50', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        // Vitalité +50%
        { id: 'masto_d_vit_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'vit', value: '50 * (ratio_deck_vit + weapon_effect_mult - 1)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
        // Vitesse +50%
        { id: 'masto_d_spd_bonus', type: ModifierType.ALT_PERCENT, targetStatKey: 'spd', value: '50 * (ratio_deck_spd + weapon_effect_mult - 1)', toggleId: 'card_diamond', toggleGroup: 'arlequin_card' },
    ],
    summons: [
        {
            id: 'summ_mastodonte',
            name: 'Mastodonte',
            countValue: 'context.toggles.card_royal ? 1 : 0',
            stats: {
                // Formule: ((Base Vit * 4) + Flat Summon) * (Ratio Vit + Weapon Effect - 1)
                vit: '(((base_vit || 0) * 4) + (summon_flat_bonus || 0)) * (ratio_deck_vit + weapon_effect_mult - 1)',
                spd: '0',
                dmg: '0'
            }
        }
    ]
  }
];
