import type { Piece } from './Piece';

export interface Token extends Piece {
    faceUp: boolean;
}
