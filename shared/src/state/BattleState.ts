import type { BattlePhaseType } from "../Enums";
import type { Battle } from "../gameActions/Battle";

export class BattleState {
    public readonly battle: Battle;
    public readonly pendingAttackerHits: number;
    public readonly pendingDefenderHits: number;
    public readonly battleSegment: BattlePhaseType;
    constructor(
        battle: Battle,
        battleSegment: BattlePhaseType = "ambush",
        pendingAttackerHits: number = 0,
        pendingDefenderHits: number = 0,
    ) {
        this.battle = battle;
        this.battleSegment = battleSegment;
        this.pendingAttackerHits = pendingAttackerHits;
        this.pendingDefenderHits = pendingDefenderHits;
    }
}
