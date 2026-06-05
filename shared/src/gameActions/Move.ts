import type { LocationID } from "../board/Location";
import type { PlayerFactionType } from "../Enums";
import type { Piece } from "../pieces/Piece";

export interface Move {
    mover: PlayerFactionType;
    pieces: Piece[];
    startingLocationID: LocationID;
    endingLocationID: LocationID;
}
