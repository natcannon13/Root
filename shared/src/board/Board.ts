import type { BoardType, PlayerFactionType } from "../Enums";
import type { Clearing } from "./Clearing";
import type { Forest } from "./Forest";
import type { Connection } from "./Connection";
import type { Item } from "../Item";
import type { Location } from "./Location";
import type { Piece } from "../pieces/Piece";
import type { RulesModule } from "../rulesModule/RulesModule";
import type { Event } from "../game/Event";
import type { RulesChange } from "../rulesModule/RulesChange";
import type { RootBoardState } from "../state/RootBoardState";

export class Board implements RulesModule {
  name: BoardType;
  clearings: Clearing[];
  forests: Forest[];
  connections: Connection[];
  items: Item[];
  staticRulesChanges: RulesChange[] = [];

  setup(): void {
    // optional: rules module setup hook
  }

  globalEvents(): Event[] {
    return [];
  }

  constructor({
    name,
    clearings,
    forests,
    connections,
  }: {
    name: BoardType;
    clearings: Clearing[];
    forests: Forest[];
    connections: Connection[];
  }) {
    this.name = name;
    this.clearings = clearings;
    this.forests = forests;
    this.connections = connections;
    this.items = [];
  }

  getClearingsAdjacent(location: Location): Clearing[] {
    throw new Error("Board.getClearingsAdjacent not implemented");
  }

  getClearingsAdjacentByRiver(location: Location): Clearing[] {
    throw new Error("Board.getClearingsAdjacentByRiver not implemented");
  }

  getForestsAdjacent(location: Location): Forest[] {
    throw new Error("Board.getForestsAdjacent not implemented");
  }

  getLocation(id: number): Location | undefined {
    throw new Error("Board.getLocation not implemented");
  }

  getCorners(): [Clearing, Clearing][] {
    throw new Error("Board.getCorners not implemented");
  }

  move(
    pieces: Piece[],
    startingLocationID: number,
    endingLocationID: number,
  ): void {
    throw new Error("Board.move not implemented");
  }

  place(pieces: Piece[], locationID: number): void {
    throw new Error("Board.place not implemented");
  }

  remove(pieces: Piece[], locationID: number): void {
    throw new Error("Board.remove not implemented");
  }

  getState(perspective?: PlayerFactionType): RootBoardState {
    throw new Error("Board.getState not implemented");
  }
}
