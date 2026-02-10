
import React, { useMemo } from 'react';
import { PlayerSelection, Entity, EntityType, CalculationResult, ModifierType } from '../types';
import { evaluateFormula } from '../services/engine';

const CUSTOM_PLACED_TOGGLES = [
    'curse_lvl_1', 'curse_lvl_2', 'curse_lvl_3', 
    'vaudou_ritual', 
    'organ_heart', 'organ_lung', 'organ_liver', 
    'pos_mante', 'pos_serpent', 'pos_lievre', 'pos_singe', 
    'toggle_protection_ally', 'toggle_zenitude', 'toggle_lutteur_unarmed',
    'career_card_spade', 'career_card_club', 'career_card_diamond', 'career_card_heart', 'career_card_royal',
    'career_athlete_second_wind',
    'toggle_respirator_active'
];

interface UseStatusLogicProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    activeEntities: Entity[];
    context: any;
}

export const useStatusLogic = ({ selection, setSelection, activeEntities, context }: UseStatusLogicProps) => {
    
    // FACTIONS (IDENTITY)
    const activeFactionsDetails = useMemo(() => {
        return activeEntities.filter(e => e.type === EntityType.FACTION);
    }, [activeEntities]);

    // GUILDS FILTERING
    const activeGuildsWithToggles = useMemo(() => {
        return activeEntities.filter(e => e.type === EntityType.GUILD).filter(guild => {
            const rankId = selection.guildRanks?.[guild.id];
            const rank = guild.guildRanks?.find(r => r.id === rankId);
            const hasPrimaryToggle = rank?.modifiers?.some(m => !!m.toggleId);

            const secRankId = selection.guildSecondaryRanks?.[guild.id];
            const secRank = guild.secondaryGuildRanks?.find(r => r.id === secRankId);
            const hasSecToggle = secRank?.modifiers?.some(m => !!m.toggleId);

            return hasPrimaryToggle || hasSecToggle;
        });
    }, [activeEntities, selection.guildRanks, selection.guildSecondaryRanks]);

    // TOGGLES CONFIGURATION
    const toggleConfig = useMemo(() => {
        const standalone: {id: string, label: string, valueDisplay?: string}[] = [];
        const groups: Record<string, {id: string, label: string, valueDisplay?: string}[]> = {};
        const seenIds = new Set<string>();
        
        activeEntities.forEach(ent => { 
            (ent.modifiers || []).forEach(mod => { 
                if (mod.toggleId && !seenIds.has(mod.toggleId)) { 
                    if (mod.toggleGroup === 'arlequin_card') return; 
                    if (mod.toggleGroup === 'career_artist_deck') return; 
                    if (mod.toggleGroup === 'thanato_organ') return; 
                    if (mod.toggleGroup === 'pugilist_stance') return; 
                    if (CUSTOM_PLACED_TOGGLES.includes(mod.toggleId)) return; 
                    
                    if (mod.toggleId === 'guild_rank_bonus') return;
                    if (mod.toggleId.startsWith('toggle_cc_')) return;
                    if (mod.toggleId.startsWith('toggle_croc_')) return;

                    seenIds.add(mod.toggleId); 
                    
                    // Calcul de la valeur dynamique pour l'affichage
                    let valueDisplay = undefined;
                    try {
                        const val = evaluateFormula(mod.value, context);
                        if (!isNaN(val) && Math.abs(val) > 0) {
                            const isPercent = mod.type === ModifierType.ALT_PERCENT || 
                                              mod.type === ModifierType.PERCENT_ADD || 
                                              mod.type === ModifierType.FINAL_ADDITIVE_PERCENT;
                            const statLabel = mod.targetStatKey.substring(0, 3).toUpperCase();
                            valueDisplay = `${val > 0 ? '+' : ''}${Math.ceil(val)}${isPercent ? '%' : ''} ${statLabel}`;
                        }
                    } catch (e) {}

                    const item = { 
                        id: mod.toggleId, 
                        label: mod.toggleName || mod.toggleId,
                        valueDisplay: valueDisplay
                    }; 

                    if (mod.toggleGroup) { 
                        if (!groups[mod.toggleGroup]) groups[mod.toggleGroup] = []; 
                        groups[mod.toggleGroup].push(item); 
                    } else { standalone.push(item); } 
                } 
            }); 
        });
        return { standalone, groups };
    }, [activeEntities, context]); // Ajout de context aux dépendances pour recalculer les valeurs

    const toggleEffect = (id: string, groupName?: string) => { 
        setSelection(prev => { 
            const newToggles = { ...prev.toggles }; 
            if (groupName) { 
                const wasActive = newToggles[id];
                const groupItems = toggleConfig.groups[groupName] || []; 
                
                groupItems.forEach(item => { 
                    newToggles[item.id] = false; 
                }); 
                
                if (!wasActive) {
                    newToggles[id] = true;
                }
            } else { 
                newToggles[id] = !newToggles[id]; 
            } 
            return { ...prev, toggles: newToggles }; 
        }); 
    };

    return {
        activeFactionsDetails,
        activeGuildsWithToggles,
        toggleConfig,
        toggleEffect
    };
};
