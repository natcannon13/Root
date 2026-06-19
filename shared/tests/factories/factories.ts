import { mock, type MockProxy } from "vitest-mock-extended";
import { Board } from "../../src/board/Board";
import { Clearing } from "../../src/board/Clearing";
import type { Connection, ConnectionID } from "../../src/board/Connection";
import { Forest } from "../../src/board/Forest";
import type { LocationID, LocationType } from "../../src/board/Location";
import type { Card, CardID } from "../../src/cards/Card";
import { CardPile } from "../../src/cards/CardPile";
import type { CardLocationType, CardPileLocation } from "../../src/cards/CardPileLocation";
import {
    isDemotedHirelingFactionType,
    type BattlePhaseType,
    type BoardType,
    type ConnectionType,
    type DeckType,
    type DemotedHirelingFactionType,
    type ExclusionType,
    type FactionType,
    type HirelingFactionType,
    type ItemType,
    type LandmarkType,
    type PhaseType,
    type PlayerFactionType,
    type PromotedHirelingFactionType,
    type Suit,
} from "../../src/Enums";
import type {
    Choice,
    ChoiceID,
    ChoiceOptionsMap,
    ChoiceType,
    ChoiceValueMap,
    PendingChoice,
    ResolvedChoice,
} from "../../src/game/Choice";
import type { Event } from "../../src/game/Event";
import type { PlayOptions } from "../../src/game/PlayOptions";
import { RandomEventHandler } from "../../src/game/RandomEventHandler";
import type { PlayerID, RootGame } from "../../src/game/RootGame";
import type {
    GameUpdateType,
    GameUpdateValueMap,
    RootGameUpdate,
} from "../../src/game/RootGameUpdate";
import type { AdvancedSetupOptions, StandardSetupOptions } from "../../src/game/SetupOptions";
import type { Battle } from "../../src/gameActions/Battle";
import type { Move } from "../../src/gameActions/Move";
import { Item } from "../../src/Item";
import type { Building } from "../../src/pieces/Building";
import type { Pawn } from "../../src/pieces/Pawn";
import type { Piece, PieceID } from "../../src/pieces/Piece";
import { Ruin } from "../../src/pieces/Ruin";
import { Supply } from "../../src/pieces/Supply";
import type { Token } from "../../src/pieces/Token";
import type { Faction } from "../../src/rulesModule/Faction";
import type { FactionUpdate } from "../../src/rulesModule/FactionUpdate";
import type { DemotedHireling, Hireling, PromotedHireling } from "../../src/rulesModule/Hireling";
import type { Landmark, LandmarkID } from "../../src/rulesModule/Landmark";
import type { PlayerFaction } from "../../src/rulesModule/PlayerFaction";
import type { ExtensionPointType, RulesChange } from "../../src/rulesModule/RulesChange";
import type { RulesModule } from "../../src/rulesModule/RulesModule";
import { BattleState } from "../../src/state/BattleState";
import type { RootBoardState } from "../../src/state/RootBoardState";
import type { CardPileState } from "../../src/state/RootCardPileState";
import type { RootFactionState } from "../../src/state/RootFactionState";
import type { RootGameState } from "../../src/state/RootGameState";
import type { RootHirelingState } from "../../src/state/RootHirelingState";
import { TimeStep } from "../../src/state/TimeStep";
import type { StateHistory as StateHistoryType } from "../../src/stateStore/StateHistory";
import { HistoryNode } from "../../src/stateStore/StateHistory";
import { StateStore, type StateType, type TransitionType } from "../../src/stateStore/StateStore";

type PropertiesOnly<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

function genericMock<T>(overrides?: Partial<T>): MockProxy<T> {
    // Lets us use mock with generics
    return mock<T>(overrides as any); // Brute force solution since we don't have access to DeepPartial
}

const DEFAULT_VERSION = "0.0.0";

