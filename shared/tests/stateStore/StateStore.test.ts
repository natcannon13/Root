import { describe, test, expect, vi } from "vitest";
import { StateStore } from "../../src/stateStore/StateStore";

describe("StateStore", () => {

  test("getState throws when state is not initialized", () => {});

  test("getState returns the initial state object", () => {});

  test("getLastTransition returns null when there are no transitions", () => {});

  test("getHistoryNodes returns the history nodes array", () => {});

  test("updateState adds a snapshot to history", () => {});

  test("updateState calls the provided stateUpdateFunction", () => {});

  test("updateState notifies subscribers", () => {});

  test("updateState throws an error if called with a transition that has the same id but is different from a previous transition", () => {});

  test("updateState does nothing if called with a duplicate transition", () => {});

  test("subscribe returns an unsubscribe function that removes the subscriber", () => {});

  test("initializeState sets the initial state", () => {});

  test("undo delegates to StateHistory", () => {});

  test("redo delegates to StateHistory", () => {});

  test("do delegates to StateHistory", () => {});
});
