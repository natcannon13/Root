import type { PlayerFactionType, PhaseType, BattlePhaseType } from "../Enums";

export class TimeStep {
  currentTurn: PlayerFactionType;
  phase: PhaseType;
  phaseSegment: "start" | "main" | "end";
  battleSegment?: BattlePhaseType;
  activePlayer: PlayerFactionType;

  constructor(
    currentTurn: PlayerFactionType,
    phase: PhaseType,
    phaseSegment: "start" | "main" | "end",
    activePlayer: PlayerFactionType,
    battleSegment?: BattlePhaseType,
  ) {
    this.currentTurn = currentTurn;
    this.phase = phase;
    this.phaseSegment = phaseSegment;
    this.activePlayer = activePlayer;
    this.battleSegment = battleSegment;
  }
}
