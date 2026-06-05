import type { Item } from "../Item";
import type { Building } from "./Building";
import type { PieceID } from "./Piece";

export class Ruin implements Building {
    id: PieceID;
    name = "ruin" as const;
    owningFaction: null = null;
    items: Item[] = [];
    remainingItemCount: number;
    constructor(id: PieceID, items: Item[] = [], remainingItemCount?: number) {
        this.id = id;
        this.items = items;
        this.remainingItemCount = remainingItemCount ?? items.length;
    }

    removeItem(itemId: PieceID): Item {
        const itemIndex = this.items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) {
            throw new Error(`Item with id ${itemId} not found in ruin ${this.id}`);
        }
        this.remainingItemCount--;
        return this.items.splice(itemIndex, 1)[0];
    }
}
