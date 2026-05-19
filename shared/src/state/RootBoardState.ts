import type { BoardType, Suit } from '../Enums';
import type { Building } from '../pieces/Building';
import type { Pawn } from '../pieces/Pawn';
import type { Token } from '../pieces/Token';

export interface RootBoardState {
    version: string;
    name: BoardType;
    clearings: {
        id: number;
        suit: Suit;
        tokens: Token[];
        pawns: Pawn[];
        buildings: Building[];
    }[];
    forests: {
        id: number;
        tokens: Token[];
        pawns: Pawn[];
    }[];
}
