import type { Piece } from '../pieces/Piece';

export interface Move {
    moverID: number;
    pieces: Piece[];
    startingLocationID: number;
    endingLocationID: number;
}
