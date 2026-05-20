import type { PlayerFactionType } from "../Enums";
export type PendingActionType = string;

type PendingActionCallbackMap = Record<string, (...args: any[]) => any>;

export interface PendingAction<
  T extends PendingActionType = PendingActionType,
> {
  id?: number;
  type: T;
  actor: PlayerFactionType;
  resolve?: PendingActionCallbackMap[T];
}
