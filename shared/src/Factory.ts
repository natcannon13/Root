import type { Board } from "./board/Board";
import type { Card } from "./cards/Card";
import type { BoardType, DeckType, HirelingFactionType, LandmarkType, PlayerFactionType } from "./Enums";
import type { Hireling } from "./rulesModule/Hireling";
import type { Landmark } from "./rulesModule/Landmark";
import type { PlayerFaction } from "./rulesModule/PlayerFaction";

export function generateFactionFromType(factionType: PlayerFactionType): PlayerFaction { 
    throw new Error(`generateFactionFromType not implemented`);
}

export function generateHirelingFromType(hirelingType: HirelingFactionType): Hireling {
    throw new Error(`generateHirelingFromType not implemented`);
}

export function generateLandmarkFromType(landmarkType: LandmarkType): Landmark {
    throw new Error(`generateLandmarkFromType not implemented`);
}

export function generateBoardFromType(boardType: BoardType): Board {
    throw new Error(`generateBoardFromType not implemented`);
}

export function generateDeckFromType(deckType: DeckType): Card[] {
    throw new Error(`generateDeckFromType not implemented`);
}