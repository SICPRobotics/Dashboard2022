import { useEffect, useRef, useState } from "react";
import { Autos, readAutos, writeAutos } from "../io";
import { AutoInstruction, parseAuto } from "./parse-auto";

export const useAutos = () => {
    const [autos, _setAutos] = useState<Autos | null>(null);
    const ref = useRef<Autos | null>(null);
    const setAutos = (autos: Autos) => {
        ref.current = autos;
        _setAutos(autos);
    }

    useEffect(() => {
        readAutos().then(setAutos);

        const interval = setInterval(() => {
            writeAutos(ref.current ?? {});
        }, 1_000);

        return () => {
            clearInterval(interval);
            writeAutos(ref.current ?? {});
        };
    }, []);

    return [autos, setAutos] as const;
}