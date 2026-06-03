import { Board } from "../board/Board";
import type { RootGameState } from "../state/RootGameState";
import { TimeStep } from "../state/TimeStep";
import type { Card } from "../cards/Card";
import type { Piece } from "../pieces/Piece";
import type { BattlePhaseType, FactionType, LandmarkType, PlayerFactionType } from "../Enums";
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
import type { PendingChoice, PendingChoiceType, PendingChoiceValueMap } from "./PendingChoice";
import type { StateStore } from "../stateStore/StateStore";
import type { RootGameUpdate } from "./RootGameUpdate";

export type RootGameStateStore = StateStore<RootGameState, RootGameUpdate>;

export class PromiseControl {
    promise: Promise<void>;
    resolve: () => void
    reject: (reason?: any) => void;

    constructor() {
        this.resolve = () => {};
        this.reject = () => {}; // these are to make Typescript happy.
        this.promise = new Promise<void>((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }

}

// Minimal RootGame stub. Methods throw or are no-ops so other modules/tests can import the class.
export class RootGame {
    version = "0.0.0";
    board: Board | null = null;
    playOptions: PlayOptions;
    playerFactionMapping: Partial<Record<PlayerFactionType, number>> = {}; 
    turnOrder: number[] = [];
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
    pendingChoice: PendingChoice | null = null; // Seperate from gameplayPendingPromise for serializability.
    pastChoices: PendingChoice[] = [];
    gameplayPromiseControl: PromiseControl | null = null; // When not null, indicates that an async gameplay loop is active and awaiting resolution.

    constructor(stateStore: RootGameStateStore, options: PlayOptions) {
        throw new Error("RootGame constructor not implemented");
    }

    static stateFromOptions(options: PlayOptions): RootGameState {
        throw new Error("RootGame.stateFromOptions not implemented");
    }

    getState(perspective?: PlayerFactionType): RootGameState {
        throw new Error("RootGame.getState not implemented");
    }

    initializeState(state: RootGameState) {
        throw new Error("RootGame.initializeState not implemented");
    }

    updateState(update: RootGameUpdate) {
        throw new Error("RootGame.updateState not implemented");
    }

    async awaitPlayerChoice<T extends PendingChoiceType>(choice: PendingChoice<T>): Promise<PendingChoiceValueMap[T]> {
        throw new Error("RootGame.awaitPlayerChoice not implemented");
    }

    private initializeBoard(initialState: RootBoardState): Board {
        throw new Error("initializeBoard not implemented");
    }

    private initializeFactions(
        initialState: RootFactionState[],
    ): PlayerFaction[] {
        throw new Error("initializeFactions not implemented");
    }

    private initializeHirelings(
        initialState: RootHirelingState[],
    ): Hireling[] {
        throw new Error("initializeHirelings not implemented");
    }

    private initializeLandmarks(initialState: LandmarkType[]): Landmark[] {
        throw new Error("initializeLandmarks not implemented");
    }
    async play() {
        throw new Error("RootGame.play not implemented");
    }

    async playTurn() {
        throw new Error("RootGame.playTurn not implemented");
    }

    async setup() {
        throw new Error("RootGame.setup not implemented");
    }

    async drawCard(faction: PlayerFactionType) {
        throw new Error("RootGame.drawCard not implemented");
    }

    async returnCardToDeck(faction: PlayerFactionType, cardID: number) {
        throw new Error("RootGame.returnCardToDeck not implemented");
    }

    rollDie(): number {
        return Math.floor(Math.random() * 4);
    }

    async isMoveLegal(move: Move): Promise<boolean> {
        throw new Error("RootGame.isMoveLegal not implemented");
    }

    async isBattleLegal(battle: Battle): Promise<boolean> {
        throw new Error("RootGame.isBattleLegal not implemented");
    }

    async isPlaceLegal(pieces: Piece[], locationID: number): Promise<boolean> {
        throw new Error("RootGame.isPlaceLegal not implemented");
    }

    async isCraftLegal(
        faction: PlayerFactionType,
        card: Card,
        craftingPieces: Piece[],
    ): Promise<boolean> {
        throw new Error("RootGame.isCraftLegal not implemented");
    }

    async move(move: Move) {
        throw new Error("RootGame.move not implemented");
    }

    async battle(battle: Battle) {
        throw new Error("RootGame.battle not implemented");
    }

    async place(pieces: Piece[], supply: Supply, locationID: number) {
        throw new Error("RootGame.place not implemented");
    }

    async craft(faction: PlayerFactionType, card: Card, craftingPieces: Piece[]) {
        throw new Error("RootGame.craft not implemented");
    }

    async dealHits(hitFaction: FactionType, hittingFaction: FactionType, locationID: number, hits: number) {
        throw new Error("RootGame.dealHits not implemented");
    }

    getGlobalEvents(): Event[] {
        return [];
    }
}
