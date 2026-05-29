
import { describe, test, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { Supply } from "../../src/pieces/Supply";
import type { Piece } from "../../src/pieces/Piece";

describe("Supply", () => {
	test("initializes with given pieces and returns available pieces", () => {
		const p1 = mock<Piece>({ id: 1, name: "wood", owningFaction: null });
		const p2 = mock<Piece>({ id: 2, name: "stone", owningFaction: null });
		const supply = new Supply([p1, p2]);
		expect(supply.getAvailablePieces()).toEqual([p1, p2]);
	});

	test("addPiece adds to supply", () => {
		const p1 = mock<Piece>({ id: 1, name: "wood", owningFaction: null });
		const supply = new Supply([]);
		supply.addPiece(p1);
		expect(supply.getAvailablePieces()).toContain(p1);
	});

	test("hasPiece works with predicate", () => {
		const p1 = mock<Piece>({ id: 1, name: "wood", owningFaction: null });
		const supply = new Supply([p1]);
		expect(supply.hasPiece((p) => p.id === 1)).toBe(true);
		expect(supply.hasPiece((p) => p.id === 999)).toBe(false);
	});

	test("removePiece removes by reference only", () => {
		const p1 = mock<Piece>({ id: 1, name: "wood", owningFaction: null });
		const p2 = mock<Piece>({ id: 2, name: "stone", owningFaction: null });
		const supply = new Supply([p1, p2]);
		// removing a new object with same id should not remove (indexOf by reference)
		const sameId = { id: 1, name: "wood", owningFaction: null } as Piece;
		supply.removePiece(sameId);
		expect(supply.getAvailablePieces()).toContain(p1);
		// remove actual reference
		supply.removePiece(p1);
		expect(supply.getAvailablePieces()).not.toContain(p1);
	});

	test("getPieceById and removePieceById by id", () => {
		const p1 = mock<Piece>({ id: 1, name: "wood", owningFaction: null });
		const p2 = mock<Piece>({ id: 2, name: "stone", owningFaction: null });
		const supply = new Supply([p1, p2]);
		expect(supply.getPieceById(2)).toBe(p2);
		supply.removePieceById(2);
		expect(supply.getAvailablePieces()).not.toContain(p2);
		expect(supply.getPieceById(999)).toBeUndefined();
	});
});
