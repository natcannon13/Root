import type { PlayerFactionType } from "./Enums";

export interface PieceType {
    name: string;
    owningFaction?: PlayerFactionType | null;
}
