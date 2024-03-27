import { useRecoilValue } from "recoil"
import "./CurriculumBody.scss"
import { subjectAtom } from "../../../state/state"
import Button from "../../common/Button/Button"
import ObjectiveInput from "../ObjectiveInput/ObjectiveInput"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { useRef } from "react"
import Empty from "../../common/Empty/Empty"

export default function CurriculumBody() {
    const subject = useRecoilValue(subjectAtom)
    const ref = useRef<HTMLDivElement>(null)

    if (!subject) return <Empty title="Nothing to show here!" />

    return (
        <>
            <div className="subject-name">
                <b>{subject.name}</b>
            </div>
            <div className="wrapper">
                <div className="wrapper-heading">
                    <div className="heading">
                        <div className="main-heading">Actions</div>
                        <div className="sub-heading">Move, Indent,<br /> Outdent, Delete</div>
                    </div>
                    <div className="heading">
                        <div className="main-heading">Standard</div>
                        <div className="sub-heading">The text of the standard</div>
                    </div>
                </div>
                <div className="wrapper-objectives" ref={ref}>
                    {
                        subject.curriculum.objectives.map(objective => <ObjectiveInput key={objective.id} objective={objective} />)
                    }
                </div>
                <Button onClick={() => subject.curriculum.addAStandard(ref.current || null)}><AiOutlinePlusCircle size={20} />Add a standard</Button>
            </div>
        </>
    )
}