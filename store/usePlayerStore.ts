
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerSelection, Entity, ItemConfigValues } from '../types';

// État par défaut
const DEFAULT_SELECTION: PlayerSelection = {
  characterName: '',
  level: 0,
  equippedItems: {},
  weaponSlots: [],
  weaponUpgrades: {},
  weaponUpgradesVit: {}, // NEW: Vitality upgrades
  partitionSlots: [],
  bonusItems: [],
  sealItems: ['seal_vitality_starter'], // Mandatory Starter Item
  specialItems: [],
  itemConfigs: {}, 
  companionItemConfigs: {}, // NEW: Companion specific configs
  toggles: {},
  companionToggles: {}, // NEW: Companion specific toggles
  sliderValues: {}, // CLEANED
  naturalStrengthAllocation: [],
  eliteCompetenceActive: false,
  racialCompetenceActive: false,
  guildRanks: {},
  guildSecondaryRanks: {},
  guildManualBonuses: {}, // CLEANED: Removed explicit zeros
  guildIds: []
};

interface Preset {
    id: string;
    name: string;
    date: number;
    selection: PlayerSelection;
}

// Type compatible avec React.Dispatch<React.SetStateAction<T>>
type SelectionUpdater = PlayerSelection | ((prev: PlayerSelection) => PlayerSelection);

interface PlayerState {
    // Data
    selection: PlayerSelection;
    customItems: Entity[];
    presets: Preset[];

    // Actions (Selection)
    setSelection: (selection: PlayerSelection) => void;
    // UpdateSelection signature matches React's setState to avoid refactoring all children
    updateSelection: (updater: SelectionUpdater) => void;
    
    // Targeted updates
    updateItemConfig: (itemId: string, key: keyof ItemConfigValues, value: number | string) => void;
    updateCompanionItemConfig: (itemId: string, key: keyof ItemConfigValues, value: number | string) => void;

    resetSelection: () => void;

    // Actions (Custom Items)
    addCustomItem: (item: Entity) => void;
    setCustomItems: (items: Entity[]) => void;

    // Actions (Presets)
    savePreset: (name: string) => void;
    loadPreset: (id: string) => void;
    deletePreset: (id: string) => void;
    setPresets: (presets: Preset[]) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            selection: DEFAULT_SELECTION,
            customItems: [],
            presets: [],

            setSelection: (selection) => set({ selection }),
            
            updateSelection: (updater) => set((state) => {
                const newSelection = typeof updater === 'function'
                    ? (updater as (prev: PlayerSelection) => PlayerSelection)(state.selection)
                    : updater;
                return { selection: newSelection };
            }),

            updateItemConfig: (itemId, key, value) => set((state) => {
                const currentConfig = state.selection.itemConfigs?.[itemId] || {};
                return {
                    selection: {
                        ...state.selection,
                        itemConfigs: {
                            ...(state.selection.itemConfigs || {}),
                            [itemId]: { ...currentConfig, [key]: value }
                        }
                    }
                };
            }),

            updateCompanionItemConfig: (itemId, key, value) => set((state) => {
                const currentConfig = state.selection.companionItemConfigs?.[itemId] || {};
                return {
                    selection: {
                        ...state.selection,
                        companionItemConfigs: {
                            ...(state.selection.companionItemConfigs || {}),
                            [itemId]: { ...currentConfig, [key]: value }
                        }
                    }
                };
            }),

            resetSelection: () => set({ selection: DEFAULT_SELECTION }),

            addCustomItem: (item) => set((state) => ({ 
                customItems: [...state.customItems, item] 
            })),

            setCustomItems: (items) => set({ customItems: items }),

            savePreset: (name) => set((state) => {
                const newPreset: Preset = {
                    id: `preset_${Date.now()}`,
                    name: name || `Loadout ${state.presets.length + 1}`,
                    date: Date.now(),
                    selection: JSON.parse(JSON.stringify(state.selection)) // Deep copy to detach ref
                };
                return { presets: [...state.presets, newPreset] };
            }),

            loadPreset: (id) => set((state) => {
                const preset = state.presets.find(p => p.id === id);
                if (preset) {
                    return { selection: JSON.parse(JSON.stringify(preset.selection)) };
                }
                return {};
            }),

            deletePreset: (id) => set((state) => ({
                presets: state.presets.filter(p => p.id !== id)
            })),

            setPresets: (presets) => set({ presets }),
        }),
        {
            name: 'omnistat_storage_v2', 
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                selection: state.selection, 
                customItems: state.customItems,
                presets: state.presets
            }), 
        }
    )
);
