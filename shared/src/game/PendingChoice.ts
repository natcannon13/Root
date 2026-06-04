export type ChoiceType = string;

export type ChoiceValueMap = Record<ChoiceType, any>;

type ChoiceBase<
  T extends ChoiceType,
> = {
  id: string; // Composed of turn number + sequence number for matching when initializing a mid-turn state
  type: T;
  playerID: number;
}

export type Choice<T extends ChoiceType = ChoiceType> = 
(ChoiceBase<T> & {
  resolved: true;
  value: ChoiceValueMap[T];
}) | 
(ChoiceBase<T> & {
  resolved: false;
});
