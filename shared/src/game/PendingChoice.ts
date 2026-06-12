import type { PlayerID } from "./RootGame";

type RandomEventType = "rand_number" | "rand_order";

export type ChoiceType = "pick" | "pickX" | "yesno" | RandomEventType;

export type ChoiceID = string; // Composed of a concatenated version of timeStep + sequence number for matching when initializing a mid-turn state

export type ChoiceOptionsMap = {
    pick: { options: string[] };
    pickX: { options: string[]; count: number };
    yesno: { question: string };
    rand_number: { min: number; max: number };
    rand_order: { count: number };
};
export type ChoiceValueMap = {
    pick: string; // The specific option picked.
    pickX: string[]; // An array of the specific options picked.
    yesno: boolean; // true for "yes", false for "no".
    rand_number: number; // A number generated within the specified range.
    rand_order: number[]; // An array representing the new order of items.
};

type ChoiceBase<T extends ChoiceType> = {
    readonly id: ChoiceID;
    readonly type: T;
    readonly playerID: T extends RandomEventType ? null : PlayerID; // null indicates rng events decided by the game
};

export type Choice<T extends ChoiceType = ChoiceType> =
    | (ChoiceBase<T> & {
          readonly resolved: true;
          readonly options: ChoiceOptionsMap[T];
          readonly value: ChoiceValueMap[T];
      })
    | (ChoiceBase<T> & {
          readonly resolved: false;
          readonly options: ChoiceOptionsMap[T];
      });
