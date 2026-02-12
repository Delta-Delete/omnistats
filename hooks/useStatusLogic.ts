import React, { useMemo } from 'react';
import { PlayerSelection, Entity, EntityType, ModifierType } from '../types';
import { evaluateFormula, checkCondition } from '../services/engine';

// Liste des IDs de toggles qui ont déjà leur propre UI dédiée (ClassMechanics)
// On les exclut de la liste générique pour éviter les doublons visuels.
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
    
    // 1. FACTIONS (IDENTITY)
    const activeFactionsDetails = useMemo(() => {
        return activeEntities.filter(e => e.type === EntityType.FACTION);
    }, [activeEntities]);

    // 2. GUILDS FILTERING (Only showing guilds that have toggleable bonuses active)
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

    // 3. SETS CALCULATION (Pour le Widget HUD & Panel)
    const activeSetsSummary = useMemo(() => {
        const sets: { name: string, count: number, active: boolean, icon?: string }[] = [];
        const setEntities = activeEntities.filter(e => e.type === EntityType.ITEM_SET);
        // Legacy faction sets support
        const factionLegacySets = activeEntities.filter(e => e.type === EntityType.FACTION && e.modifiers && e.modifiers.length > 0);
        
        [...setEntities, ...factionLegacySets].forEach(set => {
            const isLegacy = set.type === EntityType.FACTION;
            // On compte les items équipés correspondant au set
            // Note: On utilise le contexte global pour compter si disponible, sinon filtrage manuel simple
            let count = 0;
            if (context && context.equippedItems) {
                 // Méthode précise utilisant les IDs équipés réels
                 const equippedIds = Object.values(context.equippedItems);
                 if(context.weaponSlots) equippedIds.push(...context.weaponSlots);
                 
                 count = activeEntities.filter(e => 
                     e.type === EntityType.ITEM && 
                     equippedIds.includes(e.id) &&
                     (isLegacy ? e.factionId === set.id : e.setId === set.id)
                 ).length;
            } else {
                 // Fallback
                 count = activeEntities.filter(e => e.type === EntityType.ITEM && (isLegacy ? e.factionId === set.id : e.setId === set.id)).length;
            }
            
            if (count > 0) {
                // Un set est généralement considéré "actif" visuellement s'il a au moins 2 pièces
                const isActive = count >= 2; 
                sets.push({ 
                    name: set.name.replace('Set : ', '').replace('Panoplie ', ''), 
                    count, 
                    active: isActive, 
                    icon: set.imageUrl 
                });
            }
        });
        return sets;
    }, [activeEntities, context]);

    // 4. TOGGLES / BUFFS CONFIGURATION
    const toggleConfig = useMemo(() => {
        const standalone: {id: string, label: string, valueDisplay?: string}[] = [];
        const groups: Record<string, {id: string, label: string, valueDisplay?: string}[]> = {};
        const seenIds = new Set<string>();
        
        // Liste plate pour le Widget (uniquement les actifs)
        const activeBuffsList: { id: string, label: string, active: boolean }[] = [];
        let availableToggleCount = 0;

        activeEntities.forEach(ent => { 
            (ent.modifiers || []).forEach(mod => { 
                if (mod.toggleId && !seenIds.has(mod.toggleId)) { 
                    // FILTER CUSTOM PLACED TOGGLES (Class Mechanics Panels)
                    if (mod.toggleGroup === 'arlequin_card') return; 
                    if (mod.toggleGroup === 'career_artist_deck') return; 
                    if (mod.toggleGroup === 'thanato_organ') return; 
                    if (mod.toggleGroup === 'pugilist_stance') return; 
                    if (mod.toggleGroup === 'tarolex_royal') return;
                    if (CUSTOM_PLACED_TOGGLES.includes(mod.toggleId)) return; 
                    
                    if (mod.toggleId === 'guild_rank_bonus') return;
                    if (mod.toggleId.startsWith('toggle_cc_')) return; // Géré dans le panneau de guilde spécifiquement
                    if (mod.toggleId.startsWith('toggle_croc_')) return;

                    // IMPORTANT: Check Condition before showing toggle in the list
                    if (mod.condition && !checkCondition(mod.condition, context)) {
                        return;
                    }

                    seenIds.add(mod.toggleId); 
                    availableToggleCount++;
                    
                    // Calcul de la valeur dynamique pour l'affichage ("+10% Dmg")
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

                    const label = mod.toggleName || mod.toggleId;
                    const cleanLabel = label.replace('Posture ', '').replace('Inspiration ', '');

                    const item = { 
                        id: mod.toggleId, 
                        label: label,
                        valueDisplay: valueDisplay
                    }; 

                    // Construction Data Structure pour StatusPanel (Groupé)
                    if (mod.toggleGroup) { 
                        if (!groups[mod.toggleGroup]) groups[mod.toggleGroup] = []; 
                        groups[mod.toggleGroup].push(item); 
                    } else { 
                        standalone.push(item); 
                    } 

                    // Construction Data Structure pour StatusWidget (Plat et Actif uniquement)
                    if (selection.toggles[mod.toggleId]) {
                        activeBuffsList.push({ id: mod.toggleId, label: cleanLabel, active: true });
                    }
                } 
            }); 
        });

        // Add Virtual Buffs from Sliders (Legacy support for Widget display)
        if ((selection.sliderValues?.['rage_stacks'] || 0) > 0) {
             activeBuffsList.push({ id: 'rage', label: `Rage x${selection.sliderValues!['rage_stacks']}`, active: true });
             availableToggleCount++;
        }
        if ((selection.sliderValues?.['sans_peur_stacks'] || 0) > 0) {
             activeBuffsList.push({ id: 'peur', label: `Sans Peur x${selection.sliderValues!['sans_peur_stacks']}`, active: true });
             availableToggleCount++;
        }
        if ((selection.sliderValues?.['colere_vive_stacks'] || 0) > 0) {
             activeBuffsList.push({ id: 'colere', label: `Colère x${selection.sliderValues!['colere_vive_stacks']}`, active: true });
             availableToggleCount++;
        }

        return { 
            standalone, 
            groups, 
            activeBuffsList,
            availableToggleCount 
        };
    }, [activeEntities, context, selection.toggles, selection.sliderValues]);

    const toggleEffect = (id: string, groupName?: string) => { 
        setSelection(prev => { 
            const newToggles = { ...prev.toggles }; 
            if (groupName) { 
                const wasActive = newToggles[id];
                const groupItems = toggleConfig.groups[groupName] || []; 
                
                // Disable all others in group
                groupItems.forEach(item => { 
                    newToggles[item.id] = false; 
                }); 
                
                // Toggle current (if it was active, it becomes inactive, essentially untoggling the group)
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
        toggleConfig, // Pour le Panel complet
        widgetData: { // Pour le Widget HUD
            sets: activeSetsSummary,
            buffs: toggleConfig.activeBuffsList,
            availableToggleCount: toggleConfig.availableToggleCount,
            guilds: activeEntities.filter(e => e.type === EntityType.GUILD),
            faction: activeFactionsDetails[0]
        },
        toggleEffect
    };
};