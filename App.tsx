
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PlayerBuilder from './components/PlayerBuilder';
import { AdminPanel } from './components/AdminPanel';
import { MusicPlayer } from './components/MusicPlayer'; // IMPORT
import { StatDefinition, Entity, ItemSlot, ItemCategory } from './types';
import { INITIAL_STATS, INITIAL_ENTITIES, ITEM_SLOTS, ITEM_CATEGORIES } from './services/data';

// Helper hook for localStorage persistence with initial data fallback
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

export default function App() {
  // AUDIT FIX: Version bumped to v16 to reload Item Descriptions (Excalibur, etc.)
  const [stats, setStats] = usePersistentState<StatDefinition[]>('omnistat_config_stats_v16', INITIAL_STATS);
  const [entities, setEntities] = usePersistentState<Entity[]>('omnistat_config_entities_v16', INITIAL_ENTITIES);
  const [slots, setSlots] = usePersistentState<ItemSlot[]>('omnistat_config_slots_v16', ITEM_SLOTS);
  const [categories, setCategories] = usePersistentState<ItemCategory[]>('omnistat_config_categories_v16', ITEM_CATEGORIES);

  // Fonction de secours pour réinitialiser les données aux valeurs d'usine (dev mode / hard reset)
  const handleFactoryReset = () => {
      console.log("Factory Reset Triggered");
      setStats(INITIAL_STATS);
      setEntities(INITIAL_ENTITIES);
      setSlots(ITEM_SLOTS);
      setCategories(ITEM_CATEGORIES);
      
      // Clear legacy/config storage
      localStorage.removeItem('omnistat_config_stats_v16');
      localStorage.removeItem('omnistat_config_entities_v16');
      localStorage.removeItem('omnistat_config_slots_v16');
      localStorage.removeItem('omnistat_config_categories_v16');
      
      // Clear Zustand Storage (New)
      localStorage.removeItem('omnistat_storage_v2');
      
      // Reload to apply clean state from blank
      window.location.reload();
  };

  useEffect(() => {
    (window as any).resetOmniStat = handleFactoryReset;
  }, []);

  // --- CONFIGURATION DES IMAGES ---
  const BACKGROUND_IMAGE_URL = "https://i.postimg.cc/KYPzHWPW/wp9508113-medieval-city-wallpapers.jpg";
  const LOGO_IMAGE_URL = "https://i.postimg.cc/pT7DBTKG/Duralas-Logo3.png";

  return (
    <HashRouter>
      <div className="relative h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        
        {/* CALQUE 0 : BACKGROUND & OVERLAY */}
        <div className="absolute inset-0 z-0">
            {BACKGROUND_IMAGE_URL ? (
                <img 
                    src={BACKGROUND_IMAGE_URL} 
                    alt="Background" 
                    className="w-full h-full object-cover object-center opacity-40" 
                />
            ) : (
                // Fallback texture si pas d'image : un dégradé subtil
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-[#0b0f19]"></div>
            )}
            {/* Overlay dégradé pour garantir la lisibilité du texte même sur image claire */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/40 pointer-events-none"></div>
        </div>

        {/* CALQUE 1 : LOGO FIXE (BAS DROITE) */}
        {LOGO_IMAGE_URL && (
            <div className="absolute bottom-6 right-6 z-0 pointer-events-none opacity-50 mix-blend-screen">
                <img 
                    src={LOGO_IMAGE_URL} 
                    alt="Logo" 
                    className="w-32 md:w-48 lg:w-64 h-auto object-contain"
                />
            </div>
        )}

        {/* CALQUE 2 : CONTENU PRINCIPAL (SCROLLABLE) */}
        <div className="relative z-10 flex h-full flex-col">
            <main className="flex-1 overflow-auto custom-scrollbar">
              <Routes>
                <Route 
                    path="/" 
                    element={
                        <PlayerBuilder 
                            stats={stats} 
                            entities={entities} 
                            slots={slots} 
                            categories={categories} 
                        />
                    } 
                />
                <Route 
                    path="/admin" 
                    element={
                        <AdminPanel 
                            stats={stats} setStats={setStats} 
                            entities={entities} setEntities={setEntities}
                            slots={slots} setSlots={setSlots}
                            categories={categories} setCategories={setCategories}
                            onFactoryReset={handleFactoryReset}
                        />
                    } 
                />
              </Routes>
            </main>
        </div>

        {/* CALQUE 3 : MUSIC PLAYER (GLOBAL) */}
        <MusicPlayer />

      </div>
    </HashRouter>
  );
}
