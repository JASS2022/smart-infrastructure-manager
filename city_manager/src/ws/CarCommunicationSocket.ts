import * as ws from "ws";
import {TrafficInformationMessage} from "./messages/TrafficInformationMessages";
import {Coordinate, UUID} from "./messages/shared";
import * as uuid from "uuid";
import {RawData} from "ws";
import {EnterRoundaboutPermissionMessage} from "./messages/DrivePermissionMessages";
import {
    CarLocationUpdateMessage,
    CarStatus,
    CarStatusUpdate,
    SpeedBumpDetectedMessage
} from "./messages/CarStatusMessages";
import {CarCommand, CarCommandMessage} from "./messages/CarCommandMessages";

export class CarCommunicationSocket {
    private subscribers: Map<UUID, ws.WebSocket> = new Map<UUID, ws.WebSocket>();
    private wss: ws.Server

    constructor(props: {
        onCarConnect: (id: UUID) => void,
        onCarDisconnect: (id: UUID) => void,
        onLocationUpdate: (id: UUID, newLocation: Coordinate) => void,
        onStatusUpdate: (id: UUID, status: CarStatus) => void,
        onSpeedBumpDetected: (id: UUID, location: Coordinate) => void,
    }) {
        this.wss = new ws.Server({port: 8080});

        this.wss.on("connection", (ws) => {
            const id = uuid.v4();
            this.subscribers.set(id, ws);
            props.onCarConnect(id);

            ws.on("close", () => {
                props.onCarConnect(id);
                this.subscribers.delete(id);
            });
            ws.on("message", (rawMsg: RawData) => {
                const message = JSON.parse(rawMsg.toString()) as Record<string, any>;

                switch (message["type"]) {
                    case "locationUpdate":
                        const locationMessage = message as CarLocationUpdateMessage;
                        // TODO: call the april tag to location translator here
                        props.onLocationUpdate(id, {x: 0, y: 0});
                        break;
                    case "statusUpdate":
                        const statusMessage = message as CarStatusUpdate;
                        props.onStatusUpdate(id, statusMessage.data);
                        break;
                    case "speedBumpDetected":
                        const speedBumpMessage = message as SpeedBumpDetectedMessage;
                        // TODO: call the april tag to location translator here
                        props.onSpeedBumpDetected(id, {x: 0, y: 0});
                        break;
                    default:
                        console.error(`received invalid message: ${message}`);
                        return;
                }
            });
            ws.onerror = () => {
                props.onCarConnect(id);
                this.subscribers.delete(id);
            };
        });
    }

    public sendCarCommand(id: UUID, command: CarCommand) {
        const socket = this.subscribers.get(id);
        if (!socket) {
            console.error(`Tried to send message to unknown car with id ${id}`);
            return;
        }

        socket.send(JSON.stringify(<CarCommandMessage>{
            type: "command",
            data: command,
        }));
    }
}
