import type { Item } from './Item';
import type { Piece } from './Piece';
import type { PieceType } from './PieceType';

export class Ruin implements Piece {
    id: number;
    type: PieceType = { name: 'ruin', owningFaction: null };
    items: Item[] = [];
    constructor(id: number, items: Item[] = []) {
        this.id = id;
        this.items = items;
    }
}
