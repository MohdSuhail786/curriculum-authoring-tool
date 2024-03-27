import { Curriculum } from "../models/Curriculum";
import { Objective } from "../models/Objective";
import { uuidv4 } from "../utils/Utils";
import { Action } from "./abstract/Action";

interface AddActionIProps {
    subject: Curriculum
}

export class AddAction extends Action<Curriculum> {

    lastObjectiveParent!: Objective | Curriculum
    newObjective!: Objective

    constructor(config: AddActionIProps) {
        super(config.subject)
    }

    execute() {
        const lastObjective = this.subject.getLastObjective()
        this.lastObjectiveParent = lastObjective?.parent || this.subject;
        this.newObjective = new Objective({
            curriculum: this.subject,
            id: uuidv4(),
            name: '',
            objectives: [],
            parent: lastObjective?.parent || null
        })
        this.lastObjectiveParent.addObjective(this.newObjective)
        this.updateStatus('complete')
    }

    undo() {
        if (this.status !== 'complete') return

        (this.newObjective.parent || this.newObjective.curriculum)?.removeObjective(this.newObjective)

        this.updateStatus('undo');
    }

    redo() {
        if (this.status !== 'undo') return

        this.lastObjectiveParent.addObjective(this.newObjective)

        this.updateStatus('complete')
    }
}