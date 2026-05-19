import { Board } from "../board/Board";
import type { RootGameState } from "../state/RootGameState";
import { TimeStep } from "../state/TimeStep";
import type { Card } from "../cards/Card";
import type { Piece } from "../pieceInterfaces/Piece";
import type { PlayerFactionType } from "../Enums";
import type { RootGameAgent } from "../agents/RootGameAgent";
import type { Move } from "../gameActions/Move";
import type { Battle } from "../gameActions/Battle";
import type { Faction } from "../rulesModule/Faction";
import type { Hireling } from "../rulesModule/Hireling";
import type { Landmark } from "../rulesModule/Landmark";
import type { PlayOptions } from "./PlayOptions";
import type { SetupType } from "../Enums";
import type { Event } from "./Event";

// Minimal RootGame stub. Methods throw or are no-ops so other modules/tests can import the class.
export class RootGame {
  board: Board | null = null;
  factions: Faction[] = [];
  hirelings: Hireling[] = [];
  landmarks: Landmark[] = [];
  currentTimeStep: TimeStep | null = null;
  version = "0.0.0";
  winner: PlayerFactionType | null = null;
  gameOver = false;
  deck: Card[] = [];
  discardPile: Card[] = [];
  spentCraftingPieces: Piece[] = [];

  constructor(initialState?: RootGameState) {
    if (initialState) {
      this.version = initialState.version;
    }
  }

  play(options: PlayOptions, agents: RootGameAgent[]) {
    throw new Error("RootGame.play not implemented");
  }

  setup(type: SetupType) {
    throw new Error("RootGame.setup not implemented");
  }

  isMoveLegal(move: Move): boolean {
    throw new Error("RootGame.isMoveLegal not implemented");
  }

  isBattleLegal(battle: Battle): boolean {
    throw new Error("RootGame.isBattleLegal not implemented");
  }

  isPlaceLegal(pieces: Piece[], locationID: number): boolean {
    throw new Error("RootGame.isPlaceLegal not implemented");
  }

  isCraftLegal(faction: PlayerFactionType, card: Card, craftingPieces: Piece[]): boolean {
    throw new Error("RootGame.isCraftLegal not implemented");
  }

  move(move: Move) {
    throw new Error("RootGame.move not implemented");
  }

  battle(battle: Battle) {
    throw new Error("RootGame.battle not implemented");
  }

  place(pieces: Piece[], locationID: number) {
    throw new Error("RootGame.place not implemented");
  }

  craft(faction: PlayerFactionType, card: Card, craftingPieces: Piece[]) {
    throw new Error("RootGame.craft not implemented");
  }

  getGlobalEvents(): Event[] {
    return [];
  }

  getState(perspective: PlayerFactionType | null): RootGameState | null {
    return null;
  }

  updateState(state: RootGameState) {
    throw new Error("RootGame.updateState not implemented");
  }
}
