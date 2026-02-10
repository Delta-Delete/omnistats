
import React from 'react';
import { Scale } from 'lucide-react';
import { DebouncedInput, DebouncedSlider } from '../../ui/DebouncedControl';

interface PoliticsSelectorProps {
    ppValue: number;
    displayPP: number;
    onUpdate: (val: number) => void;
    onDisplayUpdate: (val: number) => void;
}

export const PoliticsSelector: React.FC<PoliticsSelectorProps> = ({
    ppValue, displayPP, onUpdate, onDisplayUpdate
}) => {
    return (
        <div className="mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex justify-between items-center mb-2">
                <label className="flex items-center text-xs uppercase font-bold text-slate-500">
                    <Scale size={14} className="mr-1.5" /> Influence Politique
                </label>
                <div className={`flex items-center justify-center text-xs font-mono font-bold px-1.5 py-0.5 rounded border transition-colors focus-within:ring-1 focus-within:ring-opacity-50 ${displayPP < 0 ? 'bg-red-900/30 border-red-500/20 text-red-400 focus-within:ring-red-500' : displayPP > 0 ? 'bg-indigo-900/30 border-indigo-500/20 text-indigo-300 focus-within:ring-indigo-500' : 'bg-slate-800 border-slate-700 text-slate-400 focus-within:ring-slate-500'}`}>
                    <DebouncedInput 
                        type="text" 
                        inputMode="numeric" 
                        value={displayPP > 0 ? `+${displayPP}` : displayPP} 
                        onChange={(val) => { 
                            if (val === '' || val === '-' || val === '+') { onUpdate(0); } 
                            else { 
                                const cleanVal = val.replace('+', ''); 
                                const num = parseInt(cleanVal, 10); 
                                if (!isNaN(num) && num >= -300 && num <= 300) { onUpdate(num); } 
                            } 
                        }} 
                        className="bg-transparent outline-none w-10 appearance-none m-0 p-0 font-inherit text-center" 
                    />
                </div>
            </div>
            <div className="relative h-6 flex items-center">
                <div className="absolute w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-900/50 to-slate-800"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-900/50 to-slate-800"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 -translate-x-1/2"></div>
                </div>
                <DebouncedSlider 
                    min={-300} 
                    max={300} 
                    value={ppValue}
                    onInput={onDisplayUpdate}
                    onChange={onUpdate}
                    className={`w-full h-2 appearance-none bg-transparent relative z-10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 ${displayPP < 0 ? '[&::-webkit-slider-thumb]:bg-red-500' : displayPP > 0 ? '[&::-webkit-slider-thumb]:bg-indigo-500' : '[&::-webkit-slider-thumb]:bg-slate-400'}`} 
                />
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1 px-1">
                <span>-300 (Rebelle)</span><span>Neutre</span><span>+300 (Loyal)</span>
            </div>
        </div>
    );
};
