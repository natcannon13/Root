import { describe, test, expect, beforeEach, vi } from "vitest";
import { RootGame } from "../../src/game/RootGame";
import { mock } from "vitest-mock-extended";
import { Board } from "../../src/board/Board";
import type { Move } from "../../src/gameActions/Move";
import type { Battle } from "../../src/gameActions/Battle";
import type { Pawn } from "../../src/pieces/Pawn";
import type { Token } from "../../src/pieces/Token";
import type { Building } from "../../src/pieces/Building";
import type { Card } from "../../src/cards/Card";
import { PlayerFaction } from "../../src/rulesModule/PlayerFaction";
import { PlayerFactionType } from "../../src/Enums";
let game: RootGame;
let board: Board;
let factions: { [key in PlayerFactionType]: PlayerFaction } = {} as any;

beforeEach(() => {
    game = new RootGame();
    board = mock<Board>();
    vi.spyOn(game as any, "initializeBoard").mockReturnValue(board);

    factions = {} as any;
    for (const factionType of ["marquise-de-cat", "eyrie-dynasties", "woodland-alliance"] as const) {
        const faction = mock<PlayerFaction>();
        faction.name = factionType;
        factions[factionType] = faction;
    }
});

// --- rollDie -----------------------------------------------------------------

describe("RootGame.rollDie", () => {
    test("returns a value between 0 and 3 inclusive", () => {});
});

// --- isMoveLegal (§4.2, §4.2.1) ----------------------------------------------

describe("RootGame.isMoveLegal (§4.2)", () => {
    test("is legal when mover rules the origin clearing", () => {});

    test("is legal when mover rules the destination clearing", () => {});

    test("is illegal when mover rules neither origin nor destination (§4.2.1)", () => {});

    test("is illegal when origin and destination are not adjacent", () => {});

    test("is illegal to move zero pieces (§4.2)", () => {});
});

// --- isBattleLegal (§4.3) ----------------------------------------------------

describe("RootGame.isBattleLegal (§4.3)", () => {
    test("is legal when attacker has warriors in the clearing and there is a defender", () => {});

    test("is illegal when attacker has no pieces in the clearing", () => {});

    test("is illegal when defender has no pieces in the clearing", () => {});

    test("is illegal to battle yourself", () => {});

    test("is illegal to battle with zero attacking warriors (§4.3)", () => {});

    test("is illegal to battle a hireling you control", () => {});
});

// --- battle - dice and hit counting (§4.3.3, §4.3.5) ------------------------

describe("RootGame.battle - hit counting", () => {
    test("attacker deals hits equal to the higher roll (§4.3.3)", () => {});

    test("defender deals hits equal to the lower roll (§4.3.3)", () => {});

    test("equal rolls give both sides the same number of hits (§4.3.3)", () => {});

    test("rolled hits are capped by attacker warrior count (§4.3.3.I)", () => {});

    test("rolled hits are capped by defender warrior count (§4.3.3.I)", () => {});

    test("defenseless: attacker deals extra hit when defender has no warriors (§4.3.5.II)", () => {});
});

describe("RootGame.battle - deal hits (§4.3.6)", () => {
    test("warriors are removed before buildings and tokens (§4.3.6)", () => {});

    test("defender can choose which buildings or tokens take hits (§4.3.6)", () => {});

    test("scoring: removing enemy building scores 1 VP (§3.2.1)", () => {});
});

describe("RootGame.battle - ambush (§4.3.1)", () => {
    test("defender can play ambush matching the clearing suit to deal 2 immediate hits", () => {});

    test("defender cannot play an ambush that doesn't match the clearing suit", () => {});

    test("attacker can foil ambush with an ambush card matching the clearing suit (§4.3.1.I)", () => {});

    test("attacker cannot foil ambush with an ambush card that doesn't match the clearing suit (§4.3.1.I)", () => {});

    test("battle ends immediately if no attacking warriors remain after ambush, even if the attacker has other pieces (§4.3.1.II)", () => {});

    test("battle continues as normal if at least 1 attacking warrior remains after ambush (§4.3.1.II)", () => {});
});

// --- isPlaceLegal (§2.2.3) ---------------------------------------------------

describe("RootGame.isPlaceLegal", () => {
    test("placing a building is legal when there is an open slot", () => {});

    test("placing a building is illegal when there are no open slots (§2.2.3)", () => {});
});

// --- isCraftLegal (§4.1) -----------------------------------------------------

describe("RootGame.isCraftLegal", () => {
    test("is legal when unexhausted crafting pieces cover all required suits(§4.1.1)", () => {});

    test("is illegal when crafting pieces do not cover all required suits (§4.1.1)", () => {});

    test("is illegal to craft with exhausted pieces (§4.1.2)", () => {});

    test("presence of extra crafting pieces does not affect legality, even if exhausted (§4.1.3)", () => {});

    test("is illegal when no crafting pieces are provided", () => {});

    test("cannot craft an ambush card (§2.1.2)", () => {});

    test("cannot craft a dominance card (§2.1.3)", () => {});

    test("cannot craft duplicate persistent effects (§4.1.4)", () => {});
});

// --- Victory - score tracking (§3.1, §3.2) --------------------------------

describe("RootGame - victory conditions (§3.1)", () => {
    test("gameOver is false at the start", () => {});

    test("first player to reach 30 VP wins (§3.1)", () => {});

    test("winning is immediate - game stops at exactly 30 (§3.1)", () => {});

    test("on a VP tie, the player closest clockwise to current player wins (§3.1.1)", () => {});

    test("non-bird dominance victory: a player ruling three or more clearings matching a claimed dominance card at start of birdsong wins", () => {});

    test("bird dominance victory: a player ruling two opposite corner clearings at start of birdsong wins", () => {});
});

// --- Dominance (§3.3) --------------------------------------------------------

describe("RootGame - dominance (§3.3)", () => {
    test("players may activate a dominance card in their hand during their daylight (§3.3.1)", () => {});

    test("players cannot activate a dominance card without having 10 VP (§3.3.1)", () => {});

    test("players cannot activate dominance cards outside of their daylight (§3.3.1)", () => {});

    test("after activating dominance, score marker is removed (score is set to -1) (§3.3.1)", () => {});

    test("players cannot activate a dominance card if they have an active dominance card (§3.3.2)", () => {});

    test("when discarded, dominance cards go to a separate pile and are not reshuffled into the deck (§3.3.3)", () => {});

    test("a faction can take an available dominance card by spending a matching card (§3.3.4)", () => {});

    test("cannot treat a bird dominance card as another suit when taking it (§3.3.4)", () => {});
});

// --- Deck reshuffling (§2.1) --------------------------------------------------

describe("RootGame - deck management (§2.1)", () => {
    test("reshuffles discard pile into deck when deck is empty", () => {});

    test("drawn card comes from top of deck", () => {});

    test("dominance cards are not reshuffled into the deck (§3.3.3)", () => {});
});

// --- Piece placement limits (§1.5.1) -----------------------------------------

describe("RootGame - piece limits (§1.5.1)", () => {
    test("does not place pieces beyond supply limit", () => {});
});
