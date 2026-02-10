
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StatDefinition, Entity, EntityType, ItemSlot, ItemCategory } from '../types';
import { 
  User, Sword, Zap, Hammer, Layers, 
  Scroll, Package, Globe, Calculator,
  LayoutDashboard, Settings, Save, FolderOpen, RefreshCw, Flag, AlertTriangle, Stethoscope, Briefcase, Users, Crown, Dna, Shield, CloudLightning, HardDrive
} from 'lucide-react';
import { INITIAL_STATS, INITIAL_ENTITIES, ITEM_SLOTS, ITEM_CATEGORIES } from '../services/data';
import { validateFormulaSyntax, analyzeFormulaReferences } from '../services/engine';

// Imported Sub-components
import { StatsEditor } from './admin/StatsEditor';
import { ConfigEditor } from './admin/ConfigEditor';
import { EntitiesEditor } from './admin/EntitiesEditor';

interface Props {
  stats: StatDefinition[];
  setStats: React.Dispatch<React.SetStateAction<StatDefinition[]>>;
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  slots: ItemSlot[];
  setSlots: React.Dispatch<React.SetStateAction<ItemSlot[]>>;
  categories: ItemCategory[];
  setCategories: React.Dispatch<React.SetStateAction<ItemCategory[]>>;
  onFactoryReset?: () => void;
}

const DiagnosticPanel: React.FC<{ entities: Entity[]; stats: StatDefinition[]; categories: ItemCategory[]; }> = ({ entities, stats, categories }) => {
    const errors: string[] = [];
    const statKeys = new Set<string>(stats.map(s => s.key));
    const validIds = new Set<string>(entities.map(e => e.id));
    
    const validKeywords = new Set<string>([
        ...Array.from(statKeys),
        'level', 'soul_count', 'pass_index', 'is_final_pass',
        'classId', 'raceId', 'careerId', 'factionId', 'guildIds',
        'context', 'toggles',
        'countItems', 'countSet', 'countFaction', 'sumItemStats', 'bestItemStat', 
        'maxItemCost', 'sumOriginalItemCost', 'maxOriginalItemCost', 'countCustomItems', 'hasItem',
        'political_points_input',
        'career_adventure_rank', 'career_adventure_stacks',
        'career_institut_rank', 'career_institut_specialty', 
        'career_artist_rank', 'career_religion_rank', 'career_commerce_rank', 'career_athlete_rank',
        'arcane_sacrifice_count', 'colere_vive_stacks', 'sans_peur_stacks', 'rage_stacks',
        'ratio_deck_dmg', 'ratio_deck_spd', 'ratio_deck_vit', 'ratio_deck_crit',
        'malus_aqua'
    ]);

    entities.forEach(e => {
        if (e.userConfig) {
            validKeywords.add(`config_${e.id}_val`);
            validKeywords.add(`config_${e.id}_vit`);
            validKeywords.add(`config_${e.id}_spd`);
            validKeywords.add(`config_${e.id}_dmg`);
        }
    });

    entities.forEach(e => {
        (e.modifiers || []).forEach(m => {
            if (!statKeys.has(m.targetStatKey)) {
                errors.push(`[${e.name}] Modificateur cible une stat inconnue : "${m.targetStatKey}"`);
            }
            if (!validateFormulaSyntax(m.value)) {
                errors.push(`[${e.name}] Erreur de syntaxe dans la formule : "${m.value}"`);
            }
            const unknownRefs = analyzeFormulaReferences(m.value, validKeywords);
            unknownRefs.forEach(ref => {
                if (!validIds.has(ref)) {
                    const isKnownToggle = entities.some(ent => ent.modifiers?.some(mod => mod.toggleId === ref));
                    if (!isKnownToggle) {
                        errors.push(`[${e.name}] Référence inconnue dans la formule : "${ref}"`);
                    }
                }
            });
            const setMatch = m.condition?.match(/(?:countSet|countFaction)\(['"]([^'"]+)['"]\)/);
            if (setMatch && !validIds.has(setMatch[1])) {
                errors.push(`[${e.name}] Condition référence un ID inexistant : "${setMatch[1]}"`);
            }
        });

        if (e.type === EntityType.ITEM && e.setId && !validIds.has(e.setId)) {
            errors.push(`[${e.name}] Item lié à un Set ID inconnu : "${e.setId}"`);
        }
        if (e.type === EntityType.ITEM && e.factionId && !validIds.has(e.factionId)) {
            errors.push(`[${e.name}] Item lié à une Faction ID inconnue : "${e.factionId}"`);
        }
        if (e.type === EntityType.ITEM && e.categoryId) {
             const cat = categories.find(c => c.id === e.categoryId);
             if (!cat) errors.push(`[${e.name}] Catégorie inconnue : "${e.categoryId}"`);
        }
    });

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center"><Stethoscope size={20} className="mr-2"/> Diagnostic d'Intégrité Profond</h3>
            {errors.length === 0 ? <div className="text-green-400 font-bold p-4 bg-green-900/20 rounded border border-green-500/30">Aucune anomalie détectée. Le système est stable.</div> : (
                <div className="bg-red-900/20 border border-red-500/30 rounded p-4 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {errors.map((err, i) => <div key={i} className="text-xs text-red-300 font-mono border-b border-red-900/30 pb-1 mb-1 last:border-0 flex items-start"><AlertTriangle size={12} className="mr-2 mt-0.5 flex-shrink-0"/> {err}</div>)}
                </div>
            )}
        </div>
    )
}

