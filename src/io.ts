import { Client } from 'wolfbyte-networktables';
import { AutoInstruction } from './auto/parse-auto';

export interface Autos {
    [name: string]: {
        source: string,
        instructions: AutoInstruction[]
    }
}

const client = new Client();
(window as any).client = client;
const networkTable: {[index: string]: any} = {};
const path = '/WolfbyteAuto/Autos';
let resReady: () => void;
const readyPromise = new Promise<void>((res, rej) => {
    resReady = () => res();
});

readyPromise.then(() => console.log('ready'));

let resReadyTimeoutHandle: null | number = null;
function resetReadyTimer() {
    if (resReadyTimeoutHandle != null) {
        clearTimeout(resReadyTimeoutHandle)
    }

    setTimeout(resReady, 5000);
}

function tryClientStart() {
    console.log('Trying to connect to robot...');
    client.startDebug('nt', 3);
    client.start((isConnected, err) => {
        console.log(`NT Status:`)
        console.log({ isConnected, err });
        if (err) {
            console.log('Connection failed.');
            //setTimeout(tryClientStart, 1_000);
        } else {
            console.log('Connection success!');
        }
    }, '10.58.22.2');
    
}
tryClientStart();

client.addListener((key, value, valueType, type, id, flags) => {
    if (type === 'add') {
        console.log(`Added key ${key}`)
        resetReadyTimer();
    }
    
    if (type === 'add' || type === 'update') {
        networkTable[key] = value;

        if (key === path) {
            resReady();
        }
    } else if (type === 'delete') {
        delete networkTable[key];
    }
});

console.log(networkTable);

let waitQueued = false;
let latestAutos: Autos = {};
export async function writeAutos(autos: Autos) {
    latestAutos = autos;

    if (waitQueued) {
        console.log(`writeAutos blocked because of existing call`)
        return;
    }

    waitQueued = true;
    await readyPromise;
    waitQueued = false;

    client.Assign(JSON.stringify({ ...networkTable[path], ...latestAutos }), path, true);
}

export async function readAutos(): Promise<Autos> {
    try {
        return JSON.parse(networkTable[path]);
    } catch (e) {
        return {};
    }
    
}

export async function selectAuto(name: string) {
    client.Assign('/WolfbyteAuto/SelectedAuto', name, true);
}

export async function getSelectedAuto(): Promise<string> {
    return networkTable['/WolfbyteAuto/SelectedAuto'];
}