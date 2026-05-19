import { describe, test, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { Board } from "../../src/board/Board";
import type { Clearing } from "../../src/board/Clearing";
import type { Forest } from "../../src/board/Forest";
import type { Connection } from "../../src/board/Connection";
import type { Pawn } from "../../src/pieces/Pawn";
import type { Token } from "../../src/pieces/Token";

describe("Board — adjacency via paths (§2.2.1)", () => {
  test("getClearingsAdjacent returns clearings linked by a path", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const c3 = mock<Clearing>({ id: 3 });
    const conn12 = mock<Connection>({
      id: 12,
      locationIDs: [1, 2],
      type: "path",
    });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2, c3],
      forests: [],
      connections: [conn12],
    });
    const adj = board.getClearingsAdjacent(c1);
    expect(adj).toContain(c2);
    expect(adj).not.toContain(c3);
  });

  test("getClearingsAdjacent is symmetric", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "path" }),
      ],
    });
    expect(board.getClearingsAdjacent(c1)).toContain(c2);
    expect(board.getClearingsAdjacent(c2)).toContain(c1);
  });

  test("getClearingsAdjacent does NOT return the clearing itself", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "path" }),
      ],
    });
    expect(board.getClearingsAdjacent(c1)).not.toContain(c1);
  });

  test("getClearingsAdjacent returns empty when no paths exist", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [],
    });
    expect(board.getClearingsAdjacent(c1)).toHaveLength(0);
  });

  test("getClearingsAdjacent throws for unknown location", () => {
    const board = new Board({
      name: "autumn",
      clearings: [],
      forests: [],
      connections: [],
    });
    expect(() => board.getClearingsAdjacent(mock<Clearing>({ id: 999 }))).toThrow();
  });

  test("getClearingsAdjacent does NOT return clearings linked by a river", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "river" }),
      ],
    });
    expect(board.getClearingsAdjacent(c1)).not.toContain(c2);
  });
});

describe("Board — river adjacency (§2.3)", () => {
  test("getClearingsAdjacentByRiver returns clearings linked by a river", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "river" }),
      ],
    });
    expect(board.getClearingsAdjacentByRiver(c1)).toContain(c2);
  });

  test("getClearingsAdjacentByRiver does NOT return path-only neighbours", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const c3 = mock<Clearing>({ id: 3 });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2, c3],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "path" }),
        mock<Connection>({ id: 13, locationIDs: [1, 3], type: "river" }),
      ],
    });
    expect(board.getClearingsAdjacentByRiver(c1)).not.toContain(c2);
    expect(board.getClearingsAdjacentByRiver(c1)).toContain(c3);
  });
});

describe("Board — forest adjacency (§2.4)", () => {
  test("getForestsAdjacent returns forests adjacent to a clearing", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const f1 = mock<Forest>({ id: 10 });
    const board = new Board({
      name: "autumn",
      clearings: [c1],
      forests: [f1],
      connections: [
        mock<Connection>({
          id: 110,
          locationIDs: [1, 10],
          type: "forest-adjacency",
        }),
      ],
    });
    expect(board.getForestsAdjacent(c1)).toContain(f1);
  });

  test("getForestsAdjacent does NOT return non-adjacent forests", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const f1 = mock<Forest>({ id: 10 });
    const board = new Board({
      name: "autumn",
      clearings: [c1],
      forests: [f1],
      connections: [],
    });
    expect(board.getForestsAdjacent(c1)).not.toContain(f1);
  });

  test("getForestsAdjacent throws for unknown location", () => {
    const board = new Board({
      name: "autumn",
      clearings: [],
      forests: [],
      connections: [],
    });
    expect(() => board.getForestsAdjacent(mock<Clearing>({ id: 999 }))).toThrow();
  });

  test("getForestsAdjacent returns forests adjacent to a forest", () => {
    const f1 = mock<Forest>({ id: 10 });
    const f2 = mock<Forest>({ id: 11 });
    const board = new Board({
      name: "autumn",
      clearings: [],
      forests: [f1, f2],
      connections: [
        mock<Connection>({
          id: 110,
          locationIDs: [10, 11],
          type: "forest-adjacency",
        }),
      ],
    });
    expect(board.getForestsAdjacent(f1)).toContain(f2);
  });
});

describe("Board — getLocation", () => {
  test("getLocation returns the clearing with the given id", () => {
    const c1 = mock<Clearing>({ id: 5 });
    const board = new Board({
      name: "autumn",
      clearings: [c1],
      forests: [],
      connections: [],
    });
    expect(board.getLocation(5)).toBe(c1);
  });

  test("getLocation throws for unknown id", () => {
    const board = new Board({
      name: "autumn",
      clearings: [],
      forests: [],
      connections: [],
    });
    expect(() => board.getLocation(999)).toThrow();
  });
});

describe("Board — move", () => {
  test("move removes pieces from the origin clearing and places them in the destination clearing", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const w = mock<Pawn>({
      id: 1,
      name: "warrior",
      owningFaction: "marquise-de-cat",
      isWarrior: true,
    });
    c1.addPieces([w]);
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "path" }),
      ],
    });
    board.move([w], 1, 2);
    expect(c1.removePieces).toHaveBeenCalledWith([w]);
    expect(c2.addPieces).toHaveBeenCalledWith([w]);
  });

  test("move throws when origin does not contain the pieces", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const c2 = mock<Clearing>({ id: 2 });
    const w = mock<Pawn>({
      id: 1,
      name: "warrior",
      owningFaction: "marquise-de-cat",
      isWarrior: true,
    });
    const board = new Board({
      name: "autumn",
      clearings: [c1, c2],
      forests: [],
      connections: [
        mock<Connection>({ id: 12, locationIDs: [1, 2], type: "path" }),
      ],
    });
    expect(() => board.move([w], 1, 2)).toThrow();
  });
});

describe("Board — place", () => {
  test("place puts pieces into a clearing", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const t = mock<Token>({
      id: 1,
      name: "sympathy",
      owningFaction: "woodland-alliance",
      faceUp: true,
    });
    const board = new Board({
      name: "autumn",
      clearings: [c1],
      forests: [],
      connections: [],
    });
    board.place([t], 1);
    expect(c1.addPieces).toHaveBeenCalledWith([t]);
  });
});

describe("Board — remove", () => {
  test("remove takes pieces out of a clearing", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const t = mock<Token>({
      id: 1,
      name: "sympathy",
      owningFaction: "woodland-alliance",
      faceUp: true,
    });
    c1.addPieces([t]);
    const board = new Board({
      name: "autumn",
      clearings: [c1],
      forests: [],
      connections: [],
    });
    board.remove([t], 1);
    expect(c1.removePieces).toHaveBeenCalledWith([t]);
  });

  test("remove throws when clearing does not contain the pieces", () => {
    const c1 = mock<Clearing>({ id: 1 });
    const t = mock<Token>({
      id: 1,
      name: "sympathy",
      owningFaction: "woodland-alliance",
      faceUp: true,
    });
    const board = new Board({
      name: "autumn",
      clearings: [c1],
      forests: [],
      connections: [],
    });
    expect(() => board.remove([t], 1)).toThrow();
  });
});
