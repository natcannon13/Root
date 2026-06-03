import { describe, test, expect, beforeEach, vi } from "vitest";
import { RootGame, RootGameStateStore } from "../../src/game/RootGame";
import { mock } from "vitest-mock-extended";
import { Board } from "../../src/board/Board";
import { PlayerFaction } from "../../src/rulesModule/PlayerFaction";
import { HirelingFactionType, LandmarkType, PlayerFactionType } from "../../src/Enums";
import type { RootBoardState } from "../../src/state/RootBoardState";
import type { RootFactionState } from "../../src/state/RootFactionState";
import type { Card } from "../../src/cards/Card";
import type { Piece } from "../../src/pieces/Piece";
import type { PendingChoice } from "../../src/game/PendingChoice";
import { RootGameState } from "../../src/state/RootGameState";
import { BattleState } from "../../src/state/BattleState";
import { TimeStep } from "../../src/state/TimeStep";
import { PlayOptions } from "../../src/game/PlayOptions";
import { PromiseControl } from "../../src/game/RootGame";
import * as Factory from "../../src/Factory";
import { Hireling } from "../../src/rulesModule/Hireling";
import { Landmark } from "../../src/rulesModule/Landmark";
let game: RootGame;
let stateStore: RootGameStateStore;
let stateStoreSubscribeMock: ReturnType<typeof vi.fn>;

const basePlayOptions = {
    setup: {
        type: "standard",
        map: "autumn",
        chosenFactions: new Map([
            ["marquise-de-cat", 1],
            ["eyrie-dynasties", 2],
            ["woodland-alliance", 3],
        ]),
        deck: "base",
    },
    playerIDs: [1, 2, 3],
} satisfies PlayOptions;

beforeEach(() => {
    mockGame();
});

function mockGame(options: PlayOptions = basePlayOptions) {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn().mockReturnValue(unsubscribe);
    stateStore = mock<RootGameStateStore>({ subscribe });
    stateStoreSubscribeMock = subscribe;
    game = new RootGame(stateStore, basePlayOptions);
}

function mockFactions(factionTypes: PlayerFactionType[]) {
    let factions: { [key in PlayerFactionType]?: PlayerFaction } = {};
    for (const factionType of factionTypes) {
        factions[factionType] = mock<PlayerFaction>({ name: factionType });
    }
    vi.spyOn(game as any, "initializeFactions").mockReturnValue(Object.values(factions));
    return factions;
}


function mockBoard() {
    let board = mock<Board>();
    vi.spyOn(game as any, "initializeBoard").mockReturnValue(board);
    return board;
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
            const stateFromOptionsSpy = vi.spyOn(RootGame, "stateFromOptions").mockReturnValue({} as RootGameState);
            const initializeStateSpy = vi.spyOn(game, "initializeState").mockReturnValue(undefined);
            mockGame();
            expect(stateFromOptionsSpy).toHaveBeenCalledWith(basePlayOptions);
            expect(initializeStateSpy).toHaveBeenCalledWith(stateFromOptionsSpy.mock.results[0].value);
    });
});

// --- getState ----------------------------------------------------------------

