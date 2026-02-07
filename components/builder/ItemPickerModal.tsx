
import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Check, Plus, Tag, Hammer, Anvil, Star, X, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { ItemSlot, ItemCategory, Entity, StatDefinition, Modifier, ModifierType } from '../../types';
import { getStatStyle, getTagLabel, calculateEnhancedStats, getRarityColor } from './utils';
import { evaluateFormula, checkCondition } from '../../services/engine';

// --- CONFIGURATION DES RESTRICTIONS DE CLASSE ---
// Ces sous-catégories ne seront visibles QUE par les classes listées.
const CLASS_RESTRICTED_SUB_CATEGORIES: Record<string, string[]> = {
    // Technophiles
    'Casque technologique': ['technophiles'],
    'Armure technologique': ['technophiles'],
    'Bottes technologiques': ['technophiles'],
    'Armes technologiques': ['technophiles'],
    'Boucliers technologiques': ['technophiles'],
    
    // Arlequins
    'Chapeau': ['arlequins'],
    'Costume': ['arlequins'],
    
    // Corrompus
    'Capuche': ['corrompu'],
    'Manteau': ['corrompu'],
    'Bottes de Corrompus': ['corrompu'],
    
    // Paladins
    'Équipement sacré': ['paladins'], 
    
    // Conjurateurs
    'Armes sacrées': ['conjurateurs'],
};

