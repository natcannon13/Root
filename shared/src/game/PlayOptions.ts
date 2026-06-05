import type { PlayerID } from "./RootGame";
import type { AdvancedSetupOptions, StandardSetupOptions } from "./SetupOptions";

export interface PlayOptions {
    setup: AdvancedSetupOptions | StandardSetupOptions;
    playerIDs: PlayerID[];
}
