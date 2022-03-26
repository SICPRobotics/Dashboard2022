import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../app-context";
import { readAuto, readAutoNames, writeAuto } from "../util/file-io";
import { Auto, AutoInstruction, parseAuto } from "./parse-auto";

/*export const useAuto = (name: string) => {
    const [autos, _setAutos] = useState<Auto | null>(null);
    const ref = useRef<Auto | null>(null);
    const setAutos = (autos: Auto) => {
        ref.current = autos;
        _setAutos(autos);
    }

    useEffect(() => {
        readAuto(name).then(setAutos);

        const interval = setInterval(() => {
            writeAuto(name, ref.current);
        }, 1_000);

        return () => {
            clearInterval(interval);
            writeAuto(name, ref.current);
        };
    }, []);

    return [autos, setAutos] as const;
}*/

const _useAuto = (name: string | null) => {
    const context = useAppContext();

    if (!name) {
        return [null, () => {}] as const;
    }

    return [context.autos[name] ?? null, (auto: Auto | null) => context.setContext({ autos: { ...context.autos, [name]: auto }})] as const;
}

export const useAuto = (name: string | null) => {
    const [auto, setAuto] = _useAuto(name);

    useEffect(() => {
        if (name) {
            setAuto(null);
            console.log('Set auto to null.')
            readAuto(name).then(setAuto);
        }
    }, [name]);

    return [auto, setAuto] as const;
}

export const useAutoNames = () => {
    const context = useAppContext();

    return [context.autoNames, (autoNames: string[]) => context.setContext({ autoNames })] as const;
}