import * as ws from "ws";

export class DrivePermissionSocket {
    // TODO: add type for subscriber
    private subscribers: Map<number, any>;
    private nextId = 0
    private wss: ws.Server

    constructor() {
        this.wss = new ws.Server({ port: 8080 });

        this.wss.on("connection", (ws) => {
            const id = this.nextId++;
            this.subscribers.set(id, ws);
            ws.on("close", () => this.subscribers.delete(id));
            ws.onerror = () => this.subscribers.delete(id);
        });
    }
}
