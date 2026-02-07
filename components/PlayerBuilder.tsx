
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StatDefinition, Entity, ItemSlot, ItemCategory } from '../types';
import { Settings, BugPlay, X, RefreshCw, AlertTriangle, Save, Download, Upload, FileJson, Bookmark, Plus, Trash2, CheckCircle } from 'lucide-react';
import { usePlayerEngine } from '../hooks/usePlayerEngine';
import { usePlayerStore } from '../store/usePlayerStore'; // IMPORT STORE
import { validateImportData } from '../utils/sanitizer'; // IMPORT SANITIZER

// Imported Sub-components
import { ItemPickerModal } from './builder/ItemPickerModal';
import { WeaponForgeModal } from './builder/WeaponForgeModal';
import { CompanionForgeModal } from './builder/CompanionForgeModal'; // NEW IMPORT
import { CharacterSheet } from './builder/CharacterSheet';

// Section Components
import { IdentityPanel } from './builder/sections/IdentityPanel';
import { ClassMechanicsPanel } from './builder/sections/ClassMechanicsPanel';
import { CareerPanel } from './builder/sections/CareerPanel';
import { StatusPanel } from './builder/sections/StatusPanel';
import { EquipmentPanel } from './builder/sections/EquipmentPanel';
import { InventoryPanel } from './builder/sections/InventoryPanel';

const STARTER_SEAL_ID = 'seal_vitality_starter';

interface Props {
  stats: StatDefinition[];
  entities: Entity[];
  slots: ItemSlot[];
  categories: ItemCategory[];
}

