import { useState } from "react";
import { Button } from "../button";
import { Loading } from "../loading";
import { TabButton } from "../tab-button";
import { TempTextInput } from "../temp-text-input";
import { AutoFileTab } from "./auto-file-tab";
import { useAutoDir } from "./hooks"

export const AutoPage = () => {
    const [autos, setAutos] = useAutoDir();
    const [selected, setSelected] = useState<null | string>(null);
    const [addingNew, setAddingNew] = useState(false);

    return <div style={{ display: 'flex', flexDirection: 'row' }}>
        here
        <div>
            {addingNew === null ? '' : <TempTextInput 
                onEnter={(val) => {
                    setAddingNew(false);
                    setAutos([val, ...autos!]);
                    setSelected(val);
                }}
                onCancel={() => setAddingNew(false)} /> }
            {!autos ? <Loading /> : autos.map((val, i) => <TabButton isSelected={selected == val} onClick={() => setSelected(val)} key={i}>{val}</TabButton>)}
            <Button onClick={() => setAddingNew(true)}>Add new</Button>
        </div>
    </div>
}