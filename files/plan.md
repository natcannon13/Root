# Overview

## Classes
A `mapping` can be represented by an object in TypeScript.  
A `tuple` can be represented by an array in TypeScript.  
A `predicate` is a callback function that returns a boolean. (predicate[<T>] = (T) => boolean)  
`int` is used in this plan in place of `number`; we shouldn't have to work with non-integers.  
Enums in TypeScript can be represented with string literals.  

---

## Game Classes (shared)

### RootGame
#### Properties
- board: Board
- factions: Faction[]
- hirelings: Hireling[]
- landmarks: Landmark[]
- currentTimeStep: TimeStep
  - Encodes phase, phase segment, battle segment, and active player.
- version: string
- winner: PlayerFactionType | null
- gameOver: boolean
- deck: Card[]
- discardPile: Card[]
- spentCraftingPieces: Piece[]

#### Methods
- play(options: object, agents: RootGameAgent[])
  - Each client and the server run their own `play()` loop. Agents fetch information over the network when input from remote players is required. All network communication is decoupled from game logic and routed through `StateStore`, the same as the rendering layer.
  - Iterates through turns. For each player's turn, for each phase: (1) `currentTimeStep` is advanced, (2) `takePhase` is called.
  - Baseline Hireling rules (rolling to obtainin, control countdown, redistribution) are tracked here.
- setup(type: SetupType)
- isMoveLegal(move: Move): boolean
  - Checks clearing rule for the majority of factions. Factions that alter movement rules do so via static rules changes in their `RulesModule`.
- isBattleLegal(battle: Battle): boolean
- isPlaceLegal(pieces: Piece[], locationID: int): boolean
- isCraftLegal(faction: PlayerFactionType, card: Card, craftingPieces: Piece[]): boolean
- move(move: Move)
- battle(battle: Battle)
- place(pieces: Piece[], locationID: int)
- craft(faction: PlayerFactionType, card: Card, craftingPieces: Piece[])
- getGlobalEvents(): Event[]
  - Returns events added by `RulesModule`s, potentially available to all factions. Some of these events will be actions that a player may or may not take.
  - Filters by current game state: only returns actions the current player can legally take right now (e.g. Otters cannot buy from themselves; path clearing is only available in daylight) / events that trigger right now.
  - `triggerCondition` is evaluated by brute force on every relevant state change; may change this later if performance requires it.
- getState(perspective: PlayerFaction | null): RootGameState
  - If a faction is provided for perspective, only private information that faction has access to is included.
- updateState(state: RootGameState)

---

### Move
#### Properties
- mover: FactionType
- pieces: Piece[]
- startingLocationID: int
- endingLocationID: int

---

### Battle
#### Properties
- attacker: FactionType
- defender: FactionType
- clearingID: int

---

### TimeStep
A class encoding the current moment in the game for use in event triggering and action legality checks.

Root has no simultaneous decisions. Whenever priority shifts mid-turn (e.g. prompting a non-active player for an ambush), `activePlayer` is updated to the player currently making a decision; it reverts when that decision is resolved.

#### Properties
- currentTurn: PlayerFaction
- phase: PhaseType
- phaseSegment: 'start' | 'main' | 'end'
- battleSegment: BattlePhaseType
  - A separate dimension from `phaseSegment`; a battle can occur during the `'main'` segment without changing the phase segment.
- activePlayer: PlayerFaction


---

### Event (interface)
#### Properties
- label: string
  - A human-readable name for display in the UI and for debugging (e.g. `"Craft Card"`, `"Battle"`).
- triggerCondition: predicate[RootGame]
  - A predicate on the game state. Determines when an event fires automatically or when it is available to be taken by a player.
- execute: (RootGame) => void
- isAction: boolean
  - Whether the event triggers automatically or needs player choice to happen.

---

### RulesChange\<T extends ExtensionPointType>
#### Properties
- extensionName: T
  - Identifies which rules extension point should invoke this object's callback. Using the `ExtensionPointType` enum ensures compile-time safety and makes all valid extension points discoverable.
- callback: RulesChangeCallbackMap[T]
  - Signature intentionally left vague. I don't yet know what needs to be supported with this.

---

### Board (implements RulesModule)
#### Properties
- name: BoardType
- clearings: Clearing[]
- forests: Forest[]
- connections: Connection[]
- items: Item[]

#### Methods
- getClearingsAdjacent(location: Location): Clearing[]
- getClearingsAdjacentByRiver(location: Location): Clearing[]
- getForestsAdjacent(location: Location): Forest[]
- getLocation(id: int): Location
- move(pieces: Piece[], startingLocationID: int, endingLocationID: int)
- place(pieces: Piece[], location: id)
- getState(perspective: PlayerFaction | null): RootBoardState
- updateState(RootBoardState)

---

### Location (abstract)
#### Properties
- id: int
- tokens: Token[]
- pawns: Pawn[]

