import type { BoardType, DeckType, PlayerFactionType } from "../Enums";

interface SetupOptions {
    type: string;
    map: BoardType;
    deck: DeckType;
}

export interface StandardSetupOptions extends SetupOptions {
    type: "standard";
    chosenFactions: Partial<Record<PlayerFactionType, number>>;
}

export interface AdvancedSetupOptions extends SetupOptions {
    type: "advanced";
    board: BoardType;
    draftableFactions: PlayerFactionType[];
    usingHirelings: boolean;
    landmarksToUse: number;
}