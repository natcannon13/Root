import type { LocationID } from "../board/Location";
import type { FactionType } from "../Enums";

export interface Battle {
    readonly attackerID: FactionType;
    readonly defenderID: FactionType;
    readonly clearingID: LocationID;
}