#### Methods
- addPieces(pieces: Piece[])
- removePieces(pieces: Piece[])
- hasPieces(pieces: Piece[]): boolean
- getPieces(predicate: predicate[Piece]): Piece[]
- replace(targetPiece: Piece, newPiece: Piece)

---

### Clearing (extends Location)
#### Properties
- printedSuit: Suit | null
- buildingSlots: mapping[int, Building | Ruin]
  - Key is the slot index (0-based). Typed as `Building | Ruin` to make explicit that only these piece types may occupy building slots. Pawns and Tokens can never go in building slots.
- landmarks: Landmark[]

#### Methods
- getWarriors(faction: FactionType): Pawn[]
- getCardboard(faction: FactionType): (Building | Token)[]
- openSlots(): int[]
- matches(suit: Suit): boolean
- build(slot: int, building: Building)
- getRuler(): FactionType | null

---

### Forest (extends Location)

---

### Connection
#### Properties
- id: int
- locationIDs: tuple[int, int]
  - An unordered pair; the two elements do not imply directionality.
- type: ConnectionType

---

### RulesModule (interface)
#### Properties
- staticRulesChanges: RulesChange[]
  - A list of static rules changes introduced by this module. Applied at defined "extension points" in RootGame, each identified by an `ExtensionPointType` value.

#### Methods
- setup(game: RootGame)
- globalEvents(game: RootGame): Event[]

---

### Faction (interface)
#### Properties
- name: FactionType
- pieceTypes: PieceType[]
- game: RootGame
- hasCraftedBox: boolean
  - Indicates whether this faction can be stolen from (i.e. whether they have a crafted items box). All factions that use items for their own mechanics do not have a crafted item box.
#### Methods
- addToSupply(piece: Piece)
  - Adds the given piece to this faction's supply. (Factions maintain their own internal representation of their supply.) 
- getPiece(pieceID: int) : Piece | null
  - Returns the piece with the given ID if it exists within this faction's supply.

---

### PlayerFaction (implements RulesModule, Faction) (abstract)
#### Properties
- name: PlayerFactionType
- agent: RootGameAgent
- score: int
- claimedDominance: boolean
- hand: Card[]
- craftedImprovements: Card[]

#### Methods
- takePhase(phase: PhaseType)
  - Merges faction-specific events (via `getEvents`) and global actions (via `RootGame.getGlobalEvents`) into the set of available actions/events for the player.
- getEvents(phase: PhaseType): Event[]
- getCraftingPieces(): Piece[]
- getState(public: boolean): RootFactionState
  - PlayerFactions will only have access to private state that is private to them, so no need to pass a faction here- it would always be "yes this is this faction" or "no this is not this faction."
- updateState(RootFactionState)

---

### Hireling (implements RulesModule, Faction) (abstract)
#### Properties
- hirelingID: int
  - Denotes which promoted and demoted Hireling classes are paired together. Relevant only because both cannot be in the same game; promoted/demoted hirelings are essentially entirely different factions rules-wise.
- associatedFaction: PlayerFactionType | null
  - The faction that cannot be played alongside this hireling, if any.
- isDemoted: boolean
  - Relevant during setup, where promoted and demoted hirelings are treated differently. Promoted and demoted hirelings are represented by separate classes.
- controlCounter: int
  - Counts how many turns remain until the controlling faction must relinquish control of this hireling.
- controllingFaction: PlayerFactionType | null
#### Methods
- getState(): RootHirelingState
- updateState(RootHirelingState)

---

### Landmark (implements RulesModule) (abstract)

---

### Piece (interface)
#### Properties
  - id: int
  - name: string
  - owningFaction: PlayerFactionType | null
    - Null for ruins and items, which are used by multiple factions. Each faction defines its own piece instances (e.g. Marquise warrior, Eyrie warrior).

---

### Building (implements Piece) (interface)

---

### Token (implements Piece)
#### Properties
- faceUp: boolean

---

### Pawn (implements Piece)
#### Properties
- isWarrior: boolean

---

### Ruin (implements Piece)
#### Properties
  - items: Item[]
  - name: string (always 'ruin')
  - owningFaction: null (ruins are unowned)
    - Placed in `buildingSlots` at game start; a slot containing a Ruin is not considered open.

---

### Item (implements Piece)
#### Properties
  - itemType: ItemType
    - Computed property returning `this.name`.
    - Items are the only pieces shared across factions; their `owningFaction` is null.
  - exhausted: boolean

---

### Deck (implements RulesModule)
The Deck RulesModule implements all rules related to its craftable cards. Persistent crafted effects have a condition that causes them only to apply when crafted: instant crafted effects define an event that triggers when that card has been crafted that then discards it. Ambush and Dominance cards are handled by the base rules engine.
#### Properties
- name: DeckType
- cards: Card[]

---

