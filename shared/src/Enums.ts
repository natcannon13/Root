const ValidSuits = ["fox", "rabbit", "mouse", "bird", "frog"] as const;
const ValidPhaseTypes = ["birdsong", "daylight", "evening", "none"] as const;
const ValidConnectionTypes = [
    "path",
    "river",
    "forest-adjacency",
    "corner",
] as const;
const ValidItemTypes = [
    "boot",
    "bag",
    "tea",
    "hammer",
    "crossbow",
    "sword",
    "coins",
] as const;
const ValidPlayerFactionTypes = [
    "marquise-de-cat",
    "eyrie-dynasties",
    "woodland-alliance",
    "vagabond",
    "vagabond-2",
    "riverfolk-company",
    "lizard-cult",
    "underground-duchy",
    "corvid-conspiracy",
    "lord-of-the-hundreds",
    "keepers-in-iron",
    "lilypad-diaspora",
    "twilight-council",
    "knaves-of-the-deepwood",
] as const;
const ValidPromotedHirelingFactionTypes = [
    "forest-patrol",
    "last-dynasty",
    "spring-uprising",
    "the-exile",
    "riverfolk-flotilla",
    "warm-sun-prophets",
    "sunward-expedition",
    "corvid-spies",
    "flame-bearers",
    "vault-keepers",
    "river-roamers",
    "sunny-advocates",
    "highway-bandits",
    "popular-band",
    "furious-protector",
    "prosperous-farmers",
] as const;
const ValidDemotedHirelingFactionTypes = [
    "feline-physicians",
    "bluebird-nobles",
    "rabbit-scouts",
    "the-brigand",
    "otter-divers",
    "lizard-envoys",
    "mole-artisans",
    "raven-sentries",
    "rat-smugglers",
    "badger-bodyguards",
    "frog-tinkers",
    "bat-messengers",
    "bandit-gangs",
    "street-band",
    "stoic-protector",
    "struggling-farmers",
] as const;
const ValidExclusionTypes = [
    "feline",
    "bird",
    "woodland",
    "vagabond",
    "otter",
    "lizard",
    "mole",
    "corvid",
    "rat",
    "badger",
    "frog",
    "bat",
    "bandit",
    "band",
    "protector",
    "farmer",
    "none",
] as const;
const ValidBoardTypes = [
    "autumn",
    "winter",
    "lake",
    "mountain",
    "gorge",
    "marsh",
] as const;
const ValidDeckTypes = [
    "base",
    "exiles-and-partisans",
    "squires-and-disciples",
] as const;
const ValidBattlePhaseTypes = [
    `ambush`,
    `before-roll`,
    `roll`,
    `after-roll`,
    `hits`,
] as const;
const ValidLandmarkTypes = [
    "ferry",
    "tower",
    "legendary-forge",
    "black-market",
    "lost-city",
    "elder-treetop",
    "foxburrow",
    "mousehold",
    "rabbittown",
] as const;

export type Suit = (typeof ValidSuits)[number];
export type PhaseType = (typeof ValidPhaseTypes)[number];
export type ConnectionType = (typeof ValidConnectionTypes)[number];
export type ItemType = (typeof ValidItemTypes)[number];
export type PlayerFactionType = (typeof ValidPlayerFactionTypes)[number];
export type PromotedHirelingFactionType = (typeof ValidPromotedHirelingFactionTypes)[number];
export type DemotedHirelingFactionType = (typeof ValidDemotedHirelingFactionTypes)[number];
export type HirelingFactionType = PromotedHirelingFactionType | DemotedHirelingFactionType;
export type ExclusionType = (typeof ValidExclusionTypes)[number];
export type FactionType = PlayerFactionType | HirelingFactionType;
export type BoardType = (typeof ValidBoardTypes)[number];
export type DeckType = (typeof ValidDeckTypes)[number];
export type BattlePhaseType = (typeof ValidBattlePhaseTypes)[number];
export type LandmarkType = (typeof ValidLandmarkTypes)[number];

