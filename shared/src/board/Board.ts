import type { BoardType } from '../Enums';
import type { Clearing } from './Clearing';
import type { Forest } from './Forest';
import type { Connection } from './Connection';
import type { Item } from '../Item';
import type { Location } from './Location';
import type { Piece } from '../pieceInterfaces/Piece';

export class Board {
    name: BoardType;
    clearings: Clearing[];
    forests: Forest[];
    connections: Connection[];
    items: Item[];

    constructor() {
        // TODO: Initialize board
    }

    getClearingsAdjacent(location: Location): Clearing[] {
        // TODO: Implement
        return [];
    }

    getClearingsAdjacentByRiver(location: Location): Clearing[] {
        // TODO: Implement
        return [];
    }

    getForestsAdjacent(location: Location): Forest[] {
        // TODO: Implement
        return [];
    }

    getLocation(id: number): Location | undefined {
        // TODO: Implement
        return undefined;
    }

    move(pieces: Piece[], startingLocationID: number, endingLocationID: number): void {
        // TODO: Implement
    }

    place(pieces: Piece[], locationID: number): void {
        // TODO: Implement
    }
}
