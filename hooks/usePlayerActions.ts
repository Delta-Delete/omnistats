
import { useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useToastStore } from '../store/useToastStore';
import { Entity } from '../types';

export const usePlayerActions = () => {
    const { updateSelection, resetSelection, addCustomItem } = usePlayerStore();
    const { addToast } = useToastStore();

    const handleResetCharacter = useCallback(() => {
        resetSelection();
        addToast("Personnage réinitialisé", "info");
    }, [resetSelection, addToast]);

    const equipItem = useCallback((slotId: string, itemId: string, targetIndex?: number) => {
        updateSelection(prev => {
            // Logic for Weapons (Dynamic Array)
            if (slotId === 'weapon_any') {
                const newWeapons = [...prev.weaponSlots];
                if (itemId === 'none') {
                    if (targetIndex !== undefined) newWeapons.splice(targetIndex, 1);
                } else {
                    if (targetIndex !== undefined) newWeapons[targetIndex] = itemId;
                    else newWeapons.push(itemId);
                }
                return { ...prev, weaponSlots: newWeapons };
            } 
            // Logic for Partitions (Dynamic Array)
            else if (slotId === 'partition_any') {
                const newPartitions = [...prev.partitionSlots];
                if (itemId === 'none') {
                    if (targetIndex !== undefined) newPartitions.splice(targetIndex, 1);
                } else {
                    if (targetIndex !== undefined) newPartitions[targetIndex] = itemId;
                    else newPartitions.push(itemId);
                }
                return { ...prev, partitionSlots: newPartitions };
            } 
            // Logic for Fixed Slots (Map)
            else {
                return { 
                    ...prev, 
                    equippedItems: { ...prev.equippedItems, [slotId]: itemId === 'none' ? '' : itemId } 
                };
            }
        });
        if (itemId !== 'none') addToast("Objet équipé", "success");
    }, [updateSelection, addToast]);

    const removeWeapon = useCallback((index: number) => {
        updateSelection(prev => {
            const newSlots = [...prev.weaponSlots];
            newSlots.splice(index, 1);
            // Re-index upgrades to match new slots
            const newUpgrades: Record<number, number> = {};
            const newUpgradesVit: Record<number, number> = {};
            
            Object.entries(prev.weaponUpgrades || {}).forEach(([k, v]) => {
                const numKey = parseInt(k, 10);
                if (numKey < index) newUpgrades[numKey] = v as number;
                else if (numKey > index) newUpgrades[numKey - 1] = v as number;
            });
            Object.entries(prev.weaponUpgradesVit || {}).forEach(([k, v]) => {
                const numKey = parseInt(k, 10);
                if (numKey < index) newUpgradesVit[numKey] = v as number;
                else if (numKey > index) newUpgradesVit[numKey - 1] = v as number;
            });

            return { ...prev, weaponSlots: newSlots, weaponUpgrades: newUpgrades, weaponUpgradesVit: newUpgradesVit };
        });
        addToast("Arme retirée", "info");
    }, [updateSelection, addToast]);

    const setWeaponUpgrade = useCallback((index: number, level: number, type: 'dmg' | 'vit' = 'dmg') => {
        updateSelection(prev => {
            const key = type === 'dmg' ? 'weaponUpgrades' : 'weaponUpgradesVit';
            const newUpgrades = { ...prev[key] };
            if (level === 0) delete newUpgrades[index];
            else newUpgrades[index] = level;
            return { ...prev, [key]: newUpgrades };
        });
    }, [updateSelection]);

    const createCustomItem = useCallback((newItem: Entity, equipSlot?: string) => {
        addCustomItem(newItem);
        if (equipSlot) {
            if (equipSlot === 'weapon_any') {
                updateSelection(prev => ({ ...prev, weaponSlots: [...prev.weaponSlots, newItem.id] }));
            } else if (equipSlot === 'custom_companion') {
                 updateSelection(prev => ({ 
                    ...prev, 
                    choiceSlotType: newItem.categoryId === 'mount' ? 'mount' : 'familiar',
                    equippedItems: { ...prev.equippedItems, custom_companion: newItem.id } 
                }));
            }
        }
        addToast(`"${newItem.name}" créé et ajouté`, "success");
    }, [addCustomItem, updateSelection, addToast]);

    return {
        handleResetCharacter,
        equipItem,
        removeWeapon,
        setWeaponUpgrade,
        createCustomItem
    };
};
