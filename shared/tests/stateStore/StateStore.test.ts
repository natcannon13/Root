import { describe, test, expect, vi } from "vitest";
import { StateStore } from "../../src/stateStore/StateStore";

describe("StateStore", () => {
  function makeState(overrides: Partial<any> = {}) {
    return {
      version: "1",
      options: {},
      boardState: {},
      factionState: {},
      hirelingState: {},
      landmarks: [],
      timeState: {},
      battleState: null,
      deck: null,
      deckSize: 0,
      discardPile: [],
      spentCraftingPieceIDs: [],
      ...overrides,
    } as any;
  }

  test("getState returns the initial state object", () => {
    const initial = makeState({ deckSize: 1 });
    const store = new StateStore(initial);
    expect(store.getState()).toBe(initial);
  });

  test("setState updates state", () => {
    const initial = makeState({ deckSize: 0 });
    const store = new StateStore(initial);

    store.setState((s) => {
      s.deckSize = 5;
    });

    expect(store.getState().deckSize).toBe(5);
  });

  test("setState notifies subscribers", () => {
    const initial = makeState({ deckSize: 0 });
    const store = new StateStore(initial);

    const sub = vi.fn();
    store.subscribe(sub);

    store.setState((s) => {
      s.deckSize = 5;
    });
    expect(sub).toHaveBeenCalled();
  });

  test("unsubscribe removes the subscriber so it is not called", () => {
    const initial = makeState({ deckSize: 0 });
    const store = new StateStore(initial);

    const sub = vi.fn();
    const unsub = store.subscribe(sub);

    unsub();
    store.setState((s) => {
      s.deckSize = 7;
    });
    expect(sub).not.toHaveBeenCalled();
  });

  test("undo reverts multiple steps", () => {
    const initial = makeState({ deckSize: 0 });
    const store = new StateStore(initial);

    store.setState((s) => {
      s.deckSize = 5;
    });
    store.setState((s) => {
      s.deckSize = 7;
    });

    // undo should revert to previous snapshot (7 -> 5 -> 0)
    store.undo();
    expect(store.getState().deckSize).toBe(5);
    store.undo();
    expect(store.getState().deckSize).toBe(0);
  });
});
