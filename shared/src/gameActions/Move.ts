import type { LocationID } from "../board/Location";
import type { PlayerFactionType } from "../Enums";
import type { Piece } from "../pieces/Piece";

export interface Move {
    readonly mover: PlayerFactionType;
    readonly pieces: Piece[];
    readonly startingLocationID: LocationID;
    readonly endingLocationID: LocationID;
}
