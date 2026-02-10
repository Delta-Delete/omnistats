
import { useEffect } from 'react';
import { PlayerSelection, Entity } from '../types';

export const useSelectionSanitizer = (
    selection: PlayerSelection, 
    updateSelection: (updater: (prev: PlayerSelection) => PlayerSelection) => void,
    allItems: Entity[]
) => {
    
    // 1. Ensure Starter Seal
    useEffect(() => {
        const STARTER_SEAL_ID = 'seal_vitality_starter';
        if (!selection.sealItems.includes(STARTER_SEAL_ID)) { 
            updateSelection(prev => ({ ...prev, sealItems: [STARTER_SEAL_ID, ...prev.sealItems] }));
        }
    }, [selection.sealItems, updateSelection]);

    // 2. Sync Religion Cult Item
    useEffect(() => {
        const CULT_IDS = ['item_cult_1', 'item_cult_2', 'item_cult_3'];
        const currentSpecial = selection.specialItems || [];
        const rank = selection.sliderValues?.['career_religion_rank'] || 0;
        const isReligion = selection.careerId === 'career_religion';
        
        const targetId = isReligion 
            ? (rank === 2 ? 'item_cult_3' : rank === 1 ? 'item_cult_2' : 'item_cult_1')
            : null;

        const hasTarget = targetId ? currentSpecial.includes(targetId) : true;
        const hasOthers = currentSpecial.some(id => CULT_IDS.includes(id) && id !== targetId);
        
        if ((targetId && !hasTarget) || hasOthers) {
            updateSelection(prev => {
                let newSpecial = prev.specialItems.filter(id => !CULT_IDS.includes(id));
                if (targetId) newSpecial.push(targetId);
                return { ...prev, specialItems: newSpecial };
            });
        }
    }, [selection.careerId, selection.sliderValues, selection.specialItems, updateSelection]);

    // 3. Sync Spelunca Gems (Auto-Equip based on Reputation)
    useEffect(() => {
        const GEM_STD_ID = 'item_gemme_spel_std';
        const GEM_BOUND_ID = 'item_gemme_spel_bound';
        
        const rankId = selection.guildSecondaryRanks?.['guild_crocs_spelunca'];
        const currentSpecial = selection.specialItems || [];

        let targetId: string | null = null;

        if (rankId === 'croc_rep_sympathisant' || rankId === 'croc_rep_allie' || rankId === 'croc_rep_ami') {
            targetId = GEM_STD_ID;
        } else if (rankId === 'croc_rep_fidele') {
            targetId = GEM_BOUND_ID;
        }

        const hasTarget = targetId ? currentSpecial.includes(targetId) : true;
        
        // Check if we have the WRONG gem equipped or no gem when required
        const hasWrong = (targetId === GEM_STD_ID && currentSpecial.includes(GEM_BOUND_ID)) || 
                         (targetId === GEM_BOUND_ID && currentSpecial.includes(GEM_STD_ID)) ||
                         (!targetId && (currentSpecial.includes(GEM_STD_ID) || currentSpecial.includes(GEM_BOUND_ID)));

        if ((targetId && !hasTarget) || hasWrong) {
             updateSelection(prev => {
                // Remove any conflicting gem first
                let newSpecial = prev.specialItems.filter(id => id !== GEM_STD_ID && id !== GEM_BOUND_ID);
                // Add correct gem if needed
                if (targetId) newSpecial.push(targetId);
                return { ...prev, specialItems: newSpecial };
            });
        }
    }, [selection.guildSecondaryRanks, selection.specialItems, updateSelection]);

    // 4. Fix Animiste Companion Slot
    useEffect(() => {
        if (selection.classId === 'animistes' && selection.choiceSlotType === 'companion') {
             updateSelection(prev => ({
                 ...prev,
                 choiceSlotType: 'mount',
                 equippedItems: { ...prev.equippedItems, custom_companion: '' } 
             }));
        }
    }, [selection.classId, selection.choiceSlotType, updateSelection]);

    // 5. Validate Equipped Items (Debounced check could be better, but this is legacy behavior)
    // We only run this if allItems changes or on mount to avoid loops
    useEffect(() => {
        const validItemIds = new Set(allItems.map(i => i.id));
        
        let changed = false;
        const newWeaponSlots = selection.weaponSlots.filter(id => { 
            if (validItemIds.has(id)) return true; 
            changed = true; 
            return false; 
        });
        
        const newEquipped = { ...selection.equippedItems };
        Object.entries(newEquipped).forEach(([slot, id]) => { 
            if (id && !validItemIds.has(id as string)) { 
                delete newEquipped[slot]; 
                changed = true; 
            } 
        });

        if (changed) { 
            updateSelection(prev => ({ ...prev, weaponSlots: newWeaponSlots, equippedItems: newEquipped })); 
        }
    }, [allItems.length, updateSelection]); 
};
