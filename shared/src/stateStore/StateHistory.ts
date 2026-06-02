export class HistoryNode<State, Transition> {
    readonly state: State;
    readonly prevIdx: number;
    nextIdx: number;
    readonly transitionFromPrev: Transition | null = null;
    constructor(state: State, prevIdx: number, transition: Transition | null = null) {
        this.state = state;
        this.prevIdx = prevIdx;
        this.transitionFromPrev = transition;
        this.nextIdx = -1;
    }
}

export class StateHistory<State, Transition> {
    private history: HistoryNode<State, Transition>[] = [];
    private currentIndex: number = -1;

    get historyNodes(): HistoryNode<State, Transition>[] {
        return this.history;
    }

    get currentNode(): HistoryNode<State, Transition> {
        if (this.currentIndex === -1) {
            throw new Error("History is empty");
        }
        return this.history[this.currentIndex];
    }

    add(state: State, transitionFromPrev: Transition | null = null) {
        const newNode = new HistoryNode(state, this.currentIndex, transitionFromPrev);
        this.history.push(newNode);

        const nextIndex = this.history.length - 1;
        if (this.currentIndex >= 0) {
            const currentNode = this.history[this.currentIndex];
            currentNode.nextIdx = nextIndex;
        }
        this.currentIndex = nextIndex;
    }
    private reTrunk(index: number) {
        // Makes a branch the canonical branch by reassigning nextIdx values along the branch to point to the new canonical path. This allows us to keep old branches around for potential future use while treating the new branch as the main one.
        let currentIndex = index;
        let currentNode = this.history[currentIndex];
        let prevIdx = currentNode.prevIdx;
        while (prevIdx !== -1) {
            this.history[prevIdx].nextIdx = currentIndex;
            currentIndex = prevIdx;
            currentNode = this.history[currentIndex];
        }
    }

    goTo(index: number): State {
        // Navigates to a specific point in history, making that branch the canonical branch. Returns the state at that point in history.
        if (index < 0 || index >= this.history.length) {
            throw new Error(`Index ${index} out of bounds for history of length ${this.history.length}`);
        }
        this.currentIndex = index;
        this.reTrunk(index);
        return this.history[index].state;
    }
    undo(): State {
        if (this.currentIndex <= 0) {
            throw new Error("No more history to undo");
        }
        this.currentIndex=this.history[this.currentIndex].prevIdx;
        return this.history[this.currentIndex].state;
    }
    redo(): State {
        // Redoing goes forward along the current canonical branch. If the user has undone some steps and then makes a new change, that creates a new branch and the redo history is preserved but no longer on the canonical branch, so redo will not go down that path unless the user explicitly goes to that point in history (which makes it the canonical branch).
        if (this.currentIndex === -1) {
            throw new Error("No history to redo");
        }        
        const nextIdx = this.history[this.currentIndex].nextIdx;
        if (nextIdx === -1) {
            throw new Error("No more history to redo");
        }
        this.currentIndex = nextIdx;
        return this.history[this.currentIndex].state;
    }
}