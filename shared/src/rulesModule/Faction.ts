import type { Piece, PieceID } from "../pieces/Piece";
import type { RulesModule } from "./RulesModule";
import type { RootGame } from "../game/RootGame";
import type { FactionType } from "../Enums";

export interface Faction extends RulesModule {
  name: FactionType;
  pieces: Piece[];
  game: RootGame;
  hasCraftedBox: boolean;
  addToSupply: (piece: Piece) => void;
  getPiece: (pieceID: PieceID) => Piece | null;
}
