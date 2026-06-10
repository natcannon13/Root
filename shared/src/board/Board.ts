import type { BoardType, PlayerFactionType } from "../Enums";
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
    name: BoardType;
    clearings: Clearing[];
    forests: Forest[];
    connections: Connection[];
    items: Item[];
    staticRulesChanges: RulesChange[] = [];

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
        this.clearings = clearings;
        this.forests = forests;
        this.connections = connections;
        this.items = [];
    }

    getClearingsAdjacent(location: Location): Clearing[] {
        throw new Error("Board.getClearingsAdjacent not implemented");
    }

    getClearingsAdjacentByRiver(location: Location): Clearing[] {
        throw new Error("Board.getClearingsAdjacentByRiver not implemented");
    }

    getForestsAdjacent(location: Location): Forest[] {
        throw new Error("Board.getForestsAdjacent not implemented");
    }

    getLocation(id: LocationID): Location | undefined {
        throw new Error("Board.getLocation not implemented");
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

    getState(perspective?: PlayerFactionType): RootBoardState {
        throw new Error("Board.getState not implemented");
    }
}
