import type { PlayerFactionType, HirelingFactionType } from "../Enums";

export interface RootHirelingState {
  version: string;
  name: HirelingFactionType;
  controlCounter: number;
  controllingFaction: PlayerFactionType;
}
