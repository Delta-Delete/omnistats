
import React from 'react';
import { PlayerSelection, Entity, ItemSlot, StatDefinition, CalculationResult } from '../../../types';
import { ArmorSection } from '../equipment/ArmorSection';
import { WeaponsSection } from '../equipment/WeaponsSection';
import { CompanionSection } from '../equipment/CompanionSection';

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
    setIsCompanionForgeOpen: (isOpen: boolean) => void;
    removeWeapon: (index: number) => void;
    setWeaponUpgrade: (index: number, level: number, type?: 'dmg' | 'vit') => void; // Signature mise à jour
    removePartition: (index: number) => void;
    companionResult: CalculationResult | null;
    companionDescriptions: any[];
}

export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ 
    selection, setSelection, slots, allItems, context, result,
    openItemPicker, equipFixedItem, setIsForgeOpen, setIsCompanionForgeOpen, removeWeapon, setWeaponUpgrade, removePartition,
    companionResult, companionDescriptions
}) => {
    
    return (
        <div className="space-y-6 mt-6">
            <ArmorSection 
                selection={selection} 
                slots={slots} 
                allItems={allItems} 
                context={context} 
                openItemPicker={openItemPicker} 
                equipFixedItem={equipFixedItem} 
            />

            <WeaponsSection 
                selection={selection} 
                allItems={allItems} 
                context={context} 
                result={result} 
                openItemPicker={openItemPicker} 
                equipFixedItem={equipFixedItem} 
                setIsForgeOpen={setIsForgeOpen} 
                removeWeapon={removeWeapon} 
                setWeaponUpgrade={(idx, lvl) => setWeaponUpgrade(idx, lvl, 'dmg')}
                setWeaponUpgradeVit={(idx, lvl) => setWeaponUpgrade(idx, lvl, 'vit')}
                removePartition={removePartition}
            />

            <CompanionSection 
                selection={selection}
                setSelection={setSelection}
                allItems={allItems}
                context={context}
                result={result}
                companionResult={companionResult}
                companionDescriptions={companionDescriptions}
                openItemPicker={openItemPicker}
                equipFixedItem={equipFixedItem}
                setIsCompanionForgeOpen={setIsCompanionForgeOpen}
            />
        </div>
    );
};
