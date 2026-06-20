import type { HirelingFactionType, LandmarkType, PlayerFactionType } from "../Enums";
import type { Choice } from "../game/Choice";
import type { PlayOptions } from "../game/PlayOptions";
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
    readonly version: string;
    readonly options: PlayOptions;
    readonly playerFactionMapping: Partial<Record<PlayerFactionType, PlayerID>>;
    readonly turnOrder: PlayerID[]; // Array of player IDs in turn order
    readonly boardState: RootBoardState;
    readonly factionState: Partial<Record<PlayerFactionType, RootFactionState>>;
    readonly hirelingState: Partial<Record<HirelingFactionType, RootHirelingState>>;
    readonly landmarks: LandmarkType[]; //TODO: update landmarks to have state
    readonly currentTimeStep: TimeStep;
    readonly battleState: BattleState | null;
    readonly deck: CardPileState;
    readonly discardPile: CardPileState;
    readonly dominancePile: CardPileState;
    readonly spentCraftingPieceIDs: PieceID[];
    readonly pendingChoice: Choice | null;
    readonly pastChoices: Choice[];
    readonly winner: PlayerFactionType | null;
}
