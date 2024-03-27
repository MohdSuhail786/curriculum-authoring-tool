import { DeleteAction } from "../actions/DeleteAction"
import { IndentAction } from "../actions/IndentAction"
import { MoveAction } from "../actions/MoveAction"
import { OutdentAction } from "../actions/OutdentAction"
import { Curriculum } from "./Curriculum"

export type IMObjective = {
    id: string,
    name: string,
    objectives: IMObjective[],
}

type IConfig = IMObjective & {
    parent: Objective | null,
    curriculum: Curriculum
}

export class Objective {

    id!: string
    name!: string
    objectives!: Objective[]
    parent: Objective | null = null
    curriculum!: Curriculum

    constructor(config: IConfig) {
        this.id = config.id;
        this.name = config.name;
        this.parent = config.parent || null
        this.curriculum = config.curriculum
        this.objectives = config.objectives.map(imObjective => new Objective({ ...imObjective, curriculum: this.curriculum, parent: this }))
    }

    setName(name: string) {
        this.name = name

        this.syncState()
    }

    indent() {
        if (!this.indentPossible()) return;
        new IndentAction({
            subject: this,
        }).execute();
    }

    outdent() {
        if (!this.outdentPossible()) return;
        new OutdentAction({
            subject: this
        }).execute()
    }

    indentPossible(): boolean {
        const parent = this.parent || this.curriculum;
        const index = parent.objectives.findIndex(obj => obj.id === this.id)
        if (index === 0) return false;
        return true
    }

    outdentPossible(): boolean {
        return !(!this.parent || this.objectives.length)
    }

    delete() {
        new DeleteAction({
            subject: this
        }).execute()
    }

    moveTo(parentObjective: Objective | null) {
        if (!parentObjective) return;

        new MoveAction({
            subject: this,
            to: parentObjective
        }).execute()
    }

    isChildOf(objective: Objective): boolean {
        let parent = this.parent;
        while (parent && parent.id !== objective.id) {
            parent = parent.parent
        }
        if (!parent) return false;
        return true;
    }

    moveToPossible(targetObjective: Objective): boolean {
        return !targetObjective.isChildOf(this)
    }

    addObjective(Objective: Objective, index?: number) {
        if (index == 0 || index) this.objectives.splice(index, 0, Objective)
        else this.objectives.push(Objective)
        Objective.parent = this;
    }

    removeObjective(Objective: Objective) {
        this.objectives = this.objectives.filter(child => child.id !== Objective.id);
        Objective.parent = null
    }

    getDepth(objective?: Objective): number {
        if (objective && !objective.parent) {
            return 1;
        }
        if (objective && objective.parent) {
            return 1 + this.getDepth(objective.parent)
        }
        if (!objective && this.parent) {
            return 1 + this.getDepth(this.parent)
        }
        return 1;
    }

    setDragging(value: boolean) {
        this.curriculum.dragging = value;
        this.curriculum.currentlyDraggedObjective = value ? this : null;

        this.syncState();
    }

    getOpacity() {
        return Math.max((100 - (Number(this.getDepth()) * 10)) / 100, 0.3)
    }

    getFontWeight() {
        return Math.max(1000 - (Number(this.getDepth()) * 100), 300)
    }

    getSubject() {
        return this.curriculum.subject
    }

    syncState() {
        this.curriculum.syncState()
    }

    jsonify(): IMObjective {
        return {
            id: this.id,
            name: this.name,
            objectives: this.objectives.map(child => child.jsonify()),
        }
    }
}