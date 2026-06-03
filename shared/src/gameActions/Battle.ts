import type { FactionType } from '../Enums';

export interface Battle {
    attackerID: FactionType;
    defenderID: FactionType;
    clearingID: number;
}
