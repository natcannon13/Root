import type { CardPileLocation } from "../cards/CardPileLocation";

export type RNGEventID = string;

type RNGEventType = "roll" | "shuffle";

interface RNGEventBase {
    id: RNGEventID;
    seed: string;
    type: RNGEventType;
}

interface Roll extends RNGEventBase {
    type: "roll";
    low: number;
    high: number;
    result: number;
}

interface Shuffle extends RNGEventBase {
    type: "shuffle";
    pile: CardPileLocation;
}

export type RNGEvent = Roll | Shuffle;