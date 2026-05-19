import type { Pawn } from "../pieces/Pawn";
import type { Piece } from "../pieces/Piece";
import type { Token } from "../pieces/Token";




export abstract class Location {
    public id: number = 0;
    private tokens: Token[] = [];
    private pawns: Pawn[] = [];

    addPieces(pieces: Piece[]): void {}
    removePieces(pieces: Piece[]): void {}
    hasPieces(pieces: Piece[]): boolean { return false; }
    getPieces(predicate: (p: Piece) => boolean): Piece[] { return []; }
    replace(targetPiece: Piece, newPiece: Piece): void {}
}