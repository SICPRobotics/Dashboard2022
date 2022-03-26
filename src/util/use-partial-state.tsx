import { useRef, useState } from "react";

export function usePartialState<TState extends ({} | null)>(defaultVal: TState) {
    const [val, _setVal] = useState(defaultVal);

    const valRef = useRef<TState>();
    valRef.current = val;

    const setValRef = useRef<(newVal: TState) => void>(() => {});
    setValRef.current = _setVal;

    return [val, (newVal: Partial<TState>) => {
        //console.trace()
        //throw 'Where am i called?'
        //console.log('Called!');
        setValRef.current!({ ...val, ...newVal });
    }] as const;
}