import type { Piece } from "../pieces/Piece";
import type { PlayerFactionType } from "../Enums";
import type { Event } from "../game/Event";
import type { Faction } from "./Faction";
import type { RootFactionState } from "../state/RootFactionState";
import type { TimeStep } from "../state/TimeStep";

export interface PlayerFaction extends Faction {
  score: number;
  takePhase: (timeStep: TimeStep) => void;
  getEvents: (timeStep: TimeStep) => Event[];
  getCraftingPieces: () => Piece[];
  getState: (publicView: boolean) => RootFactionState;
  updateState: (s: RootFactionState) => void;
  name: PlayerFactionType;
  reach: number;
}
