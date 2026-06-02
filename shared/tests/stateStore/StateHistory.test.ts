import { describe, test } from "vitest";
import { StateHistory } from "../../src/stateStore/StateHistory";

describe("StateHistory", () => {
  test("currentNode throws when history is empty", () => {});

  test("add sets currentNode and links prev/next correctly", () => {});

  test("goTo navigates to the given index and returns that state", () => {});

  test("goTo makes a branch canonical when going to an index", () => {});
  
  test("goTo throws for out-of-bounds indices", () => {});

  test("undo moves back and returns previous state", () => {});

  test("undo throws when no more history to undo", () => {});

  test("redo moves forward and returns next state", () => {});

  test("redo throws when there is no next state to redo", () => {});

});
