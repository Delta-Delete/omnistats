
import React, { useState, useMemo, useEffect } from 'react';
import { Save, Plus, Copy, Trash2, Flag, Music } from 'lucide-react';
import { Entity, EntityType, ModifierType, ItemCategory, StatDefinition } from '../../../types';
import { getStatStyle } from '../utils';

interface StandardForgeTabProps {
    categories: ItemCategory[];
    stats: StatDefinition[];
    factions?: Entity[];
    onSave: (item: Entity) => void;
}

export const StandardForgeTab: React.FC<StandardForgeTabProps> = ({ categories, stats, factions, onSave }) => {
    const [tempItemId] = useState(`custom_wep_${Date.now()}`);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [weaponFamily, setWeaponFamily] = useState<'standard' | 'instrument'>('standard');
    const [subCat, setSubCat] = useState('');
    const [partitionCount, setPartitionCount] = useState(2);
    const [cost, setCost] = useState(1);
    const [factionId, setFactionId] = useState('');
    const [bonuses, setBonuses] = useState<{id: string, stat: string, val: string, name: string}[]>([{ id: `${tempItemId}_m0`, stat: 'dmg', val: '10', name: '' }]);

    const availableTypes = useMemo((): string[] => {
        const weaponCat = (categories || []).find(c => c.id === 'weapon');
        if (!weaponCat || !weaponCat.subCategories) return [];
        if (weaponFamily === 'instrument') return weaponCat.subCategories.filter(sc => sc.startsWith('Instrument'));
        else return weaponCat.subCategories.filter(sc => !sc.startsWith('Instrument'));
    }, [categories, weaponFamily]);

    useEffect(() => { 
        if (availableTypes.length > 0 && !availableTypes.includes(subCat)) {
            setSubCat(availableTypes[0]); 
        }
    }, [availableTypes, subCat]);

    const availableStats = useMemo(() => [...stats].sort((a, b) => a.label.localeCompare(b.label)), [stats]);

    const handleSave = () => {
        if (!name) return;
        const safeCatId = (categories || []).find(c => c.id === 'weapon')?.id || categories?.[0]?.id || 'unknown';
        const newItem: Entity = {
            id: tempItemId, 
            type: EntityType.ITEM, 
            name: name, 
            description: description,
            slotId: 'weapon_any', 
            categoryId: safeCatId, 
            subCategory: subCat, 
            equipmentCost: cost, 
            factionId: factionId || undefined, 
            modifiers: [], 
            isCraftable: true
        };
        if (weaponFamily === 'instrument') newItem.modifiers.push({ id: `${tempItemId}_cap`, type: ModifierType.FLAT, targetStatKey: 'partition_cap', value: partitionCount.toString(), name: 'Capacité Pupitre' });
        bonuses.forEach((b) => { if (b.val && b.val !== '0') newItem.modifiers.push({ id: b.id, type: ModifierType.FLAT, targetStatKey: b.stat, value: b.val, name: b.name || undefined }); });
        onSave(newItem);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
                <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Nom de l'arme</label><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500 placeholder-slate-600" placeholder="Ex: Excalibur" autoFocus /></div>
                <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Description / Effets Narratifs</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500 placeholder-slate-600 resize-none h-20 text-xs" placeholder="Ex: Une lame qui vibre. Inflige {{custom_wep_..._m0}} dégâts bruts." /></div>
                
                {availableTypes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Classe d'objet</label><div className="flex bg-slate-800 rounded border border-slate-700 overflow-hidden"><button onClick={() => setWeaponFamily('standard')} className={`flex-1 py-2 text-[10px] uppercase font-bold transition-colors ${weaponFamily === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Arme</button><div className="w-px bg-slate-700"></div><button onClick={() => setWeaponFamily('instrument')} className={`flex-1 py-2 text-[10px] uppercase font-bold transition-colors ${weaponFamily === 'instrument' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Instrument</button></div></div>
                        <div><label className="block text-xs uppercase font-bold text-slate-500 mb-1">Type Spécifique</label><select value={subCat} onChange={e => setSubCat(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500">{availableTypes.map(t => <option key={t} value={t}>{t.replace('Instrument ', '')}</option>)}</select></div>
                    </div>
                ) : (<div className="p-3 border border-red-900/50 bg-red-900/20 rounded text-xs text-red-300">Catégorie 'Arme' introuvable.</div>)}
                
                {weaponFamily === 'instrument' && (<div className="bg-indigo-900/10 border border-indigo-500/20 p-3 rounded-lg"><label className="flex justify-between text-xs uppercase font-bold text-indigo-300 mb-2"><span className="flex items-center"><Music size={12} className="mr-1"/> Slots de Partitions</span><span className="text-white bg-indigo-600 px-2 rounded-full">{partitionCount}</span></label><input type="range" min="1" max="9" value={partitionCount} onChange={(e) => setPartitionCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/><div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono"><span>1</span><span>9</span></div></div>)}
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Coût (Pts)</label>
                        <div className="flex bg-slate-800 rounded border border-slate-700 overflow-hidden"><button onClick={() => setCost(1)} className={`flex-1 text-xs font-bold py-2 transition-colors ${cost === 1 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>1 Main</button><div className="w-px bg-slate-700"></div><button onClick={() => setCost(2)} className={`flex-1 text-xs font-bold py-2 transition-colors ${cost === 2 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>2 Mains</button></div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-500 mb-1 flex items-center"><Flag size={10} className="mr-1"/> Set / Faction</label>
                        <select value={factionId} onChange={e => setFactionId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-amber-500 text-xs h-[34px]">
                            <option value="">-- Aucun --</option>
                            {(factions || []).map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="border-t border-slate-800 pt-4 mt-2"><div className="flex justify-between items-center mb-2"><label className="block text-xs uppercase font-bold text-slate-500">Effets & Bonus</label><button onClick={() => setBonuses([...bonuses, { id: `${tempItemId}_m${Date.now().toString().slice(-4)}`, stat: 'vit', val: '0', name: '' }])} className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 text-green-400 px-3 py-1 rounded flex items-center transition-colors"><Plus size={12} className="mr-1"/> Ajouter</button></div>
                    <div className="space-y-3">
                        {bonuses.map((bonus, idx) => (<div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-indigo-500/30 transition-colors"><div className="flex justify-between items-center mb-1"><input type="text" value={bonus.name} onChange={(e) => { const n = [...bonuses]; n[idx].name = e.target.value; setBonuses(n); }} className="bg-transparent text-xs text-slate-300 border-b border-transparent focus:border-indigo-500 outline-none pb-0.5 placeholder-slate-600 flex-1 mr-2" placeholder="Nom de l'effet (optionnel)" /><button onClick={() => navigator.clipboard.writeText(`{{${bonus.id}}}`)} className="flex items-center text-[9px] font-mono text-slate-600 hover:text-indigo-400 bg-slate-900/50 hover:bg-slate-900 border border-transparent hover:border-indigo-500/30 px-1.5 py-0.5 rounded transition-all ml-auto" title="Cliquer pour copier l'ID dans le presse-papier"><Copy size={10} className="mr-1.5" />{`{{${bonus.id}}}`}</button></div><div className="flex gap-2 items-center"><div className="flex-1 relative"><select value={bonus.stat} onChange={(e) => { const n = [...bonuses]; n[idx].stat = e.target.value; setBonuses(n); }} className={`w-full bg-slate-900 text-xs font-bold border border-slate-700 rounded px-3 py-2 outline-none focus:border-indigo-500 appearance-none ${getStatStyle(bonus.stat)}`}>{availableStats.map(s => <option key={s.key} value={s.key} className="bg-slate-900 text-slate-300">{s.label} ({s.key})</option>)}</select></div><div className="flex items-center bg-slate-900 border border-slate-700 rounded px-3 py-2 w-32 focus-within:border-indigo-500"><span className="text-slate-500 text-xs mr-2">=</span><input type="text" value={bonus.val} onChange={(e) => { const n = [...bonuses]; n[idx].val = e.target.value; setBonuses(n); }} className="w-full bg-transparent text-white font-mono text-xs outline-none text-right" placeholder="10" /></div><button onClick={() => { const n = [...bonuses]; n.splice(idx, 1); setBonuses(n); }} className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-900 rounded transition-colors"><Trash2 size={16} /></button></div></div>))}
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex-shrink-0">
                <button onClick={handleSave} disabled={!name} className="w-full bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-amber-900/20">
                    <Save size={18} className="mr-2" /> Forger l'arme
                </button>
            </div>
        </div>
    );
};
