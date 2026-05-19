import type { ItemType } from './Enums';
import type { Piece } from './Piece';

export class Item implements Piece {
    id: number;
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
