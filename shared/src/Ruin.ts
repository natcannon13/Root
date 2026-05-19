import type { Item } from './Item';
import type { Piece } from './Piece';

export class Ruin implements Piece {
    id: number;
    name: string = 'ruin';
    owningFaction: null = null;
    items: Item[] = [];
    constructor(id: number, items: Item[] = []) {
        this.id = id;
        this.items = items;
    }
}
