import type { HirelingFactionType, PlayerFactionType } from "../Enums";

export interface RootHirelingState {
    version: string;
    name: HirelingFactionType;
    controlCounter: number;
    controllingFaction: PlayerFactionType;
}
