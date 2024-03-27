import { RiDragMove2Fill } from "react-icons/ri"
import { Objective } from "../../../models/Objective"
import { RxCross2 } from "react-icons/rx"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6"

type IProps = {
    objective: Objective
    setDraggable: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CurriculumActions({ objective, setDraggable }: IProps) {

    return (
        <>
            <div className="actions-container" >
                <div
                    className="action-item"
                    onMouseDown={() => setDraggable(true)}
                    onMouseUp={() => setDraggable(false)}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Move"
                    data-tooltip-place="top"
                >
                    <RiDragMove2Fill size={20} />
                </div>
                <div
                    className={`action-item ${!objective.outdentPossible() ? 'disabled' : ''}`}
                    onClick={() => objective.outdent()}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Outdent"
                    data-tooltip-place="top"
                >
                    <FaArrowLeft size={20} />
                </div>
                <div
                    className={`action-item ${!objective.indentPossible() ? 'disabled' : ''}`}
                    onClick={() => objective.indent()}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Indent"
                    data-tooltip-place="top"
                >
                    <FaArrowRight size={20} />
                </div>
                <div
                    className="action-item"
                    onClick={() => objective.delete()}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Delete"
                    data-tooltip-place="top"
                >
                    <RxCross2 size={20} />
                </div>
            </div>
        </>
    )
}