### Card
#### Properties
- name: string
- id: int
- suit: Suit
- craftingCost: Suit[] | null
- isAmbush: boolean
- isDominance: boolean
- item: ItemType | null

---

## Enums
- BoardType: `autumn | winter | lake | mountain | gorge | marsh`
- DeckType: `base | e&p | s&d`
- ConnectionType: `'path' | 'river' | 'forest-adjacency'`
- SetupType: `'standard' | 'advanced'`
- PhaseType: `'birdsong' | 'daylight' | 'evening' | 'none'`
- BattlePhaseType: `ambush | before-roll | roll | after-roll | hits`
- ItemType: `'boot' | 'bag' | 'tea' | 'hammer' | 'crossbow' | 'sword' | 'coins'`
- Suit: `'fox' | 'rabbit' | 'mouse' | 'bird' | 'frog'`
- ExtensionPointType: (enum of all valid rules extension points in `RootGame`; each value corresponds to a defined hook that `RulesChange` callbacks may target)
- PlayerFactionType: (enum of all player factions)
- HirelingFactionType: (enum of all hireling factions)
- FactionType: (enum of all factions)

---

## Agent Classes (shared)
On a client machine, agents representing remote players are proxies that communicate through `StateStore`; all network logic is decoupled from the game loop. The game loop blocks while awaiting input; rendering logic must remain reactive and non-blocking. If a client disconnects and then reconnects, the deserialization procedure will restore the correct position in the game loop.
### RootGameAgent (interface)
- chooseOne\<T>(message: string, options: T[]): T
- chooseAny\<T>(message: string, options: T[], restriction: predicate[T[]]): T[]
- chooseBoolean(message: string): boolean
- chooseMove(faction: FactionType, restriction: predicate[Move]): Move
- chooseBattle(faction: FactionType, restriction: predicate[Battle]): Battle

---

## State management classes (shared)

### RootGameState (interface)
All referenced types will be defined explicitly instead of imported, to make it clear when `version` needs to be updated.
#### Properties
- version: string
- boardState: RootBoardState
- factionState: mapping[PlayerFactionType, RootFactionState]
- hirelingState: mapping[HirelingFactionType, RootHirelingState]
- timeState: TimeStep
- deck: Card[] | null
- deckSize: int
- discardPile: Card[]
- spentCraftingPieceIDs: int[]

---

### RootBoardState (interface)
#### Properties
- version: string
- name: BoardType
- clearings: {id: int, suit: Suit, tokens: Token[], pawns: Pawn[], buildings: mapping[int, Building | Ruin]}
- forests: {id: int, tokens: Token[], pawns: Pawn[]}

---

### RootFactionState (interface)
#### Properties
- version: string
- name: PlayerFactionType
- hand: Card[] | null
- handSize: int
- craftedImprovements: Card[]
- score: int

---

### RootHirelingState (interface)
#### Properties
- version: string
- name: HirelingFactionType
- controlCounter: int
- controllingFaction: PlayerFactionType

---

### PendingAction\<T extends PendingActionType>
#### Properties
- type: T
- actor: PlayerFactionType
- resolve: PendingActionCallbackMap[T]
---

### StateStore
Decouples the game loop from the rendering/network layer. The game loop calls `setState`; React (or any other renderer) subscribes via `useSyncExternalStore`. Neither side depends on the other. Network communication is also routed through `StateStore`, keeping all external concerns separate from game logic.

A list of serialized `RootGameState` snapshots is maintained here to support undo/redo.
#### Properties
- state: RootGameState
- history: RootGameState[]
  - Ordered list of past serialized snapshots. Used for undo/redo. If memory becomes a problem, we'll deal with it then.
- pendingAction: PendingAction

#### Methods
- setState(updater: (g: RootGameState) => void): void
  - Applies the updater function to `state`, pushes the previous state onto `history`, then notifies all subscribers.
- subscribe(fn: () => void): () => void
  - Registers a listener. Returns an unsubscribe function. Compatible with React's `useSyncExternalStore`.
- getState(): RootGameState
- undo(): void
- redo(): void
- do(id: int): void
  - Jump to the RootGameState with the given id.
  - Note that `undo`, `redo`, and `do` will require admin privilege if they undo or redo any actions taken by another player, or actions that give information (such as Expose) 

## Network Interfaces (shared)

### RootServerInterface
#### Methods
- sendMessage(message: object, connectionID: int)
- subscribe(fn: (message: object, connectionID: int) => void): () => void

### RootClientInterface
#### Methods
- sendMessage(message: object)
- subscribe(fn: (message: object) => void): () => void

## Server Classes

### RootServer (implements RootServerInterface)
- Holds the canonical `RootGame` state.
- Broadcasts the full state (minus secret information) to all clients after every state update.

---

## Client Classes

### RootClient (implements RootClientInterface)
- Renders reactively in response to state updates pushed from the server.
- Rendering logic must not block the gameplay loop.