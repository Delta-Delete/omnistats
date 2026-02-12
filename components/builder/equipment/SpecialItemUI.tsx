
import React from 'react';
import { Target, Info } from 'lucide-react';
import { Entity, ItemConfigValues } from '../../../types';
import { usePlayerStore } from '../../../store/usePlayerStore';

// --- SECRET CARD CONFIGURATOR ---

interface SecretCardConfiguratorProps {
    providerId: string;
    weaponSlots: string[];
    allItems: Entity[];
    itemConfigs: Record<string, ItemConfigValues>;
}

export const SecretCardConfigurator: React.FC<SecretCardConfiguratorProps> = ({ 
    providerId, weaponSlots, allItems, itemConfigs 
}) => {
    const { updateItemConfig } = usePlayerStore();

    // Helper to generate options
    const getOptions = () => {
        return weaponSlots.flatMap((id, idx) => {
            const item = allItems.find(i => i.id === id);
            if (!item) return [];

            const isSelf = item.id === providerId;
            
            // Allow targeting only Decks or Fused items or Weapon category
            const isDeck = item.subCategory === 'Decks' || item.id.startsWith('fused_') || item.categoryId === 'weapon';
            if (!isDeck) return [];
            
            // IF FUSION: Extract ingredients
            if (item.description && item.description.startsWith('Fusion:')) {
                const ingredientsStr = item.description.substring(8);
                const ingredients = ingredientsStr.split(' + ').map(s => s.trim());
                const options = [];
                // Fusion: Must target an ingredient
                ingredients.forEach(ing => {
                    options.push({ value: `${idx}|${ing}`, label: `Arme ${idx + 1}: [${ing}]` });
                });
                return options;
            }

            // Normal Item: Can't boost self unless it's a fusion loop (prevented elsewhere)
            if (isSelf) return []; 
            
            // Normal item global target
            return [{ value: `${idx}|`, label: `Arme ${idx + 1}: ${item.name}` }];
        });
    };

    const handleChange = (val: string) => {
        const [idxStr, subName] = val.split('|');
        const idx = parseInt(idxStr);
        updateItemConfig(providerId, 'targetSlotIndex', idx);
        updateItemConfig(providerId, 'targetSubName' as any, subName as any);
    };

    const config = itemConfigs?.[providerId];
    const currentValue = `${config?.targetSlotIndex ?? -1}|${config?.targetSubName || ''}`;

    return (
        <div className="mt-2 p-2 bg-indigo-900/10 border border-indigo-500/30 rounded-lg">
            <label className="block text-[9px] uppercase font-bold text-indigo-400 mb-1 flex items-center">
                <Target size={10} className="mr-1"/> Cible du Bonus (Effet +100%)
            </label>
            <select 
                className="w-full bg-slate-900 border border-slate-700 text-[10px] text-white rounded p-1 outline-none focus:border-indigo-500"
                value={currentValue}
                onChange={(e) => handleChange(e.target.value)}
            >
                <option value="-1|">-- Choisir une Cible --</option>
                {getOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};

// --- TAROLEX ROYAL CONTROLS ---

interface TarolexRoyalControlsProps {
    toggles: Record<string, boolean>;
}

export const TarolexRoyalControls: React.FC<TarolexRoyalControlsProps> = ({ toggles }) => {
    const { updateSelection } = usePlayerStore();

    if (!toggles['card_royal']) return null;

    const toggleEffect = (id: string) => {
        updateSelection(prev => {
            const newToggles = { ...prev.toggles };
            // Reset siblings
            ['toggle_tarolex_r_club', 'toggle_tarolex_r_heart', 'toggle_tarolex_r_spade', 'toggle_tarolex_r_diamond']
                .forEach(k => delete newToggles[k]);
            
            // Toggle clicked
            if (!prev.toggles[id]) newToggles[id] = true;
            
            return { ...prev, toggles: newToggles };
        });
    };

    const options = [
        { id: 'toggle_tarolex_r_club', label: '♣', color: 'text-emerald-400' },
        { id: 'toggle_tarolex_r_heart', label: '♥', color: 'text-rose-500' },
        { id: 'toggle_tarolex_r_spade', label: '♠', color: 'text-slate-300' },
        { id: 'toggle_tarolex_r_diamond', label: '♦', color: 'text-amber-400' }
    ];

    return (
        <div className="mt-2 p-2 bg-yellow-900/10 border border-yellow-500/30 rounded-lg animate-in fade-in slide-in-from-top-1">
            <label className="block text-[9px] uppercase font-bold text-yellow-400 mb-1 flex items-center">
                <Info size={10} className="mr-1"/> Choix Royal (Effet Bonus)
            </label>
            <div className="grid grid-cols-4 gap-1">
                {options.map(opt => {
                    const isActive = toggles[opt.id];
                    return (
                        <button 
                            key={opt.id}
                            onClick={() => toggleEffect(opt.id)}
                            className={`p-1.5 rounded border transition-all ${isActive ? 'bg-slate-800 border-white text-white' : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-500'}`}
                        >
                            <span className={`text-sm leading-none ${isActive ? '' : opt.color}`}>{opt.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
