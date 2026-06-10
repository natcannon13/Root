import type { FactionType } from "../Enums";

export interface FactionUpdate {
        faction: FactionType;
        updateType: string;
        value: any;
}

