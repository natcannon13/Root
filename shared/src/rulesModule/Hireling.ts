import type { PlayerFactionType } from "../Enums";
import type { Faction } from "./Faction";
import type { RootHirelingState } from "../state/RootHirelingState";

export interface Hireling extends Faction {
  hirelingID: number;
  associatedFaction: PlayerFactionType | null;
  isDemoted: boolean;
  controlCounter: number;
  controllingFaction: PlayerFactionType | null;
  getState: () => RootHirelingState;
  updateState: (s: RootHirelingState) => void;
}
