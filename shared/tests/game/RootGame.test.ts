import util from "util";
import { beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Board } from "../../src/board/Board";
import type { Clearing } from "../../src/board/Clearing";
import type { Connection } from "../../src/board/Connection";
import type { Forest } from "../../src/board/Forest";
import type { LocationID } from "../../src/board/Location";
import type { Card } from "../../src/cards/Card";
import { CardPile } from "../../src/cards/CardPile";
import type { CardPileLocation } from "../../src/cards/CardPileLocation";
import {
    type BattlePhaseType,
    type ExclusionType,
    type FactionType,
    type HirelingFactionType,
    isDemotedHirelingFactionType,
    isPromotedHirelingFactionType,
    type LandmarkType,
    type PhaseType,
    type PlayerFactionType,
    reachValues,
    standardSetupOrder,
    type Suit,
} from "../../src/Enums";
import * as Factory from "../../src/Factory";
import {
    type Choice,
    type ChoiceType,
    type ChoiceValueMap,
    type PendingChoice,
    PLAYER_CHOICE_DESC,
    RAND_ORDER_DESC,
    RAND_PICK_DESC,
    RAND_PICKX_DESC,
    type ResolvedChoice,
} from "../../src/game/Choice";
import type { PlayOptions } from "../../src/game/PlayOptions";
import {
    type PlayerID,
    PromiseControl,
    RootGame,
    type RootGameStateStore,
} from "../../src/game/RootGame";
import type { RootGameUpdate } from "../../src/game/RootGameUpdate";
import type { AdvancedSetupOptions, StandardSetupOptions } from "../../src/game/SetupOptions";
import type { Battle } from "../../src/gameActions/Battle";
import type { PieceID } from "../../src/pieces/Piece";
import type { DemotedHireling, Hireling, PromotedHireling } from "../../src/rulesModule/Hireling";
import type { Landmark } from "../../src/rulesModule/Landmark";
import type { PlayerFaction } from "../../src/rulesModule/PlayerFaction";
import { BattleState } from "../../src/state/BattleState";
import type { RootBoardState } from "../../src/state/RootBoardState";
import type { CardPileState } from "../../src/state/RootCardPileState";
import type { RootFactionState } from "../../src/state/RootFactionState";
import type { RootGameState } from "../../src/state/RootGameState";
import type { RootHirelingState } from "../../src/state/RootHirelingState";
import { TimeStep } from "../../src/state/TimeStep";
import {
    makeBoard,
    makeBuilding,
    makeCard,
    makeCardPile,
    makeClearing,
    makeDemotedHireling,
    makeFactionType,
    makeForest,
    makeLandmark,
    makePawn,
    makePiece,
    makePlayerFaction,
    makePromotedHireling,
    makeResolvedChoice,
    makeToken,
} from "../factories/factories";

let game: RootGame;
let stateStore: RootGameStateStore;
let stateStoreSubscribeMock: ReturnType<typeof vi.fn>;

let board: ReturnType<typeof mock<Board>>;
let factions: Partial<Record<PlayerFactionType, ReturnType<typeof mock<PlayerFaction>>>>;
let hirelings: Partial<Record<HirelingFactionType, ReturnType<typeof mock<Hireling>>>>;
let landmarks: Landmark[];

let playerFactionMapping: Partial<Record<PlayerFactionType, PlayerID>>;
let turnOrder: PlayerID[]; // Array of player IDs in turn order

let deck: ReturnType<typeof mock<CardPile>>;
let discardPile: ReturnType<typeof mock<CardPile>>;
let dominancePile: ReturnType<typeof mock<CardPile>>;

let pastChoices: ReturnType<typeof mock<ResolvedChoice>>[];

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
            availableHirelings: ["corvid", "rat", "feline", "farmer"],
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
            availableHirelings: ["corvid", "rat", "feline", "farmer"],
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
    board = makeBoard();
    vi.spyOn(game, "board", "get").mockReturnValue(board);
}

function mockFactions(factionTurnOrder: { faction: PlayerFactionType; playerID: PlayerID }[] = []) {
    factions = {};
    playerFactionMapping = {};
    turnOrder = [];
    for (const { faction, playerID } of factionTurnOrder) {
        factions[faction] = makePlayerFaction({ name: faction });
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
            hirelings[hirelingType] = makeDemotedHireling({
                name: hirelingType,
            });
        } else {
            hirelings[hirelingType] = makePromotedHireling({
                name: hirelingType,
            });
        }
    }
    let hirelingList = Object.values(hirelings);
    vi.spyOn(game, "hirelings", "get").mockReturnValue(hirelingList);
}

function mockLandmarks(landmarkTypes: LandmarkType[] = []) {
    landmarks = landmarkTypes.map((landmarkType) => makeLandmark({ name: landmarkType }));
    vi.spyOn(game, "landmarks", "get").mockReturnValue(landmarks);
}

function mockDeck() {
    deck = makeCardPile();
    vi.spyOn(game, "deck", "get").mockReturnValue(deck);
}

function mockDiscardPile() {
    discardPile = makeCardPile();
    vi.spyOn(game, "discardPile", "get").mockReturnValue(discardPile);
}

function mockDominancePile() {
    dominancePile = makeCardPile();
    vi.spyOn(game, "dominancePile", "get").mockReturnValue(dominancePile);
}

function mockSpentCraftingPieces(pieces: PieceID[] = []) {
    vi.spyOn(game, "spentCraftingPieces", "get").mockReturnValue(pieces);
}

