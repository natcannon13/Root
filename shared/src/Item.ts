import type { ItemType } from './Enums';
import type { Piece, PieceID } from './pieces/Piece';

export class Item implements Piece {
    id: PieceID;
    name: ItemType;
    owningFaction = null;
    exhausted: boolean = false;

    constructor(id = 0, name: ItemType) {
        this.id = id;
        this.name = name;
        this.exhausted = false;
    }

    get itemType(): ItemType {
        return this.name;
    }
}
