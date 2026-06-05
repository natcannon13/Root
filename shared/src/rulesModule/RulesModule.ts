import type { Event } from "../game/Event";
import type { PlayerID, RootGame } from "../game/RootGame";
import type { RulesChange } from "./RulesChange";

export interface RulesModule {
    staticRulesChanges: RulesChange[];
    setup: (game: RootGame, playerID: PlayerID) => Promise<void>;
    globalEvents: (game: RootGame) => Event[];
}
