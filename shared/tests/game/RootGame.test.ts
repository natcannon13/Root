import { beforeEach, describe, expect, test, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Board } from "../../src/board/Board";
import { LocationID } from "../../src/board/Location";
import type { Card } from "../../src/cards/Card";
import { CardPile } from "../../src/cards/CardPile";
import { CardPileLocation } from "../../src/cards/CardPileLocation";
import {
    BattlePhaseType,
    HirelingFactionType,
    isDemotedHirelingFactionType,
    isPromotedHirelingFactionType,
    LandmarkType,
    PhaseType,
    PlayerFactionType,
    PromotedHirelingFactionType,
} from "../../src/Enums";
import * as Factory from "../../src/Factory";
import type { Choice } from "../../src/game/PendingChoice";
import { PlayOptions } from "../../src/game/PlayOptions";
import { PlayerID, PromiseControl, RootGame, RootGameStateStore } from "../../src/game/RootGame";
import { RootGameUpdate } from "../../src/game/RootGameUpdate";
import { AdvancedSetupOptions, StandardSetupOptions } from "../../src/game/SetupOptions";
import { Battle } from "../../src/gameActions/Battle";
import type { PieceID } from "../../src/pieces/Piece";
import { DemotedHireling, Hireling, PromotedHireling } from "../../src/rulesModule/Hireling";
import { Landmark } from "../../src/rulesModule/Landmark";
import { PlayerFaction } from "../../src/rulesModule/PlayerFaction";
import { BattleState } from "../../src/state/BattleState";
import type { RootBoardState } from "../../src/state/RootBoardState";
import { CardPileState } from "../../src/state/RootCardPileState";
import type { RootFactionState } from "../../src/state/RootFactionState";
import { RootGameState } from "../../src/state/RootGameState";
import { RootHirelingState } from "../../src/state/RootHirelingState";
import { TimeStep } from "../../src/state/TimeStep";
let game: RootGame;
let stateStore: RootGameStateStore;
let stateStoreSubscribeMock: ReturnType<typeof vi.fn>;

let board: ReturnType<typeof mock<Board>>;
let factions: Partial<Record<PlayerFactionType, ReturnType<typeof mock<PlayerFaction>>>>;
let hirelings: Partial<Record<HirelingFactionType, ReturnType<typeof mock<Hireling>>>>;
let landmarks: ReturnType<typeof mock<Landmark>>[];

let playerFactionMapping: Partial<Record<PlayerFactionType, PlayerID>>;
let turnOrder: PlayerID[]; // Array of player IDs in turn order

let deck: ReturnType<typeof mock<CardPile>>;
let discardPile: ReturnType<typeof mock<CardPile>>;
let dominancePile: ReturnType<typeof mock<CardPile>>;

let pastChoices: ReturnType<typeof mock<Choice>>[];

const VERSION = "0.0.0";

function getBasePlayOptions(): PlayOptions & { setup: StandardSetupOptions } {
    return {
        setup: {
            type: "standard",
            map: "autumn",
            chosenFactions: {
                "marquise-de-cat": 1,
                "eyrie-dynasties": 2,
                "woodland-alliance": 3,
            },
            deck: "base",
            usingHirelings: true,
            landmarksToUse: 2,
            availableHirelings: [
                "struggling-farmers",
                "prosperous-farmers",
                "corvid-spies",
                "raven-sentries",
                "flame-bearers",
                "rat-smugglers",
                "feline-physicians",
                "forest-patrol",
            ],
            availableLandmarks: ["tower", "ferry", "elder-treetop"],
        },
        playerIDs: [1, 2, 3],
    } satisfies PlayOptions;
}

function getAdvancedPlayOptions(): PlayOptions & { setup: AdvancedSetupOptions } {
    return {
        setup: {
            type: "advanced",
            map: "autumn",
            draftableFactions: [
                "marquise-de-cat",
                "eyrie-dynasties",
                "woodland-alliance",
                "vagabond",
                "riverfolk-company",
                "lizard-cult",
            ],
            deck: "base",
            usingHirelings: true,
            landmarksToUse: 2,
            availableHirelings: [
                "struggling-farmers",
                "prosperous-farmers",
                "corvid-spies",
                "raven-sentries",
                "flame-bearers",
                "rat-smugglers",
                "feline-physicians",
                "forest-patrol",
            ],
            availableLandmarks: ["tower", "ferry", "elder-treetop"],
        },
        playerIDs: [1, 2, 3],
    } satisfies PlayOptions;
}

beforeEach(() => {
    mockGame();
});

function mockGame(options: PlayOptions = mock<PlayOptions>()) {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn().mockReturnValue(unsubscribe);
    stateStore = mock<RootGameStateStore>({ subscribe });
    stateStoreSubscribeMock = subscribe;
    game = new RootGame(stateStore, options);
}

function mockBoard() {
    board = mock<Board>();
    vi.spyOn(game, "board", "get").mockReturnValue(board);
}

function mockFaction<T extends PlayerFactionType>(faction: T) {
    factions[faction] = mock<PlayerFaction>({ name: faction });
}

function mockFactions(factionTurnOrder: { faction: PlayerFactionType; playerID: PlayerID }[] = []) {
    factions = {};
    playerFactionMapping = {};
    turnOrder = [];
    for (const { faction, playerID } of factionTurnOrder) {
        factions[faction] = mock<PlayerFaction>({ name: faction });
        playerFactionMapping[faction] = playerID;
        turnOrder.push(playerID);
    }
    let factionList = Object.values(factions);
    vi.spyOn(game, "factions", "get").mockReturnValue(factionList);
    vi.spyOn(game, "playerFactionMapping", "get").mockReturnValue(playerFactionMapping);
    vi.spyOn(game, "turnOrder", "get").mockReturnValue(turnOrder);
}

function mockHirelings(hirelingTypes: HirelingFactionType[] = []) {
    hirelings = {};
    for (const hirelingType of hirelingTypes) {
        if (isDemotedHirelingFactionType(hirelingType)) {
            hirelings[hirelingType] = mock<DemotedHireling>({ name: hirelingType });
        } else {
            hirelings[hirelingType] = mock<PromotedHireling>({ name: hirelingType });
        }
    }
    let hirelingList = Object.values(hirelings);
    vi.spyOn(game, "hirelings", "get").mockReturnValue(hirelingList);
}

function mockLandmarks(landmarkTypes: LandmarkType[] = []) {
    landmarks = landmarkTypes.map((landmarkType) => mock<Landmark>({ name: landmarkType }));
    vi.spyOn(game, "landmarks", "get").mockReturnValue(landmarks);
}

function mockDeck() {
    deck = mock<CardPile>();
    vi.spyOn(game, "deck", "get").mockReturnValue(deck);
}

function mockDiscardPile() {
    discardPile = mock<CardPile>();
    vi.spyOn(game, "discardPile", "get").mockReturnValue(discardPile);
}

function mockDominancePile() {
    dominancePile = mock<CardPile>();
    vi.spyOn(game, "dominancePile", "get").mockReturnValue(dominancePile);
}

function mockSpentCraftingPieces(pieces: PieceID[] = []) {
    vi.spyOn(game, "spentCraftingPieces", "get").mockReturnValue(pieces);
}

