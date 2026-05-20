import type { Piece } from '../pieces/Piece';
import type { PlayerFactionType } from '../Enums';

export interface Move {
    mover: PlayerFactionType;
    pieces: Piece[];
    startingLocationID: number;
    endingLocationID: number;
}
