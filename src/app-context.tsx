import React, { useContext } from "react";
import { Autos } from "./auto/parse-auto";

export interface AppContext {
    autos: Autos,
    autoNames: null | string[],
    selectedAuto: null | string,
    setContext: (context: Partial<AppContext>) => void
}

export const defaultContext: AppContext = {
    autos: {},
    autoNames: null,
    selectedAuto: null,
    setContext: () => {},
}

export const AppContextInst = React.createContext<AppContext>(defaultContext);

export const useAppContext = () => useContext(AppContextInst);