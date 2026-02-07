
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Package, Filter, ArrowRight, Layers } from 'lucide-react';
import { Entity, EntityType, ItemSlot, ItemCategory, StatDefinition } from '../../types';
import { EntityForm } from './EntityForm';

interface EntitiesEditorProps {
    entities: Entity[];
    setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
    stats: StatDefinition[];
    filterType: string;
    slots: ItemSlot[];
    categories: ItemCategory[];
}

const ENTITY_TYPE_LABELS: Record<string, string> = {
  [EntityType.RACE]: 'Race',
  [EntityType.RACIAL_COMPETENCE]: 'Compétence Raciale',
  [EntityType.CLASS]: 'Classe',
  [EntityType.SPECIALIZATION]: 'Spécialisation',
  [EntityType.ELITE_COMPETENCE]: 'Compétence d\'Élite',
  [EntityType.PROFESSION]: 'Métier',
  [EntityType.CAREER]: 'Carrière',
  [EntityType.ITEM]: 'Objet',
  [EntityType.ITEM_SET]: 'Set',
  [EntityType.BUFF]: 'Buff',
  [EntityType.GLOBAL_RULE]: 'Règle Globale',
  [EntityType.FACTION]: 'Faction (Identité)',
  [EntityType.GUILD]: 'Guilde',
};

