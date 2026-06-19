import type { BoardType, ConnectionType, ItemType, PlayerFactionType, Suit } from "../Enums";
import type { Event } from "../game/Event";
import type { Item } from "../Item";
import type { Piece, PieceID } from "../pieces/Piece";
import type { RulesChange } from "../rulesModule/RulesChange";
import type { RulesModule } from "../rulesModule/RulesModule";
import type { RootBoardState } from "../state/RootBoardState";
import type { Clearing } from "./Clearing";
import type { Connection } from "./Connection";
import type { Forest } from "./Forest";
import type { Location, LocationID } from "./Location";

export class Board implements RulesModule {
    readonly name: BoardType;
    private _clearings: Clearing[];
    private _forests: Forest[];
    private _connections: Connection[];
    private _items: Item[];
    readonly staticRulesChanges: RulesChange[] = [];

    get clearings(): ReadonlyArray<Clearing> {
        return this._clearings;
    }

    get forests(): ReadonlyArray<Forest> {
        return this._forests;
    }

    get connections(): ReadonlyArray<Connection> {
        return this._connections;
    }

    get items(): ReadonlyArray<Item> {
        return this._items;
    }

    async setup(): Promise<void> {
        // optional: rules module setup hook
    }

    globalEvents(): Event[] {
        return [];
    }

    constructor({
        name,
        clearings,
        forests,
        connections,
    }: {
        name: BoardType;
        clearings: Clearing[];
        forests: Forest[];
        connections: Connection[];
    }) {
        this.name = name;
        this._clearings = clearings;
        this._forests = forests;
        this._connections = connections;
        this._items = [];
    }

    getClearingsAdjacent(locationID: LocationID): Clearing[] {
        throw new Error("Board.getClearingsAdjacent not implemented");
    }

    getClearingsAdjacentByRiver(locationID: LocationID): Clearing[] {
        throw new Error("Board.getClearingsAdjacentByRiver not implemented");
    }

    getForestsAdjacent(locationID: LocationID): Forest[] {
        throw new Error("Board.getForestsAdjacent not implemented");
    }

    getConnectionTypesBetween(location1: LocationID, location2: LocationID): Set<ConnectionType> {
        throw new Error("Board.getConnectionTypesBetween not implemented");
    }

    getLocation(id: LocationID): Location | undefined {
        throw new Error("Board.getLocation not implemented");
    }

    getClearing(id: LocationID): Clearing | undefined {
        throw new Error("Board.getClearing not implemented");
    }

    getForest(id: LocationID): Forest | undefined {
        throw new Error("Board.getForest not implemented");
    }

    getCorners(): [Clearing, Clearing][] {
        throw new Error("Board.getCorners not implemented");
    }

    move(pieces: PieceID[], startingLocationID: LocationID, endingLocationID: LocationID): void {
        throw new Error("Board.move not implemented");
    }

    place(pieces: PieceID[], locationID: LocationID): void {
        throw new Error("Board.place not implemented");
    }

    remove(pieces: PieceID[], locationID: LocationID): void {
        throw new Error("Board.remove not implemented");
    }

    replace(oldPieceID: PieceID, newPiece: Piece, locationID: LocationID): void {
        throw new Error("Board.replace not implemented");
    }

    hasItem(item: ItemType): boolean {
        throw new Error("Board.hasItem not implemented");
    }

    takeItem(item: ItemType): Item {
        throw new Error("Board.takeItem not implemented");
    }

    getSuitsOfPiece(pieceID: PieceID): Suit[] | null {
        throw new Error("Board.getSuitsOfPiece not implemented");
    }

    getState(perspective?: PlayerFactionType): RootBoardState {
        throw new Error("Board.getState not implemented");
    }
}
