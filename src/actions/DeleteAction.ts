import { Curriculum } from "../models/Curriculum";
import { Objective } from "../models/Objective";
import { Action } from "./abstract/Action";

interface DeleteActionIProps {
    subject: Objective
}

export class DeleteAction extends Action<Objective> {

    oldParent!: Objective | Curriculum;
    defaultObjective!: Objective | null;
    oldIndex!: number;

    constructor(config: DeleteActionIProps) {
        super(config.subject)
    }

    execute() {
        const parent = this.subject.parent || this.subject.curriculum;
        this.oldParent = parent;

        this.oldIndex = parent.objectives.findIndex(child => child.id === this.subject.id)
        parent.removeObjective(this.subject)
        if (this.subject.curriculum.objectives.length === 0) {
            this.defaultObjective = this.subject.curriculum.addDefaultObjective()
        }

        this.updateStatus('complete')
    }

    undo() {
        if (this.status !== 'complete') return

        this.oldParent.addObjective(this.subject, this.oldIndex)
        this.defaultObjective?.curriculum?.removeObjective(this.defaultObjective)
        if (this.defaultObjective) {
            this.defaultObjective.parent?.removeObjective(this.defaultObjective)
        }

        this.updateStatus('undo');
    }

    redo() {
        if (this.status !== 'undo') return

        this.oldParent.removeObjective(this.subject);
        if (this.defaultObjective) {
            this.subject.curriculum.addObjective(this.defaultObjective)
        }

        this.updateStatus('complete')
    }
}