/********** RAW VALUE FACTORIES **********/
//#region Raw Value Factories
export function makeSuit(): Suit {
    return "fox";
}

export function makePhaseType(): PhaseType {
    return "none";
}

export function makeConnectionType(): ConnectionType {
    return "path";
}

export function makeItemType(): ItemType {
    return "boot";
}

export function makePlayerFactionType(): PlayerFactionType {
    return "marquise-de-cat";
}

export function makePromotedHirelingFactionType(): PromotedHirelingFactionType {
    return "forest-patrol";
}

export function makeDemotedHirelingFactionType(): DemotedHirelingFactionType {
    return "feline-physicians";
}

export function makeHirelingFactionType(): HirelingFactionType {
    return makePromotedHirelingFactionType();
}

export function makeFactionType(): FactionType {
    return makePlayerFactionType();
}

export function makeExclusionType(): ExclusionType {
    return "feline";
}

export function makeBoardType(): BoardType {
    return "autumn";
}

export function makeDeckType(): DeckType {
    return "base";
}

export function makeBattlePhaseType(): BattlePhaseType {
    return "ambush";
}

export function makeLandmarkType(): LandmarkType {
    return "ferry";
}

export function makeLocationType(): LocationType {
    return "clearing";
}

export function makeLocationID(): LocationID {
    return 0;
}

export function makeConnectionID(): ConnectionID {
    return 0;
}

export function makePieceID(): PieceID {
    return 0;
}

export function makeCardID(): CardID {
    return 0;
}

export function makeLandmarkID(): LandmarkID {
    return 0;
}

export function makePlayerID(): PlayerID {
    return 0;
}

export function makeChoiceType(): ChoiceType {
    return "pick";
}

export function makeChoiceID(): ChoiceID {
    return "choice-0";
}

export function makeCardLocationType(): CardLocationType {
    return "nowhere";
}

export function makeExtensionPointType(): ExtensionPointType {
    return "placeholder-1";
}

export function makeGameUpdateType(): GameUpdateType {
    return "stateSet";
}

export function makeTransitionID(): string {
    return "transition-0";
}
//#endregion
/********** SIMPLE OBJECT FACTORIES **********/
//#region Simple Object Factories
export function makeStateType(overrides?: Partial<StateType>): StateType {
    return {
        version: DEFAULT_VERSION,
        ...overrides,
    };
}

export function makeTransitionType(overrides?: Partial<TransitionType>): TransitionType {
    return {
        id: makeTransitionID(),
        version: DEFAULT_VERSION,
        ...overrides,
    };
}

export function makePiece(overrides?: Partial<Piece>): Piece {
    return {
        id: makePieceID(),
        name: "piece",
        owningFaction: null,
        ...overrides,
    };
}

export function makePawn(overrides?: Partial<Pawn>): Pawn {
    return {
        ...makePiece(),
        isWarrior: true,
        ...overrides,
    };
}

export function makeToken(overrides?: Partial<Token>): Token {
    return {
        ...makePiece(),
        faceUp: false,
        ...overrides,
    };
}

export function makeBuilding(overrides?: Partial<Building>): Building {
    return {
        ...makePiece(),
        ...overrides,
    };
}

export function makeConnection(overrides?: Partial<Connection>): Connection {
    return {
        id: makeConnectionID(),
        locationIDs: [makeLocationID(), makeLocationID()],
        type: makeConnectionType(),
        ...overrides,
    };
}

export function makeCard(overrides?: Partial<Card>): Card {
    return {
        name: "card",
        id: makeCardID(),
        suit: makeSuit(),
        craftingCost: null,
        isAmbush: false,
        isDominance: false,
        item: null,
        ...overrides,
    };
}

