export type GameUpdateType = string;

type GameUpdateValueMap = Record<GameUpdateType, any>;

export interface RootGameUpdate<T extends GameUpdateType = GameUpdateType> {
    type: T;
    options: GameUpdateValueMap[T];
}