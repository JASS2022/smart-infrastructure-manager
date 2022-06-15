import * as ws from "ws";
import {RawData} from "ws";
import {
    CarEnteringMessage,
    CarExitingMessage, CarGoAroundMessage,
    EnterRoundaboutPermissionMessage
} from "./messages/DrivePermissionMessages";
import {Coordinate, UUID} from "./messages/shared";
import * as uuid from "uuid";

export class DrivePermissionSocket {
    private subscribers: Map<UUID, ws.WebSocket> = new Map<UUID, ws.WebSocket>();
    private wss: ws.Server

    constructor(onReceiveDrivePermission: (carId: UUID) => void) {
        this.wss = new ws.Server({port: 8081});

        this.wss.on("connection", (ws) => {
            const id = uuid.v4();
            this.subscribers.set(id, ws);
            ws.on("close", () => this.subscribers.delete(id));
            ws.on("message", (rawMsg: RawData) => {
                try {
                    console.log("received message", rawMsg.toString());
                    const message = JSON.parse(rawMsg.toString()) as Record<string, any>;

                    switch (message["type"]) {
                        case "carMoveCommand":
                            const drivePermission = message as EnterRoundaboutPermissionMessage;
                            onReceiveDrivePermission(drivePermission.data.carId);
                            break;
                        default:
                            console.error(`received invalid message: ${message}`);
                            return;
                    }
                } catch (e) {
                    console.error("Caught error while handling message", e, rawMsg.toString());
                }
            });
            ws.onerror = () => this.subscribers.delete(id);
        });
    }

    public requestRoundaboutPermission(carId: UUID, entry: Coordinate, exit: Coordinate) {
        // Since we assume we have a single roundabout for now, we just send this to all connected roundabouts
        this.subscribers.forEach((socket) => {
            socket.send(JSON.stringify(<CarEnteringMessage>{
                type: "carEntering",
                data: {
                    carId,
                    entry,
                    exit,
                },
            }))
        })
    }

    public sendCarExitingMessage(carId: UUID) {
        // Since we assume we have a single roundabout for now, we just send this to all connected roundabouts
        this.subscribers.forEach((socket) => {
            socket.send(JSON.stringify(<CarExitingMessage>{
                type: "carExiting",
                data: {
                    carId,
                },
            }))
        })
    }

    public sendCarGoAroundMessage(carId: UUID) {
        // Since we assume we have a single roundabout for now, we just send this to all connected roundabouts
        this.subscribers.forEach((socket) => {
            socket.send(JSON.stringify(<CarGoAroundMessage>{
                type: "carGoAround",
                data: {
                    carId,
                },
            }))
        })
    }
}
