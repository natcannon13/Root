import type { Piece, PieceID } from "../pieces/Piece";

export type LocationID = number;

export abstract class Location {
    public id: LocationID = 0;

    addPieces(pieces: Piece[]): void {}
    removePieces(pieceIDs: PieceID[]): void {}
    hasPieces(pieceIDs: PieceID[]): boolean {
        return false;
    }
    getPieces(predicate?: (p: Piece) => boolean): Piece[] {
        return [];
    }
    replace(oldPieceID: PieceID, newPiece: Piece): void {}
}
