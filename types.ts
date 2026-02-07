
// --- Core Domain Types ---

export enum ModifierType {
  FLAT = 'FLAT',             // Step 1: Add to base. (10 + 5 = 15)
  PERCENT_ADD = 'PERCENT_ADD', // Step 2: Sum % applied to Step 1. (15 * 1.2)
  PERCENT_MULTI_PRE = 'PERCENT_MULTI_PRE', // Step 2.1: Multiplies Step 2. (Used for Poing de Ki, before Postures)
  FINAL_ADDITIVE_PERCENT = 'FINAL_ADDITIVE_PERCENT', // Step 2.5: Sum % applied to Step 2.1. (Postures: 100% - 10% = 90% multiplier)
  ALT_FLAT = 'ALT_FLAT',     // Step 3: Add to result of Step 2.5. (18 + 5 = 23)
  ALT_PERCENT = 'ALT_PERCENT', // Step 4: Multiply final result. (23 * 1.5)
  OVERRIDE = 'OVERRIDE',     // Hard set, ignores everything else.
}

export enum EntityType {
  RACE = 'RACE',
  CLASS = 'CLASS',
  SPECIALIZATION = 'SPECIALIZATION',
  PROFESSION = 'PROFESSION',
  SUB_PROFESSION = 'SUB_PROFESSION', // NEW: Sous-métiers
  CAREER = 'CAREER', 
  ITEM = 'ITEM',
  ITEM_SET = 'ITEM_SET',
  BUFF = 'BUFF',
  GLOBAL_RULE = 'GLOBAL_RULE',
  FACTION = 'FACTION',
  GUILD = 'GUILD', 
  ELITE_COMPETENCE = 'ELITE_COMPETENCE', 
  RACIAL_COMPETENCE = 'RACIAL_COMPETENCE'
}

export type Rarity = 'normal' | 'exotic' | 'epic' | 'legendary';

export interface ItemSlot {
  id: string;
  name: string; // e.g. "Head", "Main Hand"
  acceptedCategories?: string[]; // Optional filter
}

export interface ItemCategory {
  id: string;
  name: string; // e.g. "Armor", "Weapon"
  subCategories?: string[]; // e.g. ["Plate", "Mail"]
}

export interface Modifier {
  id: string;
  name?: string; // Optional label for trace logs (e.g. "Weapon Mastery")
  type: ModifierType;
  targetStatKey: string;
  value: string; // Formula string or numeric string
  condition?: string; // e.g. "context.classId === 'warrior'"
  
  // NEW: Manual Toggle Logic
  toggleId?: string;   // e.g. "is_underwater". If present, requires UI activation.
  toggleName?: string; // e.g. "Sous l'eau". Label for the UI switch.
  toggleGroup?: string; // Group for mutually exclusive toggles

  displayTag?: string; // NEW: Optional tag for specific UI display logic
  isPerTurn?: boolean; // NEW: If true, this value represents a per-turn gain, not immediate stat
}

export interface DescriptionBlock {
  text: string;
  tag?: string; // e.g. 'passive', 'active', etc.
  title?: string; // NEW: Specific title for the effect (e.g. "Ocean's Blessing")
  isCollapsible?: boolean; // NEW: If true, content is hidden behind title click
  condition?: string; // NEW: Display condition
}

// NEW: Structure for Summons defined on Items/Classes
export interface SummonDefinition {
    id: string;
    name: string; // e.g. "Golem de Feu"
    countValue: string; // Formula for quantity (e.g. "1" or "level / 10")
    stats: {
        vit: string; // Formula e.g. "vit * 0.5" (Player vit) or "500"
        spd: string;
        dmg: string;
    };
    condition?: string; // e.g. "context.toggles.is_active"
}

// NEW: Guild Rank Structure
export interface GuildRank {
    id: string;
    name: string;
    modifiers?: Modifier[]; // Bonus applied if this rank is selected (and optionally toggled)
}

// NEW: Item User Configuration
export type UserConfigType = 'none' | 'slider' | 'manual_stats';

export interface ItemUserConfig {
    type: UserConfigType;
    min?: number; // For slider
    max?: number; // For slider
    step?: number; // For slider
    label?: string; // For slider label
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  
  // Legacy single description (maintained for compatibility/simple items)
  description?: string;
  descriptionTitle?: string; // NEW: Title for single description mode
  effectTag?: string;
  
  // NEW: Multiple description blocks
  descriptionBlocks?: DescriptionBlock[];

  icon?: string;
  parentId?: string; // For Specialization -> Class relationship OR SubRace -> Race OR Elite -> Class
  
  // Item specific props
  slotId?: string;
  categoryId?: string;
  subCategory?: string;
  equipmentCost?: number; // For Weapons (1 or 2 points)
  rarity?: Rarity; // NEW: Rarity system (normal, exotic, epic, legendary)
  tags?: string[]; // Optional tags for items
  isCraftable?: boolean; // Indicates if the item can be crafted by players
  
  // Visual & Faction props
  imageUrl?: string; // NEW: URL for Faction Logo or Item Image
  factionId?: string; // NEW: Link to a FACTION entity
  setId?: string; // NEW: Link to a ITEM_SET entity (Specific Panoply)
  prestige?: number; // NEW: Number of stars (visual prestige)
  guildStatus?: 'OPEN' | 'SEMI_OPEN' | 'SECRET'; // NEW: Guild specific status
  
