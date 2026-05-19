import type { RootBoardState } from './RootBoardState';
import type { RootFactionState } from './RootFactionState';
import type { TimeStep } from './TimeStep';
import type { PlayerFactionType } from '../Enums';

export interface RootGameState {
    version: string;
    boardState: RootBoardState;
    factionState: Record<PlayerFactionType, RootFactionState>;
    timeState: TimeStep;
    deck: string[] | null;
    deckSize: number;
    discardPile: string[];
    spentCraftingPieceIDs: number[];
}
