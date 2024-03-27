import { uuidv4 } from "../../utils/Utils";
import { ActionStore } from "../store/ActionStore";

export abstract class Action<T> {
    status: 'complete' | 'pending' | 'inProgress' | 'undo';
    actionID: string;
    subject!: T

    constructor(subject: T) {
        this.actionID = uuidv4()
        ActionStore.push(this)
        this.status = 'pending'
        this.subject = subject
    }

    abstract execute(): void

    abstract undo(): void

    abstract redo(): void

    updateStatus(newStatus: 'complete' | 'pending' | 'inProgress' | 'undo') {
        this.status = newStatus;
        (this.subject as any).syncState()
    }

}