import type { PlayerFactionType, PhaseType, BattlePhaseType } from "../Enums";

export class TimeStep {
    currentTurn: PlayerFactionType | "none";
    phase: PhaseType;
    phaseSegment: "start" | "main" | "end";
    battleSegment: BattlePhaseType | null;
    activePlayer: PlayerFactionType | "none";

    constructor(
        currentTurn: PlayerFactionType | "none" = "none",
        phase: PhaseType = "none",
        phaseSegment: "start" | "main" | "end" = "start",
        activePlayer: PlayerFactionType | "none" = "none",
        battleSegment: BattlePhaseType | null = null,
    ) {
        this.currentTurn = currentTurn;
        this.phase = phase;
        this.phaseSegment = phaseSegment;
        this.activePlayer = activePlayer;
        this.battleSegment = battleSegment;
    }

}
