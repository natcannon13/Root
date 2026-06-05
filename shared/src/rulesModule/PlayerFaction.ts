import type { Piece } from "../pieces/Piece";
import type { PlayerFactionType } from "../Enums";
import type { Event } from "../game/Event";
import type { Faction } from "./Faction";
import type { RootFactionState } from "../state/RootFactionState";
import type { TimeStep } from "../state/TimeStep";
import type { CardPile } from "../cards/CardPile";

export interface PlayerFaction extends Faction { //TODO: make this a generic on PlayerFactionType
  score: number;
  hand: CardPile;
  revealedCards: CardPile;
  piles: Record<string, CardPile>;
  takePhase: (timeStep: TimeStep) => void;
  getEvents: (timeStep: TimeStep) => Event[];
  getCraftingPieces: () => Piece[];
  getState: (publicView: boolean) => RootFactionState;
  updateState: (s: RootFactionState) => void;
  name: PlayerFactionType;
}
