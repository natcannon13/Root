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
] as const;
const ValidHirelingFactionTypes = [
  "placeholder-1",
  "placeholder-2",
  "placeholder-3",
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
const ValidSetupTypes = ["standard", "advanced"] as const;
const ValidBattlePhaseTypes = [
  `ambush`,
  `before-roll`,
  `roll`,
  `after-roll`,
  `hits`,
] as const;

export type Suit = (typeof ValidSuits)[number];
export type PhaseType = (typeof ValidPhaseTypes)[number];
export type ConnectionType = (typeof ValidConnectionTypes)[number];
export type ItemType = (typeof ValidItemTypes)[number];
export type PlayerFactionType = (typeof ValidPlayerFactionTypes)[number];
export type HirelingFactionType = (typeof ValidHirelingFactionTypes)[number];
export type FactionType = PlayerFactionType | HirelingFactionType;
export type BoardType = (typeof ValidBoardTypes)[number];
export type BattlePhaseType = (typeof ValidBattlePhaseTypes)[number];
export type SetupType = (typeof ValidSetupTypes)[number];

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
export function isBoardType(value: string): value is BoardType {
  return ValidBoardTypes.includes(value as BoardType);
}
export function isBattlePhaseType(value: string): value is BattlePhaseType {
  return ValidBattlePhaseTypes.includes(value as BattlePhaseType);
}
export function isSetupType(value: string): value is SetupType {
  return ValidSetupTypes.includes(value as SetupType);
}
