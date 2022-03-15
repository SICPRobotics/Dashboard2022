import React, { ComponentType, ReactElement, useState } from 'react';
import { AutoEditor } from './auto/auto-editor';
import { AutoPage } from './auto/auto-page';
import { MainPage } from './main/main-page';
import { TabButton } from './tab-button';
import { theme } from './theme';

export function App() {
    const [Tab, _setTab] = useState<ComponentType>(() => MainPage);
    const setTab = (tab: ComponentType) => _setTab(() => tab);

    return (
        <div style={{
            background: theme.semidark
        }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <TabButton isSelected={Tab == MainPage} onClick={() => setTab(MainPage)}>main</TabButton>
                <TabButton isSelected={Tab == AutoPage} onClick={() => setTab(AutoPage)}>auto</TabButton>
            </div>
            <Tab />
        </div>
    );
}