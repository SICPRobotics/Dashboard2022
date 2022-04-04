import { NtClient } from "networktables";
import { Auto } from "../auto/parse-auto";
import { NetworkTable } from "./network-table";

export const ntClient = new NtClient<NetworkTable>({
    address: '10.58.22.2',
    port: 1735
});

ntClient.connect();

/*
ntClient.when(e => true, e => {
    if (e.type === 'receivedPacket' && e.packet.type === 'entryUpdate') {
        console.log(`${e.packet.entryValue}`)
    }
});*/

(window as any).ntClient = ntClient;

export async function sendAuto(auto: Auto) {
    ntClient.set('/Wolfbyte/auto', JSON.stringify(auto), {
        persistent: true
    });
}