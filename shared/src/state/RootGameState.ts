import type { RootBoardState } from './RootBoardState';
import type { RootFactionState } from './RootFactionState';
import type { RootHirelingState } from './RootHirelingState';
import type { TimeStep } from './TimeStep';
import type { PlayerFactionType, HirelingFactionType } from '../Enums';
import type { Card } from '../cards/Card';

export interface RootGameState {
    version: string;
    boardState: RootBoardState;
    factionState: Record<PlayerFactionType, RootFactionState>;
    hirelingState: Record<HirelingFactionType, RootHirelingState>;
    timeState: TimeStep;
    deck: Card[] | null;
    deckSize: number;
    discardPile: Card[];
    spentCraftingPieceIDs: number[];
}
