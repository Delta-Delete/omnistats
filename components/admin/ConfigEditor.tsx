
import React, { useState } from 'react';
import { ItemSlot, ItemCategory } from '../../types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface ConfigEditorProps {
    slots: ItemSlot[];
    setSlots: React.Dispatch<React.SetStateAction<ItemSlot[]>>;
    categories: ItemCategory[];
    setCategories: React.Dispatch<React.SetStateAction<ItemCategory[]>>;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ slots, setSlots, categories, setCategories }) => {
    // --- SLOTS MANAGEMENT ---
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
    const [tempSlot, setTempSlot] = useState<ItemSlot | null>(null);

    const handleAddSlot = () => {
        const newSlot: ItemSlot = { id: `slot_${Date.now()}`, name: 'Nouveau Slot', acceptedCategories: [] };
        setSlots([...slots, newSlot]);
        setEditingSlotId(newSlot.id);
        setTempSlot(newSlot);
    };

    const handleSaveSlot = () => {
        if (tempSlot) {
            setSlots(slots.map(s => s.id === editingSlotId ? tempSlot : s));
            setEditingSlotId(null);
            setTempSlot(null);
        }
    };

    const handleDeleteSlot = (id: string) => {
        if (window.confirm('Supprimer ce slot ?')) {
            setSlots(slots.filter(s => s.id !== id));
        }
    };

    // --- CATEGORIES MANAGEMENT ---
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [tempCat, setTempCat] = useState<ItemCategory | null>(null);

    const handleAddCat = () => {
        const newCat: ItemCategory = { id: `cat_${Date.now()}`, name: 'Nouvelle Catégorie', subCategories: [] };
        setCategories([...categories, newCat]);
        setEditingCatId(newCat.id);
        setTempCat(newCat);
    };

    const handleSaveCat = () => {
        if (tempCat) {
            setCategories(categories.map(c => c.id === editingCatId ? tempCat : c));
            setEditingCatId(null);
            setTempCat(null);
        }
    };

    const handleDeleteCat = (id: string) => {
        if (window.confirm('Supprimer cette catégorie ?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-8 h-full">
            {/* SLOTS COLUMN */}
            <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Slots d'équipement</h3>
                    <button onClick={handleAddSlot} className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs flex items-center"><Plus size={14} className="mr-1"/> Ajouter</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {slots.map((s) => (
                        <div key={s.id} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs">
                            {editingSlotId === s.id && tempSlot ? (
                                <div className="space-y-2">
                                    <div><label className="block text-[9px] uppercase text-slate-500">ID</label><input value={tempSlot.id} onChange={e => setTempSlot({...tempSlot, id: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"/></div>
                                    <div><label className="block text-[9px] uppercase text-slate-500">Nom</label><input value={tempSlot.name} onChange={e => setTempSlot({...tempSlot, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"/></div>
                                    <div>
                                        <label className="block text-[9px] uppercase text-slate-500">Catégories Acceptées (ID, virgule)</label>
                                        <input 
                                            value={tempSlot.acceptedCategories?.join(', ') || ''} 
                                            onChange={e => setTempSlot({...tempSlot, acceptedCategories: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} 
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button onClick={() => setEditingSlotId(null)} className="text-slate-500 hover:text-white p-1"><X size={16}/></button>
                                        <button onClick={handleSaveSlot} className="text-green-500 hover:text-green-400 p-1"><Check size={16}/></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center group">
                                    <div>
                                        <div className="font-bold text-slate-200">{s.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">{s.id}</div>
                                        <div className="text-[9px] text-indigo-400 mt-1">{s.acceptedCategories?.join(', ')}</div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingSlotId(s.id); setTempSlot(s); }} className="text-slate-500 hover:text-white"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDeleteSlot(s.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CATEGORIES COLUMN */}
            <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Catégories d'objets</h3>
                    <button onClick={handleAddCat} className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs flex items-center"><Plus size={14} className="mr-1"/> Ajouter</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {categories.map((c) => (
                        <div key={c.id} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs">
                            {editingCatId === c.id && tempCat ? (
                                <div className="space-y-2">
                                    <div><label className="block text-[9px] uppercase text-slate-500">ID</label><input value={tempCat.id} onChange={e => setTempCat({...tempCat, id: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"/></div>
                                    <div><label className="block text-[9px] uppercase text-slate-500">Nom</label><input value={tempCat.name} onChange={e => setTempCat({...tempCat, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"/></div>
                                    <div>
                                        <label className="block text-[9px] uppercase text-slate-500">Sous-Catégories (virgule)</label>
                                        <textarea 
                                            value={tempCat.subCategories?.join(', ') || ''} 
                                            onChange={e => setTempCat({...tempCat, subCategories: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} 
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono min-h-[60px]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button onClick={() => setEditingCatId(null)} className="text-slate-500 hover:text-white p-1"><X size={16}/></button>
                                        <button onClick={handleSaveCat} className="text-green-500 hover:text-green-400 p-1"><Check size={16}/></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start group">
                                    <div>
                                        <div className="font-bold text-slate-200">{c.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono mb-1">{c.id}</div>
                                        <div className="text-[10px] text-slate-400 leading-tight">{c.subCategories?.join(', ')}</div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingCatId(c.id); setTempCat(c); }} className="text-slate-500 hover:text-white"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDeleteCat(c.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
