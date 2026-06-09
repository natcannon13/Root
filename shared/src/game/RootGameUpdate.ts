import type { LocationID } from "../board/Location";
import type { CardID } from "../cards/Card";
import type { CardLocationType } from "../cards/CardPileLocation";
import type { BattlePhaseType, FactionType, HirelingFactionType, PlayerFactionType } from "../Enums";
import type { Battle } from "../gameActions/Battle";
import type { PieceID } from "../pieces/Piece";
import type { RootGameState } from "../state/RootGameState";
import type { TransitionType } from "../stateStore/StateStore";
import type { Choice, ChoiceID, ChoiceType, ChoiceValueMap } from "./PendingChoice";
import type { PlayerID } from "./RootGame";

const ValidGameUpdateTypes = [
    "stateSet", // Sets the entire state. Used at the beginning of the game and when making an admin edit.
    "factionSelected", // Creates a connection between faction and player ID. Used for the initial faction selection at the start of the game.
    "turnOrderSet", // Sets the turn order. Used for the initial turn order setup at the start of the game.
    "move", // Moves pieces from one location to another on the board.
    "place", // Places pieces on the board.
    "remove", // Removes pieces from the board.
    "returnToSupply", // Adds pieces to a faction's supply.
    "factionStateUpdate", // Executes an update to a faction's state. Specific update types are defined per-faction.
    "hirelingStateUpdate", // Executes an update to a hireling's state. Specific update types are defined per-hireling.
    "moveCard", // Moves a card from one card location to another.
    "startBattle", // Starts a battle and sets the initial battle state.
    "battleSegmentChange", // Changes the current battle segment.
    "pendingHitsChange", // Updates the number of pending hits for the attacker or defender.
    "endBattle", // Ends the current battle.
    "crafting", // Marks crafting pieces as used for the current turn.
    "choicePended", // Pends a new choice.
    "choiceResolved", // Resolves a pending choice with a given resolution, and moves it to past choices.
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
    compound: { updates: RootGameUpdate[] };
};

export interface RootGameUpdate<T extends GameUpdateType = GameUpdateType> extends TransitionType {
    type: T;
    options: GameUpdateValueMap[T];
}
