const ValidSuits = ['fox', 'rabbit', 'mouse', 'bird', 'frog'] as const;
const ValidPhaseTypes = ['birdsong', 'daylight', 'evening', 'none'] as const;
const ValidConnectionTypes = ['path', 'river', 'forest-adjacency'] as const;
const ValidItemTypes = ['boot', 'bag', 'tea', 'hammer', 'crossbow', 'sword', 'coins'] as const;
const ValidPlayerFactionTypes = [
    'marquise-de-cat',
    'eyrie-dynasties',
    'woodland-alliance',
    'vagabond',
    'riverfolk-company',
    'lizard-cult',
    'underground-duchy',
    'corvid-conspiracy',
    'lord-of-the-hundreds',
    'keepers-in-iron',
    'lilypad-diaspora',
    'twilight-council',
    'knaves-of-the-deepwood'
] as const;

export type Suit = typeof ValidSuits[number];
export type PhaseType = typeof ValidPhaseTypes[number];
export type ConnectionType = typeof ValidConnectionTypes[number];
export type ItemType = typeof ValidItemTypes[number];
export type PlayerFactionType = typeof ValidPlayerFactionTypes[number];

export function isSuit(value: string): value is Suit { return ValidSuits.includes(value as Suit); }
export function isPhaseType(value: string): value is PhaseType { return ValidPhaseTypes.includes(value as PhaseType); }
export function isConnectionType(value: string): value is ConnectionType { return ValidConnectionTypes.includes(value as ConnectionType); }
export function isItemType(value: string): value is ItemType { return ValidItemTypes.includes(value as ItemType); }
export function isPlayerFactionType(value: string): value is PlayerFactionType { return ValidPlayerFactionTypes.includes(value as PlayerFactionType); }