import type { Building } from "../pieces/Building";
import type { Suit, FactionType } from "../Enums";
import { Location } from "./Location";
import type { Piece } from "../pieces/Piece";
import type { Pawn } from "../pieces/Pawn";
import type { Token } from "../pieces/Token";

export class Clearing extends Location {
  id: number;
  printedSuit: Suit | null;
  slotCount: number;

  constructor({id, printedSuit, slotCount}: {
    id: number;
    printedSuit: Suit | null;
    slotCount: number;
  }) {
    super();
    this.id = id;
    this.printedSuit = printedSuit;
    this.slotCount = slotCount;
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
  getRuler(): FactionType | null {
    return null;
  }
  getWarriors(faction: FactionType): Pawn[] {
    return [];
  }
  getCardboard(faction: FactionType): Array<Building | Token> {
    return [];
  }
}
