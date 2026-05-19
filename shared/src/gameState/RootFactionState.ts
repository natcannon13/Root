import type { PlayerFactionType } from '../Enums';

export interface RootFactionState {
    version: string;
    name: PlayerFactionType;
    hand: string[] | null;
    handSize: number;
    craftedImprovements: string[];
    score: number;
}