function mockPastChoices(choices: Partial<ResolvedChoice>[] = []) {
    pastChoices = choices.map((choice) => makeResolvedChoice("pick", choice));
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
        boardState: {
            version: "b1",
            name: "autumn",
            clearings: [],
            forests: [],
        },
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
        vi.spyOn(globalThis, "structuredClone").mockImplementation((obj) => obj);

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
        game.updateState({
            type: "stateSet",
            options: { newState },
            id: "u1",
            version: VERSION,
        });
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
        game.updateState({
            type: "move",
            options: moveOptions,
            id: "u4",
            version: VERSION,
        });
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
            options: { update: { faction, updateType, value } },
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
        game.updateState({
            type: "startBattle",
            options: { battle },
            id: "u10",
            version: VERSION,
        });
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
        game.updateState({
            type: "endBattle",
            options: {},
            id: "u13",
            version: VERSION,
        });
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: {
                pieces: [1],
                from: mock<LocationID>(),
                to: mock<LocationID>(),
            },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
            value: "option1",
        };
        mockPastChoices([past]);

        const result = await game.awaitChoice({
            id: "c1",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
        };
        mockPastChoices([past]);

        await expect(
            game.awaitChoice({
                id: "c1",
                type: "pick",
                playerID: 1,
                resolved: false,
                options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
        });

        // Change pendingChoice to a different id
        game.pendingChoice = {
            id: "other",
            type: "pick",
            playerID: 1,
            resolved: false,
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
        });
        game.pendingChoice = {
            id: "p4",
            type: "pick",
            playerID: 3,
            resolved: true,
            value: "option1",
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
            options: { description: "Pick an option", options: ["option1", "option2"] },
        });
        const resolved: Choice = {
            id: "p5",
            type: "pick",
            playerID: 4,
            resolved: true,
            value: "option1",
            options: { description: "Pick an option", options: ["option1", "option2"] },
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
                    options: {
                        timeStep: new TimeStep("marquise-de-cat", phase, segment),
                    },
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
    let awaitChoiceSpy: MockInstance<RootGame["awaitChoice"]>;
    let updateStateSpy: MockInstance<RootGame["updateState"]>;
    type ChoiceDescription = Pick<ResolvedChoice, "type" | "options" | "value"> &
        Partial<Pick<ResolvedChoice, "playerID">>;

    let resolvedChoices: Record<string, ChoiceDescription>;

    let resolvedChoiceList: ChoiceDescription[];

    function initializeResolvedChoices() {
        resolvedChoices = {
            "3-player seating order": {
                playerID: null,
                type: "pickOrder",
                options: {
                    description: RAND_ORDER_DESC.SEATING_ORDER,
                    options: [1, 2, 3],
                },
                value: [1, 2, 0],
            },
        };
        resolvedChoiceList = Object.values(resolvedChoices);
    }

    async function awaitChoiceFake<T extends ChoiceType>(
        choice: PendingChoice<T>,
    ): Promise<ChoiceValueMap[T]> {
        for (const resolvedChoice of resolvedChoiceList) {
            if (
                choice.type === resolvedChoice.type &&
                (resolvedChoice.playerID === undefined ||
                    choice.playerID === resolvedChoice.playerID) &&
                util.isDeepStrictEqual(choice.options, resolvedChoice.options)
            ) {
                return resolvedChoice.value as ChoiceValueMap[T];
            }
        }
        if (choice.type === "pickOrder") {
            return choice.options.options.map((_, i) => i) as ChoiceValueMap[T];
        }
        if (choice.type === "pickX") {
            return choice.options.options.slice(0, choice.options.count) as ChoiceValueMap[T];
        }
        if (choice.type === "pick") {
            return choice.options.options[0] as ChoiceValueMap[T];
        }
        throw new Error(`No response found for choice: ${JSON.stringify(choice)}`);
    }
    beforeEach(() => {
        basePlayOptions = getBasePlayOptions();
        game.options = basePlayOptions;
        initializeResolvedChoices();
        awaitChoiceSpy = vi.spyOn(game, "awaitChoice").mockImplementation(awaitChoiceFake);
        updateStateSpy = vi.spyOn(game, "updateState").mockReturnValue(undefined); //TODO: add implementation for cards specifically
    });
    test("randomizes seating order", () => {
        const seatingOrderChoice = resolvedChoices["3-player seating order"];
        game.setup();
        expect(awaitChoiceSpy).toHaveBeenCalledWith(expect.objectContaining({ playerID: null }));
        expect(updateStateSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "turnOrderSet",
                options: { turnOrder: seatingOrderChoice.value },
            }),
        );
    });
    test("removes dominance cards from the deck in 2-player games", () => {
        mockDeck();
        vi.spyOn(deck, "cards", "get").mockReturnValue([
            mock<Card>({ id: 1, name: "dominance-card-1", isDominance: true }),
            mock<Card>({ id: 2, name: "dominance-card-2", isDominance: true }),
            mock<Card>({ id: 3, name: "non-dominance-card", isDominance: false }),
        ]);
        basePlayOptions.playerIDs = [1, 2];
        delete basePlayOptions.setup.chosenFactions["woodland-alliance"];
        game.setup();
        for (const cardID of [1, 2]) {
            expect(updateStateSpy).toHaveBeenCalledWith(
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
        expect(updateStateSpy).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: "moveCard",
                options: expect.objectContaining({
                    from: { name: "deck" },
                    to: { name: "nowhere" },
                    cardID: 3,
                }),
            } satisfies Partial<RootGameUpdate>),
        );
    });

    test.each([2, 1, 0])(
        "randomly generates the correct number of landmarks",
        (numberOfLandmarks) => {
            basePlayOptions.setup.landmarksToUse = numberOfLandmarks;
            game.setup();
            const landmarkAddedCalls = updateStateSpy.mock.calls.filter(
                (call) => call[0].type === "landmarkAdded",
            ) as [RootGameUpdate & { type: "landmarkAdded" }][];
            expect(landmarkAddedCalls).toHaveLength(numberOfLandmarks);
        },
    );
    test("players place landmarks in reverse turn order", () => {
        resolvedChoices["3-player seating order"] = {
            ...resolvedChoices["3-player seating order"],
            value: [0, 1, 2],
        };
        basePlayOptions.setup.landmarksToUse = 2;
        const mockSetupFunction = vi.fn();
        const mockLandmark = (type: LandmarkType): Landmark =>
            mock<Landmark>({
                name: type,
                setup: mockSetupFunction,
            });

        vi.spyOn(game, "landmarks", "get").mockReturnValue([
            mockLandmark("ferry"),
            mockLandmark("tower"),
        ]);
        game.setup();
        expect(mockSetupFunction).toHaveBeenCalledTimes(2);
        expect(mockSetupFunction.mock.calls[0][1]).toBe(3);
        expect(mockSetupFunction.mock.calls[1][1]).toBe(2);
    });

    test.each([
        [3, 2],
        [4, 1],
        [5, 0],
    ])(
        "generates the correct number of promoted/demoted hirelings for the player count",
        (playerCount, numberOfPromotedHirelings) => {
            const totalHirelings = 3;
            basePlayOptions.playerIDs = Array.from({ length: playerCount }, (_, i) => i + 1);
            game.options = basePlayOptions;
            game.setup();
            const awaitChoiceHirelingCalls = awaitChoiceSpy.mock.calls.filter(
                (call) =>
                    call[0].type === "pickX" &&
                    call[0].options.description === RAND_PICKX_DESC.HIRELINGS,
            ) as [PendingChoice<"pickX">][];
            expect(awaitChoiceHirelingCalls).toHaveLength(2);
            expect(awaitChoiceHirelingCalls[0][0].options.options).toEqual(
                basePlayOptions.setup.availableHirelings,
            );
            expect(awaitChoiceHirelingCalls[0][0].options.count).toBe(totalHirelings);
            expect(awaitChoiceHirelingCalls[1][0].options.options.length).toBe(totalHirelings);
            expect(awaitChoiceHirelingCalls[1][0].options.count).toBe(numberOfPromotedHirelings);

            const updateStateCalls = updateStateSpy.mock.calls;
            const hirelingAddedCalls = updateStateCalls.filter(
                (call) => call[0].type === "hirelingAdded",
            ) as [RootGameUpdate & { type: "hirelingAdded" }][];
            const hirelingTypesUsed = hirelingAddedCalls.map((call) => call[0].options.hireling);
            const promotedHirelingsUsed = hirelingTypesUsed.filter((type) =>
                isPromotedHirelingFactionType(type),
            );
            const demotedHirelingsUsed = hirelingTypesUsed.filter((type) =>
                isDemotedHirelingFactionType(type),
            );

            const promotedHirelingCount = promotedHirelingsUsed.length;
            const demotedHirelingCount = demotedHirelingsUsed.length;

            expect(promotedHirelingCount).toBe(numberOfPromotedHirelings);
            expect(demotedHirelingCount).toBe(totalHirelings - promotedHirelingCount);
        },
    );
    test("players set up hirelings in reverse turn order", () => {
        resolvedChoices["3-player seating order"] = {
            ...resolvedChoices["3-player seating order"],
            value: [0, 1, 2],
        };
        const mockSetupFunction = vi.fn();
        function mockHireling(type: HirelingFactionType): Hireling {
            if (isDemotedHirelingFactionType(type)) {
                return mock<DemotedHireling>({
                    name: type,
                    setup: mockSetupFunction,
                });
            }
            return mock<PromotedHireling>({
                name: type,
                setup: mockSetupFunction,
            });
        }

        vi.spyOn(game, "hirelings", "get").mockReturnValue([
            mockHireling("corvid-spies"),
            mockHireling("mole-artisans"),
            mockHireling("furious-protector"),
        ]);
        game.setup();
        expect(mockSetupFunction).toHaveBeenCalledTimes(3);
        expect(mockSetupFunction.mock.calls[0][1]).toBe(3);
        expect(mockSetupFunction.mock.calls[1][1]).toBe(2);
        expect(mockSetupFunction.mock.calls[2][1]).toBe(1);
    });
    test("hirelings are skipped if the option is not enabled", () => {
        game.options.setup.usingHirelings = false;
        game.setup();
        expect(awaitChoiceSpy).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: "pickOrder",
                options: expect.objectContaining({ description: RAND_PICKX_DESC.HIRELINGS }),
            }),
        );
    });

    describe("standard setup", () => {
        test("sets up chosen factions according to the standard setup order and assigns the correct player to each faction", () => {
            const chosenFactions: Partial<Record<PlayerFactionType, PlayerID>> = {
                "corvid-conspiracy": 1,
                "eyrie-dynasties": 2,
                "keepers-in-iron": 3,
            } as const;
            basePlayOptions.setup.chosenFactions = chosenFactions;
            const chosenFactionTypes = Object.keys(chosenFactions) as PlayerFactionType[];
            let mockSetupFunction = vi.fn();
            function mockFaction(type: PlayerFactionType): PlayerFaction {
                return mock<PlayerFaction>({
                    name: type,
                    setup: async (_, id) => {
                        mockSetupFunction(type, id);
                    },
                });
            }
            vi.spyOn(game, "factions", "get").mockReturnValue(chosenFactionTypes.map(mockFaction));
            game.setup();
            const expectedSetupOrder = chosenFactionTypes.sort(
                (a, b) => standardSetupOrder.indexOf(a) - standardSetupOrder.indexOf(b),
            );
            const expectedSetUps = expectedSetupOrder.map((type) => ({
                type,
                id: chosenFactions[type]!,
            }));

            expect(mockSetupFunction).toHaveBeenCalledTimes(3);
            expectedSetUps.forEach(({ type, id }, index) => {
                expect(mockSetupFunction.mock.calls[index][0]).toBe(type);
                expect(mockSetupFunction.mock.calls[index][1]).toBe(id);
            });
        });
        test("throws an error if an invalid player id is provided", () => {
            basePlayOptions.playerIDs = [1, 2, 3];
            const chosenFactions: Partial<Record<PlayerFactionType, PlayerID>> = {
                "corvid-conspiracy": 1,
                "eyrie-dynasties": 2,
                "keepers-in-iron": 99,
            } as const;
            basePlayOptions.setup.chosenFactions = chosenFactions;
            expect(() => game.setup()).toThrow("Invalid player ID: 99");
        });
        test("each player draws three cards", () => {
            const drawCardSpy = vi.spyOn(game, "drawCard").mockResolvedValue(undefined);
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
        let advancedSetupOptions: PlayOptions & { setup: AdvancedSetupOptions };
        beforeEach(() => {
            // Replace standard setup with advanced setup in play options
            advancedSetupOptions = getAdvancedPlayOptions();
            game.options = advancedSetupOptions;
        });
        test("order of events is correct", () => {
            // TODO: rework this to be less brittle (should really just care about awaitChoice order)
            // Landmarks -> Hirelings -> Draw Cards -> Factions -> Discard Cards
            // We can check that the order is correct by looking at the order of calls in our updateStateSpy and awaitChoiceSpy
            game.setup();
            const numberOfLandmarks = advancedSetupOptions.setup.landmarksToUse;
            const numberOfHirelings = advancedSetupOptions.setup.usingHirelings ? 3 : 0; //TODO: number of hirelings requiring setup
            const numberOfPlayers = advancedSetupOptions.playerIDs.length;
            const reversePlayerOrder = [...advancedSetupOptions.playerIDs].reverse();
            const landmarksChosen = advancedSetupOptions.setup.availableLandmarks;
            const hirelingsChosen = advancedSetupOptions.setup.availableHirelings;
            const factionsChosen = advancedSetupOptions.setup.draftableFactions;

            const updateStateCalls = updateStateSpy.mock.calls;
            /**
             * updateState calls: turnOrderSet for seating, landmarkAdded for each landmark, hirelingAdded for each hireling,
             * factionAdded for each faction
             */
            const expectedUpdateStateCalls = [
                {
                    type: "turnOrderSet",
                    playerIDs: advancedSetupOptions.playerIDs,
                },
                ...Array.from({ length: numberOfLandmarks }, (_, idx) => ({
                    type: "landmarkAdded",
                    landmark: landmarksChosen[idx],
                })),
                ...Array.from({ length: numberOfHirelings }, (_, idx) => ({
                    type: "hirelingAdded",
                    hireling: hirelingsChosen[idx],
                })),
                ...Array.from({ length: numberOfPlayers }, (_, idx) => ({
                    type: "factionAdded",
                    faction: factionsChosen[idx],
                })),
            ];
            expect(updateStateCalls).toHaveLength(expectedUpdateStateCalls.length);
            expectedUpdateStateCalls.forEach((expectedCall, index) => {
                expect(updateStateCalls[index][0]).toEqual(expect.objectContaining(expectedCall));
            });

            const awaitChoiceCalls = awaitChoiceSpy.mock.calls;
            /**
             * awaitChoice calls: pickOrder for seating, pickX for landmarks, pickOne (landmark #) times for placement,
             * pickX for hirelings, pickOne (hireling #) times for setup, pickOrder for shuffle, pickX for factions, pickOne (player #) times for the draft, pickX for cards to return
             */
            const expectedAwaitChoiceCalls = [
                {
                    type: "pickOrder",
                    playerID: null,
                    options: expect.objectContaining({
                        description: RAND_ORDER_DESC.SEATING_ORDER,
                    }),
                },
                {
                    type: "pickX",
                    playerID: null,
                    options: expect.objectContaining({ description: RAND_PICKX_DESC.LANDMARKS }),
                },
                ...Array.from({ length: numberOfLandmarks }, (_, idx) => ({
                    type: "pickOne",
                    playerID: reversePlayerOrder[idx % reversePlayerOrder.length],
                    options: expect.objectContaining({
                        description: PLAYER_CHOICE_DESC.LANDMARK_SETUP,
                    }),
                })),
                {
                    type: "pickX",
                    playerID: null,
                    options: expect.objectContaining({ description: RAND_PICKX_DESC.HIRELINGS }),
                },
                ...Array.from({ length: numberOfHirelings }, (_, idx) => ({
                    type: "pickOne",
                    playerID: reversePlayerOrder[idx % reversePlayerOrder.length],
                    options: expect.objectContaining({
                        description: PLAYER_CHOICE_DESC.HIRELING_SETUP,
                    }),
                })),
                {
                    type: "pickOrder",
                    playerID: null,
                    options: expect.objectContaining({ description: RAND_ORDER_DESC.SHUFFLE }),
                },
                {
                    type: "pickX",
                    playerID: null,
                    options: expect.objectContaining({ description: RAND_PICKX_DESC.FACTIONS }),
                },
                ...Array.from({ length: numberOfPlayers }, (_, i) => ({
                    type: "pickOne",
                    playerID: reversePlayerOrder[i],
                    options: expect.objectContaining({
                        description: PLAYER_CHOICE_DESC.STARTING_FACTION,
                    }),
                })),
                ...Array.from({ length: numberOfPlayers }, () => ({
                    type: "pickX",
                    options: expect.objectContaining({
                        description: PLAYER_CHOICE_DESC.RETURN_CARDS,
                    }),
                })),
            ];
            expect(awaitChoiceCalls).toHaveLength(expectedAwaitChoiceCalls.length);
            expectedAwaitChoiceCalls.forEach((expectedCall, index) => {
                expect(awaitChoiceCalls[index][0]).toEqual(expect.objectContaining(expectedCall));
            });
        });

        test("each player draws five cards", () => {
            // Spy on drawCard to check that it's called the correct number of times for each player
            const drawCardSpy = vi.spyOn(game, "drawCard").mockResolvedValue(undefined);
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
            const returnCardToDeckSpy = vi
                .spyOn(game, "returnCardToDeck")
                .mockResolvedValue(undefined);
            game.setup();
            expect(returnCardToDeckSpy).toHaveBeenCalledTimes(6);
            let cardsReturnedByPlayer: { [playerID: PlayerID]: number } = {};
            for (let i = 0; i < 6; i++) {
                const call = returnCardToDeckSpy.mock.calls[i];
                const playerFaction = call[0];
                const playerID = game.playerFactionMapping[playerFaction]!;
                cardsReturnedByPlayer[playerID] = (cardsReturnedByPlayer[playerID] || 0) + 1;
            }
            const returnCardsAwaitChoiceCalls = awaitChoiceSpy.mock.calls.filter(
                (call) =>
                    call[0].type === "pickX" &&
                    call[0].options.description === PLAYER_CHOICE_DESC.RETURN_CARDS,
            ) as [PendingChoice<"pickX">][];
            expect(returnCardsAwaitChoiceCalls).toHaveLength(3);
            returnCardsAwaitChoiceCalls.forEach((call) => {
                expect(call[0].options.count).toBe(2);
            });
            expect(cardsReturnedByPlayer).toEqual({
                1: 2,
                2: 2,
                3: 2,
            });
        });

        test("(# of players + 1) factions are selected for the draft - one militant first, then the rest", () => {
            const numberOfPlayers = 3;
            game.setup();
            expect(awaitChoiceSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "pick",
                    options: expect.objectContaining({ description: RAND_PICK_DESC.FACTION }),
                }),
            );
            expect(awaitChoiceSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "pickX",
                    options: expect.objectContaining({
                        description: RAND_PICKX_DESC.FACTIONS,
                        count: numberOfPlayers,
                    }),
                }),
            );
        });
        test("throws an error if there are not enough factions available for the draft", () => {
            const factionsAvailable: PlayerFactionType[] = [
                "corvid-conspiracy",
                "underground-duchy",
            ];
            advancedSetupOptions.setup.draftableFactions = factionsAvailable;
            expect(() => game.setup()).toThrow("Not enough factions available for the draft"); //TODO: make error message text a constant and check against that
        });
        test("throws an error if there are no militant factions available for the first pick", () => {
            const factionsAvailable: PlayerFactionType[] = [
                "corvid-conspiracy",
                "woodland-alliance",
                "lizard-cult",
            ];
            advancedSetupOptions.setup.draftableFactions = factionsAvailable;
            expect(() => game.setup()).toThrow("No militant factions available for the first pick");
        });
        test("factions cannot be added to the draft if their corresponding hireling is in the game", () => {
            const hirelingsAvailable: ExclusionType[] = ["feline", "corvid", "mole"];
            const factionsAvailable: PlayerFactionType[] = [
                "corvid-conspiracy",
                "underground-duchy",
                "keepers-in-iron",
                "marquise-de-cat",
                "eyrie-dynasties",
                "woodland-alliance",
            ];
            advancedSetupOptions.setup.availableHirelings = hirelingsAvailable;
            advancedSetupOptions.setup.draftableFactions = factionsAvailable;
            game.setup();
            const awaitChoiceFirstFactionSelectCall = awaitChoiceSpy.mock.calls.find(
                (call) =>
                    call[0].type === "pick" &&
                    call[0].options.description === PLAYER_CHOICE_DESC.STARTING_FACTION,
            ) as [PendingChoice<"pick">];
            expect(awaitChoiceFirstFactionSelectCall).toBeDefined();
            const firstFactionOptions = awaitChoiceFirstFactionSelectCall[0].options
                .options as PlayerFactionType[];
            expect(firstFactionOptions).not.toContainEqual("corvid-conspiracy");
            expect(firstFactionOptions).not.toContainEqual("underground-duchy");
            expect(firstFactionOptions).not.toContainEqual("marquise-de-cat");
        });
        test("the first faction in the draft is militant (7+ reach)", () => {
            game.setup();
            const awaitChoiceMilitantSelectCall = awaitChoiceSpy.mock.calls.find(
                (call) =>
                    call[0].type === "pick" &&
                    call[0].options.description === RAND_PICK_DESC.FACTION &&
                    call[0].playerID === null,
            ) as [PendingChoice<"pick">];
            expect(awaitChoiceMilitantSelectCall).toBeDefined();
            const optionsForMilitantFaction = awaitChoiceMilitantSelectCall[0].options
                .options as PlayerFactionType[];
            expect(optionsForMilitantFaction.every((option) => reachValues[option] >= 7)).toBe(
                true,
            );
        });
        test("no insurgents are selected for the draft in 2-player games", () => {
            basePlayOptions.playerIDs = [1, 2];
            game.setup();
            const awaitChoiceFirstFactionSelectCall = awaitChoiceSpy.mock.calls.find(
                (call) =>
                    call[0].type === "pick" &&
                    call[0].options.description === PLAYER_CHOICE_DESC.STARTING_FACTION,
            ) as [PendingChoice<"pick">];
            expect(awaitChoiceFirstFactionSelectCall).toBeDefined();
            const firstFactionOptions = awaitChoiceFirstFactionSelectCall[0].options
                .options as PlayerFactionType[];
            expect(firstFactionOptions.every((option) => reachValues[option] >= 7)).toBe(true);
        });

        test("players draft factions in reverse turn order", () => {
            resolvedChoices["3-player seating order"] = {
                ...resolvedChoices["3-player seating order"],
                value: [0, 1, 2],
            };
            const mockSetupFunction = vi.fn();
            const mockFaction = (type: PlayerFactionType): PlayerFaction =>
                mock<PlayerFaction>({
                    name: type,
                    setup: mockSetupFunction,
                });
            const factionsAvailable: PlayerFactionType[] = [
                "corvid-conspiracy",
                "underground-duchy",
                "keepers-in-iron",
                "marquise-de-cat",
                "eyrie-dynasties",
                "woodland-alliance",
            ];
            advancedSetupOptions.setup.draftableFactions = factionsAvailable;
            vi.spyOn(game, "factions", "get").mockReturnValue(factionsAvailable.map(mockFaction));
            game.setup();
            expect(mockSetupFunction).toHaveBeenCalledTimes(3);
            expect(mockSetupFunction.mock.calls[0][1]).toBe(3);
            expect(mockSetupFunction.mock.calls[1][1]).toBe(2);
            expect(mockSetupFunction.mock.calls[2][1]).toBe(1);
        });
        test("players cannot draft the last faction in the draft if it is an insurgent and no militant faction has been drafted yet", () => {
            const factionsAvailable: PlayerFactionType[] = [
                "corvid-conspiracy",
                "lizard-cult",
                "keepers-in-iron",
                "woodland-alliance",
            ]; // insurgent, insurgent, militant, insurgent
            advancedSetupOptions.setup.draftableFactions = factionsAvailable;
            resolvedChoices["1st player faction"] = {
                playerID: 3,
                type: "pick",
                options: {
                    description: PLAYER_CHOICE_DESC.STARTING_FACTION,
                    options: ["corvid-conspiracy", "lizard-cult", "keepers-in-iron"],
                },
                value: "lizard-cult",
            };
            resolvedChoices["2nd player faction"] = {
                playerID: 2,
                type: "pick",
                options: {
                    description: PLAYER_CHOICE_DESC.STARTING_FACTION,
                    options: ["corvid-conspiracy", "keepers-in-iron"],
                },
                value: "corvid-conspiracy",
            };
            game.setup();
            const awaitChoiceThirdFactionSelectCall = awaitChoiceSpy.mock.calls.find(
                (call) =>
                    call[0].type === "pick" &&
                    call[0].options.description === PLAYER_CHOICE_DESC.STARTING_FACTION &&
                    call[0].playerID === 1,
            ) as [PendingChoice<"pick">];
            expect(awaitChoiceThirdFactionSelectCall).toBeDefined();
            expect(awaitChoiceThirdFactionSelectCall[0].options.options).toEqual([
                "keepers-in-iron",
            ]);
        });
        test("players setup their faction before the next player picks", () => {
            // We need to check that the setup function for the 1st player's faction is called before the awaitChoice for the 2nd player's faction pick
            // To do this, we'll wrap the current awaitChoice implementation to record faction select calls, and mock the faction setup functions to record their calls to the same list.
            const calls: { type: "setup" | "awaitChoice"; id: number | null }[] = [];
            const currentAwaitChoiceImpl = awaitChoiceSpy.getMockImplementation()!;
            awaitChoiceSpy.mockImplementation(async (choice) => {
                if (
                    choice.type === "pick" &&
                    choice.options.description === PLAYER_CHOICE_DESC.STARTING_FACTION
                ) {
                    calls.push({ type: "awaitChoice", id: choice.playerID });
                }
                return currentAwaitChoiceImpl(choice);
            });

            const mockFaction = (type: PlayerFactionType): PlayerFaction =>
                mock<PlayerFaction>({
                    name: type,
                    setup: async (_, id) => {
                        calls.push({ type: "setup", id });
                    },
                });
            const factionsAvailable: PlayerFactionType[] = [
                "corvid-conspiracy",
                "underground-duchy",
                "keepers-in-iron",
                "marquise-de-cat",
                "eyrie-dynasties",
                "woodland-alliance",
            ];
            advancedSetupOptions.setup.draftableFactions = factionsAvailable;
            vi.spyOn(game, "factions", "get").mockReturnValue(factionsAvailable.map(mockFaction));
            game.setup();
            expect(calls).toEqual([
                { type: "awaitChoice", id: 3 },
                { type: "setup", id: 3 },
                { type: "awaitChoice", id: 2 },
                { type: "setup", id: 2 },
                { type: "awaitChoice", id: 1 },
                { type: "setup", id: 1 },
            ]);
        });
    });
});

