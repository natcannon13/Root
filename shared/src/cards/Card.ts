import type { ItemType, Suit } from "../Enums";

export type CardID = number;

export interface Card {
    name: string;
    id: CardID;
    suit: Suit;
    craftingCost: Suit[] | null;
    isAmbush: boolean;
    isDominance: boolean;
    item: ItemType | null;
}
