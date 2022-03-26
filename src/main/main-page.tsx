import { useAppContext } from "../app-context";
import { useAuto, useAutoNames } from "../auto/hooks";
import { useNtValue } from "../util/use-nt-value"

export const MainPage = () => {
    const ntAuto = useNtValue('/Wolfbyte/auto');
    const { selectedAuto } = useAppContext();
    const [autoNames] = useAutoNames();
    const [auto] = useAuto(selectedAuto);

    const ntArm = useNtValue('/SmartDashboard/Pigeon Pitch');

    return <span>
        <img src='http://10.58.22.2:1181/?action=stream' />
        <>{ntArm}</>
    </span>
}