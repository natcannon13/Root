import type { CardPile } from "../cards/CardPile";
import type { PlayerFactionType } from "../Enums";
import type { Event } from "../game/Event";
import type { Piece } from "../pieces/Piece";
import type { RootFactionState } from "../state/RootFactionState";
import type { TimeStep } from "../state/TimeStep";
import type { Faction } from "./Faction";

export interface PlayerFaction extends Faction {
    //TODO: make this a generic on PlayerFactionType?
    score: number;
    hand: CardPile;
    revealedCards: CardPile;
    craftedImprovements: CardPile;
    piles: Record<string, CardPile>;
    takePhase: (timeStep: TimeStep) => Promise<void>;
    getEvents: (timeStep: TimeStep) => Event[];
    getCraftingPieces: () => Piece[];
    getState: (publicView: boolean) => RootFactionState;
    name: PlayerFactionType;
}
