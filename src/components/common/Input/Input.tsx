import { InputHTMLAttributes } from "react"
import "./Input.scss"

type IProps = InputHTMLAttributes<HTMLInputElement> & {
    type?: "ghost",
}

export default function Input({ type = "ghost", ...props }: IProps) {

    return <input {...props} className={`${type}`} />
}