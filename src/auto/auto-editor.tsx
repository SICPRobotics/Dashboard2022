import React, { CSSProperties, useRef } from "react";
import { useState } from "react"
import { Loading } from "../loading";
import { theme } from "../theme";
import { autoHelp } from "./auto-help";
import { useAutos } from "./hooks";
import { AutoError, AutoInstruction, CompiledAuto, parseAuto } from "./parse-auto";

const instructionStyle: CSSProperties = {
    color: 'orange'
}

const numberStyle: CSSProperties = {
    color: 'blue'
}

const suffixStyle: CSSProperties = {
    color: 'green'
}

const errorStyle: CSSProperties = {
    color: 'red'
}

const textAreaStyle: CSSProperties = {
    resize: 'none',
    color: 'transparent',
    background: 'none',
    width: '100%',
    caretColor: 'white'
}

const preStyle: CSSProperties = {
    pointerEvents: 'none',
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    whiteSpace: 'break-spaces'
}

const sharedStyle: CSSProperties = {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 16,
    padding: 0,
    margin: 0,
    border: 0
}

const codeWrapStyle: CSSProperties = {
    backgroundColor: theme.dark,
    padding: 10,
    borderRadius: 5
}

const padding: CSSProperties = {
    padding: 5
}

interface Props {
    value?: string,
    errors: AutoError[]
    onChange: (code: string, compiled: CompiledAuto) => void
}

export const AutoEditor = (props: Props) => {
    return <>
        <div style={{ ...padding, width: '100%' }}>
            <h2>Autonomous Code</h2>
            <div style={codeWrapStyle}>
                <div style={{ position: 'relative' }}>
                    <pre style={{ ...sharedStyle, ...preStyle }}>{applySyntaxHighlighting(props.value, props.errors)}</pre>
                    <textarea
                        style={{ ...sharedStyle, ...textAreaStyle }}
                        rows={(props.value?.split('\n').length ?? 0) + 1}
                        onChange={e => props.onChange(e.target.value, parseAuto(e.target.value))}
                        spellCheck={false}
                        autoComplete={'none'}
                        autoCorrect={'none'}
                        autoFocus
                        value={props.value}/>
                </div>
            </div>
        </div>
        <div style={padding}>
            <h2>Auto Reference</h2>
            <div style={codeWrapStyle}>
                <pre style={sharedStyle}>
                    {applySyntaxHighlighting(autoHelp)}
                </pre>
            </div>

            <h2>Code Status</h2>
            <div>
                { props.errors.length == 0 ? 'Compiled successfully.' : `Failed to compile: ${props.errors.length} error${props.errors.length == 1 ? '' : 's'}`}
                <pre>
                    { props.errors.map(err => `\nLine ${err.line + 1}: ${err.message}`) }
                </pre>
            </div>
        </div>
        
    </>
}

function applySyntaxHighlighting(code?: string, errors?: AutoError[]) {
    if (!code) {
        return;
    }

    const styles: CSSProperties[] = [{}];

    function applyStyles(regex: RegExp, style: CSSProperties | null, ...captureStyles: CSSProperties[]) {
        if (!code) {
            return;
        }
        
        for (const match of code.matchAll(regex)) {
            if (style) {
                applyStyleToRange(style, match.index!, match.index! + match[0].length)
            }
            
            let captureIndex = 0;
            for (let i = 0; i < captureStyles.length; i++) {
                if (match[i + 1] && captureStyles[i]) {
                    applyStyleToRange(captureStyles[i], match.index! + captureIndex, match.index! + captureIndex + match[i + 1].length);
                }

                captureIndex += match[i + 1].length;
            }
        }
    }

    function getStyleAt(index: number) {
        while (index >= 0) {
            const val = styles[index--];

            if (val) {
                return val;
            }
        }

        throw 'getStyleAt never found a style'
    }

    function applyStyleToRange(style: CSSProperties, start: number, end: number) {
        styles[end] = getStyleAt(end);
        styles[start] = { ...getStyleAt(start), ...style };

        for (let i = start + 1; i < end; i++) {
            if (styles[i]) {
                styles[i] = { ...styles[i], ...style }
            }
        }
    }

    applyStyles(/^\w+/gm, instructionStyle);
    applyStyles(/(\d+)([a-zA-Z]+)/gm, null, numberStyle, suffixStyle);

    const lineBreakIndexes = [0];

    for (const match of code.matchAll(/\n/gm)) {
        lineBreakIndexes.push(match.index!);
    }

    lineBreakIndexes.push(code.length);

    if (errors) {
        for (const error of errors) {
            applyStyleToRange(errorStyle, lineBreakIndexes[error.line], lineBreakIndexes[error.line + 1]);
        }
    }

    const elements = [];

    const raisedStyles = Object.entries(styles);

    for (let i = 0; i < raisedStyles.length; i++) {
        const [_, style] = raisedStyles[i];
        const index = Number(raisedStyles[i][0]);
        const nextIndex = i < raisedStyles.length - 1 ? Number(raisedStyles[i + 1][0]) : undefined;

        elements.push(<span key={i} style={style}>{code.substring(index, nextIndex)}</span>);
    }

    return elements;
}