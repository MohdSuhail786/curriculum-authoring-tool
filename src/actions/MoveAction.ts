import { Curriculum } from "../models/Curriculum";
import { Objective } from "../models/Objective";
import { Action } from "./abstract/Action";

interface MoveActionIProps {
    subject: Objective
    to: Objective
}

export class MoveAction extends Action<Objective> {

    to!: Objective
    oldParent!: Objective | Curriculum;
    oldIndex!: number

    constructor(config: MoveActionIProps) {
        super(config.subject)
        this.to = config.to
    }

    execute() {
        
        const parent = this.subject.parent || this.subject.curriculum;
        this.oldParent = parent;

        this.oldIndex = parent.objectives.findIndex(child => child.id === this.subject.id)
        parent.removeObjective(this.subject)
        this.to.addObjective(this.subject, 0)

        this.updateStatus('complete')
    }

    undo() {
        if (this.status !== 'complete') return
        
        this.to.removeObjective(this.subject)
        this.oldParent.addObjective(this.subject, this.oldIndex)

        this.updateStatus('undo');
    }

    redo() {
        if (this.status !== 'undo') return

        this.oldParent.removeObjective(this.subject)
        this.to.addObjective(this.subject, 0)

        this.updateStatus('complete')
    }
}