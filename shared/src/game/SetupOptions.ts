import type { BoardType, DeckType, HirelingFactionType, LandmarkType, PlayerFactionType } from "../Enums";

interface SetupOptions {
    type: string;
    map: BoardType;
    deck: DeckType;
    usingHirelings: boolean;
    landmarksToUse: number;
    availableHirelings: HirelingFactionType[];
    availableLandmarks: LandmarkType[];
}

export interface StandardSetupOptions extends SetupOptions {
    type: "standard";
    chosenFactions: Partial<Record<PlayerFactionType, number>>;
}

export interface AdvancedSetupOptions extends SetupOptions {
    type: "advanced";
    draftableFactions: PlayerFactionType[];
}