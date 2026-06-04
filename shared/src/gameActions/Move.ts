import type { Location, LocationID } from '../board/Location';
import type { PlayerFactionType } from '../Enums';
import type { Piece } from '../pieces/Piece';

export interface Move {
    mover: PlayerFactionType;
    pieces: Piece[];
    startingLocationID: LocationID;
    endingLocationID: LocationID;
}
