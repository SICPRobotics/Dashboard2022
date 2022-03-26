import { Client } from 'wolfbyte-networktables';
import { Auto, AutoInstruction, parseAuto } from '../auto/parse-auto';
import type { FileHandle } from 'fs/promises';
import nodePath from 'path';
//import fs from 'fs/promises';

export const fs = window.require('fs/promises');

const encoding = 'utf8';
const autoPath = process.cwd() + '/autos/';

// Map of file descriptors.
const fds: { [index: string]: {
    //fd: FileHandle,
    content?: string
    currentlyWriting: boolean,
    pendingWriteRes?: (canContinue: boolean) => void
}} = {};

async function getFile(path: string) {
    const normalized = nodePath.normalize(path);

    return fds[normalized] ?? (fds[normalized] = {
        //fd: await fs.open(path, 'r+'),
        currentlyWriting: false
    });
}

async function readFile(path: string) {
    //const { content } = await getFile(path);

    /*if (content) {
        return content;
    } else {
        const res = await fd.readFile({ encoding });
        fds[nodePath.normalize(path)].content = res;
        return res;
    }*/

    return fs.readFile(path, { encoding });
}

async function writeFile(path: string, data: string) {
    const file = await getFile(path);

    const canContinue = await new Promise<boolean>((res, rej) => {
        if (file.currentlyWriting) {
            (file.pendingWriteRes ?? (() => {}))(false);
            file.pendingWriteRes = res;
        } else {
            res(true);
        }
    });
    
    if (canContinue) {
        file.currentlyWriting = true;
        console.log('started write ' + path);
        //await file.fd.writeFile(data);
        fs.writeFile(path, data);
        console.log('end write ' + path)
        file.currentlyWriting = false;
        const cb = file.pendingWriteRes ?? (() => {});
        delete file.pendingWriteRes;
        cb(true);
    }
}

export async function writeAuto(name: string, auto?: Auto | null) {
    if (!auto) {
        return;
    }

    await writeFile(autoPath + name, auto.source);
}

export async function readAuto(name: string): Promise<Auto> {
    try {
        const rawAuto = (await readFile(autoPath + name)).toString();
        const { instructions } = parseAuto(rawAuto);
        eval("debugger");

        console.log(`Read auto ${name}: \n ${rawAuto}`)

        return {
            source: rawAuto,
            instructions
        }
    } catch (e) {
        console.log(`Failed to read auto: ${e}`)
        return {
            source: '',
            instructions: []
        }
    }
}

(window as any).readAuto = readAuto;

export async function readAutoNames() {
    return fs.readdir(autoPath)
}