import type { PlayerFactionType } from '../Enums';
import type { Card } from '../cards/Card';

export interface RootFactionState {
    version: string;
    name: PlayerFactionType;
    agentID: number;
    hand: Card[] | null;
    handSize: number;
    craftedImprovements: Card[];
    score: number;
}
