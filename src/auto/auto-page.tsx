import { useState } from "react";
import { Button } from "../button";
import { Loading } from "../loading";
import { TabButton } from "../tab-button";
import { TempTextInput } from "../temp-text-input";
import { AutoEditor } from "./auto-editor";
import { AutoFileTab } from "./auto-file-tab";
import { useAuto, useAutoNames } from "./hooks";
import { AutoError, Autos } from "./parse-auto";

interface Props {
    selected: string | null
    onSelectedChange: (selected: string) => void
}

export const AutoPage = (props: Props) => {
    const [autoNames, setAutoNames] = useAutoNames();
    const [auto, setAuto] = useAuto(props.selected);
    const [addingNew, setAddingNew] = useState(false);

    return <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!addingNew ? '' : <TempTextInput 
                onEnter={(val) => {
                    if (Object.keys(autoNames!).includes(val)) {
                        return;
                    }

                    setAddingNew(false);
                    setAutoNames([...(autoNames ?? []), val]);
                    props.onSelectedChange(val);
                }}
                onCancel={() => setAddingNew(false)} /> }
            {!autoNames ? <Loading /> : autoNames.map((val, i) => <TabButton isSelected={props.selected == val} onClick={() => props.onSelectedChange(val)} key={i}>{val}</TabButton>)}
            <Button onClick={() => setAddingNew(true)}>Add new</Button>
        </div>
        { props.selected ? <AutoEditor name={props.selected} value={auto} onChange={setAuto} /> : '' }
    </div>
}