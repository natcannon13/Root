import type { PlayerFactionType } from "../Enums";


export interface Piece {
    id: number;
    name: string;
    owningFaction: PlayerFactionType | null;
}
