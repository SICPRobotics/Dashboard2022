import { useState } from "react";
import { Button } from "../button";
import { Loading } from "../loading";
import { TabButton } from "../tab-button";
import { TempTextInput } from "../temp-text-input";
import { AutoEditor } from "./auto-editor";
import { AutoFileTab } from "./auto-file-tab";
import { useAutos } from "./hooks";

export const AutoPage = () => {
    const [autos, setAutos] = useAutos();
    const [selected, setSelected] = useState<null | string>(null);
    const [addingNew, setAddingNew] = useState(false);

    return <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!addingNew ? '' : <TempTextInput 
                onEnter={(val) => {
                    if (Object.keys(autos!).includes(val)) {
                        return;
                    }

                    setAddingNew(false);
                    setAutos({ ...autos, [val]: '' });
                    setSelected(val);
                }}
                onCancel={() => setAddingNew(false)} /> }
            {!autos ? <Loading /> : Object.keys(autos).map((val, i) => <TabButton isSelected={selected == val} onClick={() => setSelected(val)} key={i}>{val}</TabButton>)}
            <Button onClick={() => setAddingNew(true)}>Add new</Button>
        </div>
        { selected ? <AutoEditor value={autos![selected]} onChange={val => setAutos({ ...autos, [selected]: val })} /> : '' }
    </div>
}