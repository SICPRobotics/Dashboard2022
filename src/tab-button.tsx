import { PropsWithChildren } from "react"
import { theme } from "./theme"

interface Props {
    onClick: () => void,
    isSelected: boolean
}

export const TabButton = (props: PropsWithChildren<Props>) =>
        <button
            style={{
                all: 'unset',
                padding: '5px 10px',
                color: props.isSelected ? theme.accent : theme.light,
                cursor: 'pointer'
            }} 
            onClick={props.onClick}>{props.children}</button>