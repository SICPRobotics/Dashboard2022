import { useEffect, useRef, useState } from "react";
import { readAuto, readAutoNames, writeAuto } from "../io";

export const useAutoDir = () => {
    const [autos, setAutos] = useState<string[] | null>(null);

    useEffect(() => {
        readAutoNames().then(val => setAutos(val))
    }, []);

    return [autos, setAutos] as const;
}

export const useAuto = (name: string) => {
    const [auto, _setAuto] = useState<string | null>(null);
    const ref = useRef<string | null>(null);
    const setAuto = (code: string) => {
        ref.current = code;
        _setAuto(code);
    }

    useEffect(() => {
        readAuto(name).then(code => setAuto(code.toString()));
        return () => { writeAuto(name, ref.current!) };
    }, []);

    return [auto, setAuto] as const;
}