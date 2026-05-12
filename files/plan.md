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
  - Encodes phase, phase segment, and battle segment. Mutated in place by `RootGame` as the game progresses.
- version: string
- winner?: Faction
- gameOver: boolean

#### Methods
- play(options: object, agents: RootGameAgent[])
  - Each client and the server run their own `play()` loop. Agents fetch information over the network when input from remote players is required.
  - Iterates through turns. For each player's turn, for each phase: (1) `currentTimeStep` is advanced, (2) `takePhase` is called.
- setup(type: SetupType)
- isMoveLegal(faction: Faction, startingLocationID: int, endingLocationID: int): boolean
  - Must be faction-specific: e.g. Crows can ignore rule, Otters can move on rivers, Knaves can move in/out of forests ignoring rule.
- isBattleLegal(faction: Faction, clearingID: int, defender: Faction): boolean
- move(mover: Faction, startingLocationID: int, endingLocationID: int)
- battle(attacker: Faction, clearingID: int, defender: Faction)
- getGlobalActions(): Action[]
  - Returns actions available to the current faction independent of faction-specific rules, e.g. clearing paths on the mountain map or purchasing from Otters.
  - Filters by current game state: only returns actions the current player can legally take right now (e.g. Otters cannot buy from themselves; path clearing is only available in daylight).
  - Also returns Hireling-specific actions when called in the context of their controlling faction.
- getGlobalEvents(): Event[]
  - Mirrors `getGlobalActions()` but for events that trigger at the start or end of phases.
  - Also returns Hireling-specific events when called in the context of their controlling faction.
  - Contains the backbone hireling event logic.

---

### TimeStep
A class encoding the current moment in the game for use in event triggering and action legality checks. Mutated in place by `RootGame`.

#### Properties
- phase: PhaseType
- phaseSegment: 'start' | 'main' | 'end'
- battleSegment: (phases of battle, listed in the Law of Root)
  - A separate dimension from `phaseSegment`; a battle can occur during the `'main'` segment without changing the phase segment.

---

### Event (interface)
#### Properties
- triggerCondition: predicate[RootGame]
  - A predicate on the game state. Used both to determine when an event fires automatically, and to serve as the legality check for any Action that contains this event.
- execute: () => void
  - Closes over all required game state context.

---

### Action (interface)
#### Properties
- description: string
- event: Event
  - Replaces the former `execute` callback. The action's legality is determined by `event.triggerCondition`. Executing the action fires `event.execute`.
  - Action-embedded events are not structurally differentiated from automatic events; the distinction lies solely in how `takePhase` handles them (automatic events are evaluated after each state change; action events are fired when a player selects that action).

---

### Board
#### Properties
- name: string
- clearings: Clearing[]
- forests: Forest[]
- connections: Connection[]
- items: Item[]

#### Methods
- getClearingsAdjacent(location: Location, allowRivers: boolean): Clearing[]
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
- printedSuit?: Suit
- buildingSlots: mapping[int, Building | Ruin]
  - Typed as `Building | Ruin` to make explicit that only these piece types may occupy building slots. Pawns and Tokens can never go in building slots.
- landmarks: Landmark[]

#### Methods
- getWarriors(faction: Faction): Pawn[]
- getCardboard(faction: Faction): (Building | Token)[]
- openSlots(): int[]
- matches(suit: Suit): boolean
- build(slot: int, building: Building)
- getRuler(): Faction

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
#### Methods
- setup(game: RootGame)
- globalActions(game: RootGame): Action[]

---

### Faction (interface)
#### Properties
- name: string
- pieceTypes: PieceType[]
- supply: Piece[]
  - Contains all faction pieces not currently on the game board. Does not include pieces that have been permanently removed from the game (e.g. destroyed Otter trade posts), which are simply discarded and not tracked.
- game: RootGame
- hasCraftedBox: boolean

---

### PlayerFaction (implements RulesModule, Faction) (abstract)
#### Properties
- agent: RootGameAgent
- score: int
- claimedDominance: boolean

#### Methods
- takePhase(phase: PhaseType)
  - Merges faction-specific actions (via `getActions`) and global actions (via `RootGame.getGlobalActions`) into the set of available actions for the player.
  - Also merges faction-specific and global events (via `RootGame.getGlobalEvents`), evaluating `triggerCondition` after each state change within the phase and firing any newly-met events automatically.
- getActions(phase: PhaseType): Action[]

---

### Hireling (implements RulesModule, Faction) (abstract)
#### Properties
- hirelingID: int
  - Denotes which promoted and demoted Hireling classes are paired together.
- associatedFaction: Faction
  - The faction that cannot be played alongside this hireling.
- isDemoted: boolean
  - Relevant during setup, where promoted and demoted hirelings are treated differently. Promoted and demoted hirelings are represented by separate classes.
- controlCounter: int
  - Counts how many turns remain until the controlling faction must relinquish control of this hireling.
- controllingFaction?: PlayerFaction

---

### Landmark (implements RulesModule) (abstract)

---

### Piece (interface)
#### Properties
- type: PieceType

---

### PieceType
#### Properties
- name: string
- owningFaction: Faction | null
  - Null for ruins and items, which are used by multiple factions. Each faction defines its own `PieceType` instances (e.g. Marquise warrior, Eyrie warrior).

---

### Building (implements Piece)

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

## Enums
- ConnectionType: `'path' | 'river' | 'forest-adjacency'`
- SetupType: `'standard' | 'advanced'`
- PhaseType: `'birdsong' | 'daylight' | 'evening' | 'none'`
- ItemType: `'boot' | 'bag' | 'tea' | 'hammer' | 'crossbow' | 'sword' | 'coins'`
- Suit: `'fox' | 'rabbit' | 'mouse' | 'bird'`

---

## Agent Classes (shared)

### RootGameAgent (interface)
- chooseOne\<T>(message: string, options: T[]): T
  - On a client machine, agents representing remote players are proxies for the server. The server in turn holds a proxy for each player. The game loop blocks while awaiting input; rendering logic must remain reactive and non-blocking.
- chooseAny\<T>(message: string, options: T[], restriction: predicate[T[]]): T[]
- chooseBoolean(message: string): boolean
- selectMove(): tuple[startingLocationID: int, endingLocationID: int]
- selectBattle(message: string)

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