function mockPastChoices(choices: Partial<Choice>[] = []) {
    pastChoices = choices.map((choice) => mock<Choice>(choice));
    vi.spyOn(game, "pastChoices", "get").mockReturnValue(pastChoices);
}

function mockPromiseControl() {
    let resolve: (() => void) | null = null;
    let reject: ((reason?: any) => void) | null = null;
    const gameplayPromiseControlMock = mock<PromiseControl>();

    vi.spyOn(game, "gameplayPromiseControl", "get").mockReturnValue(gameplayPromiseControlMock);
    const spyOnGameplayPromiseControlSetter = vi
        .spyOn(game, "gameplayPromiseControl", "set")
        .mockImplementation((control) => {
            resolve = control?.resolve ?? null;
            reject = control?.reject ?? null;
        });
    function getResolver() {
        return resolve;
    }
    function getRejecter() {
        return reject;
    }
    return {
        getResolver,
        getRejecter,
        mock: gameplayPromiseControlMock,
        setter: spyOnGameplayPromiseControlSetter,
    };
}

function createRootGameState(overrides: Partial<RootGameState> = {}): RootGameState {
    return {
        version: "1.2.3",
        options: mock<PlayOptions>(),
        playerFactionMapping: {},
        turnOrder: [],
        boardState: { version: "b1", name: "autumn", clearings: [], forests: [] },
        factionState: {},
        hirelingState: {},
        landmarks: [],
        currentTimeStep: new TimeStep(),
        battleState: null,
        deck: mock<CardPileState>(),
        discardPile: mock<CardPileState>(),
        dominancePile: mock<CardPileState>(),
        spentCraftingPieceIDs: [],
        pendingChoice: null,
        pastChoices: [],
        winner: null,
        ...overrides,
    };
}

// --- constructor ----------------------------------------------------------------

describe("RootGame constructor", () => {
    test("registers a listener with the state store", () => {
        expect(stateStoreSubscribeMock).toHaveBeenCalled();
        const listener = stateStoreSubscribeMock.mock.calls[0][0];
        expect(typeof listener).toBe("function");
    });
    // TODO: figure out what this listener is supposed to do and test that it does it.
    test("calls stateFromOptions with the provided play options and calls initializeState with the resulting state", () => {
        const stateFromOptionsSpy = vi
            .spyOn(RootGame, "stateFromOptions")
            .mockReturnValue(createRootGameState());
        const initializeStateSpy = vi.spyOn(game, "initializeState").mockReturnValue(undefined);
        const basePlayOptions = getBasePlayOptions();
        mockGame(basePlayOptions);
        expect(stateFromOptionsSpy).toHaveBeenCalledWith(basePlayOptions);
        expect(initializeStateSpy).toHaveBeenCalledWith(stateFromOptionsSpy.mock.results[0].value);
    });
});

// --- getState ----------------------------------------------------------------

describe("RootGame.getState", () => {
    test("returns a state object that reflects the current game state", () => {
        mockBoard();
        mockFactions([
            { faction: "marquise-de-cat", playerID: 11 },
            { faction: "eyrie-dynasties", playerID: 2 },
        ]);
        mockHirelings(["corvid-spies", "flame-bearers", "highway-bandits"]);
        mockLandmarks(["ferry"]);
        mockDeck();
        mockDiscardPile();
        mockDominancePile();
        mockSpentCraftingPieces([4]);
        mockPastChoices([{ id: "c1" }]);

        const boardState = mock<RootBoardState>();
        board.getState.mockReturnValue(boardState);

        const pf1State = mock<RootFactionState>();
        const pf2State = mock<RootFactionState>();
        factions["marquise-de-cat"]!.getState.mockReturnValue(pf1State);
        factions["eyrie-dynasties"]!.getState.mockReturnValue(pf2State);

        const h1State = mock<RootHirelingState>();
        const h2State = mock<RootHirelingState>();
        const h3State = mock<RootHirelingState>();
        hirelings["corvid-spies"]!.getState.mockReturnValue(h1State);
        hirelings["flame-bearers"]!.getState.mockReturnValue(h2State);
        hirelings["highway-bandits"]!.getState.mockReturnValue(h3State);

        const deckState = mock<CardPileState>();
        const discardPileState = mock<CardPileState>();
        const dominancePileState = mock<CardPileState>();
        deck.getState.mockReturnValue(deckState);
        discardPile.getState.mockReturnValue(discardPileState);
        dominancePile.getState.mockReturnValue(dominancePileState);

        game.version = "vtest";
        game.options = mock<PlayOptions>();
        game.currentTimeStep = mock<TimeStep>();
        game.battleState = mock<BattleState>();
        game.pendingChoice = mock<Choice>();

        // Mock structuredClone so that it returns the same object for simplicity, since we're not actually testing immutability here.
        const structuredCloneSpy = vi
            .spyOn(globalThis, "structuredClone")
            .mockImplementation((obj) => obj);

        const state = game.getState?.();

        expect(state).not.toBeNull();
        expect(state.version).toBe("vtest");
        expect(state.options).toBe(game.options);
        expect(state.playerFactionMapping).toEqual(playerFactionMapping);
        expect(state.turnOrder).toEqual(turnOrder);
        expect(state.boardState).toBe(boardState);
        expect(state.factionState["marquise-de-cat"]).toBe(pf1State);
        expect(state.factionState["eyrie-dynasties"]).toBe(pf2State);
        expect(state.hirelingState["corvid-spies"]).toBe(h1State);
        expect(state.hirelingState["flame-bearers"]).toBe(h2State);
        expect(state.hirelingState["highway-bandits"]).toBe(h3State);
        expect(state.landmarks).toEqual(["ferry"]);
        expect(state.currentTimeStep).toBe(game.currentTimeStep);
        expect(state.battleState).toBe(game.battleState);
        expect(state.deck).toBe(deckState);
        expect(state.discardPile).toBe(discardPileState);
        expect(state.dominancePile).toBe(dominancePileState);
        expect(state.spentCraftingPieceIDs).toEqual([4]);
        expect(state.pendingChoice).toBe(game.pendingChoice);
        expect(state.pastChoices).toStrictEqual(pastChoices);
    });

    test("when given a faction perspective, calls getState on the board with that perspective, and on each faction with the correct publicView flag", () => {
        const board = mock<Board>();
        const pf1 = mock<PlayerFaction>({ name: "marquise-de-cat" });
        const pf2 = mock<PlayerFaction>({ name: "eyrie-dynasties" });
        game.board = board;
        game.factions = [pf1, pf2];
        game.getState("marquise-de-cat");
        expect(board.getState).toHaveBeenCalledWith("marquise-de-cat");
        expect(pf1.getState).toHaveBeenCalledWith(false);
        expect(pf2.getState).toHaveBeenCalledWith(true);
    });
});

// --- initializeState ----------------------------------------------------------------