export function makeCardPileLocation(
    overrides?: Partial<CardPileLocation> & Pick<CardPileLocation, "name">,
): CardPileLocation {
    if (!overrides) {
        return {
            name: "nowhere",
        };
    }
    switch (overrides.name) {
        case "hand":
        case "crafted":
        case "revealed":
            return {
                faction: makePlayerFactionType(),
                ...overrides,
            };
        case "pile":
            return {
                faction: makePlayerFactionType(),
                pileID: "pile-0",
                ...overrides,
            };
        default:
            return {
                ...overrides,
            };
    }
}

export function makeBattle(overrides?: Partial<Battle>): Battle {
    return {
        attacker: makeFactionType(),
        defender: makeFactionType(),
        clearingID: makeLocationID(),
        ...overrides,
    };
}

export function makeMove(overrides?: Partial<Move>): Move {
    return {
        mover: makePlayerFactionType(),
        pieces: [makePiece()],
        startingLocationID: makeLocationID(),
        endingLocationID: makeLocationID(),
        ...overrides,
    };
}

export function makeEvent(overrides?: Partial<Event>): MockProxy<Event> {
    return mock<Event>({
        label: "event",
        isAction: false,
        ...overrides,
    });
}

export function makeRulesChange<T extends ExtensionPointType = ExtensionPointType>(
    overrides?: Partial<RulesChange<T>>,
): MockProxy<RulesChange<T>> {
    return genericMock<RulesChange<T>>({
        extensionName: makeExtensionPointType() as T,
        ...overrides,
    });
}

export function makeRulesModule(overrides?: Partial<RulesModule>): MockProxy<RulesModule> {
    return mock<RulesModule>({
        staticRulesChanges: [],
        ...overrides,
    });
}

export function makeFaction(overrides?: Partial<Faction>): MockProxy<Faction> {
    return mock<Faction>({
        ...makeRulesModule(),
        name: makeFactionType(),
        pieces: [],
        game: makeRootGame(),
        hasCraftedBox: false,
        ...overrides,
    });
}

export function makeFactionUpdate(overrides?: Partial<FactionUpdate>): FactionUpdate {
    return {
        faction: makeFactionType(),
        updateType: "updateType",
        value: null,
        ...overrides,
    };
}

export function makePlayerFaction(overrides?: Partial<PlayerFaction>): MockProxy<PlayerFaction> {
    const defaults: PropertiesOnly<PlayerFaction> = {
        ...makeFaction(),
        name: makePlayerFactionType(),
        score: 0,
        hand: makeCardPile(),
        revealedCards: makeCardPile(),
        craftedImprovements: makeCardPile(),
        piles: {},
    };
    return mock<PlayerFaction>({
        ...defaults,
        ...overrides,
    });
}

export function makePromotedHireling(
    overrides?: Partial<PromotedHireling>,
): MockProxy<PromotedHireling> {
    return mock<PromotedHireling>({
        ...makeFaction(),
        name: makePromotedHirelingFactionType(),
        controlCounter: 0,
        controllingFaction: null,
        isDemoted: false,
        ...overrides,
    });
}

export function makeDemotedHireling(
    overrides?: Partial<DemotedHireling>,
): MockProxy<DemotedHireling> {
    return mock<DemotedHireling>({
        ...makeFaction(),
        name: makeDemotedHirelingFactionType(),
        controlCounter: 0,
        controllingFaction: null,
        isDemoted: true,
        ...overrides,
    });
}

export function makeHireling(overrides?: Partial<Hireling>): MockProxy<Hireling> {
    if (
        overrides?.isDemoted ||
        (overrides?.name && isDemotedHirelingFactionType(overrides?.name))
    ) {
        return makeDemotedHireling(overrides as Partial<DemotedHireling>);
    }
    return makePromotedHireling(overrides as Partial<PromotedHireling>);
}

export function makeLandmark(overrides?: Partial<Landmark>): Landmark {
    return {
        ...makeRulesModule(),
        id: makeLandmarkID(),
        name: makeLandmarkType(),
        piece: makePiece(),
        ...overrides,
    };
}

