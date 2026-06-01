import { describe, test, expect, vi } from "vitest";
import { StateStore } from "../../src/state/StateStore";

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

  test("setState updates state and notifies subscribers and supports undo", () => {
    const initial = makeState({ deckSize: 0 });
    const store = new StateStore(initial);

    const sub = vi.fn();
    const unsub = store.subscribe(sub);

    store.setState((s) => {
      s.deckSize = 5;
    });

    expect(store.getState().deckSize).toBe(5);
    expect(sub).toHaveBeenCalled();

    // unsubscribe and update again
    unsub();
    sub.mockClear();
    store.setState((s) => {
      s.deckSize = 7;
    });
    expect(sub).not.toHaveBeenCalled();

    // undo should revert to previous snapshot (7 -> 5 -> 0)
    store.undo();
    expect(store.getState().deckSize).toBe(5);
    store.undo();
    expect(store.getState().deckSize).toBe(0);
  });

  test("pendingAction is initially null and can be set", () => {
    const store = new StateStore(makeState());
    expect(store.pendingAction).toBeNull();
    // set a fake pending action
    (store.pendingAction as any) = { id: 123 };
    expect(store.pendingAction).toEqual({ id: 123 });
  });
});