describe("RootGame.initializeState", () => {
    // TODO: redo these tests with real data after everything has been implemented
    test("calls generate-from-type Factory functions for each game component matching the provided types and assigns them to the game instance", () => {
        const board = mock<Board>();

        const factionByType = mock<PlayerFaction>({ name: "marquise-de-cat" });
        const hirelingByType = mock<Hireling>({ name: "corvid-spies" });
        const landmarkByType = mock<Landmark>({ name: "ferry" });

        const generateBoardSpy = vi.spyOn(Factory, "generateBoardFromType").mockReturnValue(board);
        const generateFactionSpy = vi
            .spyOn(Factory, "generateFactionFromType")
            .mockReturnValue(factionByType);
        const generateHirelingSpy = vi
            .spyOn(Factory, "generateHirelingFromType")
            .mockReturnValue(hirelingByType);
        const generateLandmarkSpy = vi
            .spyOn(Factory, "generateLandmarkFromType")
            .mockReturnValue(landmarkByType);

        const boardSetterSpy = vi.spyOn(game, "board", "set");
        const factionsSetterSpy = vi.spyOn(game, "factions", "set");
        const hirelingsSetterSpy = vi.spyOn(game, "hirelings", "set");
        const landmarksSetterSpy = vi.spyOn(game, "landmarks", "set");

        const state = createRootGameState({
            factionState: {
                "marquise-de-cat": {
                    version: "f1",
                    name: "marquise-de-cat",
                    hand: mock<CardPileState>(),
                    revealedCards: mock<CardPileState>(),
                    craftedImprovements: mock<CardPileState>(),
                    piles: {},
                    score: 0,
                },
            },
            hirelingState: {
                "corvid-spies": {
                    version: "h3",
                    name: "corvid-spies",
                    controlCounter: 0,
                    controllingFaction: "woodland-alliance",
                },
            },
            landmarks: ["ferry"],
        });

        game.initializeState(state);

        expect(generateBoardSpy).toHaveBeenCalledWith(state.boardState.name);
        expect(generateFactionSpy).toHaveBeenCalledWith("marquise-de-cat");
        expect(generateHirelingSpy).toHaveBeenCalledWith("corvid-spies");
        expect(generateLandmarkSpy).toHaveBeenCalledWith("ferry");

        expect(boardSetterSpy).toHaveBeenCalledWith(board);
        expect(factionsSetterSpy).toHaveBeenCalledWith([factionByType]);
        expect(hirelingsSetterSpy).toHaveBeenCalledWith([hirelingByType]);
        expect(landmarksSetterSpy).toHaveBeenCalledWith([landmarkByType]);
    });
    test("after initialization, getState returns an identical state object to the one provided", () => {
        const state = createRootGameState({
            currentTimeStep: new TimeStep("eyrie-dynasties", "daylight", "end"),
            battleState: mock<BattleState>(),
            deck: mock<CardPileState>(),
            discardPile: mock<CardPileState>(),
            spentCraftingPieceIDs: [4, 5],
            pendingChoice: mock<Choice>({ resolved: false }),
            pastChoices: [mock<Choice>({ resolved: true })],
        });

        game.initializeState(state);

        const returnedState = game.getState();
        expect(returnedState).toEqual(state);
    });
    test("calls initializeState on StateStore", () => {
        const state = createRootGameState();
        const initializeStateSpy = vi
            .spyOn(stateStore, "initializeState")
            .mockReturnValue(undefined);
        game.initializeState(state);
        expect(initializeStateSpy).toHaveBeenCalledWith(state);
    });
});

// --- updateState ----------------------------------------------------------------

