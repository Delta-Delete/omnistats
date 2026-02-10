
import React from 'react';
import { User } from 'lucide-react';
import { DebouncedInput, DebouncedSlider } from '../../ui/DebouncedControl';

interface IdentityHeaderProps {
    characterName: string;
    level: number;
    displayLevel: number;
    onNameChange: (val: string) => void;
    onLevelChange: (val: number) => void;
    onLevelInput: (val: number) => void;
}

export const IdentityHeader: React.FC<IdentityHeaderProps> = ({
    characterName,
    level,
    displayLevel,
    onNameChange,
    onLevelChange,
    onLevelInput
}) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nom du Personnage</label>
                <div className="relative">
                    <DebouncedInput 
                        type="text" 
                        value={characterName} 
                        onChange={onNameChange} 
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 pl-9 text-sm focus:border-indigo-500 outline-none" 
                        placeholder="Entrez un nom..." 
                    />
                    <User size={16} className="absolute left-3 top-2.5 text-slate-500" />
                </div>
            </div>
            
            <div>
                <label className="flex justify-between text-xs uppercase font-bold text-slate-500 mb-1">
                    <span>Niveau</span>
                    <span className="text-indigo-400">{displayLevel}</span>
                </label>
                <DebouncedSlider 
                    min={0} 
                    max={60} 
                    value={level} 
                    onInput={onLevelInput}
                    onChange={onLevelChange}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
            </div>
        </div>
    );
};
