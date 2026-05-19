import type { BoardType, Suit } from '../Enums';
import type { Building } from '../pieceInterfaces/Building';
import type { Pawn } from '../pieceInterfaces/Pawn';
import type { Token } from '../pieceInterfaces/Token';

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
