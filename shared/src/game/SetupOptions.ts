import type {
    BoardType,
    DeckType,
    ExclusionType,
    LandmarkType,
    PlayerFactionType,
} from "../Enums";
import type { PlayerID } from "./RootGame";

interface SetupOptions {
    type: string;
    map: BoardType;
    deck: DeckType;
    usingHirelings: boolean;
    landmarksToUse: number;
    availableHirelings: ExclusionType[];
    availableLandmarks: LandmarkType[];
}

export interface StandardSetupOptions extends SetupOptions {
    type: "standard";
    chosenFactions: Partial<Record<PlayerFactionType, PlayerID>>;
}

export interface AdvancedSetupOptions extends SetupOptions {
    type: "advanced";
    draftableFactions: PlayerFactionType[];
}