export function makeRootBoardState(overrides?: Partial<RootBoardState>): RootBoardState {
    return {
        version: DEFAULT_VERSION,
        name: makeBoardType(),
        clearings: [],
        forests: [],
        ...overrides,
    };
}

export function makeCardPileState(overrides?: Partial<CardPileState>): CardPileState {
    return {
        version: DEFAULT_VERSION,
        cards: [],
        length: 0,
        ...overrides,
    };
}

export function makeRootFactionState(overrides?: Partial<RootFactionState>): RootFactionState {
    return {
        version: DEFAULT_VERSION,
        name: makePlayerFactionType(),
        hand: makeCardPileState(),
        craftedImprovements: makeCardPileState(),
        revealedCards: makeCardPileState(),
        piles: {},
        score: 0,
        ...overrides,
    };
}

export function makeRootHirelingState(overrides?: Partial<RootHirelingState>): RootHirelingState {
    return {
        version: DEFAULT_VERSION,
        name: makeHirelingFactionType(),
        controlCounter: 0,
        controllingFaction: makePlayerFactionType(),
        ...overrides,
    };
}

export function makeChoiceOptions<T extends ChoiceType>(
    type: T,
    overrides?: Partial<ChoiceOptionsMap[T]>,
): ChoiceOptionsMap[T] {
    switch (type) {
        case "pick":
            return {
                description: "pick one",
                options: ["option-1"],
                ...overrides,
            } as ChoiceOptionsMap[T];
        case "pickX":
            return {
                description: "pick many",
                options: ["option-1"],
                ...overrides,
                count: 1,
            } as ChoiceOptionsMap[T];
        case "yesno":
            return {
                description: "yes or no",
                ...overrides,
            } as ChoiceOptionsMap[T];
        case "pickRange":
            return {
                description: "pick a range",
                min: 0,
                max: 0,
                ...overrides,
            } as ChoiceOptionsMap[T];
        case "pickOrder":
            return {
                description: "pick an order",
                options: [0],
                ...overrides,
            } as ChoiceOptionsMap[T];
        default:
            throw new Error(`Invalid choice type: ${type}`); // This should never happen.
    }
}

export function makeChoiceValue<T extends ChoiceType>(type: T): ChoiceValueMap[T] {
    switch (type) {
        case "pick":
            return "option-1" as ChoiceValueMap[T];
        case "pickX":
            return ["option-1"] as ChoiceValueMap[T];
        case "yesno":
            return true as ChoiceValueMap[T];
        case "pickRange":
            return 0 as ChoiceValueMap[T];
        case "pickOrder":
            return [0] as ChoiceValueMap[T];
    }
}

export function makePendingChoice<T extends ChoiceType>(
    type: T,
    overrides?: Partial<PendingChoice<T>>,
): PendingChoice<T> {
    return {
        id: makeChoiceID(),
        type,
        playerID: null,
        resolved: false,
        options: makeChoiceOptions(type),
        ...overrides,
    } as PendingChoice<T>;
}

export function makeResolvedChoice<T extends ChoiceType = "pick">(
    type: T,
    overrides?: Partial<ResolvedChoice<T>>,
): ResolvedChoice<T> {
    return {
        id: makeChoiceID(),
        type,
        playerID: null,
        resolved: true,
        options: makeChoiceOptions(type),
        value: makeChoiceValue(type),
        ...overrides,
    } as ResolvedChoice<T>;
}

export function makeChoice<T extends ChoiceType>(
    type: T,
    overrides?: Partial<Choice<T>>,
): Choice<T> {
    if (overrides?.resolved) {
        return makeResolvedChoice(type, overrides as Partial<ResolvedChoice<T>>);
    }
    return makePendingChoice(type, overrides as Partial<PendingChoice<T>>);
}

export function makePlayOptions(overrides?: Partial<PlayOptions>): PlayOptions {
    return {
        setup: makeStandardSetupOptions(),
        playerIDs: [makePlayerID()],
        ...overrides,
    };
}

