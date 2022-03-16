import { useEffect, useRef, useState } from "react";
import { Autos, readAutos, writeAutos } from "../io";
import { AutoInstruction, parseAuto } from "./parse-auto";

export const useAutos = () => {
    const [autos, _setAutos] = useState<Autos | null>(null);
    const ref = useRef<Autos | null>(null);
    const setAutos = (code: Autos) => {
        ref.current = code;
        _setAutos(code);
    }

    function getCompiled() {
        const compiled: { [index: string]: AutoInstruction[] } = {};

        if (!autos) {
            return compiled;
        }

        for (const [key, value] of Object.entries(ref.current!)) {
            compiled[key] = parseAuto(value).instructions;
        }

        return compiled;
    }

    useEffect(() => {
        readAutos().then(setAutos);

        const interval = setInterval(() => {
            writeAutos(getCompiled());
        }, 20_000);

        return () => {
            clearInterval(interval);
            writeAutos(getCompiled());
        };
    }, []);

    return [ref.current!, setAutos] as const;
}