import { Board } from "../board/Board";
import type { LocationID } from "../board/Location";
import type { Card, CardID } from "../cards/Card";
import { CardPile } from "../cards/CardPile";
import type { FactionType, PlayerFactionType } from "../Enums";
import type { Battle } from "../gameActions/Battle";
import type { Move } from "../gameActions/Move";
import type { Piece, PieceID } from "../pieces/Piece";
import type { Supply } from "../pieces/Supply";
import type { Hireling } from "../rulesModule/Hireling";
import type { Landmark } from "../rulesModule/Landmark";
import type { PlayerFaction } from "../rulesModule/PlayerFaction";
import type { BattleState } from "../state/BattleState";
import type { RootGameState } from "../state/RootGameState";
import { TimeStep } from "../state/TimeStep";
import type { StateStore } from "../stateStore/StateStore";
import type { Choice, ChoiceType, ChoiceValueMap, PendingChoice, ResolvedChoice } from "./Choice";
import type { Event } from "./Event";
import type { PlayOptions } from "./PlayOptions";
import { RandomEventHandler } from "./RandomEventHandler";
import type { RootGameUpdate } from "./RootGameUpdate";

export type RootGameStateStore = StateStore<RootGameState, RootGameUpdate>;

export class PromiseControl {
    promise: Promise<void>;
    resolve: () => void;
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

export type PlayerID = number;

// Minimal RootGame stub. Methods throw or are no-ops so other modules/tests can import the class.
export class RootGame {
    version = "0.0.0";
    options: PlayOptions;
    playerFactionMapping: Partial<Record<PlayerFactionType, PlayerID>> = {};
    turnOrder: PlayerID[] = [];
    board: Board | null = null;
    factions: PlayerFaction[] = [];
    hirelings: Hireling[] = [];
    landmarks: Landmark[] = [];
    currentTimeStep: TimeStep = new TimeStep();
    battleState: BattleState | null = null;
    deck: CardPile = new CardPile();
    discardPile: CardPile = new CardPile();
    dominancePile: CardPile = new CardPile();
    spentCraftingPieces: PieceID[] = [];
    pendingChoice: Choice | null = null; // Separate from gameplayPendingPromise for serializability.
    pastChoices: ResolvedChoice[] = [];
    gameplayPromiseControl: PromiseControl | null = null; // When not null, indicates that an async gameplay loop is active and awaiting resolution.
    stateStore: RootGameStateStore;
    randomEventHandler: RandomEventHandler = new RandomEventHandler();
    winner: PlayerFactionType | null = null;
    gameOver = false;

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

    async awaitChoice<T extends ChoiceType>(choice: PendingChoice<T>): Promise<ChoiceValueMap[T]> {
        throw new Error("RootGame.awaitChoice not implemented");
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

    async returnCardToDeck(faction: PlayerFactionType, cardID: CardID) {
        throw new Error("RootGame.returnCardToDeck not implemented");
    }

    isMoveLegal(move: Move): boolean {
        throw new Error("RootGame.isMoveLegal not implemented");
    }

    isBattleLegal(battle: Battle): boolean {
        throw new Error("RootGame.isBattleLegal not implemented");
    }

    isPlaceLegal(pieces: Piece[], locationID: LocationID): boolean {
        throw new Error("RootGame.isPlaceLegal not implemented");
    }

    isCraftLegal(faction: PlayerFactionType, card: Card, craftingPieces: PieceID[]): boolean {
        throw new Error("RootGame.isCraftLegal not implemented");
    }

    isEnemy(faction1: PlayerFactionType, faction2: PlayerFactionType): boolean {
        throw new Error("RootGame.isEnemy not implemented");
    }

    getRuler(clearingID: LocationID): FactionType | null {
        throw new Error("RootGame.getRuler not implemented");
    }

    async move(move: Move) {
        throw new Error("RootGame.move not implemented");
    }

    async battle(battle: Battle) {
        throw new Error("RootGame.battle not implemented");
    }

    async place(pieces: Piece[], supply: Supply, locationID: LocationID) {
        throw new Error("RootGame.place not implemented");
    }

    async craft(faction: PlayerFactionType, card: Card, craftingPieces: PieceID[]) {
        throw new Error("RootGame.craft not implemented");
    }

    async dealHits(
        hitFaction: FactionType,
        hittingFaction: FactionType,
        locationID: LocationID,
        hits: number,
    ) {
        throw new Error("RootGame.dealHits not implemented");
    }

    getGlobalEvents(): Event[] {
        return [];
    }
}