describe("RootGame.updateState", () => {
    test("calls updateState on StateStore with the provided update", () => {
        const update: RootGameUpdate = mock<RootGameUpdate>();
        const updateStateSpy = vi.spyOn(stateStore, "updateState").mockReturnValue(undefined);
        game.updateState(update);
        expect(updateStateSpy).toHaveBeenCalledWith(update);
    });
    test("stateSet update calls initializeState with the provided state", () => {
        const newState = createRootGameState();
        const initializeStateSpy = vi.spyOn(game, "initializeState").mockReturnValue(undefined);
        game.updateState({ type: "stateSet", options: { newState }, id: "u1", version: VERSION });
        expect(initializeStateSpy).toHaveBeenCalledWith(newState);
    });
    test("factionSelected update adds the pair to playerFactionMapping", () => {
        const faction: PlayerFactionType = "marquise-de-cat";
        const playerID: PlayerID = 1;
        game.updateState({
            type: "factionSelected",
            options: { faction, playerID },
            id: "u2",
            version: VERSION,
        });
        expect(game.playerFactionMapping[faction]).toBe(playerID);
    });
    test("turnOrderSet update sets turnOrder to the provided order", () => {
        const turnOrder: PlayerID[] = [2, 3, 1];
        game.updateState({
            type: "turnOrderSet",
            options: { turnOrder },
            id: "u3",
            version: VERSION,
        });
        expect(game.turnOrder).toEqual(turnOrder);
    });
    test("factionAdded update generates and adds the given faction to the factions list", () => {
        const factionName: PlayerFactionType = "marquise-de-cat";
        const faction = mock<PlayerFaction>({ name: factionName });
        const generateFactionFromTypeSpy = vi
            .spyOn(Factory, "generateFactionFromType")
            .mockReturnValue(faction);

        game.updateState({
            type: "factionAdded",
            options: { faction: factionName },
            id: "u3",
            version: VERSION,
        });
        expect(generateFactionFromTypeSpy).toHaveBeenCalledWith(factionName);
        expect(game.factions).toContain(faction);
    });
    test("hirelingAdded update adds the hireling to the game", () => {
        const hireling: HirelingFactionType = "corvid-spies";
        const hirelingObj = mock<Hireling>({ name: hireling });
        const generateHirelingFromTypeSpy = vi
            .spyOn(Factory, "generateHirelingFromType")
            .mockReturnValue(hirelingObj);

        game.updateState({
            type: "hirelingAdded",
            options: { hireling },
            id: "u4",
            version: VERSION,
        });
        expect(generateHirelingFromTypeSpy).toHaveBeenCalledWith(hireling);
        expect(game.hirelings).toContain(hirelingObj);
    });
    test("landmarkAdded update adds the landmark to the game", () => {
        const landmark: LandmarkType = "ferry";
        const landmarkObj = mock<Landmark>({ name: landmark });
        const generateLandmarkFromTypeSpy = vi
            .spyOn(Factory, "generateLandmarkFromType")
            .mockReturnValue(landmarkObj);

        game.updateState({
            type: "landmarkAdded",
            options: { landmark },
            id: "u5",
            version: VERSION,
        });
        expect(generateLandmarkFromTypeSpy).toHaveBeenCalledWith(landmark);
        expect(game.landmarks).toContain(landmarkObj);
    });
    test("move update calls move on the board", () => {
        mockBoard();
        const pieces: PieceID[] = [1, 2];
        const from = mock<LocationID>();
        const to = mock<LocationID>();
        const moveOptions = { pieces, from, to };
        const moveSpy = vi.spyOn(board, "move").mockReturnValue(undefined);
        game.updateState({ type: "move", options: moveOptions, id: "u4", version: VERSION });
        expect(moveSpy).toHaveBeenCalledWith(pieces, from, to);
    });
    test("place update calls place on the board", () => {
        mockBoard();
        const location = mock<LocationID>();
        const pieces: PieceID[] = [1, 2];
        const placeSpy = vi.spyOn(board, "place").mockReturnValue(undefined);
        game.updateState({
            type: "place",
            options: { pieces, to: location },
            id: "u5",
            version: VERSION,
        });
        expect(placeSpy).toHaveBeenCalledWith(pieces, location);
    });
    test("remove update calls remove on the board", () => {
        mockBoard();
        const location = mock<LocationID>();
        const pieces: PieceID[] = [1, 2];
        const removeSpy = vi.spyOn(board, "remove").mockReturnValue(undefined);
        game.updateState({
            type: "remove",
            options: { pieces, from: location },
            id: "u6",
            version: VERSION,
        });
        expect(removeSpy).toHaveBeenCalledWith(pieces, location);
    });
    test("addToSupply update calls addToSupply on the appropriate faction", () => {
        const faction: PlayerFactionType = "marquise-de-cat";
        mockFactions([{ faction: faction, playerID: 1 }]);
        const pieces: PieceID[] = [1, 2];
        const addToSupplySpy = vi
            .spyOn(factions[faction]!, "addToSupply")
            .mockReturnValue(undefined);
        game.updateState({
            type: "addToSupply",
            options: { faction, pieces },
            id: "u7",
            version: VERSION,
        });
        expect(addToSupplySpy).toHaveBeenCalledWith(pieces);
    });
    test("factionStateUpdate calls updateFactionState on the appropriate faction with the provided update type and payload", () => {
        const faction: PlayerFactionType = "marquise-de-cat";
        mockFactions([{ faction: faction, playerID: 1 }]);
        const updateType = "resourceChange";
        const value = { amount: 5 };
        const updateFactionStateSpy = vi
            .spyOn(factions[faction]!, "updateState")
            .mockReturnValue(undefined);
        game.updateState({
            type: "factionStateUpdate",
            options: { faction, updateType, value },
            id: "u8",
            version: VERSION,
        });
        expect(updateFactionStateSpy).toHaveBeenCalledWith(updateType, value);
    });
    test("moveCard update calls addCard and removeCard on the appropriate card piles with the provided card ID", () => {
        // TODO: add different scenarios for different from/to locations
        const cardID = 42;
        const faction: PlayerFactionType = "marquise-de-cat";
        const hand = mock<CardPileLocation>({ name: "hand", faction });
        const revealed = mock<CardPileLocation>({ name: "revealed", faction });
        mockFactions([{ faction: faction, playerID: 1 }]);
        const addCardSpy = vi
            .spyOn(factions[faction]!.hand, "removeCard")
            .mockReturnValue(undefined);
        const removeCardSpy = vi
            .spyOn(factions[faction]!.revealedCards, "addCard")
            .mockReturnValue(undefined);
        game.updateState({
            type: "moveCard",
            options: { cardID, from: hand, to: revealed },
            id: "u9",
            version: VERSION,
        });
        expect(addCardSpy).toHaveBeenCalledWith(cardID);
        expect(removeCardSpy).toHaveBeenCalledWith(cardID);
    });
    test("startBattle update sets a BattleState with the provided battle", () => {
        const battle = mock<Battle>();
        game.updateState({ type: "startBattle", options: { battle }, id: "u10", version: VERSION });
        expect(game.battleState).not.toBeNull();
        expect(game.battleState?.battle).toBe(battle);
    });
    test("battleSegmentChange update updates the current battle segment in battleState", () => {
        const battleState = mock<BattleState>();
        vi.spyOn(game, "battleState", "get").mockReturnValue(battleState);
        const setBattleSegmentSpy = vi
            .spyOn(battleState, "battleSegment", "set")
            .mockReturnValue(undefined);
        const segment: BattlePhaseType = "hits" as const;
        game.updateState({
            type: "battleSegmentChange",
            options: { newBattleSegment: segment },
            id: "u11",
            version: VERSION,
        });
        expect(setBattleSegmentSpy).toHaveBeenCalledWith(segment);
    });
    test("pendingHitsChange update updates the pending hits for the attacker or defender in battleState", () => {
        const battleState = mock<BattleState>();
        vi.spyOn(game, "battleState", "get").mockReturnValue(battleState);
        const setPendingAttackerHitsSpy = vi
            .spyOn(battleState, "pendingAttackerHits", "set")
            .mockReturnValue(undefined);
        const setPendingDefenderHitsSpy = vi
            .spyOn(battleState, "pendingDefenderHits", "set")
            .mockReturnValue(undefined);
        const attackerHits = 3;
        const defenderHits = 2;
        game.updateState({
            type: "pendingHitsChange",
            options: { attackerHits, defenderHits },
            id: "u12",
            version: VERSION,
        });
        expect(setPendingAttackerHitsSpy).toHaveBeenCalledWith(attackerHits);
        expect(setPendingDefenderHitsSpy).toHaveBeenCalledWith(defenderHits);
    });
    test("endBattle update sets battleState to null", () => {
        const setBattleStateSpy = vi.spyOn(game, "battleState", "set").mockReturnValue(undefined);
        game.updateState({ type: "endBattle", options: {}, id: "u13", version: VERSION });
        expect(setBattleStateSpy).toHaveBeenCalledWith(null);
    });
    test("crafting update adds the provided piece IDs to spentCraftingPieceIDs", () => {
        const pieceIDs: PieceID[] = [1, 2];
        const startingPieces: PieceID[] = [3];
        game.spentCraftingPieces = startingPieces;
        game.updateState({
            type: "crafting",
            options: { craftingPiecesUsed: pieceIDs },
            id: "u14",
            version: VERSION,
        });
        for (const pieceID of [...startingPieces, ...pieceIDs]) {
            expect(game.spentCraftingPieces).toContain(pieceID);
        }
    });
    test("craftingReset update removes the provided piece IDs from spentCraftingPieceIDs", () => {
        const pieceIDsToRemove: PieceID[] = [1, 2];
        const pieceIDsToKeep: PieceID[] = [3, 4];
        const startingPieces: PieceID[] = [...pieceIDsToRemove, ...pieceIDsToKeep];
        game.spentCraftingPieces = startingPieces;
        game.updateState({
            type: "craftingReset",
            options: { craftingPiecesReset: pieceIDsToRemove },
            id: "u15",
            version: VERSION,
        });
        for (const pieceID of pieceIDsToRemove) {
            expect(game.spentCraftingPieces).not.toContain(pieceID);
        }
        for (const pieceID of pieceIDsToKeep) {
            expect(game.spentCraftingPieces).toContain(pieceID);
        }
    });
    test("choicePended update sets pendingChoice to the provided choice", () => {
        const choice: Choice = mock<Choice>();
        const pendingChoiceSetterSpy = vi
            .spyOn(game, "pendingChoice", "set")
            .mockReturnValue(undefined);
        game.updateState({
            type: "choicePended",
            options: { choice },
            id: "u16",
            version: VERSION,
        });
        expect(pendingChoiceSetterSpy).toHaveBeenCalledWith(choice);
    });
    test("choiceResolved update moves the pending choice with the provided ID to past choices with the provided resolution and sets pendingChoice to null", () => {
        const pendingChoice: Choice = {
            id: "c1",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { options: ["option1", "option2"] },
        };
        game.pendingChoice = pendingChoice;
        const resolution = "option1";
        game.updateState({
            type: "choiceResolved",
            options: { type: "pick", choiceID: "c1", resolution },
            id: "u17",
            version: VERSION,
        });
        expect(game.pendingChoice).toBeNull();
        expect(game.pastChoices).toContainEqual({
            ...pendingChoice,
            resolved: true,
            value: resolution,
        });
    });
    test("compound update executes multiple updates in order", () => {
        const update1: RootGameUpdate = {
            type: "turnOrderSet",
            options: { turnOrder: [2, 3, 1] },
            id: "u20",
            version: VERSION,
        };
        const update2: RootGameUpdate = {
            type: "move",
            options: { pieces: [1], from: mock<LocationID>(), to: mock<LocationID>() },
            id: "u21",
            version: VERSION,
        };
        const update3: RootGameUpdate = {
            type: "addToSupply",
            options: { faction: "marquise-de-cat", pieces: [2, 3] },
            id: "u22",
            version: VERSION,
        };
        const compoundUpdate: RootGameUpdate = {
            type: "compound",
            options: { updates: [update1, update2, update3] },
            id: "u23",
            version: VERSION,
        };
        const updateStateSpy = vi.spyOn(game, "updateState");
        game.updateState(compoundUpdate);
        expect(updateStateSpy).toHaveBeenNthCalledWith(2, update1);
        expect(updateStateSpy).toHaveBeenNthCalledWith(3, update2);
        expect(updateStateSpy).toHaveBeenNthCalledWith(4, update3);
    });
});