export function AdminPanel({ stats, setStats, entities, setEntities, slots, setSlots, categories, setCategories, onFactoryReset }: Props) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarCategories = [
    { id: 'ALL', label: 'Tout voir', icon: Layers },
    { id: EntityType.RACE, label: 'Races', icon: User },
    { id: EntityType.RACIAL_COMPETENCE, label: 'Comp. Raciale', icon: Dna },
    { id: EntityType.CLASS, label: 'Classes', icon: Sword },
    { id: EntityType.SPECIALIZATION, label: 'Spécialisations', icon: Zap },
    { id: EntityType.ELITE_COMPETENCE, label: 'Comp. Élite', icon: Crown }, 
    { id: EntityType.PROFESSION, label: 'Métiers', icon: Hammer },
    { id: EntityType.CAREER, label: 'Carrières', icon: Briefcase }, 
    { id: EntityType.FACTION, label: 'Factions (Identité)', icon: Flag },
    { id: EntityType.GUILD, label: 'Guildes', icon: Users },
    { id: EntityType.ITEM, label: 'Objets', icon: Shield },
    { id: EntityType.ITEM_SET, label: 'Sets', icon: Package },
    { id: EntityType.BUFF, label: 'Buffs', icon: Scroll },
    { id: EntityType.GLOBAL_RULE, label: 'Règles Globales', icon: Globe },
    { id: 'STATS', label: 'Statistiques', icon: Calculator },
    { id: 'CONFIG', label: 'Configuration', icon: Settings },
    { id: 'DIAGNOSTIC', label: 'Diagnostic', icon: Stethoscope },
  ];
  
  const handleResetDefaults = () => { 
      if (!isResetConfirming) {
          setIsResetConfirming(true);
          setTimeout(() => setIsResetConfirming(false), 3000); 
      } else {
          if (onFactoryReset) onFactoryReset();
          else {
              setStats(INITIAL_STATS); 
              setEntities(INITIAL_ENTITIES); 
              setSlots(ITEM_SLOTS); 
              setCategories(ITEM_CATEGORIES);
          }
          setIsResetConfirming(false);
      }
  };

  // --- MODERN FILE SYSTEM ACCESS API WITH FALLBACK ---
  
  const handleSaveToDisk = async () => {
    const dataToSave = { stats, entities, slots, categories };
    const jsonString = JSON.stringify(dataToSave, null, 2);

    const performFallbackDownload = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omnistat_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    try {
        // @ts-ignore
        // On vérifie si l'API est supportée ET si on n'est pas dans une iframe bloquée (try/catch global)
        if (typeof window.showSaveFilePicker === 'function') {
            // @ts-ignore
            const handle = await window.showSaveFilePicker({
                suggestedName: 'omnistat_data.json',
                types: [{ description: 'Fichier de Données OmniStat', accept: { 'application/json': ['.json'] } }],
            });
            const writable = await handle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            alert("Fichier sauvegardé avec succès ! (Écrasement direct)");
        } else {
            performFallbackDownload();
        }
    } catch (err: any) {
        // Si l'utilisateur annule, on ne fait rien
        if (err.name === 'AbortError') return;
        
        // Si erreur de sécurité (iframe) ou API non supportée, on utilise le fallback
        console.warn("API File System non disponible ou bloquée (iframe), utilisation du téléchargement classique.", err);
        performFallbackDownload();
    }
  };

  const handleOpenFromDisk = async () => {
      const performFallbackOpen = () => {
          // On clique sur l'input caché standard
          fileInputRef.current?.click();
      };

      try {
        // @ts-ignore
        if (typeof window.showOpenFilePicker === 'function') {
            // @ts-ignore
            const [handle] = await window.showOpenFilePicker({
                types: [{ description: 'Fichier de Données OmniStat', accept: { 'application/json': ['.json'] } }],
                multiple: false
            });
            const file = await handle.getFile();
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.stats) setStats(data.stats); 
            if (data.entities) setEntities(data.entities); 
            if (data.slots) setSlots(data.slots); 
            if (data.categories) setCategories(data.categories);
            
            alert(`Fichier "${file.name}" chargé avec succès !`);
        } else {
            performFallbackOpen();
        }
      } catch (err: any) {
          if (err.name === 'AbortError') return;
          
          console.warn("API File System non disponible ou bloquée (iframe), utilisation de l'input classique.", err);
          performFallbackOpen();
      }
  };

  // Fallback handler for hidden input
  const handleImportFallback = (event: React.ChangeEvent<HTMLInputElement>) => { 
      const file = event.target.files?.[0]; 
      if (!file) return; 
      const reader = new FileReader(); 
      reader.onload = (e) => { 
          try { 
              const content = e.target?.result as string; 
              const data = JSON.parse(content); 
              if (data.stats) setStats(data.stats); 
              if (data.entities) setEntities(data.entities); 
              if (data.slots) setSlots(data.slots); 
              if (data.categories) setCategories(data.categories); 
              alert("Import réussi !"); 
          } catch (err) { console.error(err); alert("Erreur fichier."); } 
      }; 
      reader.readAsText(file); 
      event.target.value = ''; 
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <header className="flex-none px-8 py-4 border-b border-slate-800 bg-slate-900 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4"><div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20"><Settings size={24} className="text-white" /></div><div><h2 className="text-xl font-bold text-white leading-none">Administration OmniStat</h2><p className="text-slate-500 text-xs mt-1">Version du Système 1.0.9 (Safe FS)</p></div></div>
        
        {/* Save & Reset Actions */}
        <div className="flex items-center space-x-3">
            {/* Auto Save Indicator */}
            <div className="hidden md:flex flex-col items-end mr-4">
                <div className="flex items-center text-[10px] text-emerald-400 bg-emerald-900/20 px-2.5 py-1 rounded border border-emerald-500/20" title="Vos modifications sont enregistrées en temps réel dans le navigateur">
                    <CloudLightning size={12} className="mr-1.5" /> Cache Local: Actif
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 flex items-center">
                    <HardDrive size={10} className="mr-1" /> Persistance : Fichier
                </div>
            </div>

            <button onClick={handleOpenFromDisk} className="flex items-center space-x-2 px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-xs font-bold transition-colors border border-slate-700">
                <FolderOpen size={14} />
                <span>Ouvrir</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImportFallback} accept=".json" className="hidden" />

            <button onClick={handleSaveToDisk} className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20 border border-emerald-500/50">
                <Save size={14} />
                <span>Sauvegarder</span>
            </button>
            
            <div className="h-6 w-px bg-slate-800 mx-1"></div>

            <button 
                onClick={handleResetDefaults} 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                    isResetConfirming 
                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                    : 'bg-red-900/20 text-red-400 hover:bg-red-900/40 border-red-900/50'
                }`}
                title="Restaure les données d'usine (Efface le cache)"
            >
                {isResetConfirming ? <><AlertTriangle size={14} /><span>Sûr ?</span></> : <><RefreshCw size={14} /><span>Reset</span></>}
            </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col"><div className="p-4"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bibliothèque</h3></div><nav className="flex-1 space-y-1 px-2 overflow-y-auto">{sidebarCategories.map(cat => (<button key={cat.id} onClick={() => setFilterType(cat.id)} className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${filterType === cat.id ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><div className="flex items-center"><cat.icon size={18} className={`mr-3 ${filterType === cat.id ? 'text-indigo-400' : 'text-slate-500'}`} />{cat.label}</div><span className="text-xs bg-slate-800 text-slate-500 py-0.5 px-2 rounded-full">{cat.id === 'STATS' ? stats.length : cat.id === 'CONFIG' ? slots.length + categories.length : cat.id === 'DIAGNOSTIC' ? '-' : cat.id === 'ALL' ? entities.length : entities.filter(e => e.type === cat.id).length}</span></button>))}</nav><div className="p-4 border-t border-slate-800 space-y-1"><Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"><LayoutDashboard size={18} className="mr-3" />Créateur de Perso</Link><div className="flex items-center px-3 py-2 text-sm font-medium text-indigo-400 bg-indigo-600/10 rounded-lg cursor-default"><Settings size={18} className="mr-3" />Administration</div></div></div>
          <main className="flex-1 overflow-hidden relative bg-slate-950">
                {filterType === 'STATS' ? (<div className="p-8 h-full overflow-y-auto"><div className="max-w-7xl mx-auto"><StatsEditor stats={stats} setStats={setStats} /></div></div>) : filterType === 'CONFIG' ? (<div className="p-8 h-full overflow-y-auto"><div className="max-w-7xl mx-auto"><ConfigEditor slots={slots} setSlots={setSlots} categories={categories} setCategories={setCategories} /></div></div>) : filterType === 'DIAGNOSTIC' ? (<div className="p-8 h-full overflow-y-auto"><div className="max-w-7xl mx-auto"><DiagnosticPanel entities={entities} stats={stats} categories={categories} /></div></div>) : (<EntitiesEditor entities={entities} setEntities={setEntities} stats={stats} filterType={filterType} slots={slots} categories={categories} />)}
          </main>
      </div>
    </div>
  );
}