export function makeStandardSetupOptions(
    overrides?: Partial<StandardSetupOptions>,
): StandardSetupOptions {
    return {
        type: "standard",
        map: makeBoardType(),
        deck: makeDeckType(),
        usingHirelings: false,
        landmarksToUse: 0,
        availableHirelings: [],
        availableLandmarks: [],
        chosenFactions: {},
        ...overrides,
    };
}

export function makeAdvancedSetupOptions(
    overrides?: Partial<AdvancedSetupOptions>,
): AdvancedSetupOptions {
    return {
        type: "advanced",
        map: makeBoardType(),
        deck: makeDeckType(),
        usingHirelings: false,
        landmarksToUse: 0,
        availableHirelings: [],
        availableLandmarks: [],
        draftableFactions: [makePlayerFactionType()],
        ...overrides,
    };
}

//TODO: swap these for mocks
export function makeBattleState(overrides?: Partial<BattleState>): MockProxy<BattleState> {
    return mock<BattleState>({
        battle: makeBattle(),
        pendingAttackerHits: 0,
        pendingDefenderHits: 0,
        battleSegment: null,
        ...overrides,
    });
}

export function makeTimeStep(overrides?: Partial<TimeStep>): MockProxy<TimeStep> {
    return mock<TimeStep>({
        currentTurn: "none",
        phase: "none",
        phaseSegment: "start",
        ...overrides,
    });
}

export function makeCardPile(overrides?: Partial<CardPile>): MockProxy<CardPile> {
    return mock<CardPile>({
        cards: [],
        ...overrides,
    });
}

export function makeItem(overrides?: Partial<Item>): MockProxy<Item> {
    return mock<Item>({
        id: makePieceID(),
        name: makeItemType(),
        owningFaction: null,
        exhausted: false,
        ...overrides,
    });
}

export function makeRuin(overrides?: Partial<Ruin>): MockProxy<Ruin> {
    return mock<Ruin>({
        id: makePieceID(),
        name: "ruin",
        owningFaction: null,
        items: [],
        remainingItemCount: 0,
        ...overrides,
    });
}

export function makeSupply(overrides?: Partial<Supply>): MockProxy<Supply> {
    return mock<Supply>({
        ...overrides,
    });
}

export function makeClearing(overrides?: Partial<Clearing>): MockProxy<Clearing> {
    return mock<Clearing>({
        id: makeLocationID(),
        printedSuit: null,
        slotCount: 0,
        ...overrides,
    });
}

export function makeForest(overrides?: Partial<Forest>): MockProxy<Forest> {
    return mock<Forest>({
        id: makeLocationID(),
        ...overrides,
    });
}

export function makeBoard(overrides?: Partial<Board>): MockProxy<Board> {
    const boardProperties: PropertiesOnly<Board> = {
        name: makeBoardType(),
        clearings: [],
        forests: [],
        connections: [],
        items: [],
        staticRulesChanges: [],
        ...overrides,
    };
    return mock<Board>(boardProperties);
}

export function makeRootGameState(overrides?: Partial<RootGameState>): RootGameState {
    return {
        version: DEFAULT_VERSION,
        options: makePlayOptions(),
        playerFactionMapping: {},
        turnOrder: [makePlayerID()],
        boardState: makeRootBoardState(),
        factionState: {},
        hirelingState: {},
        landmarks: [],
        currentTimeStep: makeTimeStep(),
        battleState: null,
        deck: makeCardPileState(),
        discardPile: makeCardPileState(),
        dominancePile: makeCardPileState(),
        spentCraftingPieceIDs: [],
        pendingChoice: null,
        pastChoices: [],
        winner: null,
        ...overrides,
    };
}

