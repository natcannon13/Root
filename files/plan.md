# Overview



## Classes
A `mapping` can be represented by an object in TypeScript.
A `tuple` can be represented by an array in TypeScript.
A `predicate` is a callback function that returns a boolean.
Enums in TypeScript can be represented with string literals.

### Game Classes (shared)
#### RootGame
##### Properties
- board: Board 
- factions: Faction[]
- hirelings: Hireling[]
- landmarks: Landmark[]
- currentTurn: Faction
- currentPhase: PhaseType
- version: string
##### Methods
- play(options: object, RootGameagents: RootGameAgent[])
- setup(type: SetupType)
- isMoveLegal(faction: Faction, startingLocationID: int, endingLocationID: int): boolean
- isBattleLegal(faction: Faction, clearingID: int, defender: faction): boolean
- move(mover: Faction, startingLocationID: int, endingLocationID: int)
- battle(attacker: Faction, clearingID: int, defender: Faction)
- getGlobalActions(): Action[]

#### Action (interface)
##### Properties
- description: string
##### Methods
- execute()

#### Board
##### Properties
- name: string
- clearings: Clearing[]
- forests: Forest[]
- connections: Connection[]
- items: Item[]
##### Methods
- getClearingsAdjacent(location: Location, allowRivers: boolean): Clearing[]
- getForestsAdjacent(location: Location): Forest[]
- getLocation(id: int): Location
- move(pieces: Piece[], startingLocationID: int, endingLocationID: int)

#### Location (abstract)
##### Properties
- id: int
- tokens: Token[]
- pawns: Pawn[]
##### Methods
- addPieces(Piece[])
- removePieces(Piece[])
- hasPieces(Piece[]): boolean
- getPieces(predicate[Piece]): Piece[]
- replace(targetPiece: Piece, newPiece: Piece)

#### Clearing (extends Location)
##### Properties
- printedSuit?: Suit
- buildingSlots: mapping[int, Building | Ruin]
- landmarks: Landmark[]
##### Methods
- getWarriors(faction: Faction): Pawn[]
- getCardboard(faction: Faction): (Building | Token)[]
- openSlots(): int[]
- matches(suit: Suit): boolean
- build(slot: int, building: Building)
- getRuler(): Faction

#### Forest (extends Location)

#### Connection
##### Properties
- id: int
- locationIDs: tuple[int, int]
- type: ConnectionType

#### RulesModule (interface)
##### Methods
- setup(RootGame)
- globalActions(RootGame): Action[]

#### Faction (abstract)
##### Properties
- name: string
- pieceTypes: PieceType[]
- supply: Piece[]
- game: RootGame
- hasCraftedBox: bool

#### PlayerFaction (implements RulesModule, Faction) (abstract)
##### Properties
- agent: RootGameAgent
##### Methods
- phaseStartEvents(phase: PhaseType)
- takePhase(phase: PhaseType)
- getActions(phase: PhaseType): Action[]
- phaseEndEvents(phase: PhaseType)


#### Hireling (implements RulesModule, Faction) (abstract)
##### Properties
- controlCounter: int
- controllingFaction?: PlayerFaction

#### Landmark (implements RulesModule) (abstract)

#### Piece (interface)
##### Properties
- type: PieceType

#### PieceType
##### Properties
- name: string

#### Building (implements Piece)
#### Token (implements Piece)
- faceUp: boolean
#### Pawn (implements Piece)
##### Properties
- isWarrior: boolean

#### Ruin
##### Properties
- items: Item[]

#### Item (implements Piece)
##### Properties
- itemType: ItemType
- exhausted: boolean

#### Enums
- ConnectionType ('path' | 'river' | 'forest-adjacency')
- SetupType ('standard' | 'advanced')
- PhaseType ('birdsong' | 'daylight' | 'evening' | 'none')
- ItemType ('boot' | 'bag' | 'tea' | 'hammer' | 'crossbow' | 'sword' | 'coins')

### Agent Classes (shared)

#### RootGameAgent (interface)
- chooseOne\<T>(message: string, options: T[]): T
- chooseAny\<T>(message: string, options: T[], restriction: predicate[T[]]): T[]
- chooseBoolean(message: string): boolean
- selectMove(): tuple[startingLocationID: int, endingLocationID: int]
- selectBattle(message: string)

### Server Classes
#### RootServer (implements RootServerInterface)

### Client Classes
#### RootClient (implements RootClientInterface)