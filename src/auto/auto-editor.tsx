import React, { CSSProperties, useRef } from "react";
import { useState } from "react"
import Editor from 'react-simple-code-editor';
import { Loading } from "../loading";
import { useAuto } from "./hooks";

interface Props {
    name: string
}

const instructionStyle: CSSProperties = {
    color: 'orange'
}

const numberStyle: CSSProperties = {
    color: 'blue'
}

const suffixStyle: CSSProperties = {
    color: 'green'
}

const textAreaStyle: CSSProperties = {
    resize: 'none',
    opacity: 0
}

const preStyle: CSSProperties = {
    pointerEvents: 'none',
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
}

const sharedStyle: CSSProperties = {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
    padding: 0,
    margin: 0,
    border: 0
}

const padding: CSSProperties = {
    padding: 5
}

export const AutoEditor = (props: Props) => {
    const [code, setCode] = useAuto(props.name)
    
    if (code === null) {
        return <Loading />
    }

    return <>
        <div style={{ position: 'relative', ...padding }}>
            <pre style={{ ...sharedStyle, ...preStyle, ...padding }}>{applySyntaxHighlighting(code)}</pre>
            <textarea
                style={{ ...sharedStyle, ...textAreaStyle }}
                rows={code.split('\n').length + 2}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                autoComplete={'none'}
                autoCorrect={'none'}
                value={code}/>
        </div>
    </>
}

function applySyntaxHighlighting(code: string) {

    const styles: {
        style: CSSProperties,
        start: number,
        end: number
    }[] = [];

    function applyStyles(regex: RegExp, style: CSSProperties | null, ...captureStyles: CSSProperties[]) {
        for (const match of code.matchAll(regex)) {
            if (style) {
                styles.push({
                    style,
                    start: match.index!,
                    end: match.index! + match[0].length
                });
            }
            
            let captureIndex = 0;
            for (let i = 0; i < captureStyles.length; i++) {
                if (match[i + 1]) {
                    styles.push({
                        style: captureStyles[i],
                        start: match.index! + captureIndex,
                        end: match.index! + captureIndex + match[i + 1].length
                    })
                }

                captureIndex += match[i + 1].length;
            }
        }
    }

    applyStyles(/^\w+/gm, instructionStyle);
    applyStyles(/(\d+)([A-z]+)/gm, null, numberStyle, suffixStyle)

    const elements = [];
    elements.push(<span key={'start'}>{code.substring(0, styles[0]?.start)}</span>);

    for (let i = 0; i < styles.length; i++) {
        const current = styles[i];
        const next = styles[i + 1] ?? null;

        elements.push(<span key={i} style={current.style}>{code.substring(current.start, current.end)}</span>);
        if (!next || next.start !== current.end) {
            elements.push(<span key={i + 'i'}>{code.substring(current.end, next?.start)}</span>);
        }
    }

    return elements;
}