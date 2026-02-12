
import React from 'react';
import { Sword, Hammer, Plus, Grip, Music } from 'lucide-react';
import { Entity, ItemSlot, PlayerSelection, CalculationResult, StatResult } from '../../../types';
import { SlotSelector } from '../../builder/SlotSelector';
import { toFantasyTitle } from '../../builder/utils';
import { CollapsibleCard } from '../../ui/Card';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { ItemConfigControl } from '../inventory/ItemConfigControl';
import { SecretCardConfigurator, TarolexRoyalControls } from './SpecialItemUI';

interface WeaponsSectionProps {
    selection: PlayerSelection;
    allItems: Entity[];
    context: any;
    result: CalculationResult;
    openItemPicker: (slotId: string, acceptedCats?: string[], index?: number) => void;
    equipFixedItem: (slotId: string, itemId: string) => void;
    setIsForgeOpen: (isOpen: boolean) => void;
    removeWeapon: (index: number) => void;
    setWeaponUpgrade: (index: number, level: number) => void;
    setWeaponUpgradeVit: (index: number, level: number) => void;
    removePartition: (index: number) => void;
}

export const WeaponsSection: React.FC<WeaponsSectionProps> = ({
    selection, allItems, context, result,
    openItemPicker, equipFixedItem, setIsForgeOpen, removeWeapon, setWeaponUpgrade, setWeaponUpgradeVit, removePartition
}) => {
    const { updateItemConfig } = usePlayerStore();
    
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

    // Allowed Categories Calculation
    const allowedWeaponCategories = React.useMemo(() => { 
        const restrictedMagicClasses = ['animistes', 'ensorceleurs', 'guerisseurs', 'mages']; 
        
        // --- ARLEQUINS : Decks Only ---
        if (selection.classId === 'arlequins') return ['Decks'];
        
        if (selection.classId === 'archers') return ['Arcs', 'Arbalètes', 'Frondes']; 
        if (restrictedMagicClasses.includes(selection.classId || '')) return ['Sceptres', 'Épées', 'Tonfas', 'Dagues', 'Fouets', 'Boucliers', 'Boucliers technologiques']; 
        if (selection.classId === 'pugilistes') return ['Griffes', 'Cestes', 'Tonfas', 'Bâtons d’éther']; 
        if (selection.classId === 'virtuoses') return ['Instrument (Vent)', 'Instrument (Corde)', 'Instrument (Percussion)', 'Instrument (Multi-type)'];
        if (selection.classId === 'technophiles') return ['Armes technologiques', 'Boucliers technologiques'];
        return ['weapon']; 
    }, [selection.classId]);

    // Tetrachire Logic
    const canUseTetrachire = (selection.raceId === 'entomothrope' || allItems.find(e => e.id === selection.raceId)?.parentId === 'entomothrope') 
                             && selection.level >= 20 && weaponCap > 1;

    const totalTungstenCount = React.useMemo(() => {
        const equippedIds = [
            ...selection.weaponSlots,
            ...Object.values(selection.equippedItems)
        ];
        return equippedIds.reduce((count, id) => {
            const item = allItems.find(i => i.id === id);
            return count + (item?.isTungsten ? 1 : 0);
        }, 0);
    }, [selection.weaponSlots, selection.equippedItems, allItems]);

    // Identification of Secret Card Provider
    const secretCardProviderId = React.useMemo(() => {
        return selection.weaponSlots.find(id => {
            const item = allItems.find(i => i.id === id);
            return item && (item.id === 'carte_secrete' || item.description?.includes('Carte secrète') || item.name.includes('Carte secrète'));
        });
    }, [selection.weaponSlots, allItems]);

    const secretCardTargetIndex = secretCardProviderId ? selection.itemConfigs?.[secretCardProviderId]?.targetSlotIndex : -1;

    return (
        <>
            {/* WEAPONS */}
            <CollapsibleCard 
                id="weapons_panel" 
                title={toFantasyTitle("Armes")} 
                icon={Sword} 
                className={isOverWeaponLimit ? 'border-red-500/50 bg-red-900/10' : ''}
                headerActions={
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setIsForgeOpen(true)} className="flex items-center text-[10px] bg-amber-700 hover:bg-amber-600 text-white px-2 py-1 rounded transition-colors shadow-sm"><Hammer size={10} className="mr-1" />Forge</button>
                        <div className={`text-xs font-mono px-2 py-1 rounded border border-transparent ${isOverWeaponLimit ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-green-400 border-slate-700'}`}>
                            {currentWeaponPoints} / {weaponCap} pts
                        </div>
                    </div>
                }
            >
                <div className="space-y-4 mb-3">
                    {selection.weaponSlots.map((wId, idx) => { 
                        const pseudoSlot: ItemSlot = { id: 'weapon_any', name: `Arme ${idx + 1}` }; 
                        let currentWeapon = allItems.find(i => i.id === wId);
                        
                        const currentUpgradeDmg = Number(selection.weaponUpgrades?.[idx] || 0);
                        const currentUpgradeVit = Number(selection.weaponUpgradesVit?.[idx] || 0);
                        
                        // --- SECRET CARD VISUAL FIX ---
                        const isSecretTarget = secretCardTargetIndex === idx;
                        
                        if (currentWeapon && isSecretTarget) {
                            const replaceFormula = (text: string) => text.split('weapon_effect_mult').join('(weapon_effect_mult + 1)');
                            
                            // Visual update for Normal Items (Global boost)
                            if (!currentWeapon.description?.startsWith('Fusion:')) {
                                currentWeapon = {
                                    ...currentWeapon,
                                    name: `${currentWeapon.name} (Boost Carte Secrète)`,
                                    modifiers: currentWeapon.modifiers?.map(mod => {
                                        if (mod.value && mod.value.includes('weapon_effect_mult')) {
                                            return { ...mod, value: replaceFormula(mod.value) };
                                        }
                                        return mod;
                                    }),
                                    description: currentWeapon.description ? replaceFormula(currentWeapon.description) : undefined,
                                    descriptionBlocks: currentWeapon.descriptionBlocks?.map(block => ({
                                        ...block,
                                        text: replaceFormula(block.text)
                                    }))
                                };
                            }
                        }
                        
                        let bonusColorDmg = "text-rose-400";
                        let displayUpgradeLabelDmg = "DMG";
                        
                        if (currentWeapon) {
                            if (currentWeapon.subCategory === 'Anneaux') { bonusColorDmg = "text-emerald-400"; displayUpgradeLabelDmg = "HP"; }
                            else if (currentWeapon.subCategory === 'Gantelets') { bonusColorDmg = "text-blue-300"; displayUpgradeLabelDmg = "ABS"; }
                        }

                        let effectiveCost = currentWeapon?.equipmentCost;
                        if (effectiveCost === 2 && reduceHeavyWeaponCost) effectiveCost = 1;
                        
                        const isAlleviated = selection.naturalStrengthAllocation?.includes(`weapon_${idx}`);
                        
                        // Check properties
                        const isSecretCardProvider = currentWeapon?.id === 'carte_secrete' || 
                                                     (currentWeapon?.description && currentWeapon.description.includes('Carte secrète')) ||
                                                     (currentWeapon?.name && currentWeapon.name.includes('Carte secrète'));

                        const isTarolex = currentWeapon && (
                            currentWeapon.id === 'tarolex_dore' || 
                            currentWeapon.name.includes('Tarolex Doré') ||
                            (currentWeapon.modifiers && currentWeapon.modifiers.some(m => m.toggleGroup === 'tarolex_royal'))
                        );

                        const displayItems = currentWeapon ? [...allItems.filter(i => i.id !== wId), currentWeapon] : allItems;

                        return (
                            <div key={idx} className="flex flex-col bg-slate-900/50 p-2 rounded border border-slate-800/50 relative">
                                <SlotSelector 
                                    slot={pseudoSlot} 
                                    allItems={displayItems} 
                                    selectedItemId={wId} 
                                    onOpenPicker={() => openItemPicker('weapon_any', allowedWeaponCategories, idx)} 
                                    onClear={() => removeWeapon(idx)} 
                                    effectiveCost={effectiveCost} 
                                    playerContext={context} 
                                    isAlleviated={isAlleviated}
                                    upgradeLevel={currentUpgradeDmg}
                                    upgradeLevelVit={currentUpgradeVit}
                                    totalTungstenCount={totalTungstenCount} 
                                />
                                
                                {/* ITEM USER CONFIG (SLIDER) */}
                                {currentWeapon && currentWeapon.userConfig && (
                                    <div className="px-1 pb-1">
                                        <ItemConfigControl 
                                            item={currentWeapon} 
                                            configValues={selection.itemConfigs?.[wId] || {}} 
                                            onUpdate={(k, v) => updateItemConfig(wId, k, v as number)} 
                                        />
                                    </div>
                                )}

                                {/* SPECIAL ITEMS UI */}
                                {isTarolex && <TarolexRoyalControls toggles={selection.toggles} />}
                                
                                {wId && currentWeapon?.id !== 'carte_secrete' && (
                                    <div className="mt-2 space-y-1">
                                        {/* DMG UPGRADE */}
                                        <div className="flex items-center space-x-2 p-1 bg-slate-950 border border-slate-800 rounded">
                                            <div className="text-[9px] uppercase font-bold text-slate-500 w-16 flex-shrink-0 truncate">Forge Dmg</div>
                                            <div className="flex-1 flex space-x-1">
                                                {[1, 2, 3, 4].map(lvl => { 
                                                    const active = currentUpgradeDmg >= lvl; 
                                                    const specific = currentUpgradeDmg === lvl; 
                                                    return (
                                                        <button key={lvl} onClick={() => setWeaponUpgrade(idx, specific ? lvl - 1 : lvl)} className={`flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-all duration-200 ${active ? 'bg-amber-600/20 border-amber-600 text-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.2)]' : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-slate-500 hover:text-slate-400'}`}>
                                                            {lvl === 1 ? 'I' : lvl === 2 ? 'II' : lvl === 3 ? 'III' : 'IV'}
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

                                        {/* VIT UPGRADE */}
                                        <div className="flex items-center space-x-2 p-1 bg-slate-950 border border-slate-800 rounded">
                                            <div className="text-[9px] uppercase font-bold text-slate-500 w-16 flex-shrink-0 truncate">Forge Vie</div>
                                            <div className="flex-1 flex space-x-1">
                                                {[1, 2, 3, 4].map(lvl => { 
                                                    const active = currentUpgradeVit >= lvl; 
                                                    const specific = currentUpgradeVit === lvl; 
                                                    return (
                                                        <button key={lvl} onClick={() => setWeaponUpgradeVit(idx, specific ? lvl - 1 : lvl)} className={`flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-all duration-200 ${active ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-slate-500 hover:text-slate-400'}`}>
                                                            {lvl === 1 ? 'I' : lvl === 2 ? 'II' : lvl === 3 ? 'III' : 'IV'}
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

                                {/* SECRET CARD CONFIGURATOR (Extracted) */}
                                {isSecretCardProvider && wId && (
                                    <SecretCardConfigurator 
                                        providerId={wId} 
                                        weaponSlots={selection.weaponSlots}
                                        allItems={allItems}
                                        itemConfigs={selection.itemConfigs || {}}
                                    />
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

                {/* TETRACHIRE SLOT */}
                {canUseTetrachire && (
                    <div className="mt-4 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center mb-2">
                            <Grip size={14} className="text-cyan-400 mr-2" />
                            <span className="text-xs font-bold uppercase text-cyan-300">Bras Supplémentaires (Tétrachire)</span>
                            <span className="ml-2 text-[9px] text-slate-500 bg-slate-950 px-1.5 rounded border border-slate-800">
                                {selection.racialCompetenceActive ? "Mode Actif : 2 Mains autorisé" : "Passif : 1 Main uniquement"}
                            </span>
                        </div>
                        <SlotSelector 
                            slot={{ id: 'tetrachire_weapon', name: 'Arme Bonus', acceptedCategories: ['weapon'] }} 
                            allItems={allItems} 
                            selectedItemId={selection.equippedItems['tetrachire_weapon']} 
                            onOpenPicker={() => openItemPicker('tetrachire_weapon', ['weapon'])} 
                            onClear={() => equipFixedItem('tetrachire_weapon', 'none')} 
                            playerContext={context} 
                            totalTungstenCount={totalTungstenCount} 
                        />
                    </div>
                )}
            </CollapsibleCard>

            {/* PARTITIONS */}
            {partitionCap > 0 && (
                <CollapsibleCard 
                    id="pupitre_panel"
                    title={toFantasyTitle("Pupitre")} 
                    icon={Music}
                    className="border-fuchsia-900/30"
                    headerActions={
                        <div className="text-xs bg-fuchsia-900/20 text-fuchsia-300 px-2 py-1 rounded font-mono border border-fuchsia-900/50">{selection.partitionSlots.slice(0, partitionCap).filter(Boolean).length} / {partitionCap}</div>
                    }
                >
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: partitionCap }).map((_, idx) => { 
                            const pId = selection.partitionSlots[idx]; 
                            const pseudoSlot: ItemSlot = { id: 'partition_any', name: `Partition ${idx + 1}` }; 
                            return (<SlotSelector key={idx} slot={pseudoSlot} allItems={allItems} selectedItemId={pId} onOpenPicker={() => openItemPicker('partition_any', ['partition'], idx)} onClear={() => removePartition(idx)} playerContext={context} />); 
                        })}
                    </div>
                </CollapsibleCard>
            )}
        </>
    );
};
