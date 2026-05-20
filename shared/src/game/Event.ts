import type { RootGameState } from "../state/RootGameState";

export interface Event<G = RootGameState> {
  label: string;
  triggerCondition?: (g: G) => boolean;
  execute?: (g: G) => void;
  isAction?: boolean;
}
