import type { PlayerID } from "./RootGame";

export type ChoiceType = string; // TODO: expand to literal union

export type ChoiceID = string; // Composed of turn number + sequence number for matching when initializing a mid-turn state

export type ChoiceValueMap = Record<ChoiceType, any>;

export type ChoiceOptionsMap = Record<ChoiceType, any>; 

type ChoiceBase<T extends ChoiceType> = {
    readonly id: ChoiceID;
    readonly type: T;
    readonly playerID: PlayerID | null; // null indicates rng events decided by the game
};

export type Choice<T extends ChoiceType = ChoiceType> =
    | (ChoiceBase<T> & {
          readonly resolved: true;
          readonly value: ChoiceValueMap[T];
      })
    | (ChoiceBase<T> & {
          readonly resolved: false;
          readonly options: ChoiceOptionsMap[T];
      });
