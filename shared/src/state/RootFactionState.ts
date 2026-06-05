import type { PlayerFactionType } from "../Enums";
import type { CardPileState } from "./RootCardPileState";

export interface RootFactionState {
    version: string;
    name: PlayerFactionType;
    hand: CardPileState;
    craftedImprovements: CardPileState;
    revealedCards: CardPileState;
    piles: Record<string, CardPileState>;
    score: number;
}
