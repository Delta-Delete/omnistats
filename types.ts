
export enum ModifierType {
  /**
   * ÉTAPE 1 : Addition pure.
   * Ex: 100 (Base) + 10 (Flat) = 110.
   */
  FLAT = 'FLAT',

  /**
   * ÉTAPE 2 : Pourcentage Additif (Classique).
   * On somme tous les % de ce type avant d'appliquer.
   * Ex: +10% et +20% = +30% au total appliqué sur l'étape 1.
   * Formule : Etape1 * (1 + Somme%)
   */
  PERCENT_ADD = 'PERCENT_ADD',

  /**
   * ÉTAPE 3 : Multiplicateur de groupe (Intermédiaire).
   * Rare. Utilisé pour "Poing de Ki". S'applique après PERCENT_ADD.
   * Formule : Etape2 * (1 + Somme%)
   */
  PERCENT_MULTI_PRE = 'PERCENT_MULTI_PRE',

  /**
   * ÉTAPE 4 : Pourcentage Final de Groupe.
   * Utilisé pour les Postures (ex: -10% global).
   * Formule : Etape3 * (1 + Somme%)
   */
  FINAL_ADDITIVE_PERCENT = 'FINAL_ADDITIVE_PERCENT',

  /**
   * ÉTAPE 5 : Ajout Fixe Final.
   * S'ajoute après tous les pourcentages précédents.
   * Rare. Pour bonus bruts non influencés par les multiplicateurs.
   */
  ALT_FLAT = 'ALT_FLAT',

  /**
   * ÉTAPE 6 : Pourcentage Final Cumulé (Additif Final).
   * On somme tous les % de ce groupe, puis on applique le total au résultat précédent.
   * Ex: +50% et +50% = +100% (x2.0).
   * Contrairement à avant, ce n'est plus exponentiel.
   * Utilisé pour : Spécialisations finales, Bonus situationnels majeurs.
   */
  ALT_PERCENT = 'ALT_PERCENT',

  /**
   * PRIORITAIRE : Remplace totalement la valeur.
   * Ignore tous les calculs précédents.
   */
  OVERRIDE = 'OVERRIDE',
}

export enum EntityType {
  RACE = 'RACE',
  CLASS = 'CLASS',
  ITEM = 'ITEM',
  BUFF = 'BUFF',
  ITEM_SET = 'ITEM_SET',
  GLOBAL_RULE = 'GLOBAL_RULE',
  RACIAL_COMPETENCE = 'RACIAL_COMPETENCE',
  SPECIALIZATION = 'SPECIALIZATION',
  ELITE_COMPETENCE = 'ELITE_COMPETENCE',
  PROFESSION = 'PROFESSION',
  CAREER = 'CAREER',
  FACTION = 'FACTION',
  GUILD = 'GUILD',
  SUB_PROFESSION = 'SUB_PROFESSION',
}

export type UserConfigType = 'none' | 'slider' | 'manual_stats';
export type Rarity = 'normal' | 'exotic' | 'epic' | 'legendary';
export type CompanionAllowedMode = 'auto' | 'none' | 'stats_only' | 'full' | boolean;

export interface ItemConfigValues {
    val?: number;
    vit?: number;
    spd?: number;
    dmg?: number;
    targetSlotIndex?: number; // Added for Secret Card
    targetSubName?: string; // NEW: Added for Secret Card targeting specific Fusion ingredient
    [key: string]: number | string | undefined;
}

export interface DescriptionBlock {
    title?: string;
    text: string;
    tag?: string;
    condition?: string;
    isCollapsible?: boolean;
}

export interface Modifier {
    id: string;
    type: ModifierType;
    targetStatKey: string;
    value: string;
    condition?: string;
    isPerTurn?: boolean;
    name?: string;
    toggleId?: string;
    toggleName?: string;
    toggleGroup?: string;
    displayTag?: string;
    shareWithTeam?: number; // NEW: Ratio of effect shared with team (1 = 100%)
}

export interface SummonConfig {
    mode: 'SHARED_POOL' | 'FIXED_PER_UNIT';
    sourceName: string;
    unitName: string;
    countValue: string;
    shareValue: string;
    stats: string[];
}

