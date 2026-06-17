import type { FactionType, PlayerFactionType } from "../Enums";

export type PieceID = number;

export interface Piece {
    id: PieceID;
    name: string;
    owningFaction: FactionType | null;
}
