
import type { Pawn } from "./pieceInterfaces/Pawn";
import type { Piece } from "./pieceInterfaces/Piece";
import type { Token } from "./pieceInterfaces/Token";


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