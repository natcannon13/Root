import type { RootBoardState } from './RootBoardState';
import type { RootFactionState } from './RootFactionState';
import type { RootHirelingState } from './RootHirelingState';
import type { TimeStep } from './TimeStep';
import type { PlayerFactionType, HirelingFactionType, LandmarkType } from '../Enums';
import type { Card } from '../cards/Card';
import type { PlayOptions } from '../game/PlayOptions';
import type { BattleState } from './BattleState';
import type { Choice } from '../game/PendingChoice';

export interface RootGameState {
    version: string;
    options: PlayOptions;
    playerFactionMapping: Partial<Record<PlayerFactionType, number>>;
    playerTurnOrder: number[]; // Array of player IDs in turn order
    boardState: RootBoardState;
    factionState: Partial<Record<PlayerFactionType, RootFactionState>>;
    hirelingState: Partial<Record<HirelingFactionType, RootHirelingState>>;
    landmarks: LandmarkType[]; 
    timeState: TimeStep;
    battleState: BattleState | null;
    deck: Card[] | null;
    deckSize: number;
    discardPile: Card[];
    spentCraftingPieceIDs: number[];
    pendingChoice: Choice | null;
    pastChoices: Choice[];
}
