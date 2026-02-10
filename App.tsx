
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PlayerBuilder from './components/PlayerBuilder';
import { AdminPanel } from './components/AdminPanel';
import { MusicPlayer } from './components/MusicPlayer';
import { GameDataProvider, useGameData } from './context/GameDataContext';
import { ToastContainer } from './components/ui/ToastContainer';

const AppContent = () => {
  const { stats, entities, slots, categories, setStats, setEntities, setSlots, setCategories, handleFactoryReset } = useGameData();

  return (
    <Routes>
      <Route 
          path="/" 
          element={<PlayerBuilder />} 
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
  );
};

export default function App() {
  const BACKGROUND_IMAGE_URL = "https://i.postimg.cc/KYPzHWPW/wp9508113-medieval-city-wallpapers.jpg";
  const LOGO_IMAGE_URL = "https://i.postimg.cc/pT7DBTKG/Duralas-Logo3.png";

  return (
    <HashRouter>
      <GameDataProvider>
        <div className="relative h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
          
          <div className="absolute inset-0 z-0">
              {BACKGROUND_IMAGE_URL ? (
                  <img src={BACKGROUND_IMAGE_URL} alt="Background" className="w-full h-full object-cover object-center opacity-40" />
              ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-[#0b0f19]"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/40 pointer-events-none"></div>
          </div>

          {LOGO_IMAGE_URL && (
              <div className="absolute bottom-6 right-6 z-0 pointer-events-none opacity-50 mix-blend-screen">
                  <img src={LOGO_IMAGE_URL} alt="Logo" className="w-32 md:w-48 lg:w-64 h-auto object-contain"/>
              </div>
          )}

          <div className="relative z-10 flex h-full flex-col">
              <main className="flex-1 overflow-auto custom-scrollbar">
                <AppContent />
              </main>
          </div>

          <MusicPlayer />
          <ToastContainer />

        </div>
      </GameDataProvider>
    </HashRouter>
  );
}
