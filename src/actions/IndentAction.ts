import { Curriculum } from "../models/Curriculum";
import { Objective } from "../models/Objective";
import { Action } from "./abstract/Action";

interface IndentActionIProps {
    subject: Objective
}

export class IndentAction extends Action<Objective> {

    oldIndex!: number;

    oldParent!: Objective | Curriculum;
    newParent!: Objective | Curriculum

    oldObjectives!: Objective[]

    constructor(config: IndentActionIProps) {
        super(config.subject)
    }

    execute() {

        const parent = this.subject.parent || this.subject.curriculum;
        this.oldParent = parent

        const index = parent.objectives.findIndex(obj => obj.id === this.subject.id)
        const siblingObjective = parent.objectives[index - 1];
        this.newParent = siblingObjective;

        this.oldIndex = parent.objectives.findIndex(child => child.id === this.subject.id)
        parent.removeObjective(this.subject);
        siblingObjective.addObjective(this.subject)


        this.oldObjectives = [...this.subject.objectives];

        this.subject.objectives.forEach(objective => {
            this.subject?.removeObjective(objective);
            siblingObjective.addObjective(objective)
        })

        this.updateStatus('complete')
    }

    undo() {
        if (this.status !== 'complete') return
        this.newParent?.removeObjective(this.subject)
        this.oldParent?.addObjective(this.subject, this.oldIndex)

        this.oldObjectives.forEach(objective => {
            this.newParent?.removeObjective(objective)
            this.subject.addObjective(objective)
        })

        this.updateStatus('undo');
    }

    redo() {
        if (this.status !== 'undo') return

        this.oldParent?.removeObjective(this.subject)
        this.newParent.addObjective(this.subject)

        this.oldObjectives.forEach(objective => {
            objective.parent?.removeObjective(objective)
            this.newParent.addObjective(objective)
        })

        this.updateStatus('complete')
    }
}