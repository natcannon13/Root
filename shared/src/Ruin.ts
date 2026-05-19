import type { Building } from './pieceInterfaces/Building';
import type { Item } from './Item';

export class Ruin implements Building {
    id: number;
    name: string = 'ruin';
    owningFaction: null = null;
    items: Item[] = [];
    constructor(id: number, items: Item[] = []) {
        this.id = id;
        this.items = items;
    }
}