describe("RootGame.getState", () => {
    test("returns a state object that reflects the current game state", () => {
        const board = mock<Board>();
        const boardState: RootBoardState = { version: "b1", name: "autumn", clearings: [], forests: [] };
        board.getState.mockReturnValue(boardState);

        const pf1 = mock<PlayerFaction>({ name: "marquise-de-cat" });
        const pf2 = mock<PlayerFaction>({ name: "eyrie-dynasties" });
        const pf1State: RootFactionState = { version: "f1", name: "marquise-de-cat", agentID: null, hand: null, handSize: 0, craftedImprovements: [], score: 0 };
        const pf2State: RootFactionState = { version: "f2", name: "eyrie-dynasties", agentID: null, hand: [], handSize: 0, craftedImprovements: [], score: 0 };
        pf1.getState.mockReturnValue(pf1State);
        pf2.getState.mockReturnValue(pf2State);

        // Inject mocks into game instance
        game.board = board;
        game.factions = [pf1, pf2];
        game.hirelings = [];
        game.landmarks = [mock<Landmark>({ name: "ferry" })];
        game.version = "vtest";
        game.playOptions = { setup: { type: "standard", map: "autumn", chosenFactions: new Map(), deck: "base" }, playerIDs: [1,2,3] } as PlayOptions;
        const card1 = mock<Card>({ id: 1, name: "c1", suit: "fox", craftingCost: null, isAmbush: false, isDominance: false, item: null });
        const card2 = mock<Card>({ id: 2, name: "c2", suit: "rabbit", craftingCost: null, isAmbush: false, isDominance: false, item: null });
        game.deck = [card1];
        game.discardPile = [card2];
        const piece = mock<Piece>({ id: 7, name: "p7", owningFaction: null });
        game.spentCraftingPieces = [piece];
        game.pendingChoice = null as PendingChoice | null;

        const state = game.getState?.();

        expect(state).not.toBeNull();
        expect(state.version).toBe("vtest");
        expect(state.options).toBe(game.playOptions);
        expect(state.boardState).toBe(boardState);
        expect(state.factionState["marquise-de-cat"]?.name).toBe("marquise-de-cat");
        expect(state.factionState["eyrie-dynasties"]?.name).toBe("eyrie-dynasties");
        expect(state.landmarks).toEqual([game.landmarks[0]]);
        expect(state.deckSize).toBe(game.deck.length);
        expect(state.discardPile).toEqual(game.discardPile);
        expect(state.spentCraftingPieceIDs).toEqual([game.spentCraftingPieces[0].id]);
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
    test("calls generate-from-type Factory functions for each game component matching the provided types and assigns them to the game instance", () => {
        const board = mock<Board>();

        const factionByType = mock<PlayerFaction>({ name: "marquise-de-cat" });
        const hirelingByType = mock<Hireling>({ name: "corvid-spies" });
        const landmarkByType = mock<Landmark>({ name: "ferry" });

        const generateBoardSpy = vi.spyOn(Factory, "generateBoardFromType").mockReturnValue(board);
        const generateFactionSpy = vi.spyOn(Factory, "generateFactionFromType").mockReturnValue(factionByType);
        const generateHirelingSpy = vi.spyOn(Factory, "generateHirelingFromType").mockReturnValue(hirelingByType);
        const generateLandmarkSpy = vi.spyOn(Factory, "generateLandmarkFromType").mockReturnValue(landmarkByType);

        const state = {
            version: "1.2.3",
            options: basePlayOptions,
            boardState: { version: "b1", name: "autumn", clearings: [], forests: [] },
            factionState: {
                "marquise-de-cat": { version: "f1", name: "marquise-de-cat", agentID: null, hand: null, handSize: 0, craftedImprovements: [], score: 0 },
            },
            hirelingState: {
                "corvid-spies": { version: "h3", name: "corvid-spies", controlCounter: 0, controllingFaction: "woodland-alliance" },
            },
            landmarks: ["ferry"],
            timeState: new TimeStep("marquise-de-cat", "birdsong", "main"),
            battleState: new BattleState({ attacker: "marquise-de-cat", defender: "eyrie-dynasties", clearingID: 1 }),
            deck: [mock<Card>({ id: 1, name: "c1", suit: "fox", craftingCost: null, isAmbush: false, isDominance: false, item: null })],
            deckSize: 1,
            discardPile: [mock<Card>({ id: 2, name: "c2", suit: "rabbit", craftingCost: null, isAmbush: false, isDominance: false, item: null })],
            spentCraftingPieceIDs: [7, 8],
            pendingChoice: { id: "9", type: "pick", playerID: 1, resolved: false },
            pastChoices: [{ id: "10", type: "pick", playerID: 1, resolved: true, value: {} }],
        } satisfies RootGameState;

        game.initializeState(state);

        expect(generateBoardSpy).toHaveBeenCalledWith(state.boardState.name);
        expect(generateFactionSpy).toHaveBeenCalledWith("marquise-de-cat");
        expect(generateHirelingSpy).toHaveBeenCalledWith("corvid-spies");
        expect(generateLandmarkSpy).toHaveBeenCalledWith("ferry");

        expect(game.board).toBe(board);
        expect(game.factions).toEqual([factionByType]);
        expect(game.hirelings).toEqual([hirelingByType]);
        expect(game.landmarks).toEqual([landmarkByType]);
    });
    test("initializes all other game properties correctly matching the provided state", () => {
        const state = {
            version: "1.2.3",
            options: basePlayOptions,
            boardState: { version: "b1", name: "autumn", clearings: [], forests: [] },
            factionState: {},
            hirelingState: {},
            landmarks: [],
            timeState: new TimeStep("eyrie-dynasties", "daylight", "end"),
            battleState: mock<BattleState>(),
            deck: [mock<Card>({ id: 1, name: "c1", suit: "fox", craftingCost: null, isAmbush: false, isDominance: false, item: null }), mock<Card>({ id: 2, name: "c2", suit: "rabbit", craftingCost: null, isAmbush: false, isDominance: false, item: null })],
            deckSize: 2,
            discardPile: [mock<Card>({ id: 3, name: "c3", suit: "mouse", craftingCost: null, isAmbush: false, isDominance: false, item: null })],
            spentCraftingPieceIDs: [4, 5],
            pendingChoice: { id: "6", type: "pick", playerID: 1, resolved: false },
            pastChoices: [{ id: "10", type: "pick", playerID: 1, resolved: true, value: {} }],
        } satisfies RootGameState;

        game.initializeState(state);

        expect(game.version).toBe(state.version);
        expect(game.playOptions).toBe(state.options);
        expect(game.currentTimeStep).toBe(state.timeState);
        expect(game.battleState).toBe(state.battleState);
        expect(game.deck).toBe(state.deck);
        expect(game.discardPile).toBe(state.discardPile);
        expect(game.spentCraftingPieces).toEqual(state.spentCraftingPieceIDs.map((id) => ({ id })));
        expect(game.pendingChoice).toBe(state.pendingChoice);
        expect(game.pastChoices).toEqual(state.pastChoices);
    });
});

// --- updateState ----------------------------------------------------------------

describe("RootGame.updateState", () => {
    // TODO: Add more specific tests for each type of update once the update types are defined.
});

// --- awaitPlayerChoice ----------------------------------------------------------------
describe("RootGame.awaitPlayerChoice", () => {
    test("returns right away with the appropriate value if a matching choice exists in past choices", async () => {
        const past: PendingChoice = { id: "c1", type: "pick", playerID: 1, resolved: true, value: { picked: 5 } };
        game.pastChoices = [past];

        const result = await game.awaitPlayerChoice({ id: "c1", type: "pick", playerID: 1, resolved: false });
        expect(result).toEqual(past.value);
    });

    test("throws an error if a different choice with the same id exists in past choices", async () => {
        const past: PendingChoice = { id: "c1", type: "other", playerID: 1, resolved: true, value: { picked: 5 } };
        game.pastChoices = [past];

        await expect(game.awaitPlayerChoice({ id: "c1", type: "pick", playerID: 1, resolved: false })).rejects.toThrow();
    });

    test("waits for the choice to be resolved if it's not in past choices", async () => {
        game.pendingChoice = { id: "p1", type: "pick", playerID: 2, resolved: false };
        game.gameplayPromiseControl = new PromiseControl();

        const p = game.awaitPlayerChoice({ id: "p1", type: "pick", playerID: 2, resolved: false });
        let isPending = true;
        p.then(() => isPending = false);
        
        // Check that the promise is still pending
        await undefined;
        expect(isPending).toBe(true);


        // Resolve the pending choice and then the gameplay promise
        game.pendingChoice = { id: "p1", type: "pick", playerID: 2, resolved: true, value: { ok: true } };
        game.gameplayPromiseControl.resolve();

        // Check that the promise has resolved
        await undefined;
        expect(isPending).toBe(false);
    });

    test("throws an error if the pending promise is rejected", async () => {
        game.pendingChoice = { id: "p2", type: "pick", playerID: 1, resolved: false };
        game.gameplayPromiseControl = new PromiseControl();

        const p = game.awaitPlayerChoice({ id: "p2", type: "pick", playerID: 1, resolved: false });
        game.gameplayPromiseControl.reject(new Error("gameplay failed"));

        await expect(p).rejects.toThrow("gameplay failed");
    });

    test("throws an error if the pending choice has changed after resolution", async () => {
        game.pendingChoice = { id: "p3", type: "pick", playerID: 1, resolved: false };
        game.gameplayPromiseControl = new PromiseControl();

        const p = game.awaitPlayerChoice({ id: "p3", type: "pick", playerID: 1, resolved: false });

        // Change pendingChoice to a different id 
        game.pendingChoice = { id: "other", type: "pick", playerID: 1, resolved: false };
        game.gameplayPromiseControl.resolve();

        await expect(p).rejects.toThrow();
    });

    test("returns the value of the choice after resolution", async () => {
        game.pendingChoice = { id: "p4", type: "pick", playerID: 3, resolved: false };
        game.gameplayPromiseControl = new PromiseControl();

        const p = game.awaitPlayerChoice({ id: "p4", type: "pick", playerID: 3, resolved: false });
        game.pendingChoice = { id: "p4", type: "pick", playerID: 3, resolved: true, value: { answer: 99 } };
        game.gameplayPromiseControl.resolve();

        await expect(p).resolves.toEqual({ answer: 99 });
    });

    test("adds choice to past choices and sets pending choice to null after resolution", async () => {
        game.pendingChoice = { id: "p5", type: "pick", playerID: 4, resolved: false };
        game.gameplayPromiseControl = new PromiseControl();

        const p = game.awaitPlayerChoice({ id: "p5", type: "pick", playerID: 4, resolved: false });
        const resolved: PendingChoice = { id: "p5", type: "pick", playerID: 4, resolved: true, value: { v: 1 } };
        game.pendingChoice = resolved;
        game.gameplayPromiseControl.resolve();

        await p;
        expect(game.pastChoices.find((c) => c.id === "p5")).toEqual(resolved);
        expect(game.pendingChoice).toBeNull();
        expect(game.gameplayPromiseControl).toBeNull();
    });
});


// --- playTurn ----------------------------------------------------------------

describe("RootGame.playTurn", () => {
    test("calls setup if timestep currentTurn is none", () => { });
    test("calls takePhase 3 times for the current player and updates timestep correctly in between", () => { });
    test("calls takePhase with the correct phase for each of the three phases in a turn", () => { });
    test("triggers the appropriate start-of-phase events for each phase of the turn", () => { });
    test("correctly advances the current player and time step at the end of the turn", () => { });
    test("if given a mid-turn time step, skips to the correct phase", () => { });
});

// --- setup ----------------------------------------------------------------

describe("RootGame.setup", () => {
    test("sets up chosen map", () => { });
    test("sets up chosen deck", () => { });
    test("randomizes seating order", () => { });
    test("removes dominance cards from the deck in 2-player games", () => { });

    test("generates the correct number of landmarks", () => { });
    test("players place landmarks in reverse turn order", () => { });
    test("landmarks are skipped if the number is zero", () => { });

    test("generates the correct number of promoted/demoted hirelings for the player count", () => { });
    test("players set up hirelings in reverse turn order", () => { });
    test("hirelings are skipped if the option is not enabled", () => { });

    describe("standard setup", () => {
        test("sets up chosen factions", () => { });
        test("assigns the correct player to each faction", () => { });
        test("throws an error if an invalid player id is provided", () => { });
        test("each player draws three cards", () => { });
        test("throws an error if the setup options are incomplete", () => { });
    });
    describe("advanced setup", () => {
        test("order of events is correct", () => { }); // Landmarks -> Hirelings -> Draw Cards -> Factions -> Discard Cards



        test("each player draws five cards", () => { });
        test("each player returns two cards to the deck", () => { });

        test("(# of players + 1) factions are selected for the draft", () => { });
        test("factions cannot be added to the draft if their corresponding hireling is in the game", () => { });
        test("the first faction in the draft is militant (7+ reach)", () => { });
        test("no insurgents are selected for the draft in 2-player games", () => { });

        test("players draft factions in reverse turn order", () => { });
        test("players cannot draft the last faction in the draft if it is an insurgent and no militant faction has been drafted yet", () => { });
        test("players setup their faction before the next player picks", () => { });

        test("players cannot pick a homeland clearing that has already been chosen by another player", () => { });
        test("players must follow homeland distance rules if possible", () => { });
        test("if players cannot follow the homeland distance rules, they must follow the next most lenient placement rule if possible", () => { });

        test("throws an error if the setup options are incomplete", () => { });
    });
});

// --- rollDie -----------------------------------------------------------------

describe("RootGame.rollDie", () => {
    test("returns a value between 0 and 3 inclusive", () => { });
    test("returns all possible values with equal probability", () => { });
});

// --- isMoveLegal  ----------------------------------------------

describe("RootGame.isMoveLegal ", () => {
    test("is legal when mover rules the origin clearing", () => { });

    test("is legal when mover rules the destination clearing", () => { });

    test("is illegal when mover rules neither origin nor destination ", () => { });

    test("is illegal when origin and destination are not adjacent", () => { });

    test("is illegal to move zero pieces", () => { });
});

// --- isBattleLegal  ----------------------------------------------------

describe("RootGame.isBattleLegal ", () => {
    test("is legal when attacker has warriors in the clearing and there is a defender", () => { });

    test("is illegal when attacker has no pieces in the clearing", () => { });

    test("is illegal when defender has no pieces in the clearing", () => { });

    test("is illegal to battle yourself", () => { });

    test("is illegal to battle with zero attacking warriors ", () => { });

    test("is illegal to battle a hireling you control", () => { });

    test("is illegal to battle a faction that is not an enemy", () => { });
});

// --- isPlaceLegal  ---------------------------------------------------

describe("RootGame.isPlaceLegal", () => {
    test("placing a building is legal when there is an open slot", () => { });

    test("placing a building is illegal when there are no open slots ", () => { });
});

// --- isCraftLegal  -----------------------------------------------------

describe("RootGame.isCraftLegal", () => {
    test("is legal when unexhausted crafting pieces cover all required suits", () => { });

    test("is illegal when crafting pieces do not cover all required suits ", () => { });

    test("is illegal to craft with exhausted pieces ", () => { });

    test("presence of extra crafting pieces does not affect legality, even if exhausted ", () => { });

    test("is illegal when no crafting pieces are provided", () => { });

    test("cannot craft an ambush card ", () => { });

    test("cannot craft a dominance card ", () => { });

    test("cannot craft duplicate persistent effects ", () => { });
});

// --- move  -----------------------------------------------------

describe("RootGame.move", () => {
    test("moves pieces from origin to destination clearing ", () => { });
    test("throws an error if move is illegal ", () => { });
});

// --- battle  -----------------------------------------------------

describe("RootGame.battle", () => {
    // --- battle - dice and hit counting  ------------------------

    test("throws an error if battle is illegal ", () => { });
    test("if timestep battleSegment is not none, skips to that segment ", () => { });

    describe("RootGame.battle - hit counting", () => {
        test("attacker deals hits equal to the higher roll ", () => { });

        test("defender deals hits equal to the lower roll ", () => { });

        test("equal rolls give both sides the same number of hits ", () => { });

        test("rolled hits are capped by attacker warrior count ", () => { });

        test("rolled hits are capped by defender warrior count ", () => { });

        test("defenseless: attacker deals extra hit when defender has no warriors ", () => { });
    });

    describe("RootGame.battle - ambush ", () => {
        test("defender can play ambush matching the clearing suit to deal 2 immediate hits", () => { });

        test("defender cannot play an ambush that doesn't match the clearing suit", () => { });

        test("attacker can foil ambush with an ambush card matching the clearing suit ", () => { });

        test("attacker cannot foil ambush with an ambush card that doesn't match the clearing suit ", () => { });

        test("battle ends immediately if no attacking warriors remain after ambush, even if the attacker has other pieces ", () => { });

        test("battle continues as normal if at least 1 attacking warrior remains after ambush ", () => { });
    });
});

// --- place -------------------------------------------------------------
describe("RootGame.place", () => {
    test("places pieces in target location", () => { });
    test("removes pieces from the source supply", () => { });
    test("throws an error if the placement is invalid", () => { });
});

// --- craft -------------------------------------------------------------
describe("RootGame.craft", () => {
    test("removes the card from the player's hand", () => { });
    test("adds the card to the player's crafted improvements", () => { });
    test("throws an error if the card is not in the player's hand", () => { });
    test("adds the crafted pieces to the spent crafting components", () => { });
    test("throws an error if the crafting is invalid", () => { });
});

// --- dealHits ----------------------------------------------------------
describe("RootGame.dealHits", () => {
    test("player must remove a piece for each hit they receive", () => { });

    test("warriors are removed before buildings and tokens ", () => { });

    test("players can choose which of their buildings or tokens take hits ", () => { });

    test("scoring: removing enemy building or token scores 1 VP ", () => { });

    test("hirelings do not score VP for their controller when removing enemy buildings or tokens", () => { });
});

// --- getGlobalEvents ----------------------------------------------------

describe("RootGame.getGlobalEvents", () => {
    test("collects global events from all RulesModules", () => { });
});


// --- Victory - score tracking  --------------------------------

describe("RootGame - victory conditions ", () => {
    test("gameOver is false at the start", () => { });

    test("first player to reach 30 VP wins ", () => { });

    test("winning is immediate - game stops at exactly 30 ", () => { });

    test("on a VP tie, the player closest clockwise to current player wins ", () => { });

    test("non-bird dominance victory: a player ruling three or more clearings matching a claimed dominance card at start of birdsong wins", () => { });

    test("non-bird dominance failure: a player claiming a dominance card but not ruling three or more matching clearings at start of birdsong does not win ", () => { });

    test("bird dominance victory: a player ruling two opposite corner clearings at start of birdsong wins", () => { });

    test("bird dominance failure: a player claiming a bird dominance card but not ruling two opposite corner clearings at start of birdsong does not win ", () => { });
});

// --- Dominance  --------------------------------------------------------

describe("RootGame - dominance ", () => {
    test("players may activate a dominance card in their hand during their daylight ", () => { });

    test("players cannot activate a dominance card without having 10 VP ", () => { });

    test("players cannot activate dominance cards outside of their daylight ", () => { });

    test("after activating dominance, score marker is removed (score is set to -1) ", () => { });

    test("players cannot activate a dominance card if they have an active dominance card ", () => { });

    test("when discarded, dominance cards go to a separate pile and are not reshuffled into the deck ", () => { });

    test("a faction can take an available dominance card by spending a matching card ", () => { });

    test("cannot treat a bird dominance card as another suit when taking it ", () => { });
});

// --- Deck reshuffling  --------------------------------------------------

describe("RootGame - deck management ", () => {
    test("reshuffles discard pile into deck when deck is empty", () => { });

    test("drawn card comes from top of deck", () => { });

    test("dominance cards are not reshuffled into the deck ", () => { });
});

// --- Piece placement limits  -----------------------------------------

describe("RootGame - piece limits ", () => {
    test("does not place pieces beyond supply limit", () => { });
});
