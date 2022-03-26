import { Client } from "wolfbyte-networktables";
import { Auto } from "../auto/parse-auto";

export const ntClient = new Client();
(window as any).client = ntClient;
const networkTable: {[index: string]: any} = {};
const ntPath = '/Wolfbyte/auto';

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
    //client.startDebug('nt', 3);
    ntClient.start((isConnected, err) => {
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

ntClient.addListener((key, value, valueType, type, id, flags) => {
    if (type === 'add') {
        console.log(`Added key ${key}`)
        resetReadyTimer();
    }
    
    if (type === 'add' || type === 'update') {
        networkTable[key] = value;

        if (key === ntPath) {
            resReady();
        }
    } else if (type === 'delete') {
        delete networkTable[key];
    }
});

(window as any).nt = networkTable;

export async function sendAuto(auto: Auto) {
    ntClient.Assign(JSON.stringify(auto), ntPath, true);
}