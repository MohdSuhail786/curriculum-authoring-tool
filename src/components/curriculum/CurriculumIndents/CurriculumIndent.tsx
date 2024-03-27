import { Objective } from "../../../models/Objective"

type IProps = {
    objective: Objective
}


export default function CurriculumIndent({ objective }: IProps) {

    return (
        <>
            <div className="indent">
                {
                    [...new Array(objective.getDepth())].map((_, i) => (
                        <div className="indent-item" key={i} />
                    ))
                }
            </div>
        </>
    )
}