export default function PlayerBuilder({ stats, entities = [], slots = [], categories = [] }: Props) {
  // --- ZUSTAND STORE ---
  const { 
      selection, updateSelection, resetSelection, 
      customItems, addCustomItem, setCustomItems, 
      presets, savePreset, loadPreset, deletePreset, setPresets 
  } = usePlayerStore();

  // --- UI STATE ---
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isCompanionForgeOpen, setIsCompanionForgeOpen] = useState(false); // NEW STATE
  const [itemPickerState, setItemPickerState] = useState<{ isOpen: boolean, slotId: string | null, allowedCats?: string[], targetIndex?: number } | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false); 
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  
  // Save/Load/Presets UI State
  const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ENGINE HOOK ---
  const engine = usePlayerEngine({ selection, stats, entities, customItems });
  const { allItems, activeEntities, result, contextForDisplay, activeDescriptions, companionResult, companionDescriptions, factions } = engine;

  // --- ACTIONS (Store Wrappers) ---
  const handleResetCharacter = () => { 
      if (!isResetConfirming) {
          setIsResetConfirming(true);
          setTimeout(() => setIsResetConfirming(false), 3000); 
      } else {
          resetSelection(); 
          setIsResetConfirming(false);
      }
  };

  const openItemPicker = (slotId: string, acceptedCats?: string[], index?: number) => { 
      setItemPickerState({ isOpen: true, slotId, allowedCats: acceptedCats, targetIndex: index }); 
  };

  const handleItemSelect = (itemId: string) => { 
      if (!itemPickerState || !itemPickerState.slotId) return; 
      const { slotId, targetIndex } = itemPickerState; 
      
      updateSelection(prev => {
          if (slotId === 'weapon_any') { 
              const newWeapons = [...prev.weaponSlots]; 
              if (itemId === 'none') { 
                  if (targetIndex !== undefined) newWeapons.splice(targetIndex, 1); 
              } else { 
                  if (targetIndex !== undefined) newWeapons[targetIndex] = itemId; 
                  else newWeapons.push(itemId); 
              } 
              return { ...prev, weaponSlots: newWeapons }; 
          } else if (slotId === 'partition_any') { 
              const newPartitions = [...prev.partitionSlots]; 
              if (itemId === 'none') { 
                  if (targetIndex !== undefined) newPartitions.splice(targetIndex, 1); 
              } else { 
                  if (targetIndex !== undefined) newPartitions[targetIndex] = itemId; 
                  else newPartitions.push(itemId); 
              } 
              return { ...prev, partitionSlots: newPartitions }; 
          } else { 
              return { ...prev, equippedItems: { ...prev.equippedItems, [slotId]: itemId === 'none' ? '' : itemId } }; 
          }
      });
      setItemPickerState(null); 
  };

  const equipFixedItem = (slotId: string, itemId: string) => { 
      updateSelection(prev => ({ ...prev, equippedItems: { ...prev.equippedItems, [slotId]: itemId === 'none' ? '' : itemId } })); 
  }
  
  const removeWeapon = (index: number) => { 
      updateSelection(prev => { 
          const newSlots = [...prev.weaponSlots]; 
          newSlots.splice(index, 1); 
          const newUpgrades: Record<number, number> = {}; 
          Object.entries(prev.weaponUpgrades || {}).forEach(([k, v]) => { 
              const numKey = parseInt(k, 10); 
              const val = v as number; 
              if (numKey < index) newUpgrades[numKey] = val; 
              else if (numKey > index) newUpgrades[numKey - 1] = val; 
          }); 
          return { ...prev, weaponSlots: newSlots, weaponUpgrades: newUpgrades }; 
      }); 
  };
  
  const setWeaponUpgrade = (index: number, level: number) => { 
      updateSelection(prev => { 
          const newUpgrades = { ...prev.weaponUpgrades }; 
          if (level === 0) delete newUpgrades[index]; 
          else newUpgrades[index] = level; 
          return { ...prev, weaponUpgrades: newUpgrades }; 
      }); 
  }
  
  const removePartition = (index: number) => { 
      updateSelection(prev => { 
          const newSlots = [...prev.partitionSlots]; 
          newSlots.splice(index, 1); 
          return { ...prev, partitionSlots: newSlots }; 
      }); 
  };
  
  const handleCreateCustomWeapon = (newItem: Entity) => { 
      addCustomItem(newItem); 
      if(newItem.slotId === 'weapon_any') { 
          updateSelection(prev => ({ ...prev, weaponSlots: [...prev.weaponSlots, newItem.id] })); 
      } 
      setIsForgeOpen(false); 
  };

  // NEW: Handler for Companion Forge
  const handleCreateCustomCompanion = (newItem: Entity) => {
      addCustomItem(newItem);
      // Auto-equip if slot is empty or replace
      if (newItem.slotId === 'custom_companion') {
          updateSelection(prev => ({ 
              ...prev, 
              // Set the type based on the created item
              choiceSlotType: newItem.categoryId === 'mount' ? 'mount' : 'familiar',
              equippedItems: { ...prev.equippedItems, custom_companion: newItem.id } 
          }));
      }
      setIsCompanionForgeOpen(false);
  };

  // --- EXPORT / IMPORT LOGIC ---
  const handleExport = () => {
      const safeName = (selection.characterName || 'Vagabond').replace(/[^a-z0-9]/gi, '_');
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `OmniStat_${safeName}_${dateStr}.json`;

      const dataToSave = {
          meta: { version: "1.0.7", timestamp: Date.now(), characterName: selection.characterName || "Sans Nom" },
          selection: selection,
          customItems: customItems,
          presets: presets // Included in export
      };

      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const data = JSON.parse(content);

              // SECURITY CHECK
              const validation = validateImportData(data);
              if (!validation.valid) {
                  alert(`Erreur de sécurité : ${validation.error}`);
                  return;
              }

              // Import Main Selection
              if (data.selection) {
                  resetSelection();
                  updateSelection(() => data.selection);
              }
              
              // Import Custom Items (Forge)
              if (data.customItems && Array.isArray(data.customItems)) {
                  setCustomItems(data.customItems);
              }

              // Import Presets (Loadouts)
              if (data.presets && Array.isArray(data.presets)) {
                  setPresets(data.presets);
              }

              alert("Données chargées avec succès (Personnage + Objets + Loadouts) !");
              setIsSavePanelOpen(false);
          } catch (err) {
              console.error(err);
              alert("Erreur: Le fichier semble corrompu ou incompatible.");
          }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset input
  };

  // --- SIDE EFFECTS (State Synchronization Logic) ---
  // Ensure Starter Seal
  useEffect(() => {
    updateSelection(prev => {
        let next = { ...prev };
        let changed = false;
        if (!next.sealItems.includes(STARTER_SEAL_ID)) { next.sealItems = [STARTER_SEAL_ID, ...next.sealItems]; changed = true; }
        return changed ? next : prev;
    });
  }, [entities, updateSelection]);

  // Sync Religion Cult Item
  useEffect(() => {
      const CULT_IDS = ['item_cult_1', 'item_cult_2', 'item_cult_3'];
      updateSelection(prev => {
          const currentSpecial = prev.specialItems || [];
          const rank = prev.sliderValues?.['career_religion_rank'] || 0;
          const isReligion = prev.careerId === 'career_religion';
          
          const targetId = isReligion 
              ? (rank === 2 ? 'item_cult_3' : rank === 1 ? 'item_cult_2' : 'item_cult_1')
              : null;

          const hasTarget = targetId ? currentSpecial.includes(targetId) : true;
          const hasOthers = currentSpecial.some(id => CULT_IDS.includes(id) && id !== targetId);
          
          if (targetId && hasTarget && !hasOthers) return prev;
          if (!targetId && !hasOthers) return prev;

          let newSpecial = currentSpecial.filter(id => !CULT_IDS.includes(id));
          if (targetId) {
              newSpecial.push(targetId);
          }
          return { ...prev, specialItems: newSpecial };
      });
  }, [selection.careerId, selection.sliderValues?.['career_religion_rank'], updateSelection]);

  // Fix Animiste Companion Slot
  useEffect(() => {
      if (selection.classId === 'animistes' && selection.choiceSlotType === 'companion') {
           updateSelection(prev => ({
               ...prev,
               choiceSlotType: 'mount',
               equippedItems: { ...prev.equippedItems, custom_companion: '' } 
           }));
      }
  }, [selection.classId, selection.choiceSlotType, updateSelection]);

  // Validate Equipped Items (Remove deleted items)
  useEffect(() => {
      const validItemIds = new Set(allItems.map(i => i.id));
      let changed = false;
      const newWeaponSlots = selection.weaponSlots.filter(id => { if (validItemIds.has(id)) return true; changed = true; return false; });
      const newEquipped = { ...selection.equippedItems };
      Object.entries(newEquipped).forEach(([slot, id]) => { if (id && !validItemIds.has(id as string)) { delete newEquipped[slot]; changed = true; } });
      if (changed) { updateSelection(prev => ({ ...prev, weaponSlots: newWeaponSlots, equippedItems: newEquipped })); }
  }, [allItems, selection.weaponSlots, selection.equippedItems, updateSelection]);


  return (
    <div className="p-4 w-full max-w-[1800px] mx-auto pb-20 relative">
      <header className="mb-6 flex justify-between items-end">
        <div><h2 className="text-3xl font-bold text-white mb-1">Omnistats - Dùralas</h2><p className="text-slate-400 text-sm">Assemblez votre build et visualisez les stats en temps réel.</p></div>
        <div className="flex items-center space-x-4">
            
            {/* PRESETS DROPDOWN */}
            <div className="relative">
                <button 
                    onClick={() => setIsPresetsOpen(!isPresetsOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                    <Bookmark size={16} />
                    <span className="text-xs font-bold uppercase hidden md:inline">Loadouts</span>
                </button>
                
                {isPresetsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-3 border-b border-slate-800 bg-slate-950">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Nouveau Loadout</div>
                            <div className="flex gap-2">
                                <input 
                                    value={newPresetName} 
                                    onChange={(e) => setNewPresetName(e.target.value)}
                                    placeholder="Nom..." 
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-indigo-500"
                                />
                                <button 
                                    onClick={() => { if(newPresetName) { savePreset(newPresetName); setNewPresetName(''); } }}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded p-1"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {presets.length > 0 ? (
                                presets.map(p => (
                                    <div key={p.id} className="p-3 border-b border-slate-800 last:border-0 hover:bg-slate-800 transition-colors flex justify-between items-center group">
                                        <div className="cursor-pointer flex-1" onClick={() => { loadPreset(p.id); setIsPresetsOpen(false); }}>
                                            <div className="text-sm font-bold text-slate-200">{p.name}</div>
                                            <div className="text-[10px] text-slate-500">{new Date(p.date).toLocaleDateString()}</div>
                                        </div>
                                        <button onClick={() => deletePreset(p.id)} className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-slate-500 italic">Aucun loadout sauvegardé.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* SAVE/LOAD DRAWER BUTTON */}
            <button 
                onClick={() => setIsSavePanelOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/20"
            >
                <Save size={16} />
                <span className="text-xs font-bold uppercase hidden md:inline">Sauvegarder JSON</span>
            </button>

            <button 
                onClick={handleResetCharacter} 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all border ${isResetConfirming ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'text-red-400 hover:text-red-300 hover:bg-red-900/20 border-transparent hover:border-red-900/50'}`}
            >
                {isResetConfirming ? (<><AlertTriangle size={16} /><span className="text-xs font-bold uppercase">Confirmer ?</span></>) : (<><RefreshCw size={16} /><span className="text-xs font-bold uppercase">Reset</span></>)}
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <Link to="/admin" className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors"><Settings size={18} /><span className="text-sm font-bold">Admin</span></Link>
            <div onClick={() => setIsDebugOpen(true)} className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors"><span className="text-slate-400 text-sm uppercase font-bold mr-2">Calculé en</span><span className="text-green-400 font-mono">{result.executionTime.toFixed(2)}ms</span></div>
        </div>
      </header>
      
      {/* DRAWER: SAVE/LOAD */}
      {isSavePanelOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSavePanelOpen(false)}></div>
              <div className="absolute inset-y-0 right-0 max-w-sm w-full flex">
                  <div className="w-full h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                      
                      {/* Drawer Header */}
                      <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                          <h3 className="text-lg font-bold text-white flex items-center">
                              <Save size={20} className="mr-2 text-indigo-400" /> Gestion Fichier
                          </h3>
                          <button onClick={() => setIsSavePanelOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                              <X size={24} />
                          </button>
                      </div>

                      {/* Drawer Content */}
                      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                          
                          {/* Export Section */}
                          <div className="space-y-4">
                              <div className="flex items-center text-emerald-400 font-bold uppercase text-xs tracking-wider mb-2">
                                  <Download size={14} className="mr-2" /> Exporter le Personnage
                              </div>
                              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                  <div className="text-sm text-white font-bold mb-1">{selection.characterName || 'Vagabond Sans Nom'}</div>
                                  <div className="text-xs text-slate-400 mb-4">Niveau {selection.level} • {selection.classId ? entities.find(e => e.id === selection.classId)?.name : 'Sans Classe'}</div>
                                  
                                  <button 
                                      onClick={handleExport}
                                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center"
                                  >
                                      <FileJson size={16} className="mr-2" /> Télécharger .JSON
                                  </button>
                                  <p className="text-[10px] text-slate-500 mt-2 text-center">Inclut l'équipement, les choix, les armes forgées <strong className="text-emerald-400">et les loadouts</strong>.</p>
                              </div>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-slate-800 w-full"></div>

                          {/* Import Section */}
                          <div className="space-y-4">
                              <div className="flex items-center text-blue-400 font-bold uppercase text-xs tracking-wider mb-2">
                                  <Upload size={14} className="mr-2" /> Importer un Personnage
                              </div>
                              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 border-dashed relative group hover:border-blue-500/50 transition-colors">
                                  <input 
                                      type="file" 
                                      ref={fileInputRef}
                                      onChange={handleImportFile}
                                      accept=".json"
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex flex-col items-center justify-center text-center py-4">
                                      <div className="p-3 bg-slate-900 rounded-full mb-3 text-blue-400 group-hover:scale-110 transition-transform">
                                          <Upload size={24} />
                                      </div>
                                      <span className="text-sm font-bold text-slate-300 group-hover:text-white">Cliquez ou glissez un fichier ici</span>
                                      <span className="text-[10px] text-slate-500 mt-1">Format supporté : .json</span>
                                  </div>
                              </div>
                              <div className="flex items-start p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                                  <AlertTriangle size={16} className="text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                  <p className="text-[10px] text-red-300 leading-relaxed">
                                      <span className="font-bold">Attention :</span> L'importation remplacera complètement votre personnage actuel <span className="underline">et vos loadouts</span>.
                                  </p>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div>
      )}
      
      {isDebugOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-8" onClick={() => setIsDebugOpen(false)}><div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-4xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800"><h3 className="text-xl font-bold text-white flex items-center"><BugPlay size={20} className="mr-2 text-indigo-400"/> État du Système (Debug)</h3><button onClick={() => setIsDebugOpen(false)} className="text-slate-500 hover:text-white"><X size={24}/></button></div><div className="flex-1 overflow-auto bg-slate-900 rounded p-4 border border-slate-800"><pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">{JSON.stringify(selection, null, 2)}</pre></div></div></div>)}
      
      {/* MODALS */}
      {isForgeOpen && (<WeaponForgeModal categories={categories} stats={stats} factions={factions} allItems={allItems} onClose={() => setIsForgeOpen(false)} onSave={handleCreateCustomWeapon}/>)}
      {isCompanionForgeOpen && (<CompanionForgeModal onClose={() => setIsCompanionForgeOpen(false)} onSave={handleCreateCustomCompanion} />)}
      {itemPickerState && itemPickerState.isOpen && (<ItemPickerModal slot={itemPickerState.slotId === 'weapon_any' ? { id: 'weapon_any', name: 'Arme' } : itemPickerState.slotId === 'partition_any' ? { id: 'partition_any', name: 'Partition' } : slots.find(s => s.id === itemPickerState.slotId) as ItemSlot} categories={categories} allItems={allItems} factions={factions} stats={stats} acceptedCategories={itemPickerState.allowedCats} currentId={(itemPickerState.slotId === 'weapon_any' && itemPickerState.targetIndex !== undefined) ? selection.weaponSlots[itemPickerState.targetIndex] : (itemPickerState.slotId === 'partition_any' && itemPickerState.targetIndex !== undefined) ? selection.partitionSlots[itemPickerState.targetIndex] : itemPickerState.slotId ? selection.equippedItems[itemPickerState.slotId] : undefined} onClose={() => setItemPickerState(null)} onSelect={handleItemSelect} context={contextForDisplay} />)}

      {/* 3 COLUMNS LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COL 1: IDENTITY & CLASS */}
        <div className="space-y-6">
            <IdentityPanel 
                selection={selection} 
                setSelection={updateSelection} 
                entities={entities} 
            />
            
            <CareerPanel 
                selection={selection} 
                setSelection={updateSelection} 
                entities={entities}
            />
            
            <ClassMechanicsPanel 
                selection={selection} 
                setSelection={updateSelection} 
                entities={entities} 
                activeEntities={activeEntities} 
                allItems={allItems} 
                context={contextForDisplay} 
                result={result}
            />
        </div>

        {/* COL 2: STATUS & EQUIPMENT */}
        <div className="space-y-6">
            <StatusPanel 
                selection={selection} 
                setSelection={updateSelection} 
                activeEntities={activeEntities} 
                allItems={allItems}
                context={contextForDisplay} 
                result={result}
            />

            <EquipmentPanel 
                selection={selection} 
                setSelection={updateSelection} 
                slots={slots} 
                allItems={allItems} 
                stats={stats}
                context={contextForDisplay}
                result={result}
                openItemPicker={openItemPicker}
                equipFixedItem={equipFixedItem}
                setIsForgeOpen={setIsForgeOpen}
                setIsCompanionForgeOpen={setIsCompanionForgeOpen} // Pass new prop
                removeWeapon={removeWeapon}
                setWeaponUpgrade={setWeaponUpgrade}
                removePartition={removePartition}
                companionResult={companionResult}
                companionDescriptions={companionDescriptions}
            />

            <InventoryPanel 
                selection={selection} 
                setSelection={updateSelection} 
                slots={slots} 
                allItems={allItems} 
                context={contextForDisplay}
                openItemPicker={openItemPicker}
                equipFixedItem={equipFixedItem}
            />
        </div>

        {/* COL 3: RESULTS SHEET */}
        <div className="space-y-6">
            <CharacterSheet 
                result={result} 
                stats={stats} 
                activeDescriptions={activeDescriptions} 
            />
        </div>
      </div>
    </div>
  );
}
