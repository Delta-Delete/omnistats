
import React from 'react';
import { Lock } from 'lucide-react';
import { Entity } from '../../../types';

interface OriginSelectorProps {
    raceId?: string;
    subRaceId?: string;
    classId?: string;
    specializationId?: string;
    races: Entity[];
    availableSubRaces: Entity[];
    classes: Entity[];
    availableSpecs: Entity[];
    isClassLocked: boolean;
    isSpecLocked: boolean;
    onUpdate: (field: string, value: string) => void;
}

export const OriginSelector: React.FC<OriginSelectorProps> = ({
    raceId, subRaceId, classId, specializationId,
    races, availableSubRaces, classes, availableSpecs,
    isClassLocked, isSpecLocked, onUpdate
}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* RACE SECTION */}
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Race</label>
                <select 
                    className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none" 
                    value={raceId || ''} 
                    onChange={(e) => onUpdate('raceId', e.target.value)}
                >
                    <option value="">Sélectionner</option>
                    {races.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
            </div>
            
            <div>
                {availableSubRaces.length > 0 && (
                    <>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Sous-Race</label>
                        <select 
                            className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none" 
                            value={subRaceId || ''} 
                            onChange={(e) => onUpdate('subRaceId', e.target.value)}
                        >
                            <option value="">Sélectionner Variété</option>
                            {availableSubRaces.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </>
                )}
            </div>
            
            {/* CLASS SECTION */}
            <div className="relative">
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex justify-between">
                    Classe
                    {isClassLocked && <span className="text-yellow-500 flex items-center"><Lock size={10} className="mr-1"/> Niv 5+</span>}
                </label>
                <select 
                    className={`w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none ${isClassLocked ? 'opacity-50 text-slate-400' : ''}`} 
                    value={classId || ''} 
                    onChange={(e) => onUpdate('classId', e.target.value)} 
                    disabled={isClassLocked}
                >
                    <option value="">Sélectionner</option>
                    {classes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
            </div>
            
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex justify-between">
                    Spécialisation
                    {isSpecLocked && <span className="text-yellow-500 flex items-center"><Lock size={10} className="mr-1"/> Niv 15+</span>}
                </label>
                <select 
                    className={`w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 text-sm focus:border-indigo-500 outline-none ${isSpecLocked ? 'opacity-50 text-slate-400' : ''}`} 
                    value={specializationId || ''} 
                    onChange={(e) => onUpdate('specializationId', e.target.value)} 
                    disabled={!classId || isClassLocked || isSpecLocked}
                >
                    <option value="">Sélectionner</option>
                    {availableSpecs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
            </div>
        </div>
    );
};
