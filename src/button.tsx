import { PropsWithChildren } from "react"
import { theme } from "./theme"

interface Props {
    onClick: () => void
}

export const Button = (props: PropsWithChildren<Props>) =>
        <button
            style={{
                all: 'unset',
                padding: '5px 10px',
                backgroundColor: theme.dark,
                borderRadius: 5,
                color: theme.light,
                cursor: 'pointer'
            }} 
            onClick={props.onClick}>{props.children}</button>