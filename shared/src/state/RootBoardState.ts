import type { LocationID } from '../board/Location';
import type { BoardType, Suit } from '../Enums';
import type { Piece } from '../pieces/Piece';

export interface RootBoardState {
    version: string;
    name: BoardType;
    clearings: {
        id: LocationID;
        suit: Suit;
        pieces: Piece[];
    }[];
    forests: {
        id: LocationID;
        pieces: Piece[];
    }[];
}
