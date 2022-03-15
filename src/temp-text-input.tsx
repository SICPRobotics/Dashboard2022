import React, { useState } from "react"

interface Props {
    startValue?: string
    onEnter: (value: string) => void
    onCancel: () => void
}

export const TempTextInput = (props: Props) => {
    const [text, setText] = useState(props.startValue ?? '');

    return <input
        autoFocus
        onChange={e => !e.target.value.match(/\W/g) && setText(e.target.value)}
        onKeyDown={e => e.key == 'Escape' ? props.onCancel() : (e.key == 'Enter' ? props.onEnter(text) : '')}
        value={text}/>
}