// --- drawCard  --------------------------------------------------

describe("RootGame.drawCard", () => {});

// --- returnCardToDeck  --------------------------------------------------

describe("RootGame.returnCardToDeck", () => {});

// --- isMoveLegal  ----------------------------------------------

describe("RootGame.isMoveLegal ", () => {
    const clearingIDs = [1, 2, 3, 4];
    const forestIDs = [5, 6, 7, 8];
    const connections: Connection[] = [
        { id: 1, locationIDs: [1, 2], type: "path" },
        { id: 2, locationIDs: [2, 3], type: "path" },
        { id: 3, locationIDs: [3, 4], type: "path" },
        { id: 4, locationIDs: [4, 1], type: "path" },
        { id: 5, locationIDs: [5, 6], type: "forest-adjacency" },
        { id: 6, locationIDs: [6, 7], type: "forest-adjacency" },
        { id: 7, locationIDs: [7, 8], type: "forest-adjacency" },
        { id: 8, locationIDs: [8, 5], type: "forest-adjacency" },
        { id: 9, locationIDs: [1, 3], type: "river" },
        { id: 10, locationIDs: [1, 5], type: "forest-adjacency" },
    ];
    const rulingMap = new Map<LocationID, FactionType | null>();

    let clearings: Clearing[];
    let forests: Forest[];
    beforeEach(() => {
        clearings = Array.from(clearingIDs, (id) => makeClearing({ id }));
        forests = Array.from(forestIDs, (id) => makeForest({ id }));
        mockBoard();
        vi.spyOn(board, "getLocation").mockImplementation((locationID: LocationID) => {
            if (clearingIDs.includes(locationID)) {
                return clearings.find((clearing) => clearing.id === locationID)!;
            }
            if (forestIDs.includes(locationID)) {
                return forests.find((forest) => forest.id === locationID)!;
            }
            throw new Error(`Location not found: ${locationID}`);
        });
        vi.spyOn(board, "getConnectionTypesBetween").mockImplementation(
            (location1ID: LocationID, location2ID: LocationID) => {
                return connections
                    .filter(
                        (connection) =>
                            connection.locationIDs.includes(location1ID) &&
                            connection.locationIDs.includes(location2ID),
                    )
                    .map((connection) => connection.type);
            },
        );
        vi.spyOn(game, "getRuler").mockImplementation((locationID: LocationID) => {
            if (forestIDs.includes(locationID)) {
                return null; // No one rules forests
            }
            return rulingMap.get(locationID) || null;
        });
    });
    test("is legal when mover rules the origin clearing", async () => {
        const mover = makeFactionType();
        const piece = makePiece({ owningFaction: mover });
        const originClearing = clearings[0];
        const destinationClearing = clearings[1];
        vi.spyOn(originClearing, "hasPieces").mockReturnValue(true);
        rulingMap.set(originClearing.id, mover);
        rulingMap.set(destinationClearing.id, null);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [piece],
            startingLocationID: originClearing.id,
            endingLocationID: destinationClearing.id,
        });
        expect(isLegal).toBe(true);
    });

    test("is legal when mover rules the destination clearing", async () => {
        const mover = makeFactionType();
        const piece = makePiece({ owningFaction: mover });
        const originClearing = clearings[0];
        const destinationClearing = clearings[1];
        vi.spyOn(originClearing, "hasPieces").mockReturnValue(true);
        rulingMap.set(originClearing.id, null);
        rulingMap.set(destinationClearing.id, mover);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [piece],
            startingLocationID: originClearing.id,
            endingLocationID: destinationClearing.id,
        });
        expect(isLegal).toBe(true);
    });

    test("is illegal when mover rules neither origin nor destination ", async () => {
        const mover = makeFactionType();
        const piece = makePiece({ owningFaction: mover });
        const originClearing = clearings[0];
        const destinationClearing = clearings[1];
        vi.spyOn(originClearing, "hasPieces").mockReturnValue(true);
        rulingMap.set(originClearing.id, null);
        rulingMap.set(destinationClearing.id, null);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [piece],
            startingLocationID: originClearing.id,
            endingLocationID: destinationClearing.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal when origin and destination are not adjacent", async () => {
        const mover = makeFactionType();
        const piece = makePiece({ owningFaction: mover });
        const originClearing = clearings[0];
        const destinationClearing = clearings[2]; // Not adjacent to origin
        vi.spyOn(originClearing, "hasPieces").mockReturnValue(true);
        rulingMap.set(originClearing.id, mover);
        rulingMap.set(destinationClearing.id, mover);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [piece],
            startingLocationID: originClearing.id,
            endingLocationID: destinationClearing.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal when origin is a forest", async () => {
        const mover = makeFactionType();
        const piece = makePiece({ owningFaction: mover });
        const originForest = forests[0];
        const destinationClearing = clearings[0];
        vi.spyOn(originForest, "hasPieces").mockReturnValue(true);
        rulingMap.set(destinationClearing.id, mover);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [piece],
            startingLocationID: originForest.id,
            endingLocationID: destinationClearing.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal when destination is a forest", async () => {
        const mover = makeFactionType();
        const piece = makePiece({ owningFaction: mover });
        const originClearing = clearings[0];
        const destinationForest = forests[0];
        vi.spyOn(originClearing, "hasPieces").mockReturnValue(true);
        rulingMap.set(originClearing.id, mover);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [piece],
            startingLocationID: originClearing.id,
            endingLocationID: destinationForest.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal to move zero pieces", async () => {
        const mover = makeFactionType();
        const originClearing = clearings[0];
        const destinationClearing = clearings[1];
        rulingMap.set(originClearing.id, null);
        rulingMap.set(destinationClearing.id, null);
        const isLegal = await game.isMoveLegal({
            mover,
            pieces: [],
            startingLocationID: originClearing.id,
            endingLocationID: destinationClearing.id,
        });
        expect(isLegal).toBe(false);
    });
});

