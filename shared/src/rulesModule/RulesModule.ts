import type { RulesChange } from "./RulesChange";
import type { PlayerID, RootGame } from "../game/RootGame";
import type { Event } from "../game/Event";

export interface RulesModule {
  staticRulesChanges: RulesChange[];
  setup: (game: RootGame, playerID: PlayerID) => Promise<void>;
  globalEvents: (game: RootGame) => Event[];
}
