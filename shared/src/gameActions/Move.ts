import type { Piece } from '../pieceInterfaces/Piece';
import type { PlayerFactionType } from '../Enums';

export interface Move {
    mover: PlayerFactionType;
    pieces: Piece[];
    startingLocationID: number;
    endingLocationID: number;
}
