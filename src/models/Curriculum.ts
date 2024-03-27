import { AddAction } from "../actions/AddAction";
import { uuidv4 } from "../utils/Utils";
import { IMObjective, Objective } from "./Objective";
import { Subject } from "./Subject";

export type IMCurriculum = {
    objectives: IMObjective[]
}

type IConfig = IMCurriculum & {
    subject: Subject
}

export class Curriculum {

    subject!: Subject
    objectives: Objective[] = []
    dragging: boolean = false
    currentlyDraggedObjective: Objective | null = null
    dragOverObjective: Objective | null = null
    dragOverHTMLElement: HTMLDivElement | null = null

    constructor(config: IConfig) {
        if (config.objectives.length)
            this.objectives = config.objectives.map(imObjective => new Objective({ ...imObjective, curriculum: this, parent: null }))
        else
            this.addDefaultObjective()
        this.subject = config.subject
    }

    setDragOverObjective(objective: Objective | null) {
        this.dragOverObjective = objective
    }

    setDragOverHTMLElement(wrapper: HTMLDivElement | null) {
        this.dragOverHTMLElement = wrapper
    }

    addObjective(Objective: Objective, index?: number) {
        if (index) this.objectives.splice(index, 0, Objective)
        else this.objectives.push(Objective)
        Objective.parent = null
    }

    removeObjective(Objective: Objective) {
        this.objectives = this.objectives.filter(child => child.id !== Objective.id);
        Objective.parent = null
    }

    getLastObjective(objective?: Objective): Objective | null {
        let Objective = objective
        if (!Objective) {
            if (this.objectives.length === 0) return null;
            Objective = this.objectives.at(-1) as Objective
        }
        if (Objective.objectives.length === 0) return Objective;
        return this.getLastObjective(Objective.objectives.at(-1) as Objective)
    }

    findObjectiveById(id: string, objective?: Objective): Objective | null {
        let Objective = objective
        if (!Objective) {
            if (this.objectives.length === 0) return null;
            const resultObjectives = this.objectives.map(obj => this.findObjectiveById(id, obj))
            return resultObjectives.find(obj => obj) || null
        }
        if (Objective.id === id) {
            return Objective;
        }
        const resultObjectives = Objective.objectives.map(obj => this.findObjectiveById(id, obj))
        return resultObjectives.find(obj => obj) || null
    }

    addAStandard(listElement: HTMLElement | null) {
        let allow = true;
        const lastCHildInputElement = listElement?.querySelector('.objective-input-wrapper:last-child input');
        if(lastCHildInputElement && (lastCHildInputElement as HTMLInputElement).value === '') {
            allow = false;
            (lastCHildInputElement as HTMLInputElement).focus();
        }
        if(!allow) return;

        new AddAction({
            subject: this,
        }).execute()

        this.syncState()

        setTimeout(() => {
            listElement?.scrollTo({
                top: listElement?.scrollHeight,
                behavior: 'smooth'
            });
            const lastCHildInputElement = listElement?.querySelector('.objective-input-wrapper:last-child input');
            (lastCHildInputElement as HTMLInputElement)?.focus()
        })

    }

    addDefaultObjective(): Objective {
        const objective = new Objective({
            id: uuidv4(),
            curriculum: this,
            name: '',
            objectives: [],
            parent: null
        })
        this.addObjective(objective)
        return objective
    }

    getHeight(objective?: Objective): number {
        let Objective = objective
        if (!Objective) {
            if (this.objectives.length === 0) return 0;
            return Math.max(...this.objectives.map(objective => this.getHeight(objective)))
        }
        if (Objective.objectives.length === 0) return 1;
        return 1 + this.getHeight(Objective.objectives.at(-1) as Objective)
    }

    syncState() {
        this.subject.syncState()
    }

    jsonify(): IMCurriculum {
        return {
            objectives: this.objectives.map(objective => objective.jsonify())
        }
    }
}