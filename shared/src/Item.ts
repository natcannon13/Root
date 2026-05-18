import type { ItemType } from './Enums';
import type { Piece } from './Piece';
import type { PieceType } from './PieceType';

export class Item implements Piece {
    id: number;
    type: PieceType;
    exhausted: boolean = false;

    constructor(id = 0, type: PieceType) {
        this.id = id;
        this.type = type;
        this.exhausted = false;
    }

    get itemType(): ItemType {
        return this.type?.name as ItemType;
    }
}
