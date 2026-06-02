import type { BoardType, Suit } from '../Enums';
import type { Building } from '../pieces/Building';
import type { Pawn } from '../pieces/Pawn';
import type { Piece } from '../pieces/Piece';
import type { Token } from '../pieces/Token';

export interface RootBoardState {
    version: string;
    name: BoardType;
    clearings: {
        id: number;
        suit: Suit;
        pieces: Piece[];
    }[];
    forests: {
        id: number;
        pieces: Piece[];
    }[];
}
