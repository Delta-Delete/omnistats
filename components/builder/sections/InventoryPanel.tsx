
import React from 'react';
import { Zap, Gem, Award, Package, Backpack, Waves, Power } from 'lucide-react';
import { PlayerSelection, Entity, ItemSlot, ItemConfigValues } from '../../../types';
import { SlotSelector } from '../SlotSelector';
import { toFantasyTitle } from '../utils';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { CollapsibleCard } from '../../ui/Card';
import { InventoryBag } from '../inventory/InventoryBag';

interface InventoryPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    slots: ItemSlot[];
    allItems: Entity[];
    context: any;
    openItemPicker: (slotId: string, acceptedCats?: string[], index?: number) => void;
    equipFixedItem: (slotId: string, itemId: string) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ 
    selection, setSelection, slots, allItems, context, 
    openItemPicker, equipFixedItem 
}) => {
    const { updateItemConfig } = usePlayerStore();
    
    const STARTER_SEAL_ID = 'seal_vitality_starter';

    // --- BAG HANDLERS ---
    const addItemToBag = (bagKey: 'bonusItems' | 'sealItems' | 'specialItems', itemId: string) => { 
        if (itemId === 'none') return; 
        setSelection(prev => ({ ...prev, [bagKey]: [...prev[bagKey], itemId] })); 
    };
    
    const removeItemFromBag = (bagKey: 'bonusItems' | 'sealItems' | 'specialItems', index: number) => { 
        setSelection(prev => { 
            const newBag = [...prev[bagKey]]; 
            newBag.splice(index, 1); 
            return { ...prev, [bagKey]: newBag }; 
        }); 
    };

    const getItemConfig = (itemId: string): ItemConfigValues => {
        return selection.itemConfigs?.[itemId] || {};
    };

    const handleConfigUpdate = (itemId: string, key: keyof ItemConfigValues, value: number) => {
        updateItemConfig(itemId, key, value);
    };

    // --- RESPIRATOR LOGIC ---
    const toggleRespirator = () => {
        setSelection(prev => ({
            ...prev,
            toggles: {
                ...prev.toggles,
                toggle_respirator_active: !prev.toggles['toggle_respirator_active']
            }
        }));
    };
    const isRespiratorActive = selection.toggles['toggle_respirator_active'];

    return (
        <div className="space-y-6 mt-6">
            
            {/* 1. ENCHANTEMENTS */}
            <CollapsibleCard id="enchant_panel" title={toFantasyTitle("Enchantements")} icon={Zap}>
                <div className="grid grid-cols-3 gap-3">
                    {slots.filter(s => s.id.startsWith('ench_')).map(slot => (
                        <SlotSelector 
                            key={slot.id} 
                            slot={slot} 
                            allItems={allItems} 
                            selectedItemId={selection.equippedItems[slot.id]} 
                            onOpenPicker={() => openItemPicker(slot.id, slot.acceptedCategories)} 
                            onClear={() => equipFixedItem(slot.id, 'none')} 
                            playerContext={context} 
                        />
                    ))}
                </div>
            </CollapsibleCard>

            {/* 2. ACCESSOIRES (Fixed Slots) */}
            <CollapsibleCard id="accessories_panel" title={toFantasyTitle("Accessoires & Transport")} icon={Gem}>
                <div className="grid grid-cols-2 gap-4">
                    {slots.filter(s => ['artifact', 'rebreather', 'vehicle', 'backpack'].includes(s.id)).map(slot => {
                        const hasEquipped = !!selection.equippedItems[slot.id];
                        
                        return (
                            <div key={slot.id} className="flex flex-col">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-xs text-slate-500">{slot.name}</label>
                                    
                                    {/* RESPIRATOR TOGGLE SWITCH */}
                                    {slot.id === 'rebreather' && hasEquipped && (
                                        <button 
                                            onClick={toggleRespirator}
                                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase border transition-all duration-300 ${
                                                isRespiratorActive 
                                                ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                                                : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-slate-500'
                                            }`}
                                        >
                                            {isRespiratorActive ? <Waves size={10} className="animate-pulse" /> : <Power size={10} />}
                                            {isRespiratorActive ? 'ACTIF' : 'OFF'}
                                        </button>
                                    )}
                                </div>
                                <SlotSelector slot={slot} allItems={allItems} selectedItemId={selection.equippedItems[slot.id]} onOpenPicker={() => openItemPicker(slot.id, slot.acceptedCategories)} onClear={() => equipFixedItem(slot.id, 'none')} playerContext={context} />
                            </div>
                        );
                    })}
                </div>
            </CollapsibleCard>

            {/* 3. SCEAUX (Dynamic Bag) */}
            <InventoryBag 
                id="seals_panel"
                title="Sceaux (Collection)"
                icon={Award}
                itemIds={selection.sealItems || []}
                allItems={allItems}
                context={context}
                onAddItem={(id) => addItemToBag('sealItems', id)}
                onRemoveItem={(idx) => removeItemFromBag('sealItems', idx)}
                onUpdateConfig={handleConfigUpdate}
                getItemConfig={getItemConfig}
                availableItemsFilter={(i) => i.categoryId === 'seal' && i.id !== STARTER_SEAL_ID}
                isLockedPredicate={(id) => id === STARTER_SEAL_ID}
                itemBgColor="bg-slate-900"
                placeholderText="+ Ajouter un Sceau..."
            />

            {/* 4. OBJETS SPÉCIAUX (Dynamic Bag) */}
            <InventoryBag 
                id="special_items_panel"
                title="Objets Spéciaux"
                icon={Package}
                itemIds={selection.specialItems || []}
                allItems={allItems}
                context={context}
                onAddItem={(id) => addItemToBag('specialItems', id)}
                onRemoveItem={(idx) => removeItemFromBag('specialItems', idx)}
                onUpdateConfig={handleConfigUpdate}
                getItemConfig={getItemConfig}
                availableItemsFilter={(i) => i.categoryId === 'special' && !i.id.startsWith('item_cult_') && !i.id.startsWith('item_gemme_spel')}
                isLockedPredicate={(id) => id.startsWith('item_cult_')}
                itemBgColor="bg-cyan-900/20"
                lockedIconColor="text-cyan-500/50"
                placeholderText="+ Ajouter un Objet Spécial..."
            />

            {/* 5. SAC À MALICE (Dynamic Bag) */}
            <InventoryBag 
                id="bonus_bag_panel"
                title="Sac à Malice (Bonus)"
                icon={Backpack}
                itemIds={selection.bonusItems || []}
                allItems={allItems}
                context={context}
                onAddItem={(id) => addItemToBag('bonusItems', id)}
                onRemoveItem={(idx) => removeItemFromBag('bonusItems', idx)}
                onUpdateConfig={handleConfigUpdate}
                getItemConfig={getItemConfig}
                availableItemsFilter={(i) => i.categoryId === 'misc'}
                itemBgColor="bg-indigo-900/20"
                placeholderText="+ Ajouter un objet bonus..."
            />
        </div>
    );
};
