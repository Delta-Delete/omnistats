
import React from 'react';
import { Sliders, Activity, Zap as SpdIcon, Sword } from 'lucide-react';
import { Entity, ItemConfigValues } from '../../../types';
import { DebouncedSlider, DebouncedInput } from '../../ui/DebouncedControl';

interface ItemConfigControlProps {
    item: Entity;
    configValues: ItemConfigValues;
    onUpdate: (key: keyof ItemConfigValues, value: number) => void;
}

export const ItemConfigControl: React.FC<ItemConfigControlProps> = ({ item, configValues, onUpdate }) => {
    if (!item.userConfig) return null;

    const { userConfig } = item;

    if (userConfig.type === 'slider') {
        const min = userConfig.min ?? 0;
        const max = userConfig.max ?? 100;
        const step = userConfig.step ?? 1;
        const val = configValues.val ?? min;

        return (
            <div className="w-full mt-2 pt-2 border-t border-slate-700/50">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <span className="flex items-center"><Sliders size={10} className="mr-1"/> {userConfig.label || 'Valeur'}</span>
                    <span className="text-indigo-400 font-mono">{val}</span>
                </div>
                <DebouncedSlider 
                    min={min} 
                    max={max} 
                    step={step} 
                    value={val} 
                    onChange={(v) => onUpdate('val', v)}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
        );
    }

    if (userConfig.type === 'manual_stats') {
        return (
            <div className="w-full mt-2 pt-2 border-t border-slate-700/50">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center">
                    <Sliders size={10} className="mr-1"/> Statistiques Libres
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="flex items-center justify-center text-[8px] font-bold text-emerald-500 mb-0.5"><Activity size={8} className="mr-1"/>VIT</label>
                        <DebouncedInput 
                            type="number" 
                            value={configValues.vit || 0} 
                            onChange={(val) => onUpdate('vit', parseInt(val) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-[10px] text-white font-mono focus:border-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="flex items-center justify-center text-[8px] font-bold text-amber-500 mb-0.5"><SpdIcon size={8} className="mr-1"/>SPD</label>
                        <DebouncedInput 
                            type="number" 
                            value={configValues.spd || 0} 
                            onChange={(val) => onUpdate('spd', parseInt(val) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-[10px] text-white font-mono focus:border-amber-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="flex items-center justify-center text-[8px] font-bold text-rose-500 mb-0.5"><Sword size={8} className="mr-1"/>DMG</label>
                        <DebouncedInput 
                            type="number" 
                            value={configValues.dmg || 0} 
                            onChange={(val) => onUpdate('dmg', parseInt(val) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-[10px] text-white font-mono focus:border-rose-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
