
import React, { useState, useMemo } from 'react';
import { Settings, Check, Copy, Play, Trash2 } from 'lucide-react';
import { Modifier, StatDefinition, ModifierType } from '../../types';
import { evaluateFormula } from '../../services/engine';
import { TAG_OPTIONS } from '../../services/data';

interface ModifierCardProps {
    mod: Modifier;
    stats: StatDefinition[];
    onChange: (m: Modifier) => void;
    onDelete: () => void;
}

const MODIFIER_TYPE_LABELS: Record<string, string> = {
  [ModifierType.FLAT]: 'Fixe (Flat)',
  [ModifierType.PERCENT_ADD]: '% Additif',
  [ModifierType.PERCENT_MULTI_PRE]: 'Multi. (Pré-Posture)',
  [ModifierType.FINAL_ADDITIVE_PERCENT]: 'Post-Additive (%)',
  [ModifierType.ALT_FLAT]: 'Alt Fixe (Post-%)',
  [ModifierType.ALT_PERCENT]: 'Alt Multi (Final)',
  [ModifierType.OVERRIDE]: 'Écraser (Override)'
};

const createMockContext = (lvl: number) => {
    const baseContext: any = {
        level: lvl,
        vit: 100 * lvl, spd: 100, dmg: 10 + lvl,
        effect_booster: 0, 
        special_mastery: 0, 
        itemIds: [],
        countItems: () => 0, sumItemStats: () => 0, hasItem: () => false, bestItemStat: () => 0, countCustomItems: () => 0,
    };

    return new Proxy(baseContext, {
        get: (target, prop) => {
            if (prop in target) return target[prop];
            return 0;
        },
        ownKeys: (target) => Reflect.ownKeys(target),
        has: (target, prop) => true 
    });
};

