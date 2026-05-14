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

#### Methods
- play(options: object, agents: RootGameAgent[])
  - Each client and the server run their own `play()` loop. Agents fetch information over the network when input from remote players is required. All network communication is decoupled from game logic and routed through `StateStore`, the same as the rendering layer.
  - Iterates through turns. For each player's turn, for each phase: (1) `currentTimeStep` is advanced, (2) `takePhase` is called.
  - Baseline Hireling rules (obtaining, control countdown, redistribution) are tracked here.
- setup(type: SetupType)
- isMoveLegal(move: Move): boolean
  - Checks clearing rule for the majority of factions. Factions that alter movement rules do so via static rules changes in their `RulesModule`.
- isBattleLegal(battle: Battle): boolean
- move(move: Move)
- battle(battle: Battle)
- getGlobalEvents(): Event[]
  - Returns events added by `RulesModule`s, potentially available to all factions. Some of these events will be actions that a player may or may not take.
  - Filters by current game state: only returns actions the current player can legally take right now (e.g. Otters cannot buy from themselves; path clearing is only available in daylight) / events that trigger right now.
  - `triggerCondition` is evaluated by brute force on every relevant state change; may change this later if performance requires it.
- getState(): RootGameState
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
- battleSegment: (phases of battle, listed in the Law of Root)
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

### RulesChange
#### Properties
- extensionName: ExtensionPointType
  - Identifies which rules extension point should invoke this object's callback. Using the `ExtensionPointType` enum ensures compile-time safety and makes all valid extension points discoverable.
- callback: function
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
- supply: Piece[]
  - Contains all faction pieces not currently on the game board. Also includes crafted items. Does not include pieces that have been permanently removed from the game (e.g. destroyed Otter trade posts), which are simply discarded and not tracked.
- game: RootGame
- hasCraftedBox: boolean
  - Indicates whether this faction can be stolen from (i.e. whether they have a crafted items box).

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

---

### Hireling (implements RulesModule, Faction) (abstract)
#### Properties
- hirelingID: int
  - Denotes which promoted and demoted Hireling classes are paired together.
- associatedFaction: PlayerFactionType | null
  - The faction that cannot be played alongside this hireling, if any.
- isDemoted: boolean
  - Relevant during setup, where promoted and demoted hirelings are treated differently. Promoted and demoted hirelings are represented by separate classes and cannot be swapped during play.
- controlCounter: int
  - Counts how many turns remain until the controlling faction must relinquish control of this hireling.
- controllingFaction: PlayerFactionType | null

---

### Landmark (implements RulesModule) (abstract)

---

### Piece (interface)
#### Properties
- id: int
- type: PieceType

---

### PieceType
#### Properties
- name: string
- owningFaction: FactionType | null
  - Null for ruins and items, which are used by multiple factions. Each faction defines its own `PieceType` instances (e.g. Marquise warrior, Eyrie warrior).

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
- type: PieceType
  - `owningFaction` is null, consistent with ruins being unowned.
  - Placed in `buildingSlots` at game start; a slot containing a Ruin is not considered open.

---

### Item (implements Piece)
#### Properties
- itemType: ItemType
  - Computed property returning `this.type.name`.
  - Items are the only pieces shared across factions; their `PieceType.owningFaction` is null.
- exhausted: boolean

---

### Card (implements RulesModule)
#### Properties
- name: string
- id: int
- suit: Suit
- craftingCost: Suit[] | null
- isAmbush: boolean
- isDominance: boolean

---

## Enums
- BoardType: `autumn | winter | lake | mountain | gorge | marsh`
- ConnectionType: `'path' | 'river' | 'forest-adjacency'`
- SetupType: `'standard' | 'advanced'`
- PhaseType: `'birdsong' | 'daylight' | 'evening' | 'none'`
- ItemType: `'boot' | 'bag' | 'tea' | 'hammer' | 'crossbow' | 'sword' | 'coins'`
- Suit: `'fox' | 'rabbit' | 'mouse' | 'bird' | 'frog'`
- ExtensionPointType: (enum of all valid rules extension points in `RootGame`; each value corresponds to a defined hook that `RulesChange` callbacks may target)
- PlayerFactionType: (enum of all player factions)
- HirelingFactionType: (enum of all hireling factions)
- FactionType: (enum of all factions)

---

## Agent Classes (shared)
On a client machine, agents representing remote players are proxies that communicate through `StateStore`; all network logic is decoupled from the game loop. The game loop blocks while awaiting input; rendering logic must remain reactive and non-blocking.
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

### RootBoardState (interface)
#### Properties
- version: string
- name: BoardType
- clearings: {id: int, suit: Suit, tokens: Token[], pawns: Pawns[], buildings: mapping[int, Building | Ruin]}
- forests: {id: int, tokens: Token[], pawns: Pawns[]}

### RootFactionState (interface)
#### Properties
- version: string
- name: PlayerFactionType
- hand: Card[] | null
- handSize: int
- craftedImprovements: Card[]
- score: int

### RootHirelingState (interface)
- version: string
- name: HirelingFactionType
- controlCounter: int
- controllingFaction: PlayerFactionType

### StateStore
Decouples the game loop from the rendering/network layer. The game loop calls `setState`; React (or any other renderer) subscribes via `useSyncExternalStore`. Neither side depends on the other. Network communication is also routed through `StateStore`, keeping all external concerns separate from game logic.

A list of serialized `RootGameState` snapshots is maintained here to support undo/redo.
#### Properties
- state: RootGameState
- history: RootGameState[]
  - Ordered list of past serialized snapshots. Used for undo/redo.

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

---

## Server Classes

### RootServer (implements RootServerInterface)
- Holds the canonical `RootGame` state.
- Broadcasts the full state to all clients after every state update.

---

## Client Classes

### RootClient (implements RootClientInterface)
- Renders reactively in response to state updates pushed from the server.
- Rendering logic must not block the gameplay loop.