import type { BattlePhaseType } from "../Enums";
import type { Battle } from "../gameActions/Battle";

export class BattleState {
    public battle: Battle;
    public pendingAttackerHits: number = 0;
    public pendingDefenderHits: number = 0;
    public battleSegment: BattlePhaseType | null;
    constructor(battle: Battle, battleSegment: BattlePhaseType | null = null) {
        this.battle = battle;
        this.battleSegment = battleSegment;
    }
}