export function isSuit(value: string): value is Suit {
    return ValidSuits.includes(value as Suit);
}
export function isPhaseType(value: string): value is PhaseType {
    return ValidPhaseTypes.includes(value as PhaseType);
}
export function isConnectionType(value: string): value is ConnectionType {
    return ValidConnectionTypes.includes(value as ConnectionType);
}
export function isItemType(value: string): value is ItemType {
    return ValidItemTypes.includes(value as ItemType);
}
export function isPlayerFactionType(value: string): value is PlayerFactionType {
    return ValidPlayerFactionTypes.includes(value as PlayerFactionType);
}
export function isPromotedHirelingFactionType(value: string): value is PromotedHirelingFactionType {
    return ValidPromotedHirelingFactionTypes.includes(value as PromotedHirelingFactionType);
}
export function isDemotedHirelingFactionType(value: string): value is DemotedHirelingFactionType {
    return ValidDemotedHirelingFactionTypes.includes(value as DemotedHirelingFactionType);
}
export function isHirelingFactionType(value: string): value is HirelingFactionType {
    return isPromotedHirelingFactionType(value) || isDemotedHirelingFactionType(value);
}
export function isFactionType(value: string): value is FactionType {
    return isPlayerFactionType(value) || isHirelingFactionType(value);
}
export function isExclusionType(value: string): value is ExclusionType {
    return ValidExclusionTypes.includes(value as ExclusionType);
}
export function isBoardType(value: string): value is BoardType {
    return ValidBoardTypes.includes(value as BoardType);
}
export function isDeckType(value: string): value is DeckType {
    return ValidDeckTypes.includes(value as DeckType);
}
export function isBattlePhaseType(value: string): value is BattlePhaseType {
    return ValidBattlePhaseTypes.includes(value as BattlePhaseType);
}
export function isLandmarkType(value: string): value is LandmarkType {
    return ValidLandmarkTypes.includes(value as LandmarkType);
}

export const standardSetupOrder: PlayerFactionType[] = [...ValidPlayerFactionTypes];
export const reachValues: Record<PlayerFactionType, number> = { 
    "marquise-de-cat": 10,
    "lord-of-the-hundreds": 9,
    "keepers-in-iron": 8,
    "underground-duchy": 8,
    "lilypad-diaspora": 7,
    "eyrie-dynasties": 7,
    "vagabond": 5,
    "vagabond-2": 2,
    "riverfolk-company": 5,
    "knaves-of-the-deepwood": 5,
    "twilight-council": 4,
    "woodland-alliance": 3,
    "corvid-conspiracy": 3,
    "lizard-cult": 2,
}

export const factionExclusionClassesMap: Record<FactionType,ExclusionType> = {
    "marquise-de-cat": "feline",
    "eyrie-dynasties": "bird",
    "woodland-alliance": "woodland",
    "vagabond": "vagabond",
    "vagabond-2": "none",
    "riverfolk-company": "otter",
    "lizard-cult": "lizard",
    "underground-duchy": "mole",
    "corvid-conspiracy": "corvid",
    "lord-of-the-hundreds": "rat",
    "keepers-in-iron": "badger",
    "lilypad-diaspora": "frog",
    "twilight-council": "bat",
    "knaves-of-the-deepwood": "vagabond",
    "forest-patrol": "feline",
    "last-dynasty": "bird",
    "spring-uprising": "woodland",
    "the-exile": "vagabond",
    "riverfolk-flotilla": "otter",
    "warm-sun-prophets": "lizard",
    "sunward-expedition": "mole",
    "corvid-spies": "corvid",
    "flame-bearers": "rat",
    "vault-keepers": "badger",
    "river-roamers": "frog",
    "sunny-advocates": "bat",
    "highway-bandits": "bandit",
    "popular-band": "band",
    "furious-protector": "protector",
    "prosperous-farmers": "farmer",
    "feline-physicians": "feline",
    "bluebird-nobles": "bird",
    "rabbit-scouts": "woodland",
    "the-brigand": "vagabond",
    "otter-divers": "otter",
    "lizard-envoys": "lizard",
    "mole-artisans": "mole",
    "raven-sentries": "corvid",
    "rat-smugglers": "rat",
    "badger-bodyguards": "badger",
    "frog-tinkers": "frog",
    "bat-messengers": "bat",
    "bandit-gangs": "bandit",
    "street-band": "band",
    "stoic-protector": "protector",
    "struggling-farmers": "farmer",
}
// Defines faction exclusion classes. Factions/Hirelings with the same exclusion class cannot be played together.

export const factionDependencies: Partial<Record<FactionType, FactionType>> = { 
    "vagabond-2": "vagabond",
}
// Defines which factions require another in the game to be played.
// When a dependee faction is selected for the draft while its dependent faction is not in the draft, the dependent faction will be added instead.