// --- isBattleLegal  ----------------------------------------------------

describe("RootGame.isBattleLegal ", () => {
    let clearing: Clearing;
    beforeEach(() => {
        clearing = makeClearing({ id: 1 });
        mockBoard();
        vi.spyOn(board, "getClearing").mockReturnValue(clearing);
        vi.spyOn(game, "isEnemy").mockReturnValue(true);
    });

    test("is legal when attacker has warriors in the clearing and there is a defender", () => {
        const attacker = makeFactionType();
        const defender = makeFactionType();
        const attackerWarrior = makePawn({ owningFaction: attacker });
        const defenderWarrior = makePawn({ owningFaction: defender });
        vi.spyOn(clearing, "getWarriors").mockReturnValue([attackerWarrior, defenderWarrior]);
        const isLegal = game.isBattleLegal({
            attacker,
            defender,
            clearingID: clearing.id,
        });
        expect(isLegal).toBe(true);
    });

    test("is illegal when attacker has no pieces in the clearing", () => {
        const attacker = makeFactionType();
        const defender = makeFactionType();
        const defenderWarrior = makePawn({ owningFaction: defender });
        vi.spyOn(clearing, "getWarriors").mockReturnValue([defenderWarrior]);
        const isLegal = game.isBattleLegal({
            attacker,
            defender,
            clearingID: clearing.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal when defender has no pieces in the clearing", () => {
        const attacker = makeFactionType();
        const defender = makeFactionType();
        const attackerWarrior = makePawn({ owningFaction: attacker });
        vi.spyOn(clearing, "getWarriors").mockReturnValue([attackerWarrior]);
        const isLegal = game.isBattleLegal({
            attacker,
            defender,
            clearingID: clearing.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal to battle yourself", () => {
        const attacker = makeFactionType();
        const attackerWarrior = makePawn({ owningFaction: attacker });
        vi.spyOn(clearing, "getWarriors").mockReturnValue([attackerWarrior]);
        const isLegal = game.isBattleLegal({
            attacker,
            defender: attacker,
            clearingID: clearing.id,
        });
        expect(isLegal).toBe(false);
    });

    test("is illegal to battle a faction that is not an enemy", () => {
        const attacker = makeFactionType();
        const defender = makeFactionType();
        const attackerWarrior = makePawn({ owningFaction: attacker });
        const defenderWarrior = makePawn({ owningFaction: defender });
        vi.spyOn(clearing, "getWarriors").mockReturnValue([attackerWarrior, defenderWarrior]);
        vi.spyOn(game, "isEnemy").mockReturnValue(false);
        const isLegal = game.isBattleLegal({
            attacker,
            defender,
            clearingID: clearing.id,
        });
        expect(isLegal).toBe(false);
    });
});

// --- isPlaceLegal  ---------------------------------------------------

describe("RootGame.isPlaceLegal", () => {
    let clearing: Clearing;

    beforeEach(() => {
        clearing = makeClearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        mockBoard();
        vi.spyOn(board, "getClearing").mockReturnValue(clearing);
    });

    test("placing a building is legal when there is an open slot", () => {
        vi.spyOn(clearing, "openSlots").mockReturnValue(1);
        const piece = makeBuilding({ id: 1, name: "workshop", owningFaction: "marquise-de-cat" });
        const isLegal = game.isPlaceLegal([piece], clearing.id);
        expect(isLegal).toBe(true);
    });

    test("placing a building is illegal when there are no open slots ", () => {
        vi.spyOn(clearing, "openSlots").mockReturnValue(0);
        const piece = makeBuilding({ id: 1, name: "workshop", owningFaction: "marquise-de-cat" });
        const isLegal = game.isPlaceLegal([piece], clearing.id);
        expect(isLegal).toBe(false);
    });
});

// --- isCraftLegal  -----------------------------------------------------

describe("RootGame.isCraftLegal", () => {
    let faction: PlayerFaction;
    const idSuitMap: { [key: number]: string[] } = {
        1: ["fox"],
        2: ["mouse"],
        3: ["rabbit"],
        4: ["fox"],
        5: ["mouse"],
        6: ["rabbit"],
        8: ["fox", "mouse"],
        9: ["fox", "rabbit"],
        10: ["mouse", "rabbit"],
        11: ["fox", "mouse", "rabbit"],
    };
    beforeEach(() => {
        mockFactions([{ faction: "marquise-de-cat", playerID: 1 }]);
        faction = factions["marquise-de-cat"]!;
        mockBoard();
        vi.spyOn(board, "getSuitsOfPiece").mockImplementation((pieceID: PieceID) => {
            return idSuitMap[pieceID] || [];
        });
    });
    test.each([
        [
            [1, 2],
            ["fox", "mouse"],
        ],
        [
            [2, 3],
            ["rabbit", "mouse"],
        ],
        [
            [6, 10],
            ["rabbit", "mouse"],
        ],
        [
            [1, 4],
            ["fox", "fox"],
        ],
        [
            [8, 9, 10],
            ["fox", "rabbit", "mouse"],
        ],
    ] satisfies [PieceID[], Suit[]][])(
        "is legal when unexhausted crafting pieces cover all required suits",
        (craftingPieces: PieceID[], requiredSuits: Suit[]) => {
            const card = makeCard({
                id: 1,
                name: "Test Crafting Card",
                craftingCost: requiredSuits,
                isAmbush: false,
                isDominance: false,
            });
            const isLegal = game.isCraftLegal(faction.name, card, craftingPieces);
            expect(isLegal).toBe(true);
        },
    );

    test.each([
        [[], ["fox"]],
        [
            [1, 2],
            ["fox", "rabbit"],
        ],
        [
            [1, 8],
            ["mouse", "mouse"],
        ],
        [
            [2, 10],
            ["mouse", "mouse", "mouse"],
        ],
        [
            [8, 9, 10],
            ["rabbit", "rabbit", "rabbit"],
        ],
    ] satisfies [PieceID[], Suit[]][])(
        "is illegal when crafting pieces do not cover all required suits ",
        (craftingPieces: PieceID[], requiredSuits: Suit[]) => {
            const card = makeCard({
                id: 1,
                name: "Test Crafting Card",
                craftingCost: requiredSuits,
                isAmbush: false,
                isDominance: false,
            });
            const isLegal = game.isCraftLegal(faction.name, card, craftingPieces);
            expect(isLegal).toBe(false);
        },
    );

    test("is illegal to craft with exhausted pieces", () => {
        const requiredSuits: Suit[] = ["fox", "mouse"];
        const craftingPieces: PieceID[] = [1, 2];
        const spentCraftingPieces: PieceID[] = [1, 2];
        vi.spyOn(game, "spentCraftingPieces", "get").mockReturnValue(spentCraftingPieces);
        const card = makeCard({
            id: 1,
            name: "Test Crafting Card",
            craftingCost: requiredSuits,
            isAmbush: false,
            isDominance: false,
        });
        const isLegal = game.isCraftLegal(faction.name, card, craftingPieces);
        expect(isLegal).toBe(false);
    });

    test.each([
        [[1, 2], [4, 5], ["fox", "mouse"], true],
        [[2, 3], [5, 6], ["rabbit", "mouse"], true],
        [[6, 10], [8, 3], ["rabbit", "mouse"], true],
        [[1, 4], [8, 11], ["fox", "fox"], true],
        [[8, 9, 10], [1], ["fox", "rabbit", "mouse"], true],
        [[], [1], ["fox"], false],
        [[1, 2], [3], ["fox", "rabbit"], false],
        [[1, 8], [2], ["mouse", "mouse"], false],
        [[2, 10], [5, 11], ["mouse", "mouse", "mouse"], false],
        [[8, 9, 10], [11], ["rabbit", "rabbit", "rabbit"], false],
    ] satisfies [PieceID[], PieceID[], Suit[], boolean][])(
        "presence of extra crafting pieces does not affect legality, even if exhausted ",
        (craftingPieces, exhaustedPieces, requiredSuits, expected) => {
            vi.spyOn(game, "spentCraftingPieces", "get").mockReturnValue(exhaustedPieces);
            const card = makeCard({
                id: 1,
                name: "Test Crafting Card",
                craftingCost: requiredSuits,
                isAmbush: false,
                isDominance: false,
            });
            const allPieces = [...craftingPieces, ...exhaustedPieces];
            const isLegal = game.isCraftLegal(faction.name, card, allPieces);
            expect(isLegal).toBe(expected);
        },
    );

    test("cannot craft a card with a null crafting cost", () => {
        const craftingPieces: PieceID[] = [8, 9, 10, 11];
        const card = makeCard({
            id: 1,
            name: "Test Crafting Card",
            craftingCost: null,
            isAmbush: false,
            isDominance: false,
        });
        const isLegal = game.isCraftLegal(faction.name, card, craftingPieces);
        expect(isLegal).toBe(false);
    });

    test("cannot craft duplicate persistent effects", () => {
        const craftedImprovements = makeCardPile();
        vi.spyOn(faction, "craftedImprovements", "get").mockReturnValue(craftedImprovements);
        vi.spyOn(craftedImprovements, "hasCard").mockReturnValue(true);
        const card = makeCard({
            id: 1,
            name: "Test Crafting Card",
            craftingCost: ["fox"],
            isAmbush: false,
            isDominance: false,
        });
        const isLegal = game.isCraftLegal(faction.name, card, [1]);
        expect(isLegal).toBe(false);
    });
});

// --- isEnemy  -----------------------------------------------------

describe("RootGame.isEnemy", () => {
    // TODO: Implement isEnemy tests
});

// --- getRuler  -----------------------------------------------------

describe("RootGame.getRuler", () => {
    let clearing: Clearing;
    beforeEach(() => {
        clearing = makeClearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        vi.spyOn(board, "getClearing").mockReturnValue(clearing);
        vi.spyOn(clearing, "getCardboard").mockReturnValue([]);
        vi.spyOn(clearing, "getWarriors").mockReturnValue([]);
    });
    test("getRuler() returns the faction with the most warriors", () => {
        const marquiseWarriors = [
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
        ];
        const woodlandWarriors = [
            makePawn({ owningFaction: "woodland-alliance", isWarrior: true }),
        ];
        vi.spyOn(clearing, "getWarriors").mockReturnValue([
            ...marquiseWarriors,
            ...woodlandWarriors,
        ]);
        expect(game.getRuler(1)).toBe("marquise-de-cat");
    });

    test("getRuler() returns null on a tie", () => {
        const marquiseWarriors = [
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
        ];
        const woodlandWarriors = [
            makePawn({ owningFaction: "woodland-alliance", isWarrior: true }),
            makePawn({ owningFaction: "woodland-alliance", isWarrior: true }),
        ];
        vi.spyOn(clearing, "getWarriors").mockReturnValue([
            ...marquiseWarriors,
            ...woodlandWarriors,
        ]);
        expect(game.getRuler(1)).toBeNull();
    });

    test("getRuler() returns null when the clearing is empty", () => {
        vi.spyOn(clearing, "getCardboard").mockReturnValue([]);
        vi.spyOn(clearing, "getWarriors").mockReturnValue([]);
        expect(game.getRuler(1)).toBeNull();
    });

    test("tokens do NOT contribute to rule", () => {
        // Eyrie has 1 warrior; Marquise has 3 wood tokens but no warriors
        const marquiseTokens = [
            makeToken({ owningFaction: "marquise-de-cat", faceUp: true }),
            makeToken({ owningFaction: "marquise-de-cat", faceUp: true }),
            makeToken({ owningFaction: "marquise-de-cat", faceUp: true }),
        ];
        vi.spyOn(clearing, "getWarriors").mockReturnValue([
            makePawn({ owningFaction: "eyrie-dynasties", isWarrior: true }),
        ]);
        vi.spyOn(clearing, "getCardboard").mockReturnValue(marquiseTokens);
        expect(game.getRuler(1)).toBe("eyrie-dynasties");
    });

    test("buildings count toward rule", () => {
        const marquiseBuildings = [
            makeBuilding({ id: 1, name: "workshop", owningFaction: "marquise-de-cat" }),
            makeBuilding({ id: 2, name: "recruiter", owningFaction: "marquise-de-cat" }),
        ];
        vi.spyOn(clearing, "getWarriors").mockReturnValue([
            makePawn({ owningFaction: "eyrie-dynasties", isWarrior: true }),
        ]);
        vi.spyOn(clearing, "getCardboard").mockReturnValue(marquiseBuildings);
        expect(game.getRuler(1)).toBe("marquise-de-cat");
    });

    test("rule requires a plurality, not a majority", () => {
        const marquiseWarriors = [
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
            makePawn({ owningFaction: "marquise-de-cat", isWarrior: true }),
        ];
        const woodlandWarriors = [
            makePawn({ owningFaction: "woodland-alliance", isWarrior: true }),
            makePawn({ owningFaction: "woodland-alliance", isWarrior: true }),
        ];
        const eyrieWarriors = [
            makePawn({ owningFaction: "eyrie-dynasties", isWarrior: true }),
            makePawn({ owningFaction: "eyrie-dynasties", isWarrior: true }),
        ];
        vi.spyOn(clearing, "getWarriors").mockReturnValue([
            ...marquiseWarriors,
            ...woodlandWarriors,
            ...eyrieWarriors,
        ]);
        expect(game.getRuler(1)).toBe("marquise-de-cat");
    });

    // TODO: controlled hirelings count towards rule
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
