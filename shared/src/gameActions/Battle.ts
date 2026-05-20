import type { PlayerFactionType } from '../Enums';

export interface Battle {
    attacker: PlayerFactionType;
    defender: PlayerFactionType;
    clearingID: number;
}
