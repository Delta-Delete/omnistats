
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { StatDefinition } from '../../types';

interface StatsEditorProps {
    stats: StatDefinition[];
    setStats: React.Dispatch<React.SetStateAction<StatDefinition[]>>;
}

export const StatsEditor: React.FC<StatsEditorProps> = ({ stats, setStats }) => {
  const addStat = () => {
    const newId = `custom_stat_${Date.now()}`;
    setStats([...stats, { id: newId, key: newId, label: 'Nouvelle Stat', baseValue: 0, group: 'Secondary' }]);
  };
  const removeStat = (idx: number) => {
    const newStats = [...stats];
    newStats.splice(idx, 1);
    setStats(newStats);
  };
  const updateStat = (idx: number, field: keyof StatDefinition, val: any) => {
    const newStats = [...stats];
    (newStats[idx] as any)[field] = val;
    setStats(newStats);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h3 className="text-lg font-bold text-white">Éditeur de Statistiques</h3><button onClick={addStat} className="bg-indigo-600 text-white px-3 py-1 rounded text-xs flex items-center"><Plus size={14} className="mr-1"/> Ajouter</button></div>
      <div className="grid gap-3">
        {stats.map((s, idx) => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 p-3 rounded flex items-center gap-2 text-xs">
             <div className="w-8 text-slate-500 font-mono">{idx+1}</div>
             <div className="flex-1"><label className="block text-[9px] text-slate-500 uppercase">Label</label><input value={s.label} onChange={(e) => updateStat(idx, 'label', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"/></div>
             <div className="flex-1"><label className="block text-[9px] text-slate-500 uppercase">Key (Code)</label><input value={s.key} onChange={(e) => updateStat(idx, 'key', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-400 font-mono"/></div>
             <div className="w-20"><label className="block text-[9px] text-slate-500 uppercase">Base</label><input type="number" value={s.baseValue} onChange={(e) => updateStat(idx, 'baseValue', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-right"/></div>
             <div className="w-32"><label className="block text-[9px] text-slate-500 uppercase">Groupe</label><select value={s.group} onChange={(e) => updateStat(idx, 'group', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"><option>Primary</option><option>Secondary</option><option>Derived</option><option>Combat</option><option>Hidden</option></select></div>
             <button onClick={() => removeStat(idx)} className="text-slate-600 hover:text-red-400 p-2"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};