export function makeRootGameUpdate<T extends GameUpdateType>(
    type: T,
    overrides?: Partial<RootGameUpdate>,
): RootGameUpdate {
    const optionsMap: { [K in GameUpdateType]: GameUpdateValueMap[K] } = {
        stateSet: { newState: makeRootGameState() },
        factionSelected: { playerID: makePlayerID(), faction: makePlayerFactionType() },
        turnOrderSet: { turnOrder: [makePlayerID()] },
        factionAdded: { faction: makePlayerFactionType() },
        hirelingAdded: { hireling: makeHirelingFactionType() },
        landmarkAdded: { landmark: makeLandmarkType() },
        move: { pieces: [makePieceID()], from: makeLocationID(), to: makeLocationID() },
        place: { pieces: [makePieceID()], to: makeLocationID() },
        remove: { pieces: [makePieceID()], from: makeLocationID() },
        addToSupply: { pieces: [makePieceID()], faction: makeFactionType() },
        factionStateUpdate: { update: makeFactionUpdate() },
        moveCard: {
            cardID: makeCardID(),
            from: makeCardPileLocation(),
            to: makeCardPileLocation(),
        },
        startBattle: { battle: makeBattle() },
        battleSegmentChange: { newBattleSegment: makeBattlePhaseType() },
        pendingHitsChange: { attackerHits: 1, defenderHits: 1 },
        endBattle: {},
        crafting: { craftingPiecesUsed: [makePieceID()] },
        craftingReset: { craftingPiecesReset: [makePieceID()] },
        choicePended: { choice: makeChoice(makeChoiceType()) },
        choiceResolved: {
            choiceID: makeChoiceID(),
            type: "pick",
            resolution: makeChoiceValue("pick"),
        },
        compound: { updates: [] },
    };
    return {
        id: makeTransitionID(),
        version: DEFAULT_VERSION,
        type: type,
        options: optionsMap[type],
        ...overrides,
    } as RootGameUpdate;
}

export function makeStateStore<State extends StateType, Transition extends TransitionType>(
    overrides?: Partial<StateStore<State, Transition>>,
): MockProxy<StateStore<State, Transition>> {
    return mock<StateStore<State, Transition>>({
        ...overrides,
    });
}

export function makeHistoryNode<State extends StateType, Transition extends TransitionType>(
    overrides?: Partial<HistoryNode<State, Transition>>,
): MockProxy<HistoryNode<State, Transition>> {
    return genericMock<HistoryNode<State, Transition>>({
        state: makeStateType() as State,
        prevIdx: -1,
        nextIdx: -1,
        transitionFromPrev: null,
        ...overrides,
    });
}

export function makeStateHistory<State extends StateType, Transition extends TransitionType>(
    overrides?: Partial<StateHistoryType<State, Transition>>,
): MockProxy<StateHistoryType<State, Transition>> {
    return genericMock<StateHistoryType<State, Transition>>({
        historyNodes: [],
        currentNode: makeHistoryNode<State, Transition>(),
        ...overrides,
    });
}

export function makeRandomEventHandler(): MockProxy<RandomEventHandler> {
    return mock<RandomEventHandler>();
}

export function makeRootGame(overrides?: Partial<RootGame>): MockProxy<RootGame> {
    return mock<RootGame>({
        version: DEFAULT_VERSION,
        options: makePlayOptions(),
        playerFactionMapping: {},
        turnOrder: [makePlayerID()],
        board: makeBoard(),
        factions: [],
        hirelings: [],
        landmarks: [],
        currentTimeStep: makeTimeStep(),
        battleState: null,
        deck: makeCardPile(),
        discardPile: makeCardPile(),
        dominancePile: makeCardPile(),
        spentCraftingPieces: [],
        pendingChoice: null,
        pastChoices: [],
        gameplayPromiseControl: null,
        stateStore: makeStateStore<RootGameState, RootGameUpdate>(),
        randomEventHandler: makeRandomEventHandler(),
        winner: null,
        gameOver: false,
        ...overrides,
    });
}
//#endregion
