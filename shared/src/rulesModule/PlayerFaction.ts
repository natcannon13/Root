import type { Piece } from "../pieces/Piece";
import type { PlayerFactionType } from "../Enums";
import type { Event } from "../game/Event";
import type { Faction } from "./Faction";
import type { RootGameAgent } from "../agents/RootGameAgent";
import type { RootFactionState } from "../state/RootFactionState";

export interface PlayerFaction extends Faction {
  agent: RootGameAgent;
  score: number;
  takePhase: (phase: string) => void;
  getEvents: (phase: string) => Event[];
  getCraftingPieces: () => Piece[];
  getState: (publicView: boolean) => RootFactionState;
  updateState: (s: RootFactionState) => void;
  name: PlayerFactionType;
}
