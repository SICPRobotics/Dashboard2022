import React, { useState } from "react"

interface Props {
    startValue?: string
    onEnter: (value: string) => void
    onCancel: () => void
}

export const TempTextInput = (props: Props) => {
    const [text, setText] = useState(props.startValue ?? '');

    return <input
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key == 'Escape' ? props.onCancel() : (e.key == 'Enter' ? props.onEnter(text) : '')}
        value={text}/>
}