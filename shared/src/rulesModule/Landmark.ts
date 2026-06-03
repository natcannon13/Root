import type { LandmarkType } from "../Enums";
import type { Piece } from "../pieces/Piece";
import type { RulesModule } from "./RulesModule";

export interface Landmark extends RulesModule {
  id: number;
  name: LandmarkType;
  piece: Piece;
}
