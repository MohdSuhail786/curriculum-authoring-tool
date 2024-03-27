import { AllHTMLAttributes } from "react"
import "./Empty.scss"

type IProps = AllHTMLAttributes<HTMLDivElement> & {
    title: string
}

export default function Empty({title, ...props}: IProps) {

    return (
        <>
            <div className="empty-container" {...props}>
                {title}
            </div>
        </>
    )
}