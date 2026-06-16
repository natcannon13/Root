import type { PlayerFactionType } from "../Enums";

export type CardLocationType =
    | "deck"
    | "discard"
    | "dominance"
    | "hand"
    | "crafted"
    | "revealed"
    | "pile"
    | "nowhere"; // "nowhere" is used for cards that are being created or removed from the game, where there isn't a meaningful location to specify.
export type PlayerCardLocationType = Extract<CardLocationType, "hand" | "crafted" | "revealed" | "pile">;

export type CardPileLocation = {
    [K in CardLocationType]: { name: K } & (K extends PlayerCardLocationType
        ? { faction: PlayerFactionType }
        : {}) &
        (K extends "pile" ? { pileID: string } : {});
}[CardLocationType];
