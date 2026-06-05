import type { PhaseType, PlayerFactionType } from "../Enums";

export class TimeStep {
    currentTurn: PlayerFactionType | "none";
    phase: PhaseType;
    phaseSegment: "start" | "main" | "end";

    constructor(
        currentTurn: PlayerFactionType | "none" = "none",
        phase: PhaseType = "none",
        phaseSegment: "start" | "main" | "end" = "start",
    ) {
        this.currentTurn = currentTurn;
        this.phase = phase;
        this.phaseSegment = phaseSegment;
    }
}
