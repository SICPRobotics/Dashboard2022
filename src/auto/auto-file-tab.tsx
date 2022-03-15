import { theme } from "../theme"

interface Props {
    name: string,
    onClick: () => void,
    isSelected: boolean
}

export const AutoFileTab = (props: Props) => {
    return <button onClick={props.onClick} style={{
        color: props.isSelected ? theme.accent : theme.light
    }}>{props.name}</button>
}