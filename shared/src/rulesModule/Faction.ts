import type { FactionType } from "../Enums";
import type { RootGame } from "../game/RootGame";
import type { Piece, PieceID } from "../pieces/Piece";
import type { FactionUpdate } from "./FactionUpdate";
import type { RulesModule } from "./RulesModule";

export interface Faction extends RulesModule {
    name: FactionType;
    pieces: Piece[];
    game: RootGame;
    hasCraftedBox: boolean;
    addToSupply: (piece: Piece) => void;
    getPiece: (pieceID: PieceID) => Piece | null;
    updateState: (factionUpdate: FactionUpdate) => void;
}
