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
import { RootGameAgent } from "../../src/agents/RootGameAgent";
let game: RootGame;
let factions: { [key in PlayerFactionType]?: PlayerFaction } = {};
let agents: { [id: number]: RootGameAgent } = {};

beforeEach(() => {
    factions = {};
    agents = {};
    let id = 0;
    for (const factionType of [
        "marquise-de-cat",
        "eyrie-dynasties",
        "woodland-alliance",
    ] as const) {
        factions[factionType] = mock<PlayerFaction>({ name: factionType });
        agents[id] = mock<RootGameAgent>({ id: id });
        id++;
    }

    game = new RootGame(Object.values(agents));
});

function mockBoard() {
    let board = mock<Board>();
    vi.spyOn(game as any, "initializeBoard").mockReturnValue(board);
    return board;
}

// --- constructor ----------------------------------------------------------------

describe("RootGame constructor", () => {
    test("calls setState with default values when no state is provided", () => {});
    test("calls setState with provided state", () => {});
    test("initializes with provided agents", () => {});
});

// --- rollDie -----------------------------------------------------------------

describe("RootGame.rollDie", () => {
    test("returns a value between 0 and 3 inclusive", () => {});
});

// --- isMoveLegal  ----------------------------------------------

describe("RootGame.isMoveLegal ", () => {
    test("is legal when mover rules the origin clearing", () => {});

    test("is legal when mover rules the destination clearing", () => {});

    test("is illegal when mover rules neither origin nor destination ", () => {});

    test("is illegal when origin and destination are not adjacent", () => {});

    test("is illegal to move zero pieces ", () => {});
});

// --- isBattleLegal  ----------------------------------------------------

describe("RootGame.isBattleLegal ", () => {
    test("is legal when attacker has warriors in the clearing and there is a defender", () => {});

    test("is illegal when attacker has no pieces in the clearing", () => {});

    test("is illegal when defender has no pieces in the clearing", () => {});

    test("is illegal to battle yourself", () => {});

    test("is illegal to battle with zero attacking warriors ", () => {});

    test("is illegal to battle a hireling you control", () => {});

    test("is illegal to battle a player that is not an opponent", () => {});
});

// --- battle - dice and hit counting  ------------------------

describe("RootGame.battle - hit counting", () => {
    test("attacker deals hits equal to the higher roll ", () => {});

    test("defender deals hits equal to the lower roll ", () => {});

    test("equal rolls give both sides the same number of hits ", () => {});

    test("rolled hits are capped by attacker warrior count ", () => {});

    test("rolled hits are capped by defender warrior count ", () => {});

    test("defenseless: attacker deals extra hit when defender has no warriors ", () => {});
});

describe("RootGame.battle - deal hits ", () => {
    test("warriors are removed before buildings and tokens ", () => {});

    test("defender can choose which buildings or tokens take hits ", () => {});

    test("scoring: removing enemy building scores 1 VP ", () => {});
});

describe("RootGame.battle - ambush ", () => {
    test("defender can play ambush matching the clearing suit to deal 2 immediate hits", () => {});

    test("defender cannot play an ambush that doesn't match the clearing suit", () => {});

    test("attacker can foil ambush with an ambush card matching the clearing suit ", () => {});

    test("attacker cannot foil ambush with an ambush card that doesn't match the clearing suit ", () => {});

    test("battle ends immediately if no attacking warriors remain after ambush, even if the attacker has other pieces ", () => {});

    test("battle continues as normal if at least 1 attacking warrior remains after ambush ", () => {});
});

// --- isPlaceLegal  ---------------------------------------------------

describe("RootGame.isPlaceLegal", () => {
    test("placing a building is legal when there is an open slot", () => {});

    test("placing a building is illegal when there are no open slots ", () => {});
});

// --- isCraftLegal  -----------------------------------------------------

describe("RootGame.isCraftLegal", () => {
    test("is legal when unexhausted crafting pieces cover all required suits", () => {});

    test("is illegal when crafting pieces do not cover all required suits ", () => {});

    test("is illegal to craft with exhausted pieces ", () => {});

    test("presence of extra crafting pieces does not affect legality, even if exhausted ", () => {});

    test("is illegal when no crafting pieces are provided", () => {});

    test("cannot craft an ambush card ", () => {});

    test("cannot craft a dominance card ", () => {});

    test("cannot craft duplicate persistent effects ", () => {});
});

// --- Victory - score tracking  --------------------------------

describe("RootGame - victory conditions ", () => {
    test("gameOver is false at the start", () => {});

    test("first player to reach 30 VP wins ", () => {});

    test("winning is immediate - game stops at exactly 30 ", () => {});

    test("on a VP tie, the player closest clockwise to current player wins ", () => {});

    test("non-bird dominance victory: a player ruling three or more clearings matching a claimed dominance card at start of birdsong wins", () => {});

    test("bird dominance victory: a player ruling two opposite corner clearings at start of birdsong wins", () => {});
});

// --- Dominance  --------------------------------------------------------

describe("RootGame - dominance ", () => {
    test("players may activate a dominance card in their hand during their daylight ", () => {});

    test("players cannot activate a dominance card without having 10 VP ", () => {});

    test("players cannot activate dominance cards outside of their daylight ", () => {});

    test("after activating dominance, score marker is removed (score is set to -1) ", () => {});

    test("players cannot activate a dominance card if they have an active dominance card ", () => {});

    test("when discarded, dominance cards go to a separate pile and are not reshuffled into the deck ", () => {});

    test("a faction can take an available dominance card by spending a matching card ", () => {});

    test("cannot treat a bird dominance card as another suit when taking it ", () => {});
});

// --- Deck reshuffling  --------------------------------------------------

describe("RootGame - deck management ", () => {
    test("reshuffles discard pile into deck when deck is empty", () => {});

    test("drawn card comes from top of deck", () => {});

    test("dominance cards are not reshuffled into the deck ", () => {});
});

// --- Piece placement limits  -----------------------------------------

describe("RootGame - piece limits ", () => {
    test("does not place pieces beyond supply limit", () => {});
});
