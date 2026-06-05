import type { LandmarkType } from "../Enums";
import type { Piece } from "../pieces/Piece";
import type { RulesModule } from "./RulesModule";

export type LandmarkID = number;

export interface Landmark extends RulesModule {
    id: LandmarkID;
    name: LandmarkType;
    piece: Piece;
}
