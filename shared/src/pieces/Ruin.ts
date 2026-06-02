import type { Building } from './Building';
import type { Item } from '../Item';

export class Ruin implements Building {
    id: number;
    name: string = 'ruin';
    owningFaction: null = null;
    items: Item[] = [];
    constructor(id: number, items: Item[] = []) {
        this.id = id;
        this.items = items;
    }

    removeItem(itemId: number): Item {
        const itemIndex = this.items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) {
            throw new Error(`Item with id ${itemId} not found in ruin ${this.id}`);
        }
        return this.items.splice(itemIndex, 1)[0];
    }
}
