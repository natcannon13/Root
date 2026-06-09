import { describe, test } from "vitest";

// "propertySet" - sets a property on the game state to a new value, used for simple updates that don't fit into a more specific type
// "factionSelected" - adds a player/faction pair to the playerFactionMapping
// "move" - moves pieces from one location to another on the board
// "place" - places pieces in a specific location on the board
// "remove" - removes pieces from a specific location on the board
// "factionStateUpdate" - sets a property on the state of a specific faction to a new value
// "returnToSupply" - moves a piece to the supply of a specific faction
// "moveCard" - moves a card from one card location to another
// "hirelingStateUpdate" - sets a property on the state of a specific hireling to a new value
// "battleChange" - sets a property on the battle state to a new value
// "crafting" - marks the used crafting pieces as spent and moves a card from a faction's hand to their crafted improvements
// "choicePended" - adds a pending choice to the game state
// "choiceResolved" - updates the resolved choice with its value and moves it to the resolved choices list on the game state
// "rng" - records the result of a random number generator event, such as a die roll or card shuffle, adding it to the pastRNGEvents list on the game state
// "compound" - a wrapper for multiple updates that should be applied together

describe("RootStateUpdate", () => {
    test("propertySet updates the specified property on the game state", () => {});
    test("factionSelected updates the playerFactionMapping with the new player/faction pair", () => {});
    test("move updates the board state to reflect the moved pieces", () => {});
    test("place updates the board state to reflect the placed pieces", () => {});
    test("remove updates the board state to reflect the removed pieces", () => {});
    test("factionStateUpdate updates the specified property on the specified faction's state", () => {});
    test("returnToSupply moves the specified piece to the supply of the specified faction", () => {});
    test("moveCard moves the specified card from the from location to the to location", () => {});
    test("hirelingStateUpdate updates the specified property on the specified hireling's state", () => {});
    test("battleChange updates the specified property on the battle state", () => {});
    test("crafting marks the used crafting pieces as spent and moves the crafted card from the faction's hand to their crafted improvements", () => {});
    test("choicePended adds the pending choice to the game state", () => {});
    test("choiceResolved updates the resolved choice with its value and moves it to the resolved choices list on the game state", () => {});
    test("rng adds the specified RNG event to the pastRNGEvents list on the game state", () => {});
    test("compound applies all contained updates together", () => {});
});
