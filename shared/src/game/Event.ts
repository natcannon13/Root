import type { RootGameState } from "../gameState/RootGameState";

export interface Event<G = RootGameState> {
  label: string;
  triggerCondition?: (g: G) => boolean;
  execute?: (g: G) => void;
  isAction?: boolean;
}
