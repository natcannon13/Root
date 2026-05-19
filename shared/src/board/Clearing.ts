import type { Building } from "../pieceInterfaces/Building";
import type { Suit } from "../Enums";
import { Location } from "./Location";
import type { Piece } from "../pieceInterfaces/Piece";
import type { Pawn } from "../pieceInterfaces/Pawn";
import type { Token } from "../pieceInterfaces/Token";

export class Clearing extends Location {
  id: number;
  printedSuit: Suit | null;
  slotCount: number;

  constructor(args: {
    id: number;
    printedSuit: Suit | null;
    slotCount: number;
  }) {
    super();
    this.id = args.id;
    this.printedSuit = args.printedSuit;
    this.slotCount = args.slotCount;
  }

  matches(suit: Suit | null): boolean {
    return false;
  }
  openSlots(): number {
    return 0;
  }
  addPieces(pieces: Piece[]): void {}
  removePieces(pieces: Piece[]): void {}
  hasPieces(pieces: Piece[]): boolean {
    return false;
  }
  getPieces(predicate?: (p: Piece) => boolean): Piece[] {
    return [];
  }
  replace(oldPiece: Piece, newPiece: Piece): void {}
  getRuler(): string | null {
    return null;
  }
  getWarriors(faction: string): Pawn[] {
    return [];
  }
  getCardboard(faction: string): Array<Building | Token> {
    return [];
  }
}