// --- awaitChoice ----------------------------------------------------------------

describe("RootGame.awaitChoice", () => {
    test("returns right away with the appropriate value if a matching choice exists in past choices", async () => {
        const past: Choice = {
            id: "c1",
            type: "pick",
            playerID: 1,
            resolved: true,
            options: { options: ["option1", "option2"] },
            value: "option1",
        };
        mockPastChoices([past]);

        const result = await game.awaitChoice({
            id: "c1",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { options: ["option1", "option2"] },
        });
        expect(result).toEqual(past.value);
    });

    test("throws an error if a different choice with the same id exists in past choices", async () => {
        const past: Choice = {
            id: "c1",
            type: "pick",
            playerID: 1,
            resolved: true,
            value: "option1",
            options: { options: ["option1", "option2"] },
        };
        mockPastChoices([past]);

        await expect(
            game.awaitChoice({
                id: "c1",
                type: "pick",
                playerID: 1,
                resolved: false,
                options: { options: ["option1", "option2"] },
            }),
        ).rejects.toThrow();
    });

    test("waits for the choice to be resolved if it's not in past choices", async () => {
        const { getResolver } = mockPromiseControl();

        const p = game.awaitChoice({
            id: "p1",
            type: "pick",
            playerID: 2,
            resolved: false,
            options: { options: ["option1", "option2"] },
        });
        let isPending = true;
        p.then(() => (isPending = false));

        const resolve = getResolver();
        expect(resolve).not.toBeNull();

        // Check that the promise is still pending
        await undefined;
        expect(isPending).toBe(true);

        // Resolve the pending choice and then the gameplay promise
        game.pendingChoice = {
            id: "p1",
            type: "pick",
            playerID: 2,
            resolved: true,
            value: "option1",
            options: { options: ["option1", "option2"] },
        };
        resolve?.();

        // Check that the promise has resolved
        await p; // The real test: will block forever if the promise hasn't resolved
        expect(isPending).toBe(false);
    });

    test("calls updateState to set the pending choice and sets gameplayPromiseControl to a new PromiseControl", () => {
        const choice: Choice = {
            id: "p1",
            type: "pick",
            playerID: 2,
            resolved: false,
            options: { options: ["option1", "option2"] },
        };
        const { getResolver, setter } = mockPromiseControl();
        const updateStateSpy = vi.spyOn(game, "updateState");
        game.awaitChoice(choice);
        expect(updateStateSpy).toHaveBeenCalledWith({
            type: "choicePended",
            options: { choice },
            id: expect.any(String),
            version: VERSION,
        });
        expect(setter).toHaveBeenCalledWith(
            expect.objectContaining({
                resolve: expect.any(Function),
                reject: expect.any(Function),
            }),
        );
        getResolver()?.(); // Clean up by resolving the promise
    });

    test("throws an error if the pending promise is rejected", async () => {
        const { getRejecter } = mockPromiseControl();

        const p = game.awaitChoice({
            id: "p2",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { options: ["option1", "option2"] },
        });

        const reject = getRejecter();
        expect(reject).not.toBeNull();

        reject?.(new Error("gameplay failed"));

        await expect(p).rejects.toThrow("gameplay failed");
    });

    test("throws an error if the pending choice has changed after resolution", async () => {
        const { getResolver } = mockPromiseControl();
        const p = game.awaitChoice({
            id: "p3",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { options: ["option1", "option2"] },
        });

        // Change pendingChoice to a different id
        game.pendingChoice = {
            id: "other",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { options: ["option1", "option2"] },
        };
        getResolver?.();

        await expect(p).rejects.toThrow();
    });

    test("returns the value of the choice after resolution", async () => {
        const { getResolver } = mockPromiseControl();

        const p = game.awaitChoice({
            id: "p4",
            type: "pick",
            playerID: 3,
            resolved: false,
            options: { options: ["option1", "option2"] },
        });
        game.pendingChoice = {
            id: "p4",
            type: "pick",
            playerID: 3,
            resolved: true,
            value: "option1",
            options: { options: ["option1", "option2"] },
        };

        getResolver?.();

        await expect(p).resolves.toEqual("option1");
    });

    test("calls updateState to resolve the choice and sets pending choice to null after resolution", async () => {
        const { getResolver, setter } = mockPromiseControl();
        const updateStateSpy = vi.spyOn(game, "updateState");

        const p = game.awaitChoice({
            id: "p5",
            type: "pick",
            playerID: 4,
            resolved: false,
            options: { options: ["option1", "option2"] },
        });
        const resolved: Choice = {
            id: "p5",
            type: "pick",
            playerID: 4,
            resolved: true,
            value: "option1",
            options: { options: ["option1", "option2"] },
        };
        game.pendingChoice = resolved;
        getResolver?.();

        await p;
        expect(updateStateSpy).toHaveBeenCalledWith({
            type: "choiceResolved",
            options: { choice: resolved },
            id: expect.any(String),
            version: VERSION,
        });
        expect(game.pendingChoice).toBeNull();
        expect(setter).toHaveBeenCalledWith(null); // Check that gameplayPromiseControl was set to null
    });
});

// --- playTurn ----------------------------------------------------------------

