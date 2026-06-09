import type { RootGameUpdate } from "../game/RootGameUpdate";
import type { UpdateFunction } from "../stateStore/StateStore";
import type { RootGameState } from "./RootGameState";

export const stateUpdate: UpdateFunction<RootGameState, RootGameUpdate> = (state, transition) => {
    throw new Error("stateUpdate function not implemented in stub");
};
