import type { LocationID } from "../board/Location";
import type { CardID } from "../cards/Card";
import type { FactionType, HirelingFactionType, PlayerFactionType } from "../Enums";
import type { PieceID } from "../pieces/Piece";
import type { BattleState } from "../state/BattleState";
import type { RootFactionState } from "../state/RootFactionState";
import type { RootGameState } from "../state/RootGameState";
import type { RootHirelingState } from "../state/RootHirelingState";
import type { Choice, ChoiceID, ChoiceType, ChoiceValueMap } from "./PendingChoice";
import type { CardLocationType, PlayerID } from "./RootGame";

const ValidGameUpdateTypes = [
    "propertySet",
    "factionSelected",
    "move",
    "place",
    "remove",
    "factionStateUpdate",
    "returnToSupply",
    "moveCard",
    "hirelingStateUpdate",
    "battleChange",
    "crafting",
    "choicePended",
    "choiceResolved",
    "compound",
] as const;

export type GameUpdateType = (typeof ValidGameUpdateTypes)[number];

type PlayerCardLocationType = Extract<CardLocationType, "hand" | "crafted" | "revealed" | "pile">;

type GameUpdateValueMap = {
    propertySet: {
        [K in keyof RootGameState]: { property: K; value: RootGameState[K] };
    }[keyof RootGameState];
    factionSelected: { playerID: PlayerID; faction: PlayerFactionType };
    move: { pieces: PieceID[]; from: LocationID; to: LocationID };
    place: { pieces: PieceID[]; to: LocationID };
    remove: { pieces: PieceID[]; from: LocationID };
    factionStateUpdate: {
        [K in keyof RootFactionState]: {
            faction: PlayerFactionType;
            property: K;
            value: RootFactionState[K];
        };
    }[keyof RootFactionState];
    returnToSupply: { pieceID: PieceID; faction: FactionType };
    moveCard: { cardID: CardID } & {
        [K in CardLocationType]: (K extends PlayerCardLocationType
            ? { from: K; fromPlayerID: PlayerID; fromFaction: PlayerFactionType }
            : { from: K }) &
            (K extends "pile" ? { fromPileID: string } : {});
    }[CardLocationType] &
        {
            [K in CardLocationType]: (K extends PlayerCardLocationType
                ? { to: K; toPlayerID: PlayerID; toFaction: PlayerFactionType }
                : { to: K }) &
                (K extends "pile" ? { toPileID: string } : {});
        }[CardLocationType];
    hirelingStateUpdate: {
        [K in keyof RootHirelingState]: {
            hireling: HirelingFactionType;
            property: K;
            value: RootHirelingState[K];
        };
    }[keyof RootHirelingState];
    battleChange: {
        [K in keyof BattleState]: { property: K; value: BattleState[K] };
    }[keyof BattleState];
    crafting: { playerID: PlayerID; cardID: CardID; craftingPiecesUsed: PieceID[] };
    choicePended: { choice: Choice };
    choiceResolved: {
        [T in ChoiceType]: { choiceID: ChoiceID; type: T; resolution: ChoiceValueMap[T] };
    }[ChoiceType];
    compound: { updates: RootGameUpdate[] };
};

export interface RootGameUpdate<T extends GameUpdateType = GameUpdateType> {
    id: string; // Composed of turn number + sequence number for matching when initializing a mid-turn state
    type: T;
    options: GameUpdateValueMap[T];
}
