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
    "riverfolk-company",
    "lizard-cult",
    "underground-duchy",
    "corvid-conspiracy",
    "lord-of-the-hundreds",
    "keepers-in-iron",
    "lilypad-diaspora",
    "twilight-council",
    "knaves-of-the-deepwood",
    "custom",
] as const;
const ValidHirelingFactionTypes = [
    "forest-patrol",
    "feline-physicians",
    "last-dynasty",
    "bluebird-nobles",
    "spring-uprising",
    "rabbit-scouts",
    "the-exile",
    "the-brigand",
    "riverfolk-flotilla",
    "otter-divers",
    "warm-sun-prophets",
    "lizard-envoys",
    "sunward-expedition",
    "mole-artisans",
    "corvid-spies",
    "raven-sentries",
    "flame-bearers",
    "rat-smugglers",
    "vault-keepers",
    "badger-bodyguards",
    "river-roamers",
    "frog-tinkers",
    "sunny-advocates",
    "bat-messengers",
    "highway-bandits",
    "bandit-gangs",
    "popular-band",
    "street-band",
    "furious-protector",
    "stoic-protector",
    "prosperous-farmers",
    "struggling-farmers",
    "custom",
] as const;
const ValidBoardTypes = [
    "autumn",
    "winter",
    "lake",
    "mountain",
    "gorge",
    "marsh",
    "custom",
] as const;
const ValidDeckTypes = [
    "base",
    "exiles-and-partisans",
    "squires-and-disciples",
    "custom",
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
    "custom",
] as const;

export type Suit = (typeof ValidSuits)[number];
export type PhaseType = (typeof ValidPhaseTypes)[number];
export type ConnectionType = (typeof ValidConnectionTypes)[number];
export type ItemType = (typeof ValidItemTypes)[number];
export type PlayerFactionType = (typeof ValidPlayerFactionTypes)[number];
export type HirelingFactionType = (typeof ValidHirelingFactionTypes)[number];
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
export function isHirelingFactionType(value: string): value is HirelingFactionType {
    return ValidHirelingFactionTypes.includes(value as HirelingFactionType);
}
export function isFactionType(value: string): value is FactionType {
    return isPlayerFactionType(value) || isHirelingFactionType(value);
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