export const EntitiesEditor: React.FC<EntitiesEditorProps> = ({ entities, setEntities, stats, filterType, slots, categories }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Level 2 Filter: Category (Items) or Parent Class/Race
    const [subFilter, setSubFilter] = useState(''); 
    
    // Level 3 Filter: Sub-Category (Items only)
    const [tertiaryFilter, setTertiaryFilter] = useState(''); 
    
    // RESET filters when switching main tabs
    useEffect(() => {
        setSubFilter('');
        setTertiaryFilter('');
        setSearchTerm('');
        setSelectedId(null);
    }, [filterType]);

    // RESET tertiary when sub changes
    useEffect(() => {
        setTertiaryFilter('');
    }, [subFilter]);

    // Derived sub-filter options (Level 2)
    const subFilterOptions = useMemo(() => {
        if (filterType === EntityType.ITEM) {
            return categories.map(c => ({ value: c.id, label: c.name }));
        }
        if (filterType === EntityType.SPECIALIZATION || filterType === EntityType.ELITE_COMPETENCE) {
            return entities
                .filter(e => e.type === EntityType.CLASS)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(c => ({ value: c.id, label: c.name }));
        }
        if (filterType === EntityType.RACIAL_COMPETENCE) {
            return entities
                .filter(e => e.type === EntityType.RACE)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(r => ({ value: r.id, label: r.name }));
        }
        return [];
    }, [filterType, categories, entities]);

    // Derived tertiary-filter options (Level 3 - Items Only)
    const tertiaryFilterOptions = useMemo(() => {
        if (filterType === EntityType.ITEM && subFilter) {
            const category = categories.find(c => c.id === subFilter);
            if (category && category.subCategories) {
                return category.subCategories.map(sc => ({ value: sc, label: sc }));
            }
        }
        return [];
    }, [filterType, subFilter, categories]);

    const filtered = entities.filter(e => {
        // 1. Main Type Filter
        if (filterType !== 'ALL' && e.type !== filterType) return false;
        
        // 2. Search Text
        if (searchTerm && !e.name.toLowerCase().includes(searchTerm.toLowerCase()) && !e.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        
        // 3. Sub-Filter Logic
        if (subFilter) {
            if (e.type === EntityType.ITEM) {
                if (e.categoryId !== subFilter) return false;
                // 4. Tertiary Filter Logic (Sub-Category)
                if (tertiaryFilter && e.subCategory !== tertiaryFilter) return false;
            } else if ([EntityType.SPECIALIZATION, EntityType.ELITE_COMPETENCE, EntityType.RACIAL_COMPETENCE].includes(e.type as EntityType)) {
                if (e.parentId !== subFilter) return false;
            }
        }
        
        return true;
    });

    const selectedEntity = entities.find(e => e.id === selectedId);

    const handleUpdate = (updated: Entity) => {
        setEntities(entities.map(e => e.id === updated.id ? updated : e));
    };

    const handleAdd = () => {
        const newId = `new_${filterType !== 'ALL' ? filterType.toLowerCase() : 'entity'}_${Date.now()}`;
        const newEntity: Entity = {
            id: newId,
            type: filterType !== 'ALL' ? filterType as EntityType : EntityType.ITEM,
            name: 'Nouvelle Entité',
            modifiers: [],
            // Auto-link parent if filter is active
            parentId: (subFilter && filterType !== EntityType.ITEM) ? subFilter : undefined,
            categoryId: (subFilter && filterType === EntityType.ITEM) ? subFilter : undefined,
            subCategory: (tertiaryFilter && filterType === EntityType.ITEM) ? tertiaryFilter : undefined
        };
        setEntities([...entities, newEntity]);
        setSelectedId(newId);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Supprimer cette entité ?')) {
            setEntities(entities.filter(e => e.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    const getFilterLabel = () => {
        if (filterType === EntityType.ITEM) return "Catégorie";
        if (filterType === EntityType.SPECIALIZATION || filterType === EntityType.ELITE_COMPETENCE) return "Classe Parente";
        if (filterType === EntityType.RACIAL_COMPETENCE) return "Race Parente";
        return "Filtre";
    };

    return (
        <div className="flex h-full">
            <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
                <div className="p-4 border-b border-slate-800 space-y-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-500"/>
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors" placeholder="Rechercher..."/>
                    </div>
                    
                    {/* LEVEL 2 FILTER (Category / Parent) */}
                    {subFilterOptions.length > 0 && (
                        <div className="relative">
                            <Filter size={14} className="absolute left-3 top-2.5 text-indigo-400"/>
                            <select 
                                value={subFilter} 
                                onChange={e => setSubFilter(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-8 py-2 text-xs text-indigo-300 font-bold appearance-none outline-none focus:border-indigo-500 transition-colors cursor-pointer hover:bg-slate-800"
                            >
                                <option value="">-- {getFilterLabel()} (Tout) --</option>
                                {subFilterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <ArrowRight size={12} className="absolute right-3 top-3 text-slate-600 pointer-events-none rotate-90"/>
                        </div>
                    )}

                    {/* LEVEL 3 FILTER (Sub-Category for Items) */}
                    {tertiaryFilterOptions.length > 0 && (
                        <div className="relative animate-in fade-in slide-in-from-top-1">
                            <Layers size={14} className="absolute left-3 top-2.5 text-emerald-400"/>
                            <select 
                                value={tertiaryFilter} 
                                onChange={e => setTertiaryFilter(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-8 py-2 text-xs text-emerald-300 font-bold appearance-none outline-none focus:border-emerald-500 transition-colors cursor-pointer hover:bg-slate-800"
                            >
                                <option value="">-- Sous-Type (Tout) --</option>
                                {tertiaryFilterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <ArrowRight size={12} className="absolute right-3 top-3 text-slate-600 pointer-events-none rotate-90"/>
                        </div>
                    )}

                    <button onClick={handleAdd} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-xs font-bold uppercase flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/20"><Plus size={14} className="mr-2"/> Créer {filterType !== 'ALL' ? ENTITY_TYPE_LABELS[filterType] : 'Entité'}</button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filtered.length > 0 ? filtered.map(e => (
                        <div key={e.id} onClick={() => setSelectedId(e.id)} className={`p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors group ${selectedId === e.id ? 'bg-indigo-900/20 border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'}`}>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-bold ${selectedId === e.id ? 'text-indigo-300' : 'text-slate-300 group-hover:text-white'}`}>{e.name}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-[10px] text-slate-500 truncate max-w-[150px] font-mono opacity-70">{e.id}</div>
                                {e.type === EntityType.ITEM && e.subCategory && <div className="text-[9px] text-slate-400 bg-slate-900 px-1.5 rounded border border-slate-700">{e.subCategory}</div>}
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-500 text-xs italic">Aucun résultat.</div>
                    )}
                </div>
            </div>
            <div className="w-2/3 h-full overflow-y-auto bg-slate-950 p-6 custom-scrollbar">
                {selectedEntity ? (
                    <EntityForm 
                        entity={selectedEntity}
                        entities={entities}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        stats={stats}
                        slots={slots}
                        categories={categories}
                        typeLabels={ENTITY_TYPE_LABELS}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <Package size={48} className="mb-4 opacity-50"/>
                        <p>Sélectionnez une entité pour l'éditer</p>
                    </div>
                )}
            </div>
        </div>
    )
}
