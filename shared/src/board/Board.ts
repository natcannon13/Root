import type { BoardType } from "../Enums";
import type { Clearing } from "./Clearing";
import type { Forest } from "./Forest";
import type { Connection } from "./Connection";
import type { Item } from "../Item";
import type { Location } from "./Location";
import type { Piece } from "../pieceInterfaces/Piece";

export class Board {
  name: BoardType;
  clearings: Clearing[];
  forests: Forest[];
  connections: Connection[];
  items: Item[];

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
    // TODO: Implement
    return [];
  }

  getClearingsAdjacentByRiver(location: Location): Clearing[] {
    // TODO: Implement
    return [];
  }

  getForestsAdjacent(location: Location): Forest[] {
    // TODO: Implement
    return [];
  }

  getLocation(id: number): Location | undefined {
    // TODO: Implement
    return undefined;
  }

  move(
    pieces: Piece[],
    startingLocationID: number,
    endingLocationID: number,
  ): void {
    // TODO: Implement
  }

  place(pieces: Piece[], locationID: number): void {
    // TODO: Implement
  }

  remove(pieces: Piece[], locationID: number): void {
    // TODO: Implement
  }
}
