
import React, { useState } from 'react';
import { Hammer, X, Combine } from 'lucide-react';
import { ItemCategory, StatDefinition, Entity } from '../../types';
import { StandardForgeTab } from './forge/StandardForgeTab';
import { FusionForgeTab } from './forge/FusionForgeTab';

export const WeaponForgeModal: React.FC<{ 
    categories: ItemCategory[]; 
    stats: StatDefinition[]; 
    factions?: Entity[]; 
    allItems: Entity[];
    onClose: () => void; 
    onSave: (item: Entity) => void;
    classId?: string; // NEW PROP
}> = ({ categories, stats, factions, allItems, onClose, onSave, classId }) => {
    const [activeTab, setActiveTab] = useState<'create' | 'fusion'>('create');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
             <style>
                {`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                    animation-iteration-count: infinite;
                }
                `}
             </style>
             <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* HEADER */}
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <Hammer size={18} className="mr-2 text-amber-500" /> Forge & Fusion
                        </h3>
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button 
                                onClick={() => setActiveTab('create')} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'create' ? 'bg-amber-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Création
                            </button>
                            <button 
                                onClick={() => setActiveTab('fusion')} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center ${activeTab === 'fusion' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Combine size={14} className="mr-1.5" /> Fusion
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 relative">
                    {activeTab === 'create' ? (
                        <div className="absolute inset-0">
                            <StandardForgeTab 
                                categories={categories} 
                                stats={stats} 
                                factions={factions} 
                                onSave={onSave}
                                classId={classId} // PASSED
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            <FusionForgeTab 
                                allItems={allItems} 
                                stats={stats} 
                                onSave={onSave}
                                classId={classId} // PASSED
                            />
                        </div>
                    )}
                </div>
             </div>
        </div>
    )
}