export const ItemPickerModal: React.FC<{
    slot: ItemSlot;
    categories: ItemCategory[];
    allItems: Entity[];
    factions: Entity[];
    stats: StatDefinition[];
    acceptedCategories?: string[];
    currentId?: string; // L'objet actuellement équipé dans ce slot
    onClose: () => void;
    onSelect: (itemId: string) => void;
    context: any; 
}> = ({ slot, categories, allItems, factions, stats, acceptedCategories, currentId, onClose, onSelect, context }) => {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');

    // Récupérer l'objet actuellement équipé pour la comparaison
    const currentItem = useMemo(() => allItems.find(i => i.id === currentId), [allItems, currentId]);

    // Helper pour vérifier si une sous-catégorie est autorisée pour la classe actuelle
    const isSubCategoryAllowed = (subCat: string | undefined, classId: string | undefined) => {
        if (!subCat) return true;
        const allowedClasses = CLASS_RESTRICTED_SUB_CATEGORIES[subCat];
        if (!allowedClasses) return true; // Pas de restriction définie
        return allowedClasses.includes(classId || '');
    };

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            // 0. Class Sub-Category Restriction (Strict Hide for specific Item Types)
            if (!isSubCategoryAllowed(item.subCategory, context.classId)) {
                return false;
            }

            // --- TETRACHIRE SPECIFIC LOGIC ---
            if (slot.id === 'tetrachire_weapon') {
                const sub = item.subCategory || '';
                // 1. Exclude Special Classes Weapons & Staves
                const forbidden = [
                    'Bâtons d’éther', 'Bâtons', 
                    'Armes technologiques', 'Boucliers technologiques', 
                    'Armes sacrées', 'Decks'
                ];
                if (forbidden.includes(sub)) return false;
                if (sub.startsWith('Instrument')) return false;

                // 2. Must be Weapon or Shield
                const isWeaponOrShield = item.categoryId === 'weapon' || sub === 'Boucliers';
                if (!isWeaponOrShield) return false;

                // 3. Hand Cost Logic
                const cost = item.equipmentCost || 0;
                
                if (context.racialCompetenceActive) {
                    // ACTIVE: Up to 2H allowed, NO fusion
                    if (cost > 2) return false;
                    if (item.id.startsWith('fused_') || sub === 'Amalgame') return false; 
                } else {
                    // PASSIVE: 1H only
                    if (cost > 1) return false;
                }
            } else {
                // STANDARD LOGIC FOR OTHER SLOTS
                if (acceptedCategories && acceptedCategories.length > 0) {
                     if (!item.categoryId) return false;
                     const isSubAllowed = item.subCategory && acceptedCategories.includes(item.subCategory);
                     const isCatAllowed = item.categoryId && acceptedCategories.includes(item.categoryId);
                     
                     if (!isSubAllowed && !isCatAllowed) return false;
                } else if (slot.acceptedCategories && slot.acceptedCategories.length > 0) {
                     if (!item.categoryId || !slot.acceptedCategories.includes(item.categoryId)) return false;
                }
            }
            
            // 2. Search Filter
            if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (catFilter && item.categoryId !== catFilter && item.subCategory !== catFilter) return false;

            // 3. Class Restriction Filter (Legacy Modifier Check)
            // Backup pour les objets qui n'utilisent pas les sous-catégories restreintes mais ont un modificateur restrictif
            if (item.modifiers) {
                const classRestriction = item.modifiers.find(m => m.condition && (m.condition.includes("classId ===") || m.condition.includes("classId ==")));
                if (classRestriction) {
                    const match = classRestriction.condition!.match(/classId\s*={2,3}\s*['"]([^'"]+)['"]/);
                    if (match) {
                        const requiredClass = match[1];
                        if (context.classId !== requiredClass) return false; 
                    }
                }
            }

            return true;
        });
    }, [allItems, acceptedCategories, slot, search, catFilter, context.classId, context.racialCompetenceActive]);

    const relevantSubCategories = useMemo(() => {
        // If Tetrachire, show all weapon subcats present in filtered list
        if (slot.id === 'tetrachire_weapon') {
            const set = new Set<string>();
            filteredItems.forEach(item => { if (item.subCategory) set.add(item.subCategory); });
            return Array.from(set).sort();
        }

        const targetIds = acceptedCategories || slot.acceptedCategories || [];
        const set = new Set<string>();
        categories.forEach(cat => { if (targetIds.includes(cat.id)) { (cat.subCategories || []).forEach(sc => set.add(sc)); } });
        allItems.forEach(item => { if (item.categoryId && targetIds.includes(item.categoryId) && item.subCategory) { set.add(item.subCategory); } });
        targetIds.forEach(t => {
             if (!categories.some(c => c.id === t)) {
                 set.add(t);
             }
        });
        
        // Filtre les catégories du menu déroulant selon la classe
        return Array.from(set)
            .filter(sc => isSubCategoryAllowed(sc, context.classId))
            .sort();
    }, [categories, slot, acceptedCategories, allItems, context.classId, filteredItems]);

    const primaryStatKeys = useMemo(() => {
        return new Set(stats.filter(s => s.group === 'Primary').map(s => s.key));
    }, [stats]);

    // Helper: Calculer la valeur d'une stat pour un item (pour le diff)
    const getItemStatValue = (item: Entity, statKey: string) => {
        let total = 0;
        (item.modifiers || []).forEach(m => {
            if (m.targetStatKey === statKey) {
                // On utilise enhanced calculation pour avoir la vraie valeur affichée
                const { enhanced } = calculateEnhancedStats(m, context, item);
                total += enhanced;
            }
        });
        return total;
    };

    const renderStatBadge = (m: Modifier, idx: number, item: Entity) => {
        const label = m.targetStatKey.substring(0,3).toUpperCase();
        const style = getStatStyle(m.targetStatKey);
        
        const { base, bonus, enhanced } = calculateEnhancedStats(m, context, item);
        
        // Detect percentage
        const isPercent = [ModifierType.PERCENT_ADD, ModifierType.ALT_PERCENT, ModifierType.FINAL_ADDITIVE_PERCENT, ModifierType.PERCENT_MULTI_PRE].includes(m.type);

        // --- COMPARATOR LOGIC ---
        let diff = null;
        if (currentItem && currentItem.id !== item.id) {
            // Check if current item has this stat
            const currentVal = getItemStatValue(currentItem, m.targetStatKey);
            // On compare la valeur totale de CETTE stat sur l'item survolé vs l'item équipé
            // Attention: si l'item a plusieurs modifiers pour la même stat, ce badge n'en montre qu'un.
            // Pour simplifier l'affichage, on fait un diff "global pour la stat sur cet item" vs "global pour la stat sur l'item équipé".
            const targetItemVal = getItemStatValue(item, m.targetStatKey);
            
            const diffVal = targetItemVal - currentVal;
            if (diffVal !== 0) {
                diff = diffVal;
            }
        } else if (!currentItem) {
            // Si pas d'item équipé, c'est un gain pur
            // diff = enhanced; // On pourrait afficher (+X) mais c'est redondant avec la valeur affichée
        }

        return (
            <span key={idx} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${style}`} title={m.displayTag ? getTagLabel(m.displayTag) : m.targetStatKey}>
                {m.displayTag && (
                    <Star size={8} className="mr-1 text-yellow-500 fill-yellow-500/50" />
                )}
                {base > 0 ? '+' : ''}{base}{isPercent && '%'}
                {bonus > 0 && <span className="text-emerald-400 ml-0.5 text-[9px]">(+{bonus}{isPercent && '%'})</span>} 
                {' '}{label}
                {m.isPerTurn && <span className="text-[8px] opacity-75 ml-0.5">/T</span>}
                
                {/* DIFF DISPLAY */}
                {diff !== null && (
                    <span className={`ml-1.5 text-[9px] font-bold flex items-center ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {diff > 0 ? '▲' : '▼'} {Math.abs(diff)}
                    </span>
                )}
            </span>
        )
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex-none p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                    <div><h3 className="text-xl font-bold text-white flex items-center"><Search size={22} className="mr-3 text-indigo-400" /> Choisir : {slot.name}</h3><p className="text-xs text-slate-500 mt-1">Sélectionnez un objet pour voir ses détails et l'équiper.</p></div>
                    <div className="flex items-center space-x-3"><button onClick={() => onSelect('none')} className="flex items-center px-4 py-2 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 hover:bg-red-900/30 transition-colors text-xs font-bold uppercase"><X size={14} className="mr-2" /> Retirer</button><button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"><X size={20}/></button></div>
                </div>
                <div className="flex-none p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full"><Search size={18} className="absolute left-3 top-3 text-slate-500"/><input className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-600" placeholder={`Rechercher dans ${slot.name}...`} value={search} onChange={(e) => setSearch(e.target.value)} autoFocus /></div>
                    {relevantSubCategories.length > 0 && (<div className="relative min-w-[200px] w-full sm:w-auto"><div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none"><Filter size={16} /></div><select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none focus:border-indigo-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:border-slate-600"><option value="">Tous les types</option>{relevantSubCategories.map(sc => (<option key={sc} value={sc}>{sc}</option>))}</select><div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><ChevronDown size={16} /></div></div>)}
                </div>
                <div className="flex-1 overflow-y-auto min-h-0 p-6 bg-slate-950/50">
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredItems.map(item => {
                                const isSelected = currentId === item.id;
                                const mods = item.modifiers || [];
                                const categoryName = item.subCategory || categories.find(c => c.id === item.categoryId)?.name || 'Objet';
                                
                                const faction = item.factionId ? factions.find(e => e.id === item.factionId) : null;
                                
                                const isFactionLocked = !!item.factionId && (context.factionId !== item.factionId);
                                const isReservedItem = item.description?.includes('{Réservé');
                                const hasFailedConditions = isReservedItem && mods.some(m => m.condition && !checkCondition(m.condition, context));
                                const isRestricted = isFactionLocked || hasFailedConditions;
                                const restrictionLabel = isFactionLocked ? (faction?.name || 'Faction Requise') : 'Condition non remplie';

                                const simpleMods = mods.filter(m => !m.condition && !m.toggleId);
                                const visibleMods = simpleMods.filter(m => primaryStatKeys.has(m.targetStatKey));
                                const hiddenMods = simpleMods.filter(m => !primaryStatKeys.has(m.targetStatKey));
                                const hasHidden = hiddenMods.length > 0;

                                // Rarity Color Calculation
                                const rarityColor = getRarityColor(item.rarity);

                                let description = item.description;
                                if (description) {
                                    description = description.replace(/\{\{(.*?)\}\}/g, (_, formula) => {
                                        try {
                                            const val = evaluateFormula(formula, context);
                                            return Math.ceil(val).toString();
                                        } catch (e) { return '?'; }
                                    });
                                }

                                return (
                                    <button 
                                        key={item.id} 
                                        onClick={() => onSelect(item.id)} 
                                        className={`relative text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-3 group h-full ${
                                            isRestricted 
                                            ? 'bg-red-950/10 border-red-900/50 hover:border-red-500/50 hover:bg-red-900/20' 
                                            : isSelected 
                                                ? 'bg-indigo-900/10 border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                                                : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-lg'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            {faction && faction.imageUrl && (<div className={`mr-3 mt-1 flex-shrink-0 ${isRestricted ? 'grayscale opacity-70' : ''}`}><div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center"><img src={faction.imageUrl} alt={faction.name} className="w-full h-full object-contain" title={faction.name} /></div></div>)}
                                            <div className="flex-1 pr-2">
                                                <div className={`font-bold text-sm line-clamp-1 ${isSelected ? 'text-indigo-300' : rarityColor}`}>{item.name}</div>
                                                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">{categoryName}</div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {item.equipmentCost && item.equipmentCost > 0 && (<div className="flex-shrink-0 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-amber-500 flex items-center" title="Coût d'équipement"><Hammer size={10} className="mr-1"/>{item.equipmentCost}</div>)}
                                                {item.isCraftable && (<div className="flex-shrink-0 bg-slate-950 border border-emerald-900/50 rounded px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 flex items-center" title="Cet objet est fabricable"><Anvil size={10} className="mr-1"/>Craft</div>)}
                                            </div>
                                        </div>
                                        
                                        {isRestricted && (
                                            <div className="bg-red-950/30 border border-red-900/50 rounded p-2 flex items-center gap-2 mt-auto animate-pulse">
                                                <ShieldAlert size={14} className="text-red-500 flex-shrink-0" />
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-[9px] font-bold text-red-400 uppercase mb-0.5">Restriction</span>
                                                    <span className="text-[9px] text-red-300/70 leading-tight truncate font-bold">{restrictionLabel}</span>
                                                </div>
                                            </div>
                                        )}

                                        {description && (<div className="text-xs text-slate-400 italic leading-relaxed">{description}</div>)}
                                        <div className="flex-1"></div>
                                        <div className={`flex flex-wrap gap-1.5 ${isRestricted ? 'opacity-70 blur-[0.3px]' : ''}`}>
                                            {item.tags?.map(tag => (<span key={tag} className="flex items-center text-[9px] bg-slate-950 text-slate-400 border border-slate-700 rounded px-1.5 py-0.5"><Tag size={8} className="mr-1 opacity-50" />{tag}</span>))}
                                            {visibleMods.map((m, idx) => renderStatBadge(m, idx, item))}
                                            {hasHidden && (<><div className="flex items-center justify-center w-8 h-6 rounded bg-green-900/20 border border-green-500/30 text-green-400 group-hover:hidden transition-all"><Plus size={16} strokeWidth={3} /></div><div className="hidden group-hover:flex flex-wrap gap-1.5 animate-in fade-in duration-200">{hiddenMods.map((m, idx) => renderStatBadge(m, idx + 100, item))}</div></>)}
                                        </div>
                                        {isSelected && (<div className="absolute -top-2 -right-2 bg-indigo-500 text-white p-1 rounded-full shadow-lg border-2 border-slate-900"><Check size={12} strokeWidth={4} /></div>)}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500"><div className="bg-slate-900 p-6 rounded-full mb-4 border border-slate-800"><Search size={48} className="text-slate-700" /></div><p className="text-lg font-medium text-slate-400">Aucun objet trouvé.</p><p className="text-sm mt-2">Essayez de modifier vos filtres ou votre recherche.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};
