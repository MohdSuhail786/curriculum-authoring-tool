import { ReactNode } from "react"

type IProps = {
    children: ReactNode
    title: string
}

export default function Tooltip({ children, title }: IProps) {

    return (
        <>
            <div style={{ position: 'relative', display: 'inline-block',zIndex: 8 }}>
                {children}
                {
                    <div
                        style={{
                            position: 'absolute',
                            top: '-50px',
                            zIndex: 999,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                        }}
                    >
                        {title}
                    </div>
                }
            </div>
        </>
    )
}