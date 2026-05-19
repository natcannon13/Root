import type { PlayerFactionType, PhaseType } from '../Enums';

export class TimeStep {
    currentTurn: PlayerFactionType;
    phase: PhaseType;
    phaseSegment: 'start' | 'main' | 'end';
    battleSegment?: string;
    activePlayer: PlayerFactionType;

    constructor() {
        // TODO: Initialize with appropriate defaults
    }
}
