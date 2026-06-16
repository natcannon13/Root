import type { Event } from "../game/Event";
import type { PlayerID, RootGame } from "../game/RootGame";
import type { RulesChange } from "./RulesChange";

export interface RulesModule {
    readonly staticRulesChanges: RulesChange[];
    readonly setup: (game: RootGame, playerID: PlayerID) => Promise<void>;
    readonly globalEvents: (game: RootGame) => Event[];
}