describe("RootGame.playTurn", () => {
    let takePhaseSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
        mockFactions([
            { faction: "marquise-de-cat", playerID: 1 },
            { faction: "eyrie-dynasties", playerID: 2 },
            { faction: "woodland-alliance", playerID: 3 },
        ]);
        game.turnOrder = [1, 2, 3];
        game.currentTimeStep = new TimeStep("marquise-de-cat", "birdsong", "start");
        takePhaseSpy = vi
            .spyOn(factions["marquise-de-cat"]!, "takePhase")
            .mockResolvedValue(undefined);
    });
    test("calls setup if timestep currentTurn is none", () => {
        const setupSpy = vi.spyOn(game, "setup").mockResolvedValue(undefined);
        game.currentTimeStep = new TimeStep("none", "birdsong", "main");
        game.playTurn();
        expect(setupSpy).toHaveBeenCalled();
    });

    test("calls takePhase 3 times for the current player and updates timestep correctly in between", () => {
        game.playTurn();
        expect(takePhaseSpy).toHaveBeenCalledTimes(3);
        expect(takePhaseSpy.mock.calls[0][0]).toEqual(
            new TimeStep("marquise-de-cat", "birdsong", "main"),
        );
        expect(takePhaseSpy.mock.calls[1][0]).toEqual(
            new TimeStep("marquise-de-cat", "daylight", "main"),
        );
        expect(takePhaseSpy.mock.calls[2][0]).toEqual(
            new TimeStep("marquise-de-cat", "evening", "main"),
        );
        expect(game.currentTimeStep).toEqual(new TimeStep("eyrie-dynasties", "birdsong", "start"));
    });

    test("calls updateState to set the turn phase with each combination of phase and phase segment", () => {
        const updateStateSpy = vi.spyOn(game, "updateState").mockResolvedValue(undefined);
        game.playTurn();
        const phases: PhaseType[] = ["birdsong", "daylight", "evening"];
        const segments = ["start", "main", "end"] as const;
        for (const phase of phases) {
            for (const segment of segments) {
                expect(updateStateSpy).toHaveBeenCalledWith({
                    type: "turnPhaseSet",
                    options: { timeStep: new TimeStep("marquise-de-cat", phase, segment) },
                    id: expect.any(String),
                    version: VERSION,
                });
            }
        }
    });

    test("if given a mid-turn time step, skips to the correct phase", () => {
        game.currentTimeStep = new TimeStep("marquise-de-cat", "daylight", "main");
        game.playTurn();
        expect(takePhaseSpy).toHaveBeenCalledTimes(2);
        expect(takePhaseSpy.mock.calls[0][0]).toEqual(
            new TimeStep("marquise-de-cat", "daylight", "main"),
        );
        expect(takePhaseSpy.mock.calls[1][0]).toEqual(
            new TimeStep("marquise-de-cat", "evening", "start"),
        );
    });
});

// --- setup ----------------------------------------------------------------

