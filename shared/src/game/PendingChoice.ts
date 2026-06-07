import type { PlayerID } from "./RootGame";

export type ChoiceType = string;

export type ChoiceID = string; // Composed of turn number + sequence number for matching when initializing a mid-turn state

export type ChoiceValueMap = Record<ChoiceType, any>;

type ChoiceBase<T extends ChoiceType> = {
    id: ChoiceID;
    type: T;
    playerID: PlayerID;
};

export type Choice<T extends ChoiceType = ChoiceType> =
    | (ChoiceBase<T> & {
          resolved: true;
          value: ChoiceValueMap[T];
      })
    | (ChoiceBase<T> & {
          resolved: false;
      });
