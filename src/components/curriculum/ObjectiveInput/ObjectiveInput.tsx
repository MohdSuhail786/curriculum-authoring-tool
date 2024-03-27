import "./ObjectiveInput.scss"
import { Objective } from "../../../models/Objective";
import { useRef, useState } from "react";
import Input from "../../common/Input/Input";
import CurriculumActions from "../CurriculumActions/CurriculumActions";
import CurriculumIndent from "../CurriculumIndents/CurriculumIndent";

type IProps = {
    objective: Objective
}

export default function ObjectiveInput({ objective }: IProps) {
    const [dragging, setDragging] = useState(false)
    const [draggable, setDraggable] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const handleDragStart = () => {
        setDragging(true)
        objective.setDragging(true)
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        const id = e.currentTarget?.id;
        if (!id) return;
        const draggedOverObjectiveID = id.split('objective-input-wrapper-')[1]
        const draggedObjective = objective.curriculum.currentlyDraggedObjective;
        if (!draggedObjective || draggedOverObjectiveID === draggedObjective.id) return;
        const draggedOverObjective = objective.curriculum.findObjectiveById(draggedOverObjectiveID)
        if (!draggedOverObjective || !draggedObjective.moveToPossible(draggedOverObjective)) return;
        objective.curriculum.setDragOverObjective(draggedOverObjective)
        objective.curriculum.setDragOverHTMLElement(e.currentTarget)
        e.currentTarget.style.paddingBottom = '41px'

    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        const id = e.currentTarget?.id;
        if (!id) return;
        const draggedOverObjectiveID = id.split('objective-input-wrapper-')[1]
        const draggedOverObjective = objective.curriculum.findObjectiveById(draggedOverObjectiveID)
        if (!draggedOverObjective) return;
        if (objective.curriculum.dragOverObjective?.id === draggedOverObjective.id) {
            objective.curriculum.setDragOverObjective(null)
            objective.curriculum.setDragOverHTMLElement(null)
        }
        e.currentTarget.style.paddingBottom = '0px'
    }

    const handleDragEnd = () => {
        if (objective.curriculum.dragOverHTMLElement) {
            objective.curriculum.dragOverHTMLElement.style.paddingBottom = '0px'
        }
        objective.curriculum.currentlyDraggedObjective?.moveTo(objective.curriculum.dragOverObjective)
        setDragging(false)
        objective.setDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return (
        <>
            <div
                ref={ref}
                key={objective.id}
                id={`objective-input-wrapper-${objective.id}`}
                onDragOver={handleDragOver}
                className={`objective-input-wrapper ${dragging ? 'dragging' : ''}`}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                draggable={draggable}
            >
                <div className={`body-container ${objective.curriculum.dragging ? 'listening-false' : ''}`}>
                    <CurriculumActions objective={objective} setDraggable={setDraggable} />
                    <CurriculumIndent objective={objective} />
                    <div className="objecitve-name-container">
                        <Input
                            placeholder={objective.getSubject().objectivePlaceholder}
                            value={objective.name}
                            style={{
                                color: objective.parent === null ? 'rgba(0, 255, 255, 0.838)' : `rgba(0,0,0,${objective.getOpacity()})`,
                                fontWeight: objective.getFontWeight(),
                            }}
                            onChange={(e) => objective.setName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (objective.curriculum.getLastObjective()?.id === objective.id) {
                                        objective.curriculum.addAStandard(ref.current?.parentElement || null)
                                    }
                                    setTimeout(() => {
                                        const nextObjectiveElement = document.querySelector(`#objective-input-wrapper-${objective.id} + .objective-input-wrapper`);
                                        const nextObjectiveInputElement = nextObjectiveElement?.querySelector('input');
                                        nextObjectiveInputElement?.focus()
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {
                objective.objectives.map(childObjective => <ObjectiveInput key={childObjective.id} objective={childObjective} />)
            }
        </>
    )
}