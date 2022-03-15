import fs from 'fs/promises';

const autoRoot = '/WolfbyteDashboard2022/auto/';
const dirPromise = fs.mkdir(autoRoot, { recursive: true });

export async function readAutoNames() {
    await dirPromise;
    return fs.readdir(autoRoot);
}

export async function writeAuto(name: string, content: string) {
    await dirPromise;
    return fs.writeFile(autoRoot + name, content);
}

export async function readAuto(name: string) {
    await dirPromise;
    return fs.readFile(autoRoot + name);
}