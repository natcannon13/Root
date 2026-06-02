import type { Building } from './Building';
import type { Item } from '../Item';

export class Ruin implements Building {
    id: number;
    name = 'ruin' as const;
    owningFaction: null = null;
    items: Item[] = [];
    remainingItemCount: number;
    constructor(id: number, items: Item[] = [], remainingItemCount?: number) {
        this.id = id;
        this.items = items;
        this.remainingItemCount = remainingItemCount ?? items.length;
    }

    removeItem(itemId: number): Item {
        const itemIndex = this.items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) {
            throw new Error(`Item with id ${itemId} not found in ruin ${this.id}`);
        }
        this.remainingItemCount--;
        return this.items.splice(itemIndex, 1)[0];
    }
}
