import { Action } from "../abstract/Action";

export class ActionsStoreClass {
    ActionsList: Action<any>[] = [];
    index: number = -1;
    maxLength: number = 150;

    constructor() {
    }

    push(action: Action<any>) {
        this.index += 1;
        this.ActionsList[this.index] = action
        if (this.ActionsList.length > this.maxLength) {
            this.ActionsList.shift();
            this.index -= 1;
        }
    }

    undo() {
        if (this.index === -1) return;
        this.ActionsList[this.index]?.undo()
        this.index -= 1;
    }

    redo() {
        if (this.maxLength === this.index + 1) return;
        this.ActionsList[this.index + 1]?.redo()
        this.index += 1;
    }

    reset() {
        this.ActionsList = [];
        this.index = -1
    }
}

export const ActionStore = new ActionsStoreClass();