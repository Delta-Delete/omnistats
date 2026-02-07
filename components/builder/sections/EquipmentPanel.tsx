
import React, { useEffect } from 'react';
import { Shield, Check, Sword, Hammer, Plus, Music, Dog, Car, Zap, User, X } from 'lucide-react';
import { PlayerSelection, Entity, ItemSlot, StatDefinition, StatResult, CalculationResult, EntityType } from '../../../types';
import { SlotSelector } from '../SlotSelector';
import { evaluateFormula } from '../../../services/engine';
import { toFantasyTitle } from '../utils';

interface EquipmentPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    slots: ItemSlot[];
    allItems: Entity[];
    stats: StatDefinition[];
    context: any;
    result: CalculationResult;
    // Handlers
    openItemPicker: (slotId: string, acceptedCats?: string[], index?: number) => void;
    equipFixedItem: (slotId: string, itemId: string) => void;
    setIsForgeOpen: (isOpen: boolean) => void;
    setIsCompanionForgeOpen: (isOpen: boolean) => void; // NEW PROP
    removeWeapon: (index: number) => void;
    setWeaponUpgrade: (index: number, level: number) => void;
    removePartition: (index: number) => void;
    companionResult: CalculationResult | null;
    companionDescriptions: any[];
}

export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ 
    selection, setSelection, slots, allItems, context, result,
    openItemPicker, equipFixedItem, setIsForgeOpen, setIsCompanionForgeOpen, removeWeapon, setWeaponUpgrade, removePartition,
    companionResult, companionDescriptions
}) => {
    // Derived values
    const reduceHeavyWeaponCost = ((result.stats['reduce_heavy_weapon_cost'] as StatResult | undefined)?.finalValue || 0) > 0;
    const weaponCap = (result.stats['weapon_cap'] as StatResult | undefined)?.finalValue || 2; 
    const currentWeaponPoints = selection.weaponSlots.reduce((acc, id) => { 
        const item = allItems.find(i => i.id === id); 
        let cost = item?.equipmentCost || 0; 
        if (cost === 2 && reduceHeavyWeaponCost) cost = 1; 
        return acc + cost; 
    }, 0);
    const isOverWeaponLimit = currentWeaponPoints > weaponCap;
    const partitionCap = (result.stats['partition_cap'] as StatResult | undefined)?.finalValue || 0;
    
    // Weapon Category Helper
    const allowedWeaponCategories = React.useMemo(() => { 
        const restrictedMagicClasses = ['animistes', 'ensorceleurs', 'guerisseurs', 'mages']; 
        if (selection.classId === 'archers') return ['Arcs', 'Arbalètes', 'Frondes']; 
        if (restrictedMagicClasses.includes(selection.classId || '')) return ['Sceptres', 'Épées', 'Tonfas', 'Dagues', 'Fouets', 'Boucliers', 'Boucliers technologiques']; 
        if (selection.classId === 'pugilistes') return ['Griffes', 'Cestes', 'Tonfas', 'Bâtons d’éther']; 
        if (selection.classId === 'virtuoses') return ['Instrument (Vent)', 'Instrument (Corde)', 'Instrument (Percussion)', 'Instrument (Multi-type)'];
        if (selection.classId === 'technophiles') return ['Armes technologiques', 'Boucliers technologiques'];
        return ['weapon']; 
    }, [selection.classId]);

    // Companion Stats
    const companionScale = ((result.stats['companion_scale'] as StatResult | undefined)?.finalValue) ?? 50; 
    const companionRatio = Number(companionScale) / 100;
    const getPreFinal = (res: CalculationResult | null, key: string) => {
        if (!res || !res.stats[key]) return 0;
        const bd = res.stats[key].breakdown;
        return (bd.base + bd.flat) * (1 + (bd.percentAdd / 100));
    };
    const companionStats = { 
        vit: Math.ceil((getPreFinal(companionResult, 'vit')) * companionRatio), 
        spd: Math.ceil((getPreFinal(companionResult, 'spd')) * companionRatio), 
        dmg: Math.ceil((getPreFinal(companionResult, 'dmg')) * companionRatio), 
        aura: Math.ceil((getPreFinal(companionResult, 'aura')) * companionRatio), 
        res: Math.ceil((getPreFinal(companionResult, 'res')) * companionRatio) 
    };

    // Logic for Institut de Magie - Professor of Fauna & Flora
    // Rank 1 (Prof) && Specialty 2 (Fauna)
    const isProfFauna = selection.careerId === 'career_institut' && 
                        selection.sliderValues?.['career_institut_rank'] === 1 && 
                        selection.sliderValues?.['career_institut_specialty'] === 2;

    // Determine if the secondary slot is available
    // Rule: Must be Prof Fauna AND must have selected 'familiar' as the primary type
    const showSecondFamiliarSlot = isProfFauna && selection.choiceSlotType === 'familiar';

    // Cleanup Effect: If slot becomes unavailable but has an item, remove it
    useEffect(() => {
        if (!showSecondFamiliarSlot && selection.equippedItems['custom_familiar_2']) {
            setSelection(prev => {
                const newEquipped = { ...prev.equippedItems };
                delete newEquipped['custom_familiar_2'];
                return { ...prev, equippedItems: newEquipped };
            });
        }
    }, [showSecondFamiliarSlot, selection.equippedItems, setSelection]);

    // Helper for Vit Upgrades
    const setWeaponUpgradeVit = (index: number, level: number) => {
        setSelection(prev => {
            const newUpgrades = { ...prev.weaponUpgradesVit };
            if (level === 0) delete newUpgrades[index];
            else newUpgrades[index] = level;
            return { ...prev, weaponUpgradesVit: newUpgrades };
        });
    };

    return (
        <div className="space-y-6 mt-6">
            {/* ARMOR SECTION */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide">
                    <Shield size={20} className="mr-2" /> {toFantasyTitle("Armure")}
                </h4>
                <div className="flex flex-col gap-3 mt-3">
                    {[{ main: 'head', bonus: 'head_bonus', label: '+50 Vitalité' }, { main: 'chest', bonus: 'chest_bonus', label: '+50 Vitalité' }, { main: 'legs', bonus: 'legs_bonus', label: '+50 Vitesse' }].map(pair => { 
                        const mainSlot = slots.find(s => s.id === pair.main); 
                        const upgradeMap: Record<string, string> = { 'head_bonus': 'opt_head_vit', 'chest_bonus': 'opt_chest_vit', 'legs_bonus': 'opt_legs_spd' };
                        const upgradeItemId = upgradeMap[pair.bonus]; 
                        if (!mainSlot) return null; 
                        
                        const isUpgraded = selection.equippedItems[pair.bonus] === upgradeItemId; 
                        const isAlleviated = pair.main === 'chest' && selection.naturalStrengthAllocation?.includes('chest');

                        return (
                            <div key={pair.main} className="flex gap-2">
                                <div className="flex-1 min-w-0">
                                    <SlotSelector 
                                        slot={mainSlot} 
                                        allItems={allItems} 
                                        selectedItemId={selection.equippedItems[mainSlot.id]} 
                                        onOpenPicker={() => openItemPicker(mainSlot.id, mainSlot.acceptedCategories)} 
                                        onClear={() => equipFixedItem(mainSlot.id, 'none')} 
                                        playerContext={context} 
                                        isAlleviated={isAlleviated}
                                    />
                                </div>
                                {upgradeItemId && (
                                    <button 
                                        className={`w-[130px] flex-shrink-0 h-[56px] flex flex-col justify-center px-3 rounded-lg border transition-all duration-300 relative group overflow-hidden text-left ${
                                            isUpgraded 
                                            ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                                            : 'bg-slate-900 border-slate-600 hover:border-slate-500'
                                        }`} 
                                        onClick={() => equipFixedItem(pair.bonus, isUpgraded ? 'none' : upgradeItemId)}
                                        title={isUpgraded ? "Désactiver l'amélioration" : "Activer l'amélioration"}
                                    >
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className={`text-[9px] uppercase font-bold tracking-wider ${isUpgraded ? 'text-indigo-400' : 'text-slate-500'}`}>
                                                Option
                                            </span>
                                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${isUpgraded ? 'bg-indigo-500 border-indigo-400' : 'bg-slate-950 border-slate-700'}`}>
                                                {isUpgraded && <Check size={8} className="text-white" strokeWidth={4} />}
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-mono font-bold truncate ${isUpgraded ? 'text-white' : 'text-slate-600'}`}>
                                            {pair.label}
                                        </span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* WEAPONS SECTION */}
            <div className={`bg-slate-900 border p-5 rounded-xl transition-colors ${isOverWeaponLimit ? 'border-red-500/50 bg-red-900/10' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide"><Sword size={20} className="mr-2" /> {toFantasyTitle("Armes")}</h4>
                  <div className="flex items-center space-x-2">
                      <button onClick={() => setIsForgeOpen(true)} className="flex items-center text-[10px] bg-amber-700 hover:bg-amber-600 text-white px-2 py-1 rounded transition-colors shadow-sm"><Hammer size={10} className="mr-1" />Forge Perso</button>
                      <div className={`text-xs font-mono px-2 py-1 rounded ${isOverWeaponLimit ? 'bg-red-500 text-white' : 'bg-slate-800 text-green-400'}`}>{currentWeaponPoints} / {weaponCap} pts</div>
                  </div>
              </div>
              <div className="space-y-4 mb-3">
                  {selection.weaponSlots.map((wId, idx) => { 
                      const pseudoSlot: ItemSlot = { id: 'weapon_any', name: `Arme ${idx + 1}` }; 
                      const currentWeapon = allItems.find(i => i.id === wId);
                      
                      const currentUpgradeDmg = Number(selection.weaponUpgrades?.[idx] || 0);
                      const currentUpgradeVit = Number(selection.weaponUpgradesVit?.[idx] || 0);
                      
                      let bonusColorDmg = "text-rose-400";
                      let displayUpgradeLabelDmg = "DMG";
                      
                      // Exceptions ring/gantelet logic maintained for display consistency
                      if (currentWeapon) {
                          if (currentWeapon.subCategory === 'Anneaux') { bonusColorDmg = "text-emerald-400"; displayUpgradeLabelDmg = "HP"; }
                          else if (currentWeapon.subCategory === 'Gantelets') { bonusColorDmg = "text-blue-300"; displayUpgradeLabelDmg = "ABS"; }
                      }

                      let effectiveCost = currentWeapon?.equipmentCost;
                      if (effectiveCost === 2 && reduceHeavyWeaponCost) effectiveCost = 1;
                      
                      const isAlleviated = selection.naturalStrengthAllocation?.includes(`weapon_${idx}`);

                      return (
                          <div key={idx} className="flex flex-col bg-slate-900/50 p-2 rounded border border-slate-800/50 relative">
                              <SlotSelector 
                                slot={pseudoSlot} 
                                allItems={allItems} 
                                selectedItemId={wId} 
                                onOpenPicker={() => openItemPicker('weapon_any', allowedWeaponCategories, idx)} 
                                onClear={() => removeWeapon(idx)} 
                                effectiveCost={effectiveCost} 
                                playerContext={context} 
                                isAlleviated={isAlleviated}
                                upgradeLevel={currentUpgradeDmg} // Used for visual calc in SlotSelector
                                upgradeLevelVit={currentUpgradeVit} // NEW: Passed to SlotSelector
                               />
                              
                              {/* UPGRADE BUTTONS */}
                              {wId && (
                                  <div className="mt-2 space-y-1">
                                      {/* DMG UPGRADE ROW */}
                                      <div className="flex items-center space-x-2 p-1 bg-slate-950 border border-slate-800 rounded">
                                          <div className="text-[9px] uppercase font-bold text-slate-500 w-16 flex-shrink-0 truncate" title="Amélioration Dégâts">Forge Dmg</div>
                                          <div className="flex-1 flex space-x-1">
                                              {[1, 2, 3].map(lvl => { 
                                                  const active = currentUpgradeDmg >= lvl; 
                                                  const specific = currentUpgradeDmg === lvl; 
                                                  return (
                                                      <button key={lvl} onClick={() => setWeaponUpgrade(idx, specific ? lvl - 1 : lvl)} className={`flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-all duration-200 ${active ? 'bg-amber-600/20 border-amber-600 text-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.2)]' : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-slate-500 hover:text-slate-400'}`}>
                                                          {lvl === 1 ? 'I' : lvl === 2 ? 'II' : 'III'}
                                                      </button>
                                                  ); 
                                              })}
                                          </div>
                                          {currentUpgradeDmg > 0 && (
                                              <div className={`text-[9px] font-mono font-bold ${bonusColorDmg} ml-2 min-w-[50px] text-right`}>
                                                  {currentWeapon?.subCategory === 'Gantelets' ? `+${currentUpgradeDmg * 2}%` : `+${currentUpgradeDmg * 50}`} {displayUpgradeLabelDmg}
                                              </div>
                                          )}
                                      </div>

                                      {/* VIT UPGRADE ROW (NEW) */}
                                      <div className="flex items-center space-x-2 p-1 bg-slate-950 border border-slate-800 rounded">
                                          <div className="text-[9px] uppercase font-bold text-slate-500 w-16 flex-shrink-0 truncate" title="Amélioration Vitalité">Forge Vie</div>
                                          <div className="flex-1 flex space-x-1">
                                              {[1, 2, 3].map(lvl => { 
                                                  const active = currentUpgradeVit >= lvl; 
                                                  const specific = currentUpgradeVit === lvl; 
                                                  return (
                                                      <button key={lvl} onClick={() => setWeaponUpgradeVit(idx, specific ? lvl - 1 : lvl)} className={`flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-all duration-200 ${active ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-slate-500 hover:text-slate-400'}`}>
                                                          {lvl === 1 ? 'I' : lvl === 2 ? 'II' : 'III'}
                                                      </button>
                                                  ); 
                                              })}
                                          </div>
                                          {currentUpgradeVit > 0 && (
                                              <div className={`text-[9px] font-mono font-bold text-emerald-400 ml-2 min-w-[50px] text-right`}>
                                                  +{currentUpgradeVit * 50} VIT
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              )}
                          </div>
                      ); 
                  })}
                  <button 
                    onClick={() => openItemPicker('weapon_any', allowedWeaponCategories)} 
                    className="w-full flex items-center justify-center p-3 rounded border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-500 hover:text-white text-slate-500 transition-all text-xs uppercase font-bold"
                  >
                    <Plus size={14} className="mr-2" /> Ajouter une Arme
                  </button>
              </div>
            </div>

            {/* PARTITIONS */}
            {partitionCap > 0 && (
                <div className="bg-slate-900 border border-fuchsia-900/30 p-5 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-perrigord text-fuchsia-300 flex items-center tracking-wide"><Music size={20} className="mr-2" /> {toFantasyTitle("Pupitre")}</h4>
                        <div className="text-xs bg-fuchsia-900/20 text-fuchsia-300 px-2 py-1 rounded font-mono">{selection.partitionSlots.slice(0, partitionCap).filter(Boolean).length} / {partitionCap}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: partitionCap }).map((_, idx) => { 
                            const pId = selection.partitionSlots[idx]; 
                            const pseudoSlot: ItemSlot = { id: 'partition_any', name: `Partition ${idx + 1}` }; 
                            return (<SlotSelector key={idx} slot={pseudoSlot} allItems={allItems} selectedItemId={pId} onOpenPicker={() => openItemPicker('partition_any', ['partition'], idx)} onClear={() => removePartition(idx)} playerContext={context} />); 
                        })}
                    </div>
                </div>
            )}

            {/* COMPANION */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl border-l-4 border-l-indigo-500">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide">
                        <Dog size={20} className="mr-2" /> {toFantasyTitle("Compagnon de Route")}
                    </h4>
                    
                    <div className="flex items-center gap-2">
                        {selection.choiceSlotType !== 'companion' && (
                            <button 
                                onClick={() => setIsCompanionForgeOpen(true)} 
                                className="flex items-center text-[9px] bg-indigo-700 hover:bg-indigo-600 text-white px-2 py-1 rounded transition-colors shadow-sm"
                            >
                                <Plus size={10} className="mr-1" /> Créer Perso
                            </button>
                        )}
                        {selection.choiceSlotType === 'companion' && (
                            <div className="bg-slate-950 px-2 py-1 rounded border border-slate-700 text-[10px] flex items-center">
                                <span className="text-slate-500 mr-1 uppercase font-bold">Échelle</span>
                                <span className={`font-mono font-bold ${companionScale > 50 ? 'text-green-400' : companionScale < 50 ? 'text-red-400' : 'text-slate-200'}`}>
                                    {companionScale}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Radio Selection - Flexible for Prof Fauna now */}
                <div className="flex space-x-4 mb-3">
                    {[{ id: 'mount', label: 'Monture', icon: Car }, { id: 'familiar', label: 'Familier', icon: Zap }, { id: 'companion', label: 'Compagnon', icon: User }].map(type => {
                        if (selection.classId === 'animistes' && type.id === 'companion') return null;
                        return (
                            <label key={type.id} className={`flex items-center space-x-1 cursor-pointer text-xs ${selection.choiceSlotType === type.id ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                                <input type="radio" name="choiceSlot" checked={selection.choiceSlotType === type.id} onChange={() => { const newEquipped = { ...selection.equippedItems }; delete newEquipped['custom_companion']; setSelection({ ...selection, choiceSlotType: type.id, equippedItems: newEquipped }); }} className="accent-indigo-500" />
                                <span>{type.label}</span>
                            </label>
                        );
                    })}
                </div>

                {/* Primary Companion Slot */}
                {selection.choiceSlotType !== 'companion' && (
                    <SlotSelector 
                        slot={{ id: 'custom_companion', name: isProfFauna ? 'Slot Principal' : 'Selection', acceptedCategories: [selection.choiceSlotType || 'mount'] }} 
                        allItems={allItems} 
                        selectedItemId={selection.equippedItems['custom_companion']} 
                        onOpenPicker={() => openItemPicker('custom_companion', [selection.choiceSlotType || 'mount'])} 
                        onClear={() => equipFixedItem('custom_companion', 'none')} 
                        playerContext={context} 
                    />
                )}

                {/* Secondary Familiar Slot (Only for Prof Fauna + Familiar Selected) */}
                {showSecondFamiliarSlot && (
                    <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/50 p-2 rounded animate-in fade-in slide-in-from-top-2">
                        <div className="text-[10px] text-purple-400 mb-2 flex items-center font-bold uppercase tracking-wider">
                            <Zap size={10} className="mr-1"/> Bonus Professeur : 2nd Familier
                        </div>
                        <SlotSelector 
                            slot={{ id: 'custom_familiar_2', name: 'Familier Secondaire', acceptedCategories: ['familiar'] }} 
                            allItems={allItems} 
                            selectedItemId={selection.equippedItems['custom_familiar_2']} 
                            onOpenPicker={() => openItemPicker('custom_familiar_2', ['familiar'])} 
                            onClear={() => equipFixedItem('custom_familiar_2', 'none')} 
                            playerContext={context} 
                        />
                    </div>
                )}

                {/* Companion Stat Block (Only for Humanoid Companion mode) */}
                {selection.choiceSlotType === 'companion' && (
                    <div className="mt-3 bg-slate-950/50 p-3 rounded border border-slate-800 relative overflow-hidden group">
                        <div className="flex justify-center gap-4 mb-3 text-[9px] border-b border-slate-800 pb-2"><div className="text-emerald-400 flex items-center" title="Inclus: Race, Classe, Armes, Armures, Sceaux, Artefacts"><Check size={10} className="mr-1"/> Inclus</div><div className="text-red-400/70 flex items-center" title="Exclus: Spécialisation, Enchantements, Faction (hors Armes/Armures)"><X size={10} className="mr-1"/> Exclus</div></div>
                        <div className="grid grid-cols-5 gap-2 text-center mb-3 border-b border-slate-800/50 pb-3">{[{ label: 'Vit', val: companionStats.vit, color: 'text-emerald-400' }, { label: 'Spd', val: companionStats.spd, color: 'text-amber-400' }, { label: 'Dmg', val: companionStats.dmg, color: 'text-rose-400' }, { label: 'Aura', val: companionStats.aura, color: 'text-cyan-300' }, { label: 'Res', val: companionStats.res, color: 'text-blue-300' }].map(s => (<div key={s.label} className="flex flex-col"><span className="text-[9px] text-slate-500 uppercase">{s.label}</span><span className={`text-xs font-mono font-bold ${s.color}`}>{s.val}</span></div>))}</div>
                        {companionDescriptions && companionDescriptions.length > 0 && (<div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Effets Copiés (Ajustés)</div>{companionDescriptions.map(desc => (<div key={desc.id} className="text-[10px] text-slate-300 leading-tight pl-2 border-l border-slate-700"><span className="font-bold text-slate-400">{desc.name}:</span> <span className="italic opacity-80">{desc.description}</span></div>))}</div>)}
                    </div>
                )}
            </div>
        </div>
    );
};