  guildRanks?: GuildRank[]; // NEW: Available ranks for this guild
  secondaryGuildRanks?: GuildRank[]; // NEW: Second set of ranks (e.g. Personnel vs Artiste)
  
  // Companion Logic
  companionAllowed?: boolean; // NEW: If true, explicitly included in companion stats. If false, excluded. Undefined = auto logic.
  
  // NEW: UI Logic
  hideInRecap?: boolean; // If true, this entity is hidden from the "Récapitulatif des Effets" panel (useful for Lore entities or simple stat sticks)
  
  // NEW: User Configuration (Seals, etc.)
  userConfig?: ItemUserConfig;

  modifiers: Modifier[];

  // NEW: Invocations attached to this entity
  summons?: SummonDefinition[];
}

export interface StatDefinition {
  id: string;
  key: string;
  label: string;
  baseValue: number;
  min?: number;
  max?: number;
  group: 'Primary' | 'Secondary' | 'Derived' | 'Combat' | 'Hidden';
  description?: string;
  formula?: string; // For derived stats purely calculated from others
  precision?: number; // NEW: Number of decimals to keep. Default 0 (Integer).
}

// --- Engine/Runtime Types ---

export interface StatDetail {
    source: string;
    value: number;
}

export interface StatResult {
  key: string;
  finalValue: number;
  base: number;
  perTurn: number; // Value gained per turn (Flat)
  perTurnPercent: number; // NEW: Value gained per turn (Percent)
  breakdown: {
    base: number;
    flat: number;
    percentAdd: number;
    percentMultiPre: number; // NEW: Step 2.1
    finalAdditivePercent: number; // Step 2.5
    altFlat: number;
    altPercent: number;
  };
  // NEW: Detailed breakdown arrays
  detailedBase?: StatDetail[];
  detailedFlat?: StatDetail[];
  
  trace: string[]; // Detailed log
}

// NEW: Resolved Summon for UI Display
export interface ActiveSummon {
    id?: string; // Definition ID for tracking/renaming
    sourceName: string; // "Bâton d'invocation"
    name: string; // "Golem"
    count: number;
    sharePercent?: number; // NEW: To display "50% stats shared"
    stats: {
        vit: number;
        spd: number;
        dmg: number;
    };
}

export interface CalculationResult {
  stats: Record<string, StatResult>;
  modifierResults: Record<string, number>; // NEW: Stores resolved value of each modifier ID
  activeSummons: ActiveSummon[]; // NEW: List of all active summons
  logs: string[];
  executionTime: number;
}

// Configuration values for items (Seals, etc.)
export interface ItemConfigValues {
    val?: number; // General slider value
    vit?: number; // Specific manual stats
    spd?: number;
    dmg?: number;
}

export interface PlayerSelection {
  characterName?: string; // NEW: Player Name
  raceId?: string;
  subRaceId?: string; // NEW: For Entomothrope variants etc.
  classId?: string;
  specializationId?: string;
  professionId?: string;
  professionRank?: string; // NEW: Rank for main profession (e.g. 'Maître')
  subProfessions?: Record<string, string>; // NEW: Map of SubProfessionID -> Rank string (e.g. { 'sub_potion': 'Maître' })
  
  careerId?: string; // NEW: Career selection (e.g., Artiste)
  factionId?: string; // NEW: Single Faction
  guildIds?: string[]; // NEW: Multiple Guilds
  guildRanks?: Record<string, string>; // NEW: Selected Rank ID per Guild ID
  guildSecondaryRanks?: Record<string, string>; // NEW: Selected Secondary Rank ID per Guild ID (Cirque)
  
  // NEW: Manual bonuses for guilds
  guildManualBonuses?: {
      vit?: number;
      spd?: number;
      dmg?: number;
      absorption?: number;
  };

  level: number;
  equippedItems: Record<string, string>; // Fixed Slots (Head, Chest...) -> EntityId
  weaponSlots: string[]; // Dynamic Array of Weapon EntityIds
  weaponUpgrades?: Record<number, number>; // NEW: Map weapon index to upgrade level (1, 2, 3) (DAMAGE)
  weaponUpgradesVit?: Record<number, number>; // NEW: Map weapon index to upgrade level (1, 2, 3) (VITALITY)
  partitionSlots: string[]; // NEW: Dynamic Array of Sheet Music (Partitions)
  bonusItems: string[]; // Unlimited Array of EntityIds
  sealItems: string[];    // NEW: Unlimited Array of Seal EntityIds
  specialItems: string[]; // NEW: Unlimited Array of Special EntityIds
  
  // NEW: Store for user-configurable items (Seals, etc.)
  itemConfigs?: Record<string, ItemConfigValues>;

  choiceSlotType?: string; // Tracks selection for the dynamic slot (Mount vs Familiar vs Companion)
  soulCount?: number; // NEW: Specific to Animistes class
  
  toggles: Record<string, boolean>; // NEW: State of active situational toggles
  sliderValues?: Record<string, number>; // NEW: Generic numeric inputs (e.g. Ensorceleur Arcanes Sombres)
  naturalStrengthAllocation?: string[]; // NEW: Array of slot IDs (e.g., 'chest', 'weapon_0') that are refunded by Force Naturelle
  
  summonNames?: Record<string, string>; // NEW: Custom names for summons (ID -> Name)

  eliteCompetenceActive?: boolean; // NEW: Is the class Elite Competence active?
  racialCompetenceActive?: boolean; // NEW: Is the Racial Competence active?
}
