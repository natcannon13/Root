import { HistoryNode, StateHistory } from "./StateHistory";

export type TransitionID = string;

export interface StateType {
    version: string;
}

export interface TransitionType {
    id: TransitionID;
    version: string;
}

export class StateStore<State extends StateType, Transition extends TransitionType> {
    private state?: State;
    private history: StateHistory<State, Transition> = new StateHistory();
    private subscribers: Array<(transition: Transition) => void> = [];

    constructor( initialState?: State ) {
        this.state = initialState;
        if (initialState) {
            this.history.add(initialState, null);
        }
    }

    initializeState(initialState: State): void {
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

    updateState(transition: Transition, newState: State): void {
        this.state = newState;
        this.history.add(this.state, transition);
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
