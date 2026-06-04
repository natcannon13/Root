import { HistoryNode, StateHistory } from "./StateHistory";

export type TransitionID = string;

interface TransitionType {
  id: TransitionID;
}

export class StateStore<State, Transition extends TransitionType> {
  private state?: State;
  private history: StateHistory<State, Transition> = new StateHistory();
  private subscribers: Array<(transition: Transition) => void> = [];
  private stateUpdateFunction: (state: State, transition: Transition) => void;

  constructor(stateUpdateFunction: (state: State, transition: Transition) => void, initialState?: State) {
    this.stateUpdateFunction = stateUpdateFunction;
    this.state = initialState;
  }

  initializeState(initialState: State) {
    throw new Error("StateStore.initializeState not implemented in stub");
  }

  getState(): State {
    if (!this.state) {
      throw new Error("State has not been initialized!");
    }
    return this.state;
  }

  getLastTransition(): Transition | null {
    return this.history.currentNode.transitionFromPrev;
  }

  getHistoryNodes(): HistoryNode<State, Transition>[] {
    return this.history.historyNodes;
  }

  updateState(transition: Transition): void {
    if (!this.state) {
      throw new Error("State has not been initialized!");
    }
    // Shallow snapshot for history; serialized clone would be safer in production.
    try {
      const snapshot = JSON.parse(JSON.stringify(this.state)) as State;
      this.history.add(snapshot, transition);
    } catch (e) {
      // ignore cloning errors in this stub
    }
    this.stateUpdateFunction(this.state, transition);
    this.subscribers.forEach((s) => s(transition));
  }

  subscribe(fn: (transition: Transition) => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== fn);
    };
  }

  undo(): void {
    throw new Error("StateStore.undo not implemented in stub");
  }

  redo(): void {
    throw new Error("StateStore.redo not implemented in stub");
  }

  do(index: number): void {
    throw new Error("StateStore.do not implemented in stub");
  }
}
