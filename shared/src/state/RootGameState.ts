import type { RootBoardState } from './RootBoardState';
import type { RootFactionState } from './RootFactionState';
import type { RootHirelingState } from './RootHirelingState';
import type { TimeStep } from './TimeStep';
import type { PlayerFactionType, HirelingFactionType, LandmarkType } from '../Enums';
import type { PlayOptions } from '../game/PlayOptions';
import type { BattleState } from './BattleState';
import type { Choice } from '../game/PendingChoice';
import type { PieceID } from '../pieces/Piece';
import type { PlayerID } from '../game/RootGame';
import type { CardPileState } from './RootCardPileState';

export interface RootGameState {
    version: string;
    options: PlayOptions;
    playerFactionMapping: Partial<Record<PlayerFactionType, PlayerID>>;
    playerTurnOrder: PlayerID[]; // Array of player IDs in turn order
    boardState: RootBoardState;
    factionState: Partial<Record<PlayerFactionType, RootFactionState>>;
    hirelingState: Partial<Record<HirelingFactionType, RootHirelingState>>;
    landmarks: LandmarkType[]; 
    timeState: TimeStep;
    battleState: BattleState | null;
    deck: CardPileState;
    discardPile: CardPileState;
    spentCraftingPieceIDs: PieceID[];
    pendingChoice: Choice | null;
    pastChoices: Choice[];
}
