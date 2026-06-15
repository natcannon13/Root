import type { PlayerID } from "./RootGame";

export type ChoiceType = "pick" | "pickX" | "yesno" | "pickOrder" | "pickRange";

export type ChoiceID = string; // Composed of a concatenated version of timeStep + sequence number for matching when initializing a mid-turn state

export const RAND_ORDER_DESC = Object.freeze({
    SEATING_ORDER: "seating-order",
    SHUFFLE: "shuffle",
} as const);

export const RAND_NUMBER_DESC = Object.freeze({
    ROLL: "roll",
} as const);

export const RAND_PICK_DESC = Object.freeze({
    FACTION: "faction",
    HIRELING: "hireling",
    LANDMARK: "landmark",
    CARD: "card",
} as const);

export const RAND_PICKX_DESC = Object.freeze({
    HIRELINGS: "hirelings",
    LANDMARKS: "landmarks",
    FACTIONS: "factions",
    CARDS: "cards",
} as const);

export type ChoiceOptionsMap = {
    pick: { options: string[] };
    pickX: { options: string[]; count: number };
    yesno: { question: string };
    pickRange: { description: string; min: number; max: number };
    pickOrder: { description: string; options: any[] };
};
export type ChoiceValueMap = {
    pick: string; // The specific option picked.
    pickX: string[]; // An array of the specific options picked.
    yesno: boolean; // true for "yes", false for "no".
    pickRange: number; // A number generated within the specified range (inclusive).
    pickOrder: number[]; // An array representing the new order of items.
};

type ChoiceBase<T extends ChoiceType> = {
    readonly id: ChoiceID;
    readonly type: T;
    readonly playerID: PlayerID | null; // null indicates rng events decided by the game
};

export type Choice<T extends ChoiceType = ChoiceType> = T extends ChoiceType
    ?
          | (ChoiceBase<T> & {
                readonly resolved: true;
                readonly options: ChoiceOptionsMap[T];
                readonly value: ChoiceValueMap[T];
            })
          | (ChoiceBase<T> & {
                readonly resolved: false;
                readonly options: ChoiceOptionsMap[T];
            })
    : never;

export type PendingChoice<T extends ChoiceType = ChoiceType> = Extract<
    Choice<T>,
    { readonly resolved: false }
>;
export type ResolvedChoice<T extends ChoiceType = ChoiceType> = Extract<
    Choice<T>,
    { readonly resolved: true }
>;