export interface SummonDefinition {
    id?: string;
    name: string;
    countValue: string;
    condition?: string;
    stats: {
        vit: string;
        spd: string;
        dmg: string;
    };
    sharePercent?: string;
}

export interface GuildRank {
    id: string;
    name: string;
    modifiers?: Modifier[];
}

export interface Entity {
    id: string;
    type: EntityType;
    name: string;
    description?: string;
    modifiers?: Modifier[];
    parentId?: string;
    categoryId?: string;
    subCategory?: string;
    equipmentCost?: number;
    factionId?: string;
    setId?: string;
    isCraftable?: boolean;
    isTungsten?: boolean;
    imageUrl?: string;
    descriptionBlocks?: DescriptionBlock[];
    tags?: string[];
    hideInRecap?: boolean;
    userConfig?: {
        type: UserConfigType;
        min?: number;
        max?: number;
        step?: number;
        label?: string;
    };
    slotId?: string;
    goldCost?: number;
    rarity?: Rarity;
    companionAllowed?: CompanionAllowedMode;
    guildStatus?: string;
    guildRanks?: GuildRank[];
    secondaryGuildRanks?: GuildRank[];
    summonConfig?: SummonConfig;
    summons?: SummonDefinition[];
    effectTag?: string;
    descriptionTitle?: string;
    prestige?: number;
}

export interface StatDefinition {
    id: string;
    key: string;
    label: string;
    baseValue: number;
    group: 'Primary' | 'Secondary' | 'Derived' | 'Combat' | 'Hidden';
    description?: string;
    min?: number;
    max?: number;
    precision?: number;
}

export interface ItemSlot {
    id: string;
    name: string;
    acceptedCategories?: string[];
}

export interface ItemCategory {
    id: string;
    name: string;
    subCategories?: string[];
}

export interface PlayerSelection {
    characterName?: string;
    level: number;
    equippedItems: Record<string, string>;
    weaponSlots: string[];
    weaponUpgrades?: Record<number, number>;
    weaponUpgradesVit?: Record<number, number>;
    partitionSlots: string[];
    bonusItems: string[];
    sealItems: string[];
    specialItems: string[];
    itemConfigs?: Record<string, ItemConfigValues>;
    companionItemConfigs?: Record<string, ItemConfigValues>; // NEW: Config specific to companion items
    toggles: Record<string, boolean>;
    companionToggles?: Record<string, boolean>;
    sliderValues?: Record<string, number>;
    naturalStrengthAllocation?: string[];
    eliteCompetenceActive?: boolean;
    racialCompetenceActive?: boolean;
    guildRanks?: Record<string, string>;
    guildSecondaryRanks?: Record<string, string>;
    guildManualBonuses?: { vit?: number; spd?: number; dmg?: number; absorption?: number };
    guildIds?: string[];
    raceId?: string;
    subRaceId?: string;
    classId?: string;
    specializationId?: string;
    professionId?: string;
    professionRank?: string;
    subProfessions?: Record<string, string>;
    careerId?: string;
    factionId?: string;
    soulCount?: number;
    choiceSlotType?: string;
    summonNames?: Record<string, string>;
}

export interface StatDetail {
    source: string;
    value: number;
}

export interface StatResult {
    key: string;
    base: number;
    finalValue: number;
    perTurn: number;
    perTurnPercent: number;
    breakdown: {
        base: number;
        flat: number;
        percentAdd: number;
        percentMultiPre: number;
        finalAdditivePercent: number;
        altFlat: number;
        altPercent: number;
    };
    detailedBase: StatDetail[];
    detailedFlat: StatDetail[];
    trace: string[];
}

export interface ActiveSummon {
    id?: string;
    sourceName: string;
    name: string;
    count: number;
    stats: {
        vit: number;
        spd: number;
        dmg: number;
    };
    sharePercent?: number;
}

export interface CalculationResult {
    stats: Record<string, StatResult>;
    modifierResults: Record<string, number>;
    activeSummons: ActiveSummon[];
    logs: string[];
    executionTime: number;
    finalEntities?: Entity[]; // Added finalEntities
    evalContext?: any; // Added evalContext
}

export type SummonProcessor = (entity: Entity, summonContext: any, flatBonus: number) => ActiveSummon | null;
