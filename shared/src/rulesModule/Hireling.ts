import type {
    DemotedHirelingFactionType,
    PlayerFactionType,
    PromotedHirelingFactionType,
} from "../Enums";
import type { RootHirelingState } from "../state/RootHirelingState";
import type { Faction } from "./Faction";

export type Hireling = PromotedHireling | DemotedHireling;

interface HirelingBase extends Faction {
    controlCounter: number;
    controllingFaction: PlayerFactionType | null;
    getState: () => RootHirelingState;
    updateState: (s: RootHirelingState) => void;
}

export interface PromotedHireling extends HirelingBase {
    name: PromotedHirelingFactionType;
    isDemoted: false;
}

export interface DemotedHireling extends HirelingBase {
    name: DemotedHirelingFactionType;
    isDemoted: true;
}
