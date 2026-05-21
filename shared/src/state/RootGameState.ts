import type { RootBoardState } from './RootBoardState';
import type { RootFactionState } from './RootFactionState';
import type { RootHirelingState } from './RootHirelingState';
import type { TimeStep } from './TimeStep';
import type { PlayerFactionType, HirelingFactionType, LandmarkType } from '../Enums';
import type { Card } from '../cards/Card';
import type { PlayOptions } from '../game/PlayOptions';

export interface RootGameState {
    version: string;
    options: PlayOptions, 
    boardState: RootBoardState;
    factionState: Record<PlayerFactionType, RootFactionState>;
    hirelingState: Record<HirelingFactionType, RootHirelingState>;
    landmarks: LandmarkType[]; 
    timeState: TimeStep;
    deck: Card[] | null;
    deckSize: number;
    discardPile: Card[];
    spentCraftingPieceIDs: number[];
}
