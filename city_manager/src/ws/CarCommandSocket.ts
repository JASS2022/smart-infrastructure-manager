import * as ws from "ws";
import {TrafficInformationMessage} from "./messages/TrafficInformationMessages";

export class TrafficInformationSocket {
    // TODO: add type for subscriber
    private subscribers: Map<number, any>;
    private nextId = 0
    private wss: ws.Server

    constructor() {
        this.wss = new ws.Server({ port: 8080 });

        this.wss.on("connection", ws => {
            const id = this.nextId++;
            this.subscribers.set(id, ws);
            ws.on("close", () => this.subscribers.delete(id));
            ws.on("message", (message) => {});
            ws.onerror = () => this.subscribers.delete(id);
        });
    }

    broadcastMessage(message: TrafficInformationMessage) {
        this.subscribers.forEach((subscriber) => subscriber.send(JSON.stringify(message)))
    }
}
