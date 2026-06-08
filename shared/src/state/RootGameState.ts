import type { HirelingFactionType, LandmarkType, PlayerFactionType } from "../Enums";
import type { Choice } from "../game/PendingChoice";
import type { PlayOptions } from "../game/PlayOptions";
import type { RNGEvent } from "../game/RNGEvent";
import type { PlayerID } from "../game/RootGame";
import type { PieceID } from "../pieces/Piece";
import type { StateType } from "../stateStore/StateStore";
import type { BattleState } from "./BattleState";
import type { RootBoardState } from "./RootBoardState";
import type { CardPileState } from "./RootCardPileState";
import type { RootFactionState } from "./RootFactionState";
import type { RootHirelingState } from "./RootHirelingState";
import type { TimeStep } from "./TimeStep";

export interface RootGameState extends StateType {
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
    dominancePile: CardPileState;
    spentCraftingPieceIDs: PieceID[];
    pendingChoice: Choice | null;
    pastChoices: Choice[];
    pastRNGEvents: RNGEvent[];
}
