
import React from 'react';
import { Shield, Check } from 'lucide-react';
import { Entity, ItemSlot, PlayerSelection } from '../../../types';
import { SlotSelector } from '../../builder/SlotSelector';
import { toFantasyTitle } from '../../builder/utils';
import { CollapsibleCard } from '../../ui/Card';

interface ArmorSectionProps {
    selection: PlayerSelection;
    slots: ItemSlot[];
    allItems: Entity[];
    context: any;
    openItemPicker: (slotId: string, acceptedCats?: string[]) => void;
    equipFixedItem: (slotId: string, itemId: string) => void;
}

export const ArmorSection: React.FC<ArmorSectionProps> = ({
    selection, slots, allItems, context, openItemPicker, equipFixedItem
}) => {
    return (
        <CollapsibleCard id="armor_panel" title={toFantasyTitle("Armure")} icon={Shield}>
            <div className="flex flex-col gap-3">
                {[
                    { main: 'head', bonus: 'head_bonus', label: '+50 Vitalité', upgradeId: 'opt_head_vit' }, 
                    { main: 'chest', bonus: 'chest_bonus', label: '+50 Vitalité', upgradeId: 'opt_chest_vit' }, 
                    { main: 'legs', bonus: 'legs_bonus', label: '+50 Vitesse', upgradeId: 'opt_legs_spd' }
                ].map(pair => { 
                    const mainSlot = slots.find(s => s.id === pair.main); 
                    if (!mainSlot) return null; 
                    
                    const isUpgraded = selection.equippedItems[pair.bonus] === pair.upgradeId; 
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
                            {pair.upgradeId && (
                                <button 
                                    className={`w-[130px] flex-shrink-0 h-[56px] flex flex-col justify-center px-3 rounded-lg border transition-all duration-300 relative group overflow-hidden text-left ${
                                        isUpgraded 
                                        ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                                        : 'bg-slate-900 border-slate-600 hover:border-slate-500'
                                    }`} 
                                    onClick={() => equipFixedItem(pair.bonus, isUpgraded ? 'none' : pair.upgradeId)}
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
        </CollapsibleCard>
    );
};
