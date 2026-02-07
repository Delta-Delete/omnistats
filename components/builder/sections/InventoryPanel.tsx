
import React from 'react';
import { Zap, Gem, Award, Lock, Trash2, Package, Backpack, Sliders, Activity, Zap as SpdIcon, Sword, Power, Waves } from 'lucide-react';
import { PlayerSelection, Entity, ItemSlot, ItemConfigValues, ModifierType } from '../../../types';
import { SlotSelector } from '../SlotSelector';
import { toFantasyTitle, calculateEnhancedStats, getStatStyle } from '../utils';
import { usePlayerStore } from '../../../store/usePlayerStore';

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

    const addItemToBag = (bagKey: 'bonusItems' | 'sealItems' | 'specialItems', itemId: string) => { 
        if (itemId === 'none') return; 
        setSelection(prev => ({ ...prev, [bagKey]: [...prev[bagKey], itemId] })); 
    };
    
    const removeItemFromBag = (bagKey: 'bonusItems' | 'sealItems' | 'specialItems', index: number) => { 
        setSelection(prev => { 
            const newBag = [...prev[bagKey]]; 
            newBag.splice(index, 1); 
            // Optional: Clean up config when removing? 
            // We keep config for now in case they re-add it.
            return { ...prev, [bagKey]: newBag }; 
        }); 
    };

    // Helper to render user configuration controls
    const renderItemConfig = (itemId: string) => {
        const item = allItems.find(i => i.id === itemId);
        if (!item || !item.userConfig) return null;

        const config = item.userConfig;
        const savedValues = selection.itemConfigs?.[itemId] || {};

        if (config.type === 'slider') {
            const min = config.min ?? 0;
            const max = config.max ?? 100;
            const step = config.step ?? 1;
            const val = savedValues.val ?? min;

            return (
                <div className="w-full mt-2 pt-2 border-t border-slate-700/50">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1">
                        <span className="flex items-center"><Sliders size={10} className="mr-1"/> {config.label || 'Valeur'}</span>
                        <span className="text-indigo-400 font-mono">{val}</span>
                    </div>
                    <input 
                        type="range" 
                        min={min} 
                        max={max} 
                        step={step} 
                        value={val} 
                        onChange={(e) => updateItemConfig(itemId, 'val', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            );
        }

        if (config.type === 'manual_stats') {
            return (
                <div className="w-full mt-2 pt-2 border-t border-slate-700/50">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center">
                        <Sliders size={10} className="mr-1"/> Statistiques Libres
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="flex items-center justify-center text-[8px] font-bold text-emerald-500 mb-0.5"><Activity size={8} className="mr-1"/>VIT</label>
                            <input 
                                type="number" 
                                value={savedValues.vit || 0} 
                                onChange={(e) => updateItemConfig(itemId, 'vit', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-[10px] text-white font-mono focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center justify-center text-[8px] font-bold text-amber-500 mb-0.5"><SpdIcon size={8} className="mr-1"/>SPD</label>
                            <input 
                                type="number" 
                                value={savedValues.spd || 0} 
                                onChange={(e) => updateItemConfig(itemId, 'spd', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-[10px] text-white font-mono focus:border-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center justify-center text-[8px] font-bold text-rose-500 mb-0.5"><Sword size={8} className="mr-1"/>DMG</label>
                            <input 
                                type="number" 
                                value={savedValues.dmg || 0} 
                                onChange={(e) => updateItemConfig(itemId, 'dmg', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-[10px] text-white font-mono focus:border-rose-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderBagItem = (itemId: string, index: number, bagKey: 'bonusItems' | 'sealItems' | 'specialItems', isLocked: boolean = false, bgColor: string = 'bg-slate-800') => {
        const item = allItems.find(i => i.id === itemId);
        const hasConfig = !!item?.userConfig;

        return (
            <div key={`${itemId}-${index}`} className={`flex flex-col p-2 rounded-lg border ${bgColor} border-slate-700/50 ${hasConfig ? 'w-full md:w-[48%]' : ''}`}>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate mr-2">{item?.name || 'Objet Inconnu'}</span>
                    {isLocked ? (
                        <Lock size={12} className="text-slate-500/70" />
                    ) : (
                        <button onClick={() => removeItemFromBag(bagKey, index)} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 size={12}/>
                        </button>
                    )}
                </div>
                {renderItemConfig(itemId)}
            </div>
        );
    };

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
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide"><Zap size={20} className="mr-2" /> {toFantasyTitle("Enchantements")}</h4>
                <div className="grid grid-cols-3 gap-3 mt-3">
                    {slots.filter(s => s.id.startsWith('ench_')).map(slot => (
                        <SlotSelector key={slot.id} slot={slot} allItems={allItems} selectedItemId={selection.equippedItems[slot.id]} onOpenPicker={() => openItemPicker(slot.id, slot.acceptedCategories)} onClear={() => equipFixedItem(slot.id, 'none')} playerContext={context} />
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide"><Gem size={20} className="mr-2" /> {toFantasyTitle("Accessoires & Transport")}</h4>
                <div className="grid grid-cols-2 gap-4 mt-3">
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
                                                : 'bg-slate-950 border-slate-700 text-slate-600 hover:border-slate-500'
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
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide"><Award size={20} className="mr-2" /> {toFantasyTitle("Sceaux (Collection)")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 mt-3">
                    {(selection.sealItems || []).map((bId, idx) => { 
                        const isLocked = bId === STARTER_SEAL_ID; 
                        const item = allItems.find(i => i.id === bId);
                        
                        // Card Styles
                        const containerClass = `relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-200 shadow-sm ${
                            isLocked 
                            ? 'bg-amber-950/20 border-amber-600/30' 
                            : 'bg-slate-900 border-slate-700/50 hover:border-slate-600'
                        }`;

                        return (
                            <div key={`${bId}-${idx}`} className={containerClass}>
                                {/* Header: Name + Remove */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold line-clamp-1 ${isLocked ? 'text-amber-400' : 'text-slate-200'}`}>
                                            {item?.name || 'Sceau Inconnu'}
                                        </span>
                                        {/* Show simple stats preview if not configurable */}
                                        {!item?.userConfig && item?.modifiers && item.modifiers.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.modifiers.slice(0, 2).map((m, midx) => {
                                                    const { enhanced } = calculateEnhancedStats(m, context, item);
                                                    const label = m.targetStatKey.substring(0, 3).toUpperCase();
                                                    // Simple color check
                                                    let color = 'text-slate-400';
                                                    if(m.targetStatKey === 'vit') color = 'text-emerald-400';
                                                    if(m.targetStatKey === 'spd') color = 'text-amber-400';
                                                    if(m.targetStatKey === 'dmg') color = 'text-rose-400';
                                                    return (
                                                        <span key={midx} className={`text-[9px] font-mono ${color}`}>
                                                            {enhanced > 0 ? '+' : ''}{enhanced} {label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    {isLocked ? (
                                        <Lock size={12} className="text-amber-500/50 flex-shrink-0" />
                                    ) : (
                                        <button onClick={() => removeItemFromBag('sealItems', idx)} className="text-slate-600 hover:text-red-400 p-1 -mt-1 -mr-1 transition-colors">
                                            <Trash2 size={12}/>
                                        </button>
                                    )}
                                </div>

                                {/* Content: Inputs OR Description */}
                                <div className="flex-1">
                                    {renderItemConfig(bId)}
                                    
                                    {!item?.userConfig && item?.description && (
                                        <div className="mt-auto pt-2 text-[9px] text-slate-500 italic line-clamp-2 border-t border-slate-700/30">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <select className="w-full bg-slate-800 border-slate-700 rounded text-sm text-slate-300 p-2 outline-none hover:border-slate-600 transition-colors" onChange={(e) => { addItemToBag('sealItems', e.target.value); e.target.value = 'none'; }}>
                    <option value="none">+ Ajouter un Sceau...</option>
                    {allItems.filter(i => i.categoryId === 'seal' && i.id !== STARTER_SEAL_ID).map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
                </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide"><Package size={20} className="mr-2" /> {toFantasyTitle("Objets Spéciaux")}</h4>
                <div className="flex flex-wrap gap-2 mb-3 mt-3">
                    {(selection.specialItems || []).map((bId, idx) => { 
                        const isCultItem = bId.startsWith('item_cult_');
                        return renderItemConfig(bId) 
                            ? renderBagItem(bId, idx, 'specialItems', isCultItem, isCultItem ? 'bg-sky-900/20' : 'bg-cyan-900/30')
                            : (
                                <div key={idx} className={`flex items-center px-2 py-1 rounded-full text-xs border ${isCultItem ? 'bg-sky-900/30 border-sky-500/30 text-sky-200' : 'bg-cyan-900/30 border-cyan-500/30 text-cyan-200'}`}>
                                    <span className="mr-2">{allItems.find(i => i.id === bId)?.name}</span>
                                    {isCultItem ? (
                                        <Lock size={10} className="text-sky-500/70" />
                                    ) : (
                                        <button onClick={() => removeItemFromBag('specialItems', idx)} className="hover:text-white"><Trash2 size={10}/></button>
                                    )}
                                </div>
                            )
                    })}
                </div>
                <select className="w-full bg-slate-800 border-slate-700 rounded text-sm text-slate-300 p-2 outline-none" onChange={(e) => { addItemToBag('specialItems', e.target.value); e.target.value = 'none'; }}>
                    <option value="none">+ Ajouter un Objet Spécial...</option>
                    {allItems.filter(i => 
                        i.categoryId === 'special' && 
                        !i.id.startsWith('item_cult_') && 
                        !i.id.startsWith('item_gemme_spel') 
                    ).map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
                </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-lg font-perrigord text-slate-300 flex items-center tracking-wide"><Backpack size={20} className="mr-2" /> {toFantasyTitle("Sac à Malice (Bonus)")}</h4>
                <div className="flex flex-wrap gap-2 mb-3 mt-3">
                    {(selection.bonusItems || []).map((bId, idx) => { 
                        return renderItemConfig(bId) 
                            ? renderBagItem(bId, idx, 'bonusItems', false, 'bg-indigo-900/30')
                            : (
                                <div key={idx} className="flex items-center bg-indigo-900/30 border border-indigo-500/30 text-indigo-200 px-2 py-1 rounded-full text-xs">
                                    <span className="mr-2">{allItems.find(i => i.id === bId)?.name}</span>
                                    <button onClick={() => removeItemFromBag('bonusItems', idx)} className="hover:text-white"><Trash2 size={10}/></button>
                                </div>
                            ) 
                    })}
                </div>
                <select className="w-full bg-slate-800 border-slate-700 rounded text-sm text-slate-300 p-2 outline-none" onChange={(e) => { addItemToBag('bonusItems', e.target.value); e.target.value = 'none'; }}>
                    <option value="none">+ Ajouter un objet bonus...</option>
                    {allItems.filter(i => i.categoryId === 'misc').map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
                </select>
            </div>
        </div>
    );
};
