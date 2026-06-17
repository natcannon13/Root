import { describe, expect, test } from "vitest";
import { mock } from "vitest-mock-extended";
import { Clearing } from "../../src/board/Clearing";
import type { Building } from "../../src/pieces/Building";
import type { Pawn } from "../../src/pieces/Pawn";
import { Ruin } from "../../src/pieces/Ruin";
import type { Token } from "../../src/pieces/Token";

describe("Clearing - suit", () => {
    test("stores the printed suit", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        expect(c.printedSuit).toBe("fox");
    });

    test("matches(suit) returns true when the clearing suit matches", () => {
        const c = new Clearing({ id: 1, printedSuit: "rabbit", slotCount: 2 });
        expect(c.matches("rabbit")).toBe(true);
    });

    test("matches(suit) returns false for a different suit", () => {
        const c = new Clearing({ id: 1, printedSuit: "mouse", slotCount: 2 });
        expect(c.matches("fox")).toBe(false);
    });

    test("printedSuit null is valid", () => {
        // Clearings with no printed suit (e.g. Burrow) have null
        const c = new Clearing({ id: 1, printedSuit: null, slotCount: 0 });
        expect(c.printedSuit).toBeNull();
    });
});

describe("Clearing - building slots (§2.2.3)", () => {
    test("openSlots() returns all indices when no buildings placed", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        expect(c.openSlots()).toEqual(3);
    });

    test("building reduces open slots", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        const b = mock<Building>();
        c.addPieces([b]);
        expect(c.openSlots()).toEqual(2);
    });

    test("build() throws when there are no open slots", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        c.addPieces([mock<Building>(), mock<Building>()]);
        expect(() => c.addPieces([mock<Building>()])).toThrow();
    });

    test("ruins occupy slots (§2.2.4)", () => {
        const ruin = mock<Ruin>();
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        c.addPieces([ruin]);
        expect(c.openSlots()).toEqual(1);
    });

    test("openSlots() returns 0 when all slots are occupied", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 1 });
        c.addPieces([mock<Building>()]);
        expect(c.openSlots()).toEqual(0);
    });
});

describe("Clearing - rule (§2.5, §G.28)", () => {
    test("getRuler() returns the faction with the most warriors", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        c.addPieces([
            mock<Pawn>({
                id: 1,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 2,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
        ]);
        c.addPieces([
            mock<Pawn>({
                id: 3,
                name: "warrior",
                owningFaction: "woodland-alliance",
                isWarrior: true,
            }),
        ]);
        expect(c.getRuler()).toBe("marquise-de-cat");
    });

    test("getRuler() returns null on a tie (§2.5)", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        c.addPieces([
            mock<Pawn>({
                id: 1,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 2,
                name: "warrior",
                owningFaction: "woodland-alliance",
                isWarrior: true,
            }),
        ]);
        expect(c.getRuler()).toBeNull();
    });

    test("getRuler() returns null when the clearing is empty", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        expect(c.getRuler()).toBeNull();
    });

    test("tokens do NOT contribute to rule (§2.5)", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        // Eyrie has 1 warrior; Marquise has 3 wood tokens but no warriors
        c.addPieces([
            mock<Pawn>({
                id: 1,
                name: "warrior",
                owningFaction: "eyrie-dynasties",
                isWarrior: true,
            }),
        ]);
        c.addPieces([
            mock<Token>({
                id: 2,
                name: "wood",
                owningFaction: "marquise-de-cat",
                faceUp: true,
            }),
            mock<Token>({
                id: 3,
                name: "wood",
                owningFaction: "marquise-de-cat",
                faceUp: true,
            }),
            mock<Token>({
                id: 4,
                name: "wood",
                owningFaction: "marquise-de-cat",
                faceUp: true,
            }),
        ]);
        expect(c.getRuler()).toBe("eyrie-dynasties");
    });

    test("buildings count toward rule (§2.5)", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        c.addPieces([
            mock<Pawn>({
                id: 1,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
        ]);
        c.addPieces([
            mock<Building>({ id: 1, name: "workshop", owningFaction: "marquise-de-cat" }),
        ]);
        c.addPieces([
            mock<Pawn>({
                id: 2,
                name: "warrior",
                owningFaction: "woodland-alliance",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 3,
                name: "warrior",
                owningFaction: "woodland-alliance",
                isWarrior: true,
            }),
        ]);
        expect(c.getRuler()).toBeNull();
    });

    test("rule requires a plurality of warriors, not a majority", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 3 });
        c.addPieces([
            mock<Pawn>({
                id: 1,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 2,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 3,
                name: "warrior",
                owningFaction: "woodland-alliance",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 4,
                name: "warrior",
                owningFaction: "eyrie-dynasties",
                isWarrior: true,
            }),
        ]);
        expect(c.getRuler()).toBe("marquise-de-cat");
    });

    test("pawns do NOT contribute to rule (§2.5)", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        c.addPieces([
            mock<Pawn>({
                id: 1,
                name: "warrior",
                owningFaction: "marquise-de-cat",
                isWarrior: true,
            }),
            mock<Pawn>({
                id: 2,
                name: "pawn",
                owningFaction: "vagabond",
                isWarrior: false,
            }),
            mock<Pawn>({
                id: 3,
                name: "pawn",
                owningFaction: "vagabond",
                isWarrior: false,
            }),
        ]);
        expect(c.getRuler()).toBe("marquise-de-cat");
    });

    // TODO: controlled hirelings count towards rule
});

describe("Clearing - warrior and cardboard queries", () => {
    test("getWarriors(faction) returns only that faction's warriors", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        const mq = mock<Pawn>({
            id: 1,
            name: "warrior",
            owningFaction: "marquise-de-cat",
            isWarrior: true,
        });
        const ey = mock<Pawn>({
            id: 2,
            name: "warrior",
            owningFaction: "eyrie-dynasties",
            isWarrior: true,
        });
        c.addPieces([mq, ey]);
        const result = c.getWarriors("marquise-de-cat");
        expect(result).toContain(mq);
        expect(result).not.toContain(ey);
    });

    test("getCardboard(faction) returns buildings and tokens owned by faction", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        const b = mock<Building>({
            id: 1,
            name: "sawmill",
            owningFaction: "marquise-de-cat",
        });
        const t = mock<Token>({
            id: 2,
            name: "wood",
            owningFaction: "marquise-de-cat",
            faceUp: true,
        });
        c.addPieces([b, t]);
        const result = c.getCardboard("marquise-de-cat");
        expect(result).toContain(b);
        expect(result).toContain(t);
    });

    test("getCardboard(faction) does not return pieces owned by other factions", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        const t = mock<Token>({
            id: 2,
            name: "sympathy",
            owningFaction: "woodland-alliance",
            faceUp: true,
        });
        c.addPieces([t]);
        const result = c.getCardboard("marquise-de-cat");
        expect(result).not.toContain(t);
    });

    test("getCardboard(faction) does not return pawns", () => {
        const c = new Clearing({ id: 1, printedSuit: "fox", slotCount: 2 });
        const p = mock<Pawn>({
            id: 1,
            name: "pawn",
            owningFaction: "marquise-de-cat",
            isWarrior: true,
        });
        c.addPieces([p]);
        const result = c.getCardboard("marquise-de-cat");
        expect(result).not.toContain(p);
    });
});
