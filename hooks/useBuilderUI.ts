
import { useState, useCallback } from 'react';

export type MobileTab = 'identity' | 'equipment' | 'stats';

export interface ItemPickerState {
    isOpen: boolean;
    slotId: string | null;
    allowedCats?: string[];
    targetIndex?: number;
}

export const useBuilderUI = () => {
    // --- MODALS STATE ---
    const [isForgeOpen, setIsForgeOpen] = useState(false);
    const [isCompanionForgeOpen, setIsCompanionForgeOpen] = useState(false);
    const [itemPickerState, setItemPickerState] = useState<ItemPickerState | null>(null);
    
    // --- PANELS STATE ---
    const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
    const [isStatusPanelOpen, setIsStatusPanelOpen] = useState(false);
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    
    // --- NAVIGATION STATE ---
    const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('identity');
    const [isResetConfirming, setIsResetConfirming] = useState(false);

    // --- ACTIONS ---

    const openPicker = useCallback((slotId: string, acceptedCats?: string[], index?: number) => {
        setItemPickerState({ isOpen: true, slotId, allowedCats: acceptedCats, targetIndex: index });
    }, []);

    const closePicker = useCallback(() => {
        setItemPickerState(null);
    }, []);

    const toggleResetConfirmation = useCallback(() => {
        if (!isResetConfirming) {
            setIsResetConfirming(true);
            setTimeout(() => setIsResetConfirming(false), 3000);
            return false; // Not confirmed yet
        }
        setIsResetConfirming(false);
        return true; // Confirmed
    }, [isResetConfirming]);

    const closeAllSidePanels = useCallback(() => {
        setIsSavePanelOpen(false);
        setIsStatusPanelOpen(false);
        setIsDebugOpen(false);
    }, []);

    return {
        // States
        isForgeOpen, setIsForgeOpen,
        isCompanionForgeOpen, setIsCompanionForgeOpen,
        itemPickerState,
        isSavePanelOpen, setIsSavePanelOpen,
        isStatusPanelOpen, setIsStatusPanelOpen,
        isDebugOpen, setIsDebugOpen,
        activeMobileTab, setActiveMobileTab,
        isResetConfirming,

        // Actions
        openPicker,
        closePicker,
        toggleResetConfirmation,
        closeAllSidePanels
    };
};
