import { describe, expect, test } from "vitest";
import { mock } from "vitest-mock-extended";
import { Location } from "../../src/board/Location";
import { Building } from "../../src/pieces/Building";
import { Pawn } from "../../src/pieces/Pawn";
import { Token } from "../../src/pieces/Token";

class TestLocation extends Location {}

describe("Location - pieces (§1.5, §G.20, §G.24)", () => {
    test("addPieces() adds tokens", () => {
        const c = new TestLocation();
        const t = mock<Token>();
        c.addPieces([t]);
        expect(c.getPieces()).toContain(t);
    });

    test("addPieces() adds pawns", () => {
        const c = new TestLocation();
        const p = mock<Pawn>();
        c.addPieces([p]);
        expect(c.getPieces()).toContain(p);
    });

    test("removePieces() removes the specified pieces", () => {
        const c = new TestLocation();
        const t = mock<Token>();
        c.addPieces([t]);
        c.removePieces([t]);
        expect(c.getPieces()).not.toContain(t);
    });

    test("removePieces() does not remove pieces not specified", () => {
        const c = new TestLocation();
        const t1 = mock<Token>();
        const t2 = mock<Token>();
        c.addPieces([t1, t2]);
        c.removePieces([t1]);
        expect(c.getPieces()).toContain(t2);
    });

    test("hasPieces() returns true when pieces are present", () => {
        const c = new TestLocation();
        const t1 = mock<Token>();
        const t2 = mock<Pawn>();
        c.addPieces([t1, t2]);
        expect(c.hasPieces([t1, t2])).toBe(true);
    });

    test("hasPieces() returns false when pieces are absent", () => {
        const c = new TestLocation();
        const t = mock<Token>();
        expect(c.hasPieces([t])).toBe(false);
    });

    test("hasPieces() returns false when only some pieces are present", () => {
        const c = new TestLocation();
        const t1 = mock<Token>();
        const t2 = mock<Token>();
        c.addPieces([t1]);
        expect(c.hasPieces([t1, t2])).toBe(false);
    });

    test("getPieces() filters by predicate", () => {
        const c = new TestLocation();
        const w = mock<Pawn>({
            id: 1,
            name: "warrior",
            owningFaction: "marquise-de-cat",
            isWarrior: true,
        });
        const p = mock<Pawn>({
            id: 2,
            name: "pawn",
            owningFaction: "vagabond",
            isWarrior: false,
        });
        c.addPieces([w, p]);
        const warriors = c.getPieces((piece) => (piece as any).isWarrior === true);
        expect(warriors).toContain(w);
        expect(warriors).not.toContain(p);
    });

    test("replace() swaps a target piece with a new piece", () => {
        const c = new TestLocation();
        const old = mock<Token>({ id: 1 });
        const fresh = mock<Building>({ id: 2 });
        c.addPieces([old]);
        c.replace(old, fresh);
        expect(c.getPieces()).toContain(fresh);
        expect(c.getPieces()).not.toContain(old);
    });
});
