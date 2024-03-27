import { ButtonHTMLAttributes } from "react"
import "./Button.scss"

type IProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variation?: "primary" | "danger",
}

export default function Button({ variation = "primary", ...props }: IProps) {

    return <button {...props} className={`${variation}`}>{props.children}</button>
}