export type GameUpdateType = string;

type GameUpdateValueMap = Record<GameUpdateType, any>;

export interface RootGameUpdate<T extends GameUpdateType = GameUpdateType> {
    id: string; // Composed of turn number + sequence number for matching when initializing a mid-turn state
    type: T;
    options: GameUpdateValueMap[T];
}