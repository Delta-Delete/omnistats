
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bookmark, Save, RefreshCw, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

interface Preset {
    id: string;
    name: string;
    date: number;
}

interface BuilderHeaderProps {
    presets: Preset[];
    executionTime: number;
    onSavePreset: (name: string) => void;
    onLoadPreset: (id: string) => void;
    onDeletePreset: (id: string) => void;
    onOpenSavePanel: () => void;
    onReset: () => void;
    isResetConfirming: boolean;
    setIsDebugOpen: (val: boolean) => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
    presets,
    executionTime,
    onSavePreset,
    onLoadPreset,
    onDeletePreset,
    onOpenSavePanel,
    onReset,
    isResetConfirming,
    setIsDebugOpen
}) => {
    const { addToast } = useToastStore();
    const [isPresetsOpen, setIsPresetsOpen] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');

    const handleSavePresetClick = () => {
        if (newPresetName) {
            onSavePreset(newPresetName);
            setNewPresetName('');
            addToast("Sauvegardé", "success");
        }
    };

    const handleLoadPresetClick = (id: string) => {
        onLoadPreset(id);
        setIsPresetsOpen(false);
        addToast("Chargé", "success");
    };

    return (
        <header className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-1 font-perrigord tracking-wide">Omnistats - Dùralas</h2>
                <p className="text-slate-400 text-sm">Assemblez votre build et visualisez les stats en temps réel.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
                {/* PRESETS */}
                <div className="relative">
                    <button 
                        onClick={() => setIsPresetsOpen(!isPresetsOpen)} 
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                    >
                        <Bookmark size={16} />
                        <span className="text-xs font-bold uppercase hidden md:inline">Loadouts</span>
                    </button>
                    
                    {isPresetsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                            <div className="p-3 border-b border-slate-800 bg-slate-950">
                                <div className="flex gap-2">
                                    <input 
                                        value={newPresetName} 
                                        onChange={(e) => setNewPresetName(e.target.value)} 
                                        placeholder="Nom..." 
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-indigo-500 transition-colors" 
                                    />
                                    <button 
                                        onClick={handleSavePresetClick} 
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded p-1 transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {presets.length > 0 ? presets.map(p => (
                                    <div key={p.id} className="p-3 border-b border-slate-800 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                                        <div className="cursor-pointer flex-1" onClick={() => handleLoadPresetClick(p.id)}>
                                            <div className="text-sm font-bold text-slate-200 group-hover:text-white">{p.name}</div>
                                            <div className="text-[10px] text-slate-500">{new Date(p.date).toLocaleDateString()}</div>
                                        </div>
                                        <button onClick={() => onDeletePreset(p.id)} className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="p-4 text-center text-xs text-slate-500 italic">Aucun loadout enregistré.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={onOpenSavePanel} className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    <Save size={16} />
                    <span className="text-xs font-bold uppercase hidden md:inline">Sauvegarder JSON</span>
                </button>

                <button 
                    onClick={onReset} 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all border shadow-sm ${isResetConfirming ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-slate-900 border-slate-700 text-red-400 hover:text-red-300 hover:border-red-900/50'}`}
                >
                    {isResetConfirming ? (
                        <>
                            <AlertTriangle size={16}/>
                            <span className="text-xs font-bold uppercase">Confirmer ?</span>
                        </>
                    ) : (
                        <>
                            <RefreshCw size={16}/>
                            <span className="text-xs font-bold uppercase">Reset</span>
                        </>
                    )}
                </button>

                <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
                
                <Link to="/admin" className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800">
                    <Settings size={18} />
                </Link>
                
                <div onClick={() => setIsDebugOpen(true)} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer hidden md:flex items-center hover:border-slate-600 transition-colors">
                    <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">Calcul</span>
                    <span className="text-green-400 font-mono text-xs">{executionTime.toFixed(2)}ms</span>
                </div>
            </div>
        </header>
    );
};
