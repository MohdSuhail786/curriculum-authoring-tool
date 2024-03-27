import { Curriculum } from "../models/Curriculum";
import { Objective } from "../models/Objective";
import { Action } from "./abstract/Action";

interface OutdentActionIProps {
    subject: Objective
}

export class OutdentAction extends Action<Objective> {

    oldParent!: Objective | Curriculum | null;
    newParent!: Objective | Curriculum

    myImmediateSiblings!: Objective[]
    parentIndex!: number;

    constructor(config: OutdentActionIProps) {
        super(config.subject)
        this.oldParent = this.subject.parent;
    }

    execute() {
        if (!this.subject.parent || this.subject.objectives.length) return;
        const parentParent = this.subject.parent?.parent || this.subject.curriculum;
        const myIndex = this.subject.parent?.objectives.findIndex(obj => obj.id === this.subject.id);
        this.parentIndex = parentParent.objectives.findIndex(obj => obj.id === this.subject.parent?.id)

        this.myImmediateSiblings = this.subject.parent?.objectives.reduce((acc: Objective[], curr: Objective, index: number) => {
            if (index > myIndex) acc.push(curr)
            return acc;
        }, [] as Objective[]);

        this.myImmediateSiblings?.forEach(sibling => {
            sibling.parent?.removeObjective(sibling)
            this.subject.addObjective(sibling)
        })

        this.subject.parent?.removeObjective(this.subject)
        parentParent.addObjective(this.subject, this.parentIndex + 1)

        this.newParent = parentParent;

        this.updateStatus('complete')
    }

    undo() {
        if (this.status !== 'complete') return
        
        this.newParent.removeObjective(this.subject)
        this.oldParent?.addObjective(this.subject)
        
        this.myImmediateSiblings?.forEach(sibling => {
            sibling.parent?.removeObjective(sibling)
            this.subject.parent?.addObjective(sibling)
        })

        this.updateStatus('undo');
    }

    redo() {
        if (this.status !== 'undo') return

        this.myImmediateSiblings?.forEach(sibling => {
            sibling.parent?.removeObjective(sibling)
            this.subject.addObjective(sibling)
        })

        this.oldParent?.removeObjective(this.subject)
        this.newParent.addObjective(this.subject, this.parentIndex + 1)

        this.updateStatus('complete')
    }
}