describe("RootGame.setup", () => {
    let basePlayOptions: PlayOptions & {
        setup: StandardSetupOptions;
    };
    beforeEach(() => {
        basePlayOptions = getBasePlayOptions();
        game.options = basePlayOptions;
    });
    test("randomizes seating order", () => {
        const order = [2, 3, 1];
        const awaitChoiceSpy = vi.spyOn(game, "awaitChoice").mockResolvedValue(order);
        const gameUpdateSpy = vi.spyOn(game, "updateState").mockReturnValue(undefined);
        game.setup();
        expect(awaitChoiceSpy).toHaveBeenCalledWith(expect.objectContaining({ playerID: null }));
        expect(gameUpdateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ type: "turnOrderSet", options: { turnOrder: order } }),
        );
    });
    test("removes dominance cards from the deck in 2-player games", () => {
        mockDeck();
        vi.spyOn(deck, "cards", "get").mockReturnValue([
            mock<Card>({ id: 1, name: "dominance-card-1", isDominance: true }),
            mock<Card>({ id: 2, name: "dominance-card-2", isDominance: true }),
            mock<Card>({ id: 3, name: "non-dominance-card", isDominance: false }),
        ]);
        const gameUpdateSpy = vi.spyOn(game, "updateState").mockReturnValue(undefined);
        basePlayOptions.playerIDs = [1, 2];
        delete basePlayOptions.setup.chosenFactions["woodland-alliance"];
        game.setup();
        for (const cardID of [1, 2]) {
            expect(gameUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "moveCard",
                    options: {
                        from: { name: "deck" },
                        to: { name: "nowhere" },
                        cardID,
                    },
                } satisfies Partial<RootGameUpdate>),
            );
        }
        expect(gameUpdateSpy).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: "moveCard",
                options: expect.objectContaining({
                    cardID: 3,
                }),
            } satisfies Partial<RootGameUpdate>),
        );
    });

    test.each([2, 1, 0])(
        "randomly generates the correct number of landmarks",
        (numberOfLandmarks) => {
            const availableLandmarks = basePlayOptions.setup.availableLandmarks;
            const updateStateSpy = vi.spyOn(game, "updateState").mockReturnValue(undefined);
            game.setup();
            const landmarkAddedCalls = updateStateSpy.mock.calls.filter(
                (call) => call[0].type === "landmarkAdded",
            ) as [RootGameUpdate & { type: "landmarkAdded" }][];
            const landmarksAdded = landmarkAddedCalls.map((call) => call[0].options.landmark);
            expect(landmarkAddedCalls).toHaveLength(numberOfLandmarks);
            for (const landmark of landmarksAdded) {
                expect(availableLandmarks).toContain(landmark);
            }
            expect(new Set(landmarksAdded).size).toBe(landmarksAdded.length); // Check that all landmarks are unique
        },
    );
    test("players place landmarks in reverse turn order", () => {
        const turnOrderSpy = vi.spyOn(game, "turnOrder", "get").mockReturnValue([1, 2, 3]);
        let playerIDs: PlayerID[] = [];
        const generateLandmarkSpy = vi
            .spyOn(Factory, "generateLandmarkFromType")
            .mockImplementation((type) =>
                mock<Landmark>({
                    name: type,
                    setup: async (g, id) => {
                        playerIDs.push(id);
                    },
                }),
            );
        game.setup();
        expect(playerIDs).toEqual([3, 2]);
    });

    test("generates the correct number of promoted/demoted hirelings for the player count", () => {
        const generateHirelingSpy = vi.spyOn(Factory, "generateHirelingFromType");
        const totalHirelings = 3;
        const promotedHirelingCountsByPlayerCount: { [key: number]: number } = {
            3: 2,
            4: 1,
            5: 0,
        };
        for (let playerCount = 3; playerCount <= 5; playerCount++) {
            const basePlayOptions = getBasePlayOptions();
            basePlayOptions.playerIDs = Array.from({ length: playerCount }, (_, i) => i + 1);
            game.options = basePlayOptions;
            generateHirelingSpy.mockClear();
            game.setup();
            // get an array of the types used to call generateHirelingFromType
            const hirelingTypesUsed = generateHirelingSpy.mock.calls.map((call) => call[0]);
            const promotedHirelingsUsed = hirelingTypesUsed.filter((type) =>
                isPromotedHirelingFactionType(type),
            );
            const demotedHirelingsUsed = hirelingTypesUsed.filter((type) =>
                isDemotedHirelingFactionType(type),
            );

            const promotedHirelingCount = promotedHirelingsUsed.length;
            const demotedHirelingCount = demotedHirelingsUsed.length;

            expect(promotedHirelingCount).toBe(promotedHirelingCountsByPlayerCount[playerCount]);
            expect(demotedHirelingCount).toBe(totalHirelings - promotedHirelingCount);
        }
    });
    test("players set up hirelings in reverse turn order", () => {
        const turnOrderSpy = vi.spyOn(game, "turnOrder", "get").mockReturnValue([1, 2, 3]);
        let playerIDs: PlayerID[] = [];
        const generateHirelingSpy = vi
            .spyOn(Factory, "generateHirelingFromType")
            .mockImplementation((type) =>
                mock<PromotedHireling>({
                    name: type as PromotedHirelingFactionType,
                    setup: async (g, id) => {
                        playerIDs.push(id);
                    },
                }),
            );
        game.setup();
        expect(playerIDs).toEqual([3, 2]);
    });
    test("hirelings are skipped if the option is not enabled", () => {
        game.options.setup.usingHirelings = false;
        const generateHirelingSpy = vi.spyOn(Factory, "generateHirelingFromType");
        const hirelingSetterSpy = vi.spyOn(game, "hirelings", "set");
        game.setup();
        expect(generateHirelingSpy).not.toHaveBeenCalled();
        expect(hirelingSetterSpy).toHaveBeenCalledWith([]);
    });

    describe("standard setup", () => {
        test("sets up chosen factions", () => {
            let mockSetupFunction = vi.fn();
            const generateFactionSpy = vi
                .spyOn(Factory, "generateFactionFromType")
                .mockImplementation((type) =>
                    mock<PlayerFaction>({
                        name: type,
                        setup: mockSetupFunction,
                    }),
                );
            game.setup();
            const expectedSetUps: { type: PlayerFactionType; id: PlayerID }[] = [
                { type: "marquise-de-cat", id: 1 },
                { type: "eyrie-dynasties", id: 2 },
                { type: "woodland-alliance", id: 3 },
            ];
            expect(mockSetupFunction).toHaveBeenCalledTimes(3);
            expectedSetUps.forEach(({ type, id }, index) => {
                expect(generateFactionSpy.mock.calls[index][0]).toBe(type);
                expect(mockSetupFunction.mock.calls[index][0]).toBe(game);
                expect(mockSetupFunction.mock.calls[index][1]).toBe(id);
            });
        });
        test("assigns the correct player to each faction", () => {
            game.setup();
            const basePlayOptions = getBasePlayOptions();
            expect(game.playerFactionMapping).toEqual(basePlayOptions.setup.chosenFactions);
        });
        test("throws an error if an invalid player id is provided", () => {
            game.options.playerIDs = [1, 2, 99];
            expect(() => game.setup()).toThrow();
        });
        test("each player draws three cards", () => {
            // Add a deck to draw from and spy on drawCard to check that it's called the correct number of times for each player
            const deck = Array.from({ length: 30 }, (_, i) =>
                mock<Card>({
                    id: i + 1,
                    name: `c${i + 1}`,
                    suit: "fox",
                    craftingCost: null,
                    isAmbush: false,
                    isDominance: false,
                    item: null,
                }),
            );
            const generateDeckSpy = vi.spyOn(Factory, "generateDeckFromType").mockReturnValue(deck);
            const drawCardSpy = vi.spyOn(game, "drawCard");
            game.setup();
            expect(drawCardSpy).toHaveBeenCalledTimes(9);
            let cardsDrawnByPlayer: { [playerID: PlayerID]: number } = {};
            for (let i = 0; i < 9; i++) {
                const call = drawCardSpy.mock.calls[i];
                const playerFaction = call[0];
                const playerID = game.playerFactionMapping[playerFaction]!;
                cardsDrawnByPlayer[playerID] = (cardsDrawnByPlayer[playerID] || 0) + 1;
            }
            expect(cardsDrawnByPlayer).toEqual({
                1: 3,
                2: 3,
                3: 3,
            });
        });
    });
    describe("advanced setup", () => {
        beforeEach(() => {
            // Replace standard setup with advanced setup in play options
            const advancedSetupOptions = getAdvancedPlayOptions();
            game.options = advancedSetupOptions;
        });
        test("order of events is correct", () => {
            // Landmarks -> Hirelings -> Draw Cards -> Factions -> Discard Cards
            // We can check the order of events by spying on the relevant methods and checking the order in which they were called
            const generateLandmarkSpy = vi.spyOn(Factory, "generateLandmarkFromType");
            const generateHirelingSpy = vi.spyOn(Factory, "generateHirelingFromType");
            const drawCardSpy = vi.spyOn(game, "drawCard");
            const generateFactionSpy = vi
                .spyOn(Factory, "generateFactionFromType")
                .mockReturnValue(mock<PlayerFaction>({ name: "marquise-de-cat" }));
            const returnCardToDeckSpy = vi.spyOn(game, "returnCardToDeck");
            expect(generateLandmarkSpy).toHaveBeenCalledBefore(generateHirelingSpy);
            expect(generateHirelingSpy).toHaveBeenCalledBefore(drawCardSpy);
            expect(drawCardSpy).toHaveBeenCalledBefore(generateFactionSpy);
            expect(generateFactionSpy).toHaveBeenCalledBefore(returnCardToDeckSpy);
        });

        test("each player draws five cards", () => {
            // Spy on drawCard to check that it's called the correct number of times for each player
            const drawCardSpy = vi.spyOn(game, "drawCard");
            game.setup();
            expect(drawCardSpy).toHaveBeenCalledTimes(15);
            let cardsDrawnByPlayer: { [playerID: PlayerID]: number } = {};
            for (let i = 0; i < 15; i++) {
                const call = drawCardSpy.mock.calls[i];
                const playerFaction = call[0];
                const playerID = game.playerFactionMapping[playerFaction]!;
                cardsDrawnByPlayer[playerID] = (cardsDrawnByPlayer[playerID] || 0) + 1;
            }
            expect(cardsDrawnByPlayer).toEqual({
                1: 5,
                2: 5,
                3: 5,
            });
        });
        test("each player chooses two cards to return to the deck", () => {
            const returnCardToDeckSpy = vi.spyOn(game, "returnCardToDeck");
            game.setup();
            expect(returnCardToDeckSpy).toHaveBeenCalledTimes(6);
            let cardsReturnedByPlayer: { [playerID: PlayerID]: number } = {};
            for (let i = 0; i < 6; i++) {
                const call = returnCardToDeckSpy.mock.calls[i];
                const playerFaction = call[0];
                const playerID = game.playerFactionMapping[playerFaction]!;
                cardsReturnedByPlayer[playerID] = (cardsReturnedByPlayer[playerID] || 0) + 1;
            }
            expect(cardsReturnedByPlayer).toEqual({
                1: 2,
                2: 2,
                3: 2,
            });
        });

        test("(# of players + 1) factions are selected for the draft", () => {});
        test("factions cannot be added to the draft if their corresponding hireling is in the game", () => {});
        test("the first faction in the draft is militant (7+ reach)", () => {});
        test("no insurgents are selected for the draft in 2-player games", () => {});

        test("players draft factions in reverse turn order", () => {});
        test("players cannot draft the last faction in the draft if it is an insurgent and no militant faction has been drafted yet", () => {});
        test("players setup their faction before the next player picks", () => {});

        test("players cannot pick a homeland clearing that has already been chosen by another player", () => {});
        test("players must follow homeland distance rules if possible", () => {});
        test("if players cannot follow the homeland distance rules, they must follow the next most lenient placement rule if possible", () => {});

        test("throws an error if the setup options are incomplete", () => {});
    });
});

