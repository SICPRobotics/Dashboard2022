import { useEffect, useState } from "react";
import { useAppContext } from "../app-context";
import { useAuto, useAutoNames } from "../auto/hooks";
import { ntClient } from "../util/nt";
import { useNtValue } from "../util/use-nt-value"

export const MainPage = () => {
    const { selectedAuto, setContext } = useAppContext();
    const [autoNames] = useAutoNames();
    const [auto] = useAuto(selectedAuto);
    
    useEffect(() => {
        if (!auto) {
            return;
        }

        ntClient.set('/Wolfbyte/auto', JSON.stringify(auto));
    }, [auto])

    return <span>
        <img src='http://10.58.22.2:1181/?action=stream' />
        <select value={selectedAuto ?? ''} onChange={(e) => setContext({ selectedAuto: e.target.value })}>
            {autoNames?.map((val, i) => <option value={val} key={i}>{val}</option>)}
        </select>
    </span>
}