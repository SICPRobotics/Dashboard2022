import { useEffect, useRef, useState } from "react";
import { Autos, readAutos, writeAutos } from "../io";

export const useAutos = () => {
    const [autos, _setAutos] = useState<Autos | null>(null);
    const ref = useRef<Autos | null>(null);
    const setAutos = (code: Autos) => {
        ref.current = code;
        _setAutos(code);
    }

    useEffect(() => {
        readAutos().then(setAutos);
        return () => { writeAutos(ref.current!) };
    }, []);

    return [autos, setAutos] as const;
}