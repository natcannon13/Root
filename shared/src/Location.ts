import type { Piece } from './Piece';
import type  { Token } from './Token';
import type  { Pawn } from './Pawn';

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