export const ModifierCard: React.FC<ModifierCardProps> = ({ mod, stats, onChange, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingId, setIsEditingId] = useState(false);
    
    const previewValues = useMemo(() => {
        if (!mod.value) return null;
        try {
            return {
                lvl1: evaluateFormula(mod.value, createMockContext(1)),
                lvl10: evaluateFormula(mod.value, createMockContext(10)),
                lvl30: evaluateFormula(mod.value, createMockContext(30)),
                lvl60: evaluateFormula(mod.value, createMockContext(60))
            };
        } catch (e) { return null; }
    }, [mod.value]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 transition-all hover:border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 flex-1 mr-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">ID</span>
                    {isEditingId ? (
                        <div className="flex items-center flex-1 max-w-[200px]">
                             <input value={mod.id} onChange={(e) => onChange({...mod, id: e.target.value})} onBlur={() => setIsEditingId(false)} className="w-full bg-indigo-900/30 border border-indigo-500 rounded px-1.5 py-0.5 text-xs font-mono text-indigo-300 focus:outline-none" autoFocus />
                             <button onClick={() => setIsEditingId(false)} className="ml-1 text-green-400 hover:text-green-300"><Check size={12}/></button>
                        </div>
                    ) : (
                        <div className="flex items-center group cursor-pointer" onClick={() => setIsEditingId(true)} title="Cliquer pour éditer l'ID">
                            <span className="text-xs font-mono text-indigo-400 bg-indigo-900/10 border border-indigo-500/20 px-1.5 py-0.5 rounded select-all group-hover:border-indigo-500/50 transition-colors">{mod.id}</span>
                        </div>
                    )}
                     <button onClick={() => navigator.clipboard.writeText(mod.id)} className="text-slate-600 hover:text-white transition-colors" title="Copier l'ID"><Copy size={12} /></button>
                </div>
                <div className="flex items-center space-x-2">
                     <button onClick={() => setIsExpanded(!isExpanded)} className={`text-slate-500 hover:text-white transition-colors ${mod.condition || mod.toggleId || mod.name || mod.displayTag ? 'text-blue-400' : ''}`} title="Options Avancées"><Settings size={14} /></button>
                     <button onClick={onDelete} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-3 mb-3">
                 <div className="col-span-4">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Stat Cible</label>
                      <select value={mod.targetStatKey} onChange={(e) => onChange({ ...mod, targetStatKey: e.target.value })} className="w-full bg-slate-950 text-xs text-amber-400 font-bold outline-none border border-slate-700 rounded px-2 py-1.5 focus:border-amber-500">
                           {stats.map(s => <option key={s.key} value={s.key}>{s.label} ({s.key})</option>)}
                      </select>
                 </div>
                 <div className="col-span-3">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Type Opération</label>
                      <select value={mod.type} onChange={(e) => onChange({ ...mod, type: e.target.value as ModifierType })} className="w-full bg-slate-950 text-xs text-slate-300 outline-none border border-slate-700 rounded px-2 py-1.5 focus:border-indigo-500">
                           {Object.entries(MODIFIER_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                 </div>
                 <div className="col-span-5">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Formule / Valeur</label>
                      <div className="flex items-center bg-slate-950 border border-slate-700 rounded px-2 focus-within:border-indigo-500 transition-colors">
                           <span className="text-slate-500 text-xs font-mono mr-2">=</span>
                           <input value={mod.value} onChange={(e) => onChange({ ...mod, value: e.target.value })} className="w-full bg-transparent text-white text-sm font-mono py-1.5 outline-none" placeholder="10, level * 5..." />
                      </div>
                 </div>
            </div>
            {previewValues && (
                <div className="flex items-center space-x-4 bg-indigo-900/10 border border-indigo-500/20 rounded px-3 py-1.5 mb-3">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase flex items-center"><Play size={10} className="mr-1"/> Simulation</span>
                    <div className="flex space-x-3 text-[10px] font-mono text-slate-300">
                        <span title="Niveau 1">L1: <span className="text-white">{Math.floor(previewValues.lvl1)}</span></span>
                        <span className="text-slate-700">|</span>
                        <span title="Niveau 10">L10: <span className="text-white">{Math.floor(previewValues.lvl10)}</span></span>
                        <span className="text-slate-700">|</span>
                        <span title="Niveau 30">L30: <span className="text-white">{Math.floor(previewValues.lvl30)}</span></span>
                        <span className="text-slate-700">|</span>
                        <span title="Niveau 60">L60: <span className="text-white">{Math.floor(previewValues.lvl60)}</span></span>
                    </div>
                </div>
            )}
            {(isExpanded || mod.condition || mod.toggleId || mod.name || mod.displayTag) && (
                <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/50 -mx-4 px-4 pb-2 rounded-b-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Label (Trace Logs)</label><input value={mod.name || ''} onChange={(e) => onChange({ ...mod, name: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-indigo-500" placeholder="ex: Maîtrise de l'épée" /></div>
                        <div><label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Tag Visuel (Joueur)</label><select value={mod.displayTag || ''} onChange={(e) => onChange({ ...mod, displayTag: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-indigo-300 outline-none focus:border-indigo-500">{TAG_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                    </div>
                    <div><label className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-between"><span>Condition JS (Optionnel)</span><span className="text-[9px] font-normal lowercase text-slate-600">ex: level &gt;= 10 && hasItem('sword')</span></label><div className="flex items-center bg-slate-950 border border-slate-700 rounded px-2"><span className="text-yellow-600 font-mono text-xs mr-2">if</span><input value={mod.condition || ''} onChange={(e) => onChange({ ...mod, condition: e.target.value })} className="w-full bg-transparent text-yellow-500 text-xs font-mono py-1.5 outline-none placeholder-slate-700" placeholder="true" /></div></div>
                    <div className="grid grid-cols-3 gap-3">
                         <div><label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Toggle ID</label><input value={mod.toggleId || ''} onChange={(e) => onChange({ ...mod, toggleId: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-orange-300 font-mono outline-none focus:border-orange-500" placeholder="ex: underwater" /></div>
                         <div className="col-span-2"><label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Nom du Toggle (UI)</label><input value={mod.toggleName || ''} onChange={(e) => onChange({ ...mod, toggleName: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-orange-500" placeholder="ex: Sous l'eau" /></div>
                         <div><label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Groupe Toggle</label><input value={mod.toggleGroup || ''} onChange={(e) => onChange({ ...mod, toggleGroup: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-orange-500" placeholder="ex: stances" /></div>
                    </div>
                </div>
            )}
        </div>
    );
};
