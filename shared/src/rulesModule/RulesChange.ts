import type { RootGame } from "../game/RootGame";

export type ExtensionPointType = string;

type RulesChangeCallbackMap = {
    [extensionName: ExtensionPointType]: (game: RootGame, ...args: any[]) => void;
};

export interface RulesChange<T extends ExtensionPointType = ExtensionPointType> {
    extensionName: T;
    callback: RulesChangeCallbackMap[T];
}
