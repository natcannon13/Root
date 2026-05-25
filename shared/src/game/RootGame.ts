import { Board } from "../board/Board";
import type { RootGameState } from "../state/RootGameState";
import { TimeStep } from "../state/TimeStep";
import type { Card } from "../cards/Card";
import type { Piece } from "../pieces/Piece";
import type { BattlePhaseType, LandmarkType, PlayerFactionType } from "../Enums";
import type { RootGameAgent } from "../agents/RootGameAgent";
import type { Move } from "../gameActions/Move";
import type { Battle } from "../gameActions/Battle";
import type { Faction } from "../rulesModule/Faction";
import type { Hireling } from "../rulesModule/Hireling";
import type { Landmark } from "../rulesModule/Landmark";
import type { Event } from "./Event";
import type { RootBoardState } from "../state/RootBoardState";
import type { RootFactionState } from "../state/RootFactionState";
import type { PlayerFaction } from "../rulesModule/PlayerFaction";
import type { Supply } from "../pieces/Supply";
import type { RootHirelingState } from "../state/RootHirelingState";
import type { PlayOptions } from "./PlayOptions";
import type { BattleState } from "../state/BattleState";

// Minimal RootGame stub. Methods throw or are no-ops so other modules/tests can import the class.
export class RootGame {
    version = "0.0.0";
    board: Board | null = null;
    players: RootGameAgent[] = [];
    playOptions?: PlayOptions;
    factions: Faction[] = [];
    hirelings: Hireling[] = [];
    landmarks: Landmark[] = [];
    currentTimeStep: TimeStep = new TimeStep();
    battleState: BattleState | null = null;
    winner: PlayerFactionType | null = null;
    gameOver = false;
    deck: Card[] = [];
    discardPile: Card[] = [];
    dominancePile: Card[] = [];
    spentCraftingPieces: Piece[] = [];

    constructor(agents: RootGameAgent[], initialState?: RootGameState) {
    }

    getState(perspective: PlayerFactionType | null): RootGameState | null {
        return null;
    }

    setState(state: RootGameState) {
        throw new Error("RootGame.setState not implemented");
    }

    private initializeBoard(initialState?: RootBoardState): Board {
        throw new Error("initializeBoard not implemented");
    }

    private initializeFactions(
        initialState?: RootFactionState[],
    ): PlayerFaction[] {
        throw new Error("initializeFactions not implemented");
    }

    private initializeHirelings(
        initialState?: RootHirelingState[],
    ): Hireling[] {
        throw new Error("initializeHirelings not implemented");
    }

    private initializeLandmarks(initialState?: LandmarkType[]): Landmark[] {
        throw new Error("initializeLandmarks not implemented");
    }

    playTurn() {
        throw new Error("RootGame.play not implemented");
    }

    setup() {
        throw new Error("RootGame.setup not implemented");
    }

    rollDie(): number {
        return Math.floor(Math.random() * 4);
    }

    isMoveLegal(move: Move): boolean {
        throw new Error("RootGame.isMoveLegal not implemented");
    }

    isBattleLegal(battle: Battle): boolean {
        throw new Error("RootGame.isBattleLegal not implemented");
    }

    isPlaceLegal(pieces: Piece[], locationID: number): boolean {
        throw new Error("RootGame.isPlaceLegal not implemented");
    }

    isCraftLegal(
        faction: PlayerFactionType,
        card: Card,
        craftingPieces: Piece[],
    ): boolean {
        throw new Error("RootGame.isCraftLegal not implemented");
    }

    move(move: Move) {
        throw new Error("RootGame.move not implemented");
    }

    battle(battle: Battle) {
        throw new Error("RootGame.battle not implemented");
    }

    place(pieces: Piece[], supply: Supply, locationID: number) {
        throw new Error("RootGame.place not implemented");
    }

    craft(faction: PlayerFactionType, card: Card, craftingPieces: Piece[]) {
        throw new Error("RootGame.craft not implemented");
    }

    dealHits(faction: PlayerFactionType, locationID: number, hits: number) {
        throw new Error("RootGame.dealHits not implemented");
    }

    getGlobalEvents(): Event[] {
        return [];
    }
}
