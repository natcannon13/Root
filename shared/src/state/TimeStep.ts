import type { PlayerFactionType, PhaseType } from "../Enums";

export class TimeStep {
    currentTurn: PlayerFactionType | "none";
    phase: PhaseType;
    phaseSegment: "start" | "main" | "end";
    activePlayer: PlayerFactionType | "none";

    constructor(
        currentTurn: PlayerFactionType | "none" = "none",
        phase: PhaseType = "none",
        phaseSegment: "start" | "main" | "end" = "start",
        activePlayer: PlayerFactionType | "none" = "none"
    ) {
        this.currentTurn = currentTurn;
        this.phase = phase;
        this.phaseSegment = phaseSegment;
        this.activePlayer = activePlayer;
    }

}
