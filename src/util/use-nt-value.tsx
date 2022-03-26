import { useEffect, useRef, useState } from "react";
import { onNtChange } from "./nt";

export function useNtValue<TType>(value: string) {
    const [val, setVal] = useState<TType | null>(null);

    const valRef = useRef<TType | null>(val);
    valRef.current = val;

    const setValRef = useRef(setVal);
    setValRef.current = setVal;

    useEffect(() => onNtChange(nt => {
        if (nt[value] !== valRef.current) {
            setValRef.current!(nt[value])
        }
    }), []);

    return val;
}