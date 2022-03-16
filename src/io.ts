import { Client } from 'wpilib-nt-client';
import { AutoInstruction } from './auto/parse-auto';

export interface Autos {
    [name: string]: string
}

const client = new Client();

const networkTable: {[index: string]: any} = {};

client.start((isConnected, err) => {
    console.log(`NT Status:`)
    console.log({ isConnected, err });
}, '10.58.22.2');

client.addListener((key, value, valueType, type, id, flags) => {
    if (type === 'add' || type === 'update') {
        networkTable[key] = value;
    } else if (type === 'delete') {
        delete networkTable[key];
    }
})

export async function writeAutos(autos: { [index: string]: AutoInstruction[] }) {
    
}

export async function readAutos() {
    // TODO some NT stuff
    return {};
}