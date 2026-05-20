import type { Piece } from "./Piece";

export class Supply {
    private pieces: Piece[] = [];

    constructor(pieces: Piece[]) {
        this.pieces = pieces;
    }

    getAvailablePieces(): Piece[] {
        return this.pieces;
    }

    addPiece(piece: Piece) {
        this.pieces.push(piece);
    }

    hasPiece(predicate: (piece: Piece) => boolean): boolean {
        return this.pieces.some(predicate);
    }

    removePiece(piece: Piece) {
        const index = this.pieces.indexOf(piece);
        if (index !== -1) {
            this.pieces.splice(index, 1);
        }
    }

    getPieceById(id: number): Piece | undefined {
        return this.pieces.find((piece) => piece.id === id);
    }

    removePieceById(id: number) {
        const index = this.pieces.findIndex((piece) => piece.id === id);
        if (index !== -1) {
            this.pieces.splice(index, 1);
        }
    }
}
