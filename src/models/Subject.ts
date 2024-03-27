import { setRecoil } from "recoil-nexus";
import { downloadStringAsFile, uuidv4 } from "../utils/Utils";
import { subjectAtom } from "../state/state";
import { Curriculum, IMCurriculum } from "./Curriculum";

export type IMSubject = {
    id: string,
    name: string,
    curriculum: IMCurriculum
}

export class Subject {

    id!: string;
    name!: string;
    curriculum!: Curriculum;
    objectivePlaceholder: string = 'Add a standard here (e.g. Numbers)'

    constructor(config: IMSubject){
        this.id = config.id || uuidv4();
        this.name = config.name;
        this.curriculum = new Curriculum({...config.curriculum, subject: this});
        
        this.syncState()
    }

    syncState() {
        setRecoil(subjectAtom, null)
        setRecoil(subjectAtom, this)
    }

    downloadIMFile() {
        downloadStringAsFile(JSON.stringify(this.jsonify()), `${this.name}_Curriculum_(${new Date().toISOString()}).json`)
    }

    jsonify(): IMSubject {
        return {
            id: this.id,
            name: this.name,
            curriculum: this.curriculum.jsonify()
        }
    }
}