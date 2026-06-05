import type { Card } from "../cards/Card";

export interface CardPileState {
    version: string;
    cards: Card[] | null;
    length: number;
}
