import type { PlayerFactionType } from '../Enums';
import type { Piece } from '../pieces/Piece';

export interface Move {
    mover: PlayerFactionType;
    pieces: Piece[];
    startingLocationID: number;
    endingLocationID: number;
}
