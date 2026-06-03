import type { RulesChange } from "./RulesChange";
import type { RootGame } from "../game/RootGame";
import type { Event } from "../game/Event";

export interface RulesModule {
  staticRulesChanges: RulesChange[];
  setup: (game: RootGame, playerID: number) => Promise<void>;
  globalEvents: (game: RootGame) => Event[];
}
