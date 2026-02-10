
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Download, Upload, ToggleRight, ChevronDown, User, Sword, Activity } from 'lucide-react';
import { usePlayerEngine } from '../hooks/usePlayerEngine';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameData } from '../context/GameDataContext';
import { useSelectionSanitizer } from '../hooks/useSelectionSanitizer';
import { usePlayerActions } from '../hooks/usePlayerActions'; 
import { useToastStore } from '../store/useToastStore';
import { useBuilderUI } from '../hooks/useBuilderUI'; 
import { validateImportData } from '../utils/sanitizer';
import { EntityType } from '../types';

// Imported Sub-components
import { ItemPickerModal } from './builder/ItemPickerModal';
import { WeaponForgeModal } from './builder/WeaponForgeModal';
import { CompanionForgeModal } from './builder/CompanionForgeModal';
import { CharacterSheet } from './builder/CharacterSheet';
import { StatusWidget } from './builder/StatusWidget'; 
import { BuilderHeader } from './builder/BuilderHeader';
import { StickyStatsHUD } from './builder/StickyStatsHUD'; // NEW IMPORT

// Section Components
import { IdentityPanel } from './builder/sections/IdentityPanel';
import { CareerPanel } from './builder/sections/CareerPanel';
import { StatusPanel } from './builder/sections/StatusPanel';
import { EquipmentPanel } from './builder/sections/EquipmentPanel';
import { InventoryPanel } from './builder/sections/InventoryPanel';

