import { NtEvent } from "networktables/src/nt-event";
import { useEffect, useRef, useState } from "react";
import { NetworkTable } from "./network-table";
import { ntClient } from "./nt";

export function useNtValue<TKey extends keyof NetworkTable>(key: TKey) {
    type TValue = NetworkTable[TKey];
    const [val, setVal] = useState<TValue | null>(null);

    const valRef = useRef<TValue | null>(val);
    valRef.current = val;

    const setValRef = useRef(setVal);
    setValRef.current = setVal;

    useEffect(() => {
        const listener = (e: NtEvent) => {
            if (e.type === 'entryUpdate' && valRef.current !== e.entries[key]) {
                setValRef.current!(e.entries[key] as any);
            }
        }

        ntClient.when(e => e.type === 'entryUpdate', listener);

        return () => ntClient.removeListener(listener);
    }, [key]);

    return val;
}