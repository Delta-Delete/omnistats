
import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, X, Layers, Anvil, Hammer, Coins, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { ItemSlot, ItemCategory, Entity, StatDefinition, Rarity } from '../../types';
import { ItemPickerCard } from './picker/ItemPickerCard';

const CLASS_RESTRICTED_SUB_CATEGORIES: Record<string, string[]> = {
    'Casque technologique': ['technophiles'],
    'Armure technologique': ['technophiles'],
    'Bottes technologiques': ['technophiles'],
    'Armes technologiques': ['technophiles'],
    'Boucliers technologiques': ['technophiles'],
    'Chapeau': ['arlequins'],
    'Costume': ['arlequins'],
    'Capuche': ['corrompu'],
    'Manteau': ['corrompu'],
    'Bottes de Corrompus': ['corrompu'],
    'Équipement sacré': ['paladins'], 
    'Armes sacrées': ['conjurateurs'],
};

export const ItemPickerModal: React.FC<{
    slot: ItemSlot;
    categories: ItemCategory[];
    allItems: Entity[];
    factions: Entity[];
    stats: StatDefinition[];
    acceptedCategories?: string[];
    currentId?: string;
    onClose: () => void;
    onSelect: (itemId: string) => void;
    context: any; 
}> = ({ slot, categories, allItems, factions, stats, acceptedCategories, currentId, onClose, onSelect, context }) => {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    
    // FILTERS
    const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
    const [tungstenFilter, setTungstenFilter] = useState(false);
    const [craftableFilter, setCraftableFilter] = useState(false);
    const [costFilter, setCostFilter] = useState<number | 'all'>('all'); // 'all', 1, 2
    
    // SORT
    const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');

    const currentItem = useMemo(() => allItems.find(i => i.id === currentId), [allItems, currentId]);

    const isSubCategoryAllowed = (subCat: string | undefined, classId: string | undefined) => {
        if (!subCat) return true;
        const allowedClasses = CLASS_RESTRICTED_SUB_CATEGORIES[subCat];
        if (!allowedClasses) return true;
        return allowedClasses.includes(classId || '');
    };

    const filteredItems = useMemo(() => {
        let result = allItems.filter(item => {
            if (!isSubCategoryAllowed(item.subCategory, context.classId)) return false;

            if (slot.id === 'tetrachire_weapon') {
                const sub = item.subCategory || '';
                const forbidden = ['Bâtons d’éther', 'Bâtons', 'Armes technologiques', 'Boucliers technologiques', 'Armes sacrées', 'Decks'];
                if (forbidden.includes(sub)) return false;
                if (sub.startsWith('Instrument')) return false;
                const isWeaponOrShield = item.categoryId === 'weapon' || sub === 'Boucliers';
                if (!isWeaponOrShield) return false;
                const cost = item.equipmentCost || 0;
                if (context.racialCompetenceActive) {
                    if (cost > 2) return false;
                    if (item.id.startsWith('fused_') || sub === 'Amalgame') return false; 
                } else {
                    if (cost > 1) return false;
                }
            } else {
                if (acceptedCategories && acceptedCategories.length > 0) {
                     if (!item.categoryId) return false;
                     const isSubAllowed = item.subCategory && acceptedCategories.includes(item.subCategory);
                     const isCatAllowed = item.categoryId && acceptedCategories.includes(item.categoryId);
                     if (!isSubAllowed && !isCatAllowed) return false;
                } else if (slot.acceptedCategories && slot.acceptedCategories.length > 0) {
                     if (!item.categoryId || !slot.acceptedCategories.includes(item.categoryId)) return false;
                }
            }
            
            if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (catFilter && item.categoryId !== catFilter && item.subCategory !== catFilter) return false;

            // RARITY
            if (rarityFilter !== 'all') {
                const itemRarity = item.rarity || 'normal';
                if (itemRarity !== rarityFilter) return false;
            }
            
            // SPECIAL PROPERTIES
            if (tungstenFilter && !item.isTungsten) return false;
            if (craftableFilter && !item.isCraftable) return false;
            
            // COST
            if (costFilter !== 'all') {
                const itemCost = item.equipmentCost || 0; // Default to 0 for accessories? Or 1 for weapons?
                // Logic: if filtering for cost 1, show items with cost 1. If filtering for 2, show 2.
                // Usually applies to weapons/shields.
                if (itemCost !== costFilter) return false;
            }

            if (item.modifiers) {
                const classRestriction = item.modifiers.find(m => m.condition && (m.condition.includes("classId ===") || m.condition.includes("classId ==")));
                if (classRestriction) {
                    const match = classRestriction.condition!.match(/classId\s*={2,3}\s*['"]([^'"]+)['"]/);
                    if (match && context.classId !== match[1]) return false;
                }
            }
            return true;
        });

        // SORTING
        if (priceSort !== 'default') {
            result.sort((a, b) => {
                const priceA = a.goldCost || 0;
                const priceB = b.goldCost || 0;
                if (priceSort === 'asc') return priceA - priceB;
                return priceB - priceA;
            });
        }

        return result;
    }, [allItems, acceptedCategories, slot, search, catFilter, rarityFilter, tungstenFilter, craftableFilter, costFilter, priceSort, context.classId, context.racialCompetenceActive]);

    const relevantSubCategories = useMemo(() => {
        if (slot.id === 'tetrachire_weapon') {
            const set = new Set<string>();
            filteredItems.forEach(item => { if (item.subCategory) set.add(item.subCategory); });
            return Array.from(set).sort();
        }
        const targetIds = acceptedCategories || slot.acceptedCategories || [];
        const set = new Set<string>();
        categories.forEach(cat => { if (targetIds.includes(cat.id)) { (cat.subCategories || []).forEach(sc => set.add(sc)); } });
        allItems.forEach(item => { if (item.categoryId && targetIds.includes(item.categoryId) && item.subCategory) { set.add(item.subCategory); } });
        targetIds.forEach(t => { if (!categories.some(c => c.id === t)) set.add(t); });
        return Array.from(set).filter(sc => isSubCategoryAllowed(sc, context.classId)).sort();
    }, [categories, slot, acceptedCategories, allItems, context.classId, filteredItems]);

    // Helper for Rarity Button
    const RarityButton = ({ r, label, colorClass }: { r: Rarity | 'all', label: string, colorClass: string }) => (
        <button 
            onClick={() => setRarityFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                rarityFilter === r 
                ? `${colorClass} border-current shadow-sm` 
                : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'
            }`}
        >
            {label}
        </button>
    );

    const cyclePriceSort = () => {
        if (priceSort === 'default') setPriceSort('asc');
        else if (priceSort === 'asc') setPriceSort('desc');
        else setPriceSort('default');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
            <div className="bg-slate-950 border border-slate-700 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                
                {/* HEADER */}
                <div className="flex-none p-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center relative z-10 shadow-lg">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center tracking-wide font-perrigord">
                            <Search size={22} className="mr-3 text-indigo-400" /> {slot.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                            Sélectionnez un objet pour l'équiper.
                            {currentItem && (
                                <span className="ml-2 pl-2 border-l border-slate-700 text-slate-400">
                                    Actuel : <span className="text-indigo-300 font-bold">{currentItem.name}</span>
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => onSelect('none')} className="flex items-center px-4 py-2 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 hover:bg-red-900/30 transition-colors text-xs font-bold uppercase hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                            <X size={14} className="mr-2" /> Retirer
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                            <X size={20}/>
                        </button>
                    </div>
                </div>

                {/* ADVANCED FILTERS BAR */}
                <div className="flex-none p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col gap-4 backdrop-blur-sm z-10">
                    {/* Top Row: Search & Category */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                        <div className="relative flex-1 w-full">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-500" placeholder={`Rechercher dans ${slot.name}...`} value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                        {relevantSubCategories.length > 0 && (
                            <div className="relative min-w-[200px] w-full sm:w-auto">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"><Filter size={16} /></div>
                                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:border-indigo-500 cursor-pointer hover:border-slate-600 appearance-none transition-colors">
                                    <option value="" className="bg-slate-900 text-slate-300">Tous les types</option>
                                    {relevantSubCategories.map(sc => (<option key={sc} value={sc} className="bg-slate-900 text-slate-300">{sc}</option>))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                        )}
                    </div>

                    {/* Bottom Row: Advanced Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full pt-1">
                        
                        {/* RARITY GROUP */}
                        <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
                            <Layers size={14} className="text-slate-500 mx-1" />
                            <RarityButton r="all" label="Tout" colorClass="bg-slate-700 text-white" />
                            <RarityButton r="normal" label="N" colorClass="bg-slate-800 text-slate-300 border-slate-600" />
                            <RarityButton r="exotic" label="E" colorClass="bg-cyan-900/40 text-cyan-300 border-cyan-500/50" />
                            <RarityButton r="epic" label="Ep" colorClass="bg-amber-900/40 text-amber-300 border-amber-500/50" />
                            <RarityButton r="legendary" label="L" colorClass="bg-fuchsia-900/40 text-fuchsia-300 border-fuchsia-500/50" />
                        </div>

                        <div className="w-px h-6 bg-slate-800 hidden sm:block"></div>

                        {/* PROPERTIES GROUP */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setTungstenFilter(!tungstenFilter)}
                                className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                                    tungstenFilter 
                                    ? 'bg-red-900/30 border-red-500 text-red-300 shadow-sm' 
                                    : 'bg-slate-950 text-slate-500 border-slate-700 hover:border-slate-500'
                                }`}
                                title="Filtrer Tungstène"
                            >
                                <img src="https://i.servimg.com/u/f19/18/61/88/98/iczne_10.png" className={`w-3.5 h-3.5 mr-1.5 ${tungstenFilter ? '' : 'opacity-50 grayscale'}`} alt="" />
                                Tung.
                            </button>

                            <button 
                                onClick={() => setCraftableFilter(!craftableFilter)}
                                className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                                    craftableFilter 
                                    ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300 shadow-sm' 
                                    : 'bg-slate-950 text-slate-500 border-slate-700 hover:border-slate-500'
                                }`}
                                title="Filtrer Craftable"
                            >
                                <Anvil size={12} className={`mr-1.5 ${craftableFilter ? '' : 'opacity-50'}`} />
                                Craft
                            </button>
                        </div>

                        {/* COST GROUP (Only for weapons usually) */}
                        {slot.acceptedCategories?.includes('weapon') && (
                            <>
                                <div className="w-px h-6 bg-slate-800 hidden sm:block"></div>
                                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
                                    <button 
                                        onClick={() => setCostFilter('all')}
                                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${costFilter === 'all' ? 'bg-slate-700 text-white border-slate-600' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        <Hammer size={12} />
                                    </button>
                                    <button 
                                        onClick={() => setCostFilter(1)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${costFilter === 1 ? 'bg-amber-900/30 border-amber-500/50 text-amber-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        1 Main
                                    </button>
                                    <button 
                                        onClick={() => setCostFilter(2)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${costFilter === 2 ? 'bg-amber-900/30 border-amber-500/50 text-amber-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        2 Mains
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="flex-1"></div>

                        {/* PRICE SORT */}
                        <button 
                            onClick={cyclePriceSort}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                                priceSort !== 'default' 
                                ? 'bg-yellow-900/30 border-yellow-500 text-yellow-300 shadow-sm' 
                                : 'bg-slate-950 text-slate-500 border-slate-700 hover:border-slate-500'
                            }`}
                            title="Trier par Prix"
                        >
                            <Coins size={12} className="mr-1.5" />
                            {priceSort === 'default' && <ArrowUpDown size={12} className="opacity-50" />}
                            {priceSort === 'asc' && <ArrowUp size={12} />}
                            {priceSort === 'desc' && <ArrowDown size={12} />}
                        </button>
                        
                        <div className="text-[10px] text-slate-500 italic ml-2">
                            {filteredItems.length}
                        </div>
                    </div>
                </div>

                {/* GRID CONTENT */}
                <div className="flex-1 overflow-y-auto min-h-0 p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                            {filteredItems.map(item => {
                                const isSelected = currentId === item.id;
                                const categoryName = item.subCategory || categories.find(c => c.id === item.categoryId)?.name || 'Objet';
                                const faction = item.factionId ? factions.find(e => e.id === item.factionId) : undefined;

                                return (
                                    <ItemPickerCard 
                                        key={item.id}
                                        item={item}
                                        currentItem={currentItem}
                                        isSelected={isSelected}
                                        context={context}
                                        stats={stats}
                                        onSelect={onSelect}
                                        categoryName={categoryName}
                                        faction={faction}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 pb-20">
                            <div className="bg-slate-900 p-8 rounded-full mb-4 border border-slate-800 shadow-xl">
                                <Search size={64} className="text-slate-700" />
                            </div>
                            <p className="text-xl font-bold text-slate-400 font-perrigord tracking-wide">Aucun objet trouvé.</p>
                            <p className="text-sm mt-2 text-slate-600">Modifiez vos filtres ou essayez une autre catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
