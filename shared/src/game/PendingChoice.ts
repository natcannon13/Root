export type PendingChoiceType = string;

export type PendingChoiceValueMap = Record<PendingChoiceType, any>;

type PendingChoiceBase<
  T extends PendingChoiceType,
> = {
  id: string; // Composed of turn number + sequence number for matching when initializing a mid-turn state
  type: T;
  playerID: number;
}

export type PendingChoice<T extends PendingChoiceType = PendingChoiceType> = 
(PendingChoiceBase<T> & {
  resolved: true;
  value: PendingChoiceValueMap[T];
}) | 
(PendingChoiceBase<T> & {
  resolved: false;
});
