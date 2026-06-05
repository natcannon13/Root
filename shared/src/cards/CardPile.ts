import type { CardPileState } from "../state/RootCardPileState";
import type { Card, CardID } from "./Card";

const VERSION = "0.0.0";

export class CardPile {
    cards: Card[]; // TODO: make this nullable, add errors where that causes problems (an error will signify we need a state update)

    constructor(cards: Card[] = []) {
        this.cards = cards;
    }

    addCard(card: Card) {
        this.cards.push(card);
    }

    removeCard(cardID: CardID) {
        const index = this.cards.findIndex((c) => c.id === cardID);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }

    hasCard(cardID: CardID) {
        return this.cards.some((c) => c.id === cardID);
    }

    topCard() {
        return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
    }

    randomCard() {
        if (this.cards.length === 0) return null;
        const index = Math.floor(Math.random() * this.cards.length);
        return this.cards[index];
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    getState(hidden: boolean): CardPileState {
        return {
            version: VERSION,
            cards: hidden ? null : this.cards,
            length: this.cards.length,
        };
    }

    setState(state: CardPileState) {
        throw new Error("CardPile.setState not implemented");
    }
}
