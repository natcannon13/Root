import type { FactionType, Suit } from "../Enums";
import type { Building } from "../pieces/Building";
import type { Pawn } from "../pieces/Pawn";
import type { Piece, PieceID } from "../pieces/Piece";
import type { Token } from "../pieces/Token";
import { Location, type LocationID } from "./Location";

export class Clearing extends Location {
    id: LocationID;
    printedSuit: Suit | null;
    slotCount: number;

    constructor({
        id,
        printedSuit,
        slotCount,
    }: {
        id: LocationID;
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
    removePieces(pieceIDs: PieceID[]): void {}
    hasPieces(pieceIDs: PieceID[]): boolean {
        return false;
    }
    getPieces(predicate?: (p: Piece) => boolean): Piece[] {
        return [];
    }
    replace(oldPieceID: PieceID, newPiece: Piece): void {}
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
