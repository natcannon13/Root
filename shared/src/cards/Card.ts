import type { Suit, ItemType } from '../Enums';

export interface Card {
    name: string;
    id: number;
    suit: Suit;
    craftingCost: Suit[] | null;
    isAmbush: boolean;
    isDominance: boolean;
    item: ItemType | null;
}
