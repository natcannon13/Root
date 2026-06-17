import type { LocationID } from "../board/Location";
import type { FactionType } from "../Enums";
import type { Piece } from "../pieces/Piece";

export interface Move {
    readonly mover: FactionType;
    readonly pieces: Piece[];
    readonly startingLocationID: LocationID;
    readonly endingLocationID: LocationID;
}
