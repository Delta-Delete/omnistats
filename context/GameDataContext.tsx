
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatDefinition, Entity, ItemSlot, ItemCategory } from '../types';
import { INITIAL_STATS, INITIAL_ENTITIES, ITEM_SLOTS, ITEM_CATEGORIES } from '../services/data';

interface GameDataContextType {
  stats: StatDefinition[];
  setStats: React.Dispatch<React.SetStateAction<StatDefinition[]>>;
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  slots: ItemSlot[];
  setSlots: React.Dispatch<React.SetStateAction<ItemSlot[]>>;
  categories: ItemCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ItemCategory[]>>;
  handleFactoryReset: () => void;
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined);

// Helper for localStorage persistence
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(`Error loading ${key} from localStorage`, e);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn(`Error saving ${key} to localStorage`, e);
    }
  }, [key, state]);

  return [state, setState];
}

export const GameDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // VERSION BUMP TO v17 TO FORCE REFRESH OF DEFINITIONS
  const [stats, setStats] = usePersistentState<StatDefinition[]>('omnistat_config_stats_v17', INITIAL_STATS);
  const [entities, setEntities] = usePersistentState<Entity[]>('omnistat_config_entities_v17', INITIAL_ENTITIES);
  const [slots, setSlots] = usePersistentState<ItemSlot[]>('omnistat_config_slots_v17', ITEM_SLOTS);
  const [categories, setCategories] = usePersistentState<ItemCategory[]>('omnistat_config_categories_v17', ITEM_CATEGORIES);

  const handleFactoryReset = () => {
      console.log("Factory Reset Triggered");
      setStats(INITIAL_STATS);
      setEntities(INITIAL_ENTITIES);
      setSlots(ITEM_SLOTS);
      setCategories(ITEM_CATEGORIES);
      
      // Cleanup old keys
      localStorage.removeItem('omnistat_config_stats_v16');
      localStorage.removeItem('omnistat_config_entities_v16');
      localStorage.removeItem('omnistat_config_slots_v16');
      localStorage.removeItem('omnistat_config_categories_v16');
      
      localStorage.removeItem('omnistat_config_stats_v17');
      localStorage.removeItem('omnistat_config_entities_v17');
      localStorage.removeItem('omnistat_config_slots_v17');
      localStorage.removeItem('omnistat_config_categories_v17');
      localStorage.removeItem('omnistat_storage_v2');
      
      window.location.reload();
  };

  return (
    <GameDataContext.Provider value={{ 
      stats, setStats, 
      entities, setEntities, 
      slots, setSlots, 
      categories, setCategories,
      handleFactoryReset 
    }}>
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (context === undefined) {
    throw new Error('useGameData must be used within a GameDataProvider');
  }
  return context;
};