export default function PlayerBuilder() {
  const { stats, entities, slots, categories } = useGameData();
  const { selection, updateSelection, resetSelection, customItems, setCustomItems, presets, savePreset, loadPreset, deletePreset, setPresets } = usePlayerStore();
  const { addToast } = useToastStore();
  const { handleResetCharacter, equipItem, removeWeapon, setWeaponUpgrade, createCustomItem } = usePlayerActions();

  // --- UI STATE MANAGEMENT ---
  const ui = useBuilderUI();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- SCROLL DETECTION FOR HUD ---
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const handleScroll = () => {
          // Detect scroll past 200px
          setIsScrolled(mainElement.scrollTop > 200);
      };

      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Show HUD if scrolled OR if any major modal is open (to see stats while picking items)
  const isAnyModalOpen = (ui.itemPickerState?.isOpen || ui.isForgeOpen || ui.isCompanionForgeOpen);
  const showStickyHud = isScrolled || isAnyModalOpen;

  // --- ENGINE ---
  const engine = usePlayerEngine({ selection, stats, entities, customItems });
  const { allItems, activeEntities, result, contextForDisplay, activeDescriptions, companionResult, companionDescriptions, factions, allActiveSummons } = engine;

  useSelectionSanitizer(selection, updateSelection, allItems);

  // --- CALCULATE TOTAL GOLD (Moved here to share with HUD) ---
  const totalGoldCost = useMemo(() => {
      return activeEntities
          .filter(e => e.type === EntityType.ITEM)
          .reduce((acc, item) => acc + (item.goldCost || 0), 0);
  }, [activeEntities]);

  // --- UI HANDLERS ---
  const handleResetClick = () => {
      if (ui.toggleResetConfirmation()) {
          handleResetCharacter();
      }
  };

  const onPickerSelect = (itemId: string) => {
      if (!ui.itemPickerState || !ui.itemPickerState.slotId) return;
      equipItem(ui.itemPickerState.slotId, itemId, ui.itemPickerState.targetIndex);
      ui.closePicker();
  };

  const handleExport = () => {
      const safeName = (selection.characterName || 'Vagabond').replace(/[^a-z0-9]/gi, '_');
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `OmniStat_${safeName}_${dateStr}.json`;
      const dataToSave = { meta: { version: "1.0.8", timestamp: Date.now() }, selection, customItems, presets };
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      addToast("Fichier exporté", "success");
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const data = JSON.parse(content);
              const validation = validateImportData(data);
              if (!validation.valid) { addToast(`Erreur : ${validation.error}`, "error"); return; }
              if (data.selection) { resetSelection(); updateSelection(() => data.selection); }
              if (data.customItems) { setCustomItems(data.customItems); }
              if (data.presets) { setPresets(data.presets); }
              addToast("Données chargées", "success");
              ui.setIsSavePanelOpen(false);
          } catch (err) { console.error(err); addToast("Fichier corrompu", "error"); }
      };
      reader.readAsText(file);
      event.target.value = ''; 
  };

  return (
    <div className="p-4 w-full max-w-[1800px] mx-auto pb-32 lg:pb-20 relative">
      
      {/* STICKY HUD (Always on top of modals now) */}
      <StickyStatsHUD result={result} totalGold={totalGoldCost} isVisible={!!showStickyHud} />

      {/* HEADER */}
      <BuilderHeader 
          presets={presets}
          executionTime={result.executionTime}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
          onDeletePreset={deletePreset}
          onOpenSavePanel={() => ui.setIsSavePanelOpen(true)}
          onReset={handleResetClick}
          isResetConfirming={ui.isResetConfirming}
          setIsDebugOpen={ui.setIsDebugOpen}
      />
      
      {/* DRAWER SAVE/LOAD */}
      {ui.isSavePanelOpen && (
          <div className="fixed inset-0 z-[60]" onClick={() => ui.setIsSavePanelOpen(false)}>
              <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-slate-900 border-l border-slate-700 shadow-2xl p-6 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-bold text-white mb-6">Gestion Fichier</h3>
                  <button onClick={handleExport} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold mb-4 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                      <Download size={16} className="mr-2"/> Exporter .JSON
                  </button>
                  <div className="relative group border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".json" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                      <Upload size={24} className="mx-auto mb-2 text-blue-400"/>
                      <span className="text-sm font-bold text-slate-300">Importer .JSON</span>
                  </div>
              </div>
          </div>
      )}
      
      {/* DEBUG */}
      {ui.isDebugOpen && (
          <div className="fixed inset-0 z-[70] bg-black/90 p-8 flex justify-center" onClick={() => ui.setIsDebugOpen(false)}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-4xl overflow-auto" onClick={e => e.stopPropagation()}>
                  <pre className="text-xs font-mono text-green-400">{JSON.stringify(selection, null, 2)}</pre>
              </div>
          </div>
      )}
      
      {/* MODALS */}
      {ui.isForgeOpen && (
          <WeaponForgeModal categories={categories} stats={stats} factions={factions} allItems={allItems} onClose={() => ui.setIsForgeOpen(false)} onSave={(item) => { createCustomItem(item, 'weapon_any'); ui.setIsForgeOpen(false); }}/>
      )}
      {ui.isCompanionForgeOpen && (
          <CompanionForgeModal categories={categories} onClose={() => ui.setIsCompanionForgeOpen(false)} onSave={(item) => { createCustomItem(item, 'custom_companion'); ui.setIsCompanionForgeOpen(false); }} />
      )}
      {ui.itemPickerState && ui.itemPickerState.isOpen && (
          <ItemPickerModal 
              slot={slots.find(s => s.id === ui.itemPickerState!.slotId) || { id: ui.itemPickerState!.slotId!, name: 'Slot' }} 
              categories={categories} 
              allItems={allItems} 
              factions={factions} 
              stats={stats} 
              acceptedCategories={ui.itemPickerState.allowedCats} 
              currentId={ui.itemPickerState.targetIndex !== undefined ? (ui.itemPickerState.slotId === 'weapon_any' ? selection.weaponSlots[ui.itemPickerState.targetIndex] : selection.partitionSlots[ui.itemPickerState.targetIndex]) : selection.equippedItems[ui.itemPickerState.slotId!]} 
              onClose={ui.closePicker} 
              onSelect={onPickerSelect} 
              context={contextForDisplay} 
          />
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`space-y-6 ${ui.activeMobileTab === 'identity' ? 'block' : 'hidden xl:block'}`}>
            <IdentityPanel 
                selection={selection} 
                setSelection={updateSelection} 
                activeEntities={activeEntities}
                allItems={allItems}
                context={contextForDisplay}
                result={result}
            />
            <CareerPanel selection={selection} setSelection={updateSelection} entities={entities} />
        </div>
        <div className={`space-y-6 ${ui.activeMobileTab === 'equipment' ? 'block' : 'hidden xl:block'}`}>
            <EquipmentPanel 
                selection={selection} 
                setSelection={updateSelection} 
                slots={slots} 
                allItems={allItems} 
                stats={stats} 
                context={contextForDisplay} 
                result={result} 
                openItemPicker={ui.openPicker} 
                equipFixedItem={equipItem} 
                setIsForgeOpen={ui.setIsForgeOpen} 
                setIsCompanionForgeOpen={ui.setIsCompanionForgeOpen} 
                removeWeapon={removeWeapon} 
                setWeaponUpgrade={setWeaponUpgrade} 
                removePartition={(idx) => equipItem('partition_any', 'none', idx)} 
                companionResult={companionResult} 
                companionDescriptions={companionDescriptions} 
            />
            <InventoryPanel selection={selection} setSelection={updateSelection} slots={slots} allItems={allItems} context={contextForDisplay} openItemPicker={ui.openPicker} equipFixedItem={equipItem} />
        </div>
        <div className={`space-y-6 ${ui.activeMobileTab === 'stats' ? 'block' : 'hidden xl:block'}`}>
            <CharacterSheet 
                result={result} 
                stats={stats} 
                activeDescriptions={activeDescriptions} 
                activeEntities={activeEntities}
            />
        </div>
      </div>

      {/* STATUS WIDGET */}
      {!ui.isStatusPanelOpen && (
          <StatusWidget 
              selection={selection} 
              activeEntities={activeEntities} 
              onClick={() => ui.setIsStatusPanelOpen(true)} 
          />
      )}

      {/* FLOATING STATUS PANEL DRAWER */}
      <div 
          className={`fixed bottom-[56px] sm:bottom-6 right-0 sm:right-6 z-40 w-full sm:w-[450px] max-h-[75vh] sm:max-h-[85vh] flex flex-col bg-slate-950/95 backdrop-blur-md border-t sm:border border-slate-700 rounded-t-2xl sm:rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.7)] transition-all duration-300 origin-bottom ${
              ui.isStatusPanelOpen 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-[110%] opacity-0 pointer-events-none'
          }`}
      >
          <div 
              className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 rounded-t-xl cursor-pointer hover:bg-slate-900 transition-colors group"
              onClick={() => ui.setIsStatusPanelOpen(false)}
          >
              <div>
                  <h3 className="text-sm font-bold text-white flex items-center group-hover:text-indigo-300 transition-colors">
                      <ToggleRight size={18} className="mr-2 text-indigo-400"/> Gestion des Effets
                  </h3>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                      Factions, Sets, Bonus Situationnels...
                  </div>
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-white transition-colors">
                  Fermer <ChevronDown size={16} className="ml-1" />
              </div>
          </div>
          
          <div className="p-4 overflow-y-auto custom-scrollbar flex-1 pb-4">
              <StatusPanel 
                  selection={selection} 
                  setSelection={updateSelection} 
                  activeEntities={activeEntities} 
                  allItems={allItems} 
                  context={contextForDisplay} 
                  result={result}
                  activeSummons={allActiveSummons} // PASSAGE DE LA LISTE COMBINÉE
              />
          </div>
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-slate-800 flex xl:hidden z-40 pb-safe">
          <button onClick={() => ui.setActiveMobileTab('identity')} className={`flex-1 flex flex-col items-center justify-center py-3 ${ui.activeMobileTab === 'identity' ? 'text-indigo-400 bg-indigo-900/10' : 'text-slate-500'}`}><User size={20} /><span className="text-[10px] font-bold uppercase mt-1">Identité</span></button>
          <button onClick={() => ui.setActiveMobileTab('equipment')} className={`flex-1 flex flex-col items-center justify-center py-3 ${ui.activeMobileTab === 'equipment' ? 'text-amber-400 bg-amber-900/10' : 'text-slate-500'}`}><Sword size={20} /><span className="text-[10px] font-bold uppercase mt-1">Équipement</span></button>
          <button onClick={() => ui.setActiveMobileTab('stats')} className={`flex-1 flex flex-col items-center justify-center py-3 ${ui.activeMobileTab === 'stats' ? 'text-emerald-400 bg-emerald-900/10' : 'text-slate-500'}`}><Activity size={20} /><span className="text-[10px] font-bold uppercase mt-1">Stats</span></button>
      </div>
    </div>
  );
}
