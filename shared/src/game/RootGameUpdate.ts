import type { Location, LocationID } from "../board/Location";
import type { CardID } from "../cards/Card";
import type { PlayerFactionType } from "../Enums";
import type { PieceID } from "../pieces/Piece";
import type { RootGameState } from "../state/RootGameState";
import type { TimeStep } from "../state/TimeStep";
import type { PlayerID } from "./RootGame";

const ValidGameUpdateTypes = [
    'propertySet', 
    'factionSelected', 
    'move', 
    'place', 
    'remove', 
    'factionStateUpdate', 
    'returnToSupply',
    'moveCard', 
    'hirelingStateUpdate', 
    'hirelingControlChange', 
    'timestepChange',
    'battlePhaseUpdate',
    'hitsChange',
    'crafting',
    'choicePended',
    'choiceResolved',
    'compound',
] as const;

export type GameUpdateType = typeof ValidGameUpdateTypes[number];

type GameUpdateValueMap = {
    'propertySet': { [K in keyof RootGameState]: { property: K; value: RootGameState[K] } }[keyof RootGameState];
    'factionSelected': { playerID: PlayerID; faction: PlayerFactionType };
    'move': { pieceID: PieceID; from: LocationID; to: LocationID };
    'place': { pieceID: PieceID; to: LocationID };
    'remove': { pieceID: PieceID; from: LocationID };
    'factionStateUpdate': { faction: PlayerFactionType; newState: any };
    'returnToSupply': { pieceID: PieceID; from: LocationID };
    'moveCard': { cardID: CardID; from: 'deck' | 'hand' | 'discard'; to: 'deck' | 'hand' | 'discard' };
    'hirelingStateUpdate': { hirelingID: PieceID; newState: any };
    'hirelingControlChange': { hirelingID: PieceID; newControllingFaction: PlayerFactionType | null };
    'timestepChange': { newTimeStep: TimeStep };
    'battlePhaseUpdate': { newPhase: any };
    'hitsChange': { attackerHits: number; defenderHits: number };
    'crafting': { playerID: PlayerID; cardID: CardID; craftingPiecesUsed: PieceID[] };
    'choicePended': { choice: any };
    'choiceResolved': { choiceID: string; resolution: any };
    'compound': { updates: RootGameUpdate[] };
};

export interface RootGameUpdate<T extends GameUpdateType = GameUpdateType> {
    id: string; // Composed of turn number + sequence number for matching when initializing a mid-turn state
    type: T;
    options: GameUpdateValueMap[T];
}