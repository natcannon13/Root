import type { LocationID } from "../board/Location";
import type { CardID } from "../cards/Card";
import type { CardLocationType } from "../cards/CardPileLocation";
import type { BattlePhaseType, FactionType, HirelingFactionType, PlayerFactionType } from "../Enums";
import type { Battle } from "../gameActions/Battle";
import type { PieceID } from "../pieces/Piece";
import type { RootGameState } from "../state/RootGameState";
import type { TransitionType } from "../stateStore/StateStore";
import type { Choice, ChoiceID, ChoiceType, ChoiceValueMap } from "./PendingChoice";
import type { RNGEvent } from "./RNGEvent";
import type { PlayerID } from "./RootGame";

const ValidGameUpdateTypes = [
    "stateSet",
    "factionSelected",
    "turnOrderSet",
    "move",
    "place",
    "remove",
    "returnToSupply",
    "factionStateUpdate",
    "hirelingStateUpdate",
    "moveCard",
    "startBattle",
    "battleSegmentChange",
    "pendingHitsChange",
    "endBattle",
    "crafting",
    "choicePended",
    "choiceResolved",
    "rng",
    "compound",
] as const;

export type GameUpdateType = (typeof ValidGameUpdateTypes)[number];

type GameUpdateValueMap = {
    stateSet: { newState: RootGameState };
    factionSelected: { playerID: PlayerID; faction: PlayerFactionType };
    turnOrderSet: { turnOrder: PlayerID[] };
    move: { pieces: PieceID[]; from: LocationID; to: LocationID };
    place: { pieces: PieceID[]; to: LocationID };
    remove: { pieces: PieceID[]; from: LocationID };
    returnToSupply: { pieceID: PieceID; faction: FactionType };
    factionStateUpdate: {
        faction: PlayerFactionType;
        updateType: string;
        value: any;
    };
    hirelingStateUpdate: {
        hireling: HirelingFactionType;
        updateType: string;
        value: any;
    };
    startBattle: { battle: Battle };
    battleSegmentChange: { newBattleSegment: BattlePhaseType | null };
    pendingHitsChange: { attackerHits?: number; defenderHits?: number };
    endBattle: { };
    moveCard: { cardID: CardID; from: CardLocationType; to: CardLocationType };
    crafting: { playerID: PlayerID; craftingPiecesUsed: PieceID[] };
    choicePended: { choice: Choice };
    choiceResolved: {
        [T in ChoiceType]: { choiceID: ChoiceID; type: T; resolution: ChoiceValueMap[T] };
    }[ChoiceType];
    rng: { event: RNGEvent };
    compound: { updates: RootGameUpdate[] };
};

export interface RootGameUpdate<T extends GameUpdateType = GameUpdateType> extends TransitionType {
    type: T;
    options: GameUpdateValueMap[T];
}