// --- placeLandmark ----------------------------------------------------------------

// --- rollDie -----------------------------------------------------------------

describe("RootGame.rollDie", () => {
    test("returns a value between 0 and 3 inclusive", () => {});
    test("returns all possible values with equal probability", () => {});
});

// --- isMoveLegal  ----------------------------------------------

describe("RootGame.isMoveLegal ", () => {
    test("is legal when mover rules the origin clearing", () => {});

    test("is legal when mover rules the destination clearing", () => {});

    test("is illegal when mover rules neither origin nor destination ", () => {});

    test("is illegal when origin and destination are not adjacent", () => {});

    test("is illegal to move zero pieces", () => {});
});

// --- isBattleLegal  ----------------------------------------------------

describe("RootGame.isBattleLegal ", () => {
    test("is legal when attacker has warriors in the clearing and there is a defender", () => {});

    test("is illegal when attacker has no pieces in the clearing", () => {});

    test("is illegal when defender has no pieces in the clearing", () => {});

    test("is illegal to battle yourself", () => {});

    test("is illegal to battle with zero attacking warriors ", () => {});

    test("is illegal to battle a hireling you control", () => {});

    test("is illegal to battle a faction that is not an enemy", () => {});
});

// --- isPlaceLegal  ---------------------------------------------------

describe("RootGame.isPlaceLegal", () => {
    test("placing a building is legal when there is an open slot", () => {});

    test("placing a building is illegal when there are no open slots ", () => {});
});

// --- isCraftLegal  -----------------------------------------------------

describe("RootGame.isCraftLegal", () => {
    test("is legal when unexhausted crafting pieces cover all required suits", () => {});

    test("is illegal when crafting pieces do not cover all required suits ", () => {});

    test("is illegal to craft with exhausted pieces ", () => {});

    test("presence of extra crafting pieces does not affect legality, even if exhausted ", () => {});

    test("is illegal when no crafting pieces are provided", () => {});

    test("cannot craft an ambush card ", () => {});

    test("cannot craft a dominance card ", () => {});

    test("cannot craft duplicate persistent effects ", () => {});
});

// --- move  -----------------------------------------------------

describe("RootGame.move", () => {
    test("moves pieces from origin to destination clearing ", () => {});
    test("throws an error if move is illegal ", () => {});
});

// --- battle  -----------------------------------------------------

describe("RootGame.battle", () => {
    // --- battle - dice and hit counting  ------------------------

    test("throws an error if battle is illegal ", () => {});
    test("if timestep battleSegment is not none, skips to that segment ", () => {});

    describe("RootGame.battle - hit counting", () => {
        test("attacker deals hits equal to the higher roll ", () => {});

        test("defender deals hits equal to the lower roll ", () => {});

        test("equal rolls give both sides the same number of hits ", () => {});

        test("rolled hits are capped by attacker warrior count ", () => {});

        test("rolled hits are capped by defender warrior count ", () => {});

        test("defenseless: attacker deals extra hit when defender has no warriors ", () => {});
    });

    describe("RootGame.battle - ambush ", () => {
        test("defender can play ambush matching the clearing suit to deal 2 immediate hits", () => {});

        test("defender cannot play an ambush that doesn't match the clearing suit", () => {});

        test("attacker can foil ambush with an ambush card matching the clearing suit ", () => {});

        test("attacker cannot foil ambush with an ambush card that doesn't match the clearing suit ", () => {});

        test("battle ends immediately if no attacking warriors remain after ambush, even if the attacker has other pieces ", () => {});

        test("battle continues as normal if at least 1 attacking warrior remains after ambush ", () => {});
    });
});

// --- place -------------------------------------------------------------
describe("RootGame.place", () => {
    test("places pieces in target location", () => {});
    test("removes pieces from the source supply", () => {});
    test("throws an error if the placement is invalid", () => {});
});

// --- craft -------------------------------------------------------------
describe("RootGame.craft", () => {
    test("removes the card from the player's hand", () => {});
    test("adds the card to the player's crafted improvements", () => {});
    test("throws an error if the card is not in the player's hand", () => {});
    test("adds the crafted pieces to the spent crafting components", () => {});
    test("throws an error if the crafting is invalid", () => {});
});

// --- dealHits ----------------------------------------------------------
describe("RootGame.dealHits", () => {
    test("player must remove a piece for each hit they receive", () => {});

    test("warriors are removed before buildings and tokens ", () => {});

    test("players can choose which of their buildings or tokens take hits ", () => {});

    test("scoring: removing enemy building or token scores 1 VP ", () => {});

    test("hirelings do not score VP for their controller when removing enemy buildings or tokens", () => {});
});

// --- getGlobalEvents ----------------------------------------------------

describe("RootGame.getGlobalEvents", () => {
    test("collects global events from all RulesModules", () => {});
});

// --- Victory - score tracking  --------------------------------

describe("RootGame - victory conditions ", () => {
    test("gameOver is false at the start", () => {});

    test("first player to reach 30 VP wins ", () => {});

    test("winning is immediate - game stops at exactly 30 ", () => {});

    test("on a VP tie, the player closest clockwise to current player wins ", () => {});

    test("non-bird dominance victory: a player ruling three or more clearings matching a claimed dominance card at start of birdsong wins", () => {});

    test("non-bird dominance failure: a player claiming a dominance card but not ruling three or more matching clearings at start of birdsong does not win ", () => {});

    test("bird dominance victory: a player ruling two opposite corner clearings at start of birdsong wins", () => {});

    test("bird dominance failure: a player claiming a bird dominance card but not ruling two opposite corner clearings at start of birdsong does not win ", () => {});
});

// --- Dominance  --------------------------------------------------------

describe("RootGame - dominance ", () => {
    test("players may activate a dominance card in their hand during their daylight ", () => {});

    test("players cannot activate a dominance card without having 10 VP ", () => {});

    test("players cannot activate dominance cards outside of their daylight ", () => {});

    test("after activating dominance, score marker is removed (score is set to -1) ", () => {});

    test("players cannot activate a dominance card if they have an active dominance card ", () => {});

    test("when discarded, dominance cards go to a separate pile and are not reshuffled into the deck ", () => {});

    test("a faction can take an available dominance card by spending a matching card ", () => {});

    test("cannot treat a bird dominance card as another suit when taking it ", () => {});
});

// --- Deck reshuffling  --------------------------------------------------

describe("RootGame - deck management ", () => {
    test("reshuffles discard pile into deck when deck is empty", () => {});

    test("drawn card comes from top of deck", () => {});

    test("dominance cards are not reshuffled into the deck ", () => {});
});

// --- Piece placement limits  -----------------------------------------

describe("RootGame - piece limits ", () => {
    test("does not place pieces beyond supply limit", () => {});
});
