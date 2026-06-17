import type { LocationID } from "../board/Location";
import type { FactionType } from "../Enums";

export interface Battle {
    readonly attacker: FactionType;
    readonly defender: FactionType;
    readonly clearingID: LocationID;
}
