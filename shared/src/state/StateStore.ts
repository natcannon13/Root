import type { RootGameState } from "../gameState/RootGameState";
import type { PendingAction } from "../game/PendingAction";

export class StateStore {
  private state: RootGameState;
  private history: RootGameState[] = [];
  private subscribers: Array<() => void> = [];
  pendingAction: PendingAction | null = null;

  constructor(initialState: RootGameState) {
    this.state = initialState;
  }

  getState(): RootGameState {
    return this.state;
  }

  setState(updater: (s: RootGameState) => void): void {
    // Shallow snapshot for history; serialized clone would be safer in production.
    try {
      const snapshot = JSON.parse(JSON.stringify(this.state)) as RootGameState;
      this.history.push(snapshot);
    } catch (e) {
      // ignore cloning errors in this stub
    }
    updater(this.state);
    this.subscribers.forEach((s) => s());
  }

  subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== fn);
    };
  }

  undo(): void {
    const prev = this.history.pop();
    if (prev) {
      this.state = prev;
      this.subscribers.forEach((s) => s());
    }
  }

  redo(): void {
    throw new Error("StateStore.redo not implemented in stub");
  }

  do(id: number): void {
    throw new Error("StateStore.do not implemented in stub");
  }
}
