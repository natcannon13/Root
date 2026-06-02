export type PendingChoiceType = string;

type PendingChoiceValueMap = Record<string, any>;

type PendingChoiceBase<
  T extends PendingChoiceType,
> = {
  id: number;
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
