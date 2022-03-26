import React, { ComponentType, ReactElement, useEffect, useRef, useState } from 'react';
import { AppContext, AppContextInst, defaultContext } from './app-context';
import { AutoEditor } from './auto/auto-editor';
import { AutoPage } from './auto/auto-page';
import { MainPage } from './main/main-page';
import { TabButton } from './tab-button';
import { theme } from './theme';
import { readAutoNames } from './util/file-io';
import { ntClient, onNtChange } from './util/nt';
import { usePartialState } from './util/use-partial-state';


type AppTab = 'main' | 'auto';

export function App() {
    const [context, _setContext] = usePartialState<AppContext>(defaultContext);

    useEffect(() => {
        readAutoNames().then(autoNames => setContext({ autoNames }));
    }, []);

    const setContextRef = useRef<(ctx: Partial<AppContext>) => void>(() => {});
    setContextRef.current = _setContext;
    function setContext(context: Partial<AppContext>) {
        setContextRef.current!(context)
    }


    const [tab, setTab] = useState<AppTab>('main');

    return (
        <AppContextInst.Provider value={{
            ...context,
            setContext
        }}>
            <div style={{
                background: theme.semidark
            }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <TabButton isSelected={tab === 'main'} onClick={() => setTab('main')}>main</TabButton>
                    <TabButton isSelected={tab === 'auto'} onClick={() => setTab('auto')}>auto</TabButton>
                </div>
                {tab === 'auto' ? <AutoPage selected={context.selectedAuto} onSelectedChange={selectedAuto => setContext({ selectedAuto })} /> : <MainPage />}
            </div>
        </AppContextInst.Provider>
    );
}