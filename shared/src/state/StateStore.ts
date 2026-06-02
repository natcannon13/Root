export class StateStore<T> {
  private state?: T;
  private history: T[] = [];
  private subscribers: Array<() => void> = [];

  constructor(initialState?: T) {
    this.state = initialState;
  }

  getState(): T {
    if (!this.state) {
      throw new Error("State has not been initialized!");
    }
    return this.state;
  }

  setState(updater: (s: T) => void): void {
    if (!this.state) {
      throw new Error("State has not been initialized!");
    }
    // Shallow snapshot for history; serialized clone would be safer in production.
    try {
      const snapshot = JSON.parse(JSON.stringify(this.state)) as T;
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
