import * as ws from "ws";
import {Coordinate, UUID, LocatorCoordinates} from "./messages/shared";
import * as uuid from "uuid";
import {RawData} from "ws";
import {
    CarLocationUpdateMessage,
    CarStatus,
    CarStatusUpdate, InitialCarLocationMessage,
    SpeedBumpDetectedMessage
} from "./messages/CarStatusMessages";
import {CarCommand, CarCommandMessage} from "./messages/CarCommandMessages";

export class CarCommunicationSocket {
    private subscribers: Map<UUID, ws.WebSocket> = new Map<UUID, ws.WebSocket>();
    private wss: ws.Server

    constructor(props: {
        onCarConnect: (id: UUID, trip: Coordinate[]) => void,
        onCarDisconnect: (id: UUID) => void,
        onLocationUpdate: (id: UUID, newLocation: Coordinate) => void,
        onStatusUpdate: (id: UUID, status: CarStatus) => void,
        onSpeedBumpDetected: (id: UUID, location: Coordinate) => void,
    }) {
        this.wss = new ws.Server({port: 8080});

        this.wss.on("connection", (ws) => {
            const id = uuid.v4();
            this.subscribers.set(id, ws);

            ws.on("close", () => {
                props.onCarDisconnect(id);
                this.subscribers.delete(id);
            });
            ws.on("message", (rawMsg: RawData) => {
                try {
                    console.log("received message", rawMsg.toString());
                    const message = JSON.parse(rawMsg.toString()) as Record<string, any>;

                    switch (message["type"]) {
                        case "locationUpdate":
                            const locationMessage = message as CarLocationUpdateMessage;
                            props.onLocationUpdate(id, LocatorCoordinates[locationMessage.data.aprilTag]);
                            break;
                        case "statusUpdate":
                            const statusMessage = message as CarStatusUpdate;
                            props.onStatusUpdate(id, statusMessage.data);
                            break;
                        case "speedBumpDetected":
                            const speedBumpMessage = message as SpeedBumpDetectedMessage;
                            props.onSpeedBumpDetected(id, LocatorCoordinates[speedBumpMessage.data.aprilTag]);
                            break;
                        case "initialCarLocation":
                            const initialCarLocationMessage = message as InitialCarLocationMessage;
                            props.onCarConnect(id, initialCarLocationMessage.data.trip);
                            break;
                        default:
                            console.error(`received invalid message: ${message}`);
                            return;
                    }
                } catch (e) {
                    console.error("Caught error while handling message", e, rawMsg.toString());
                }
            });
            ws.onerror = () => {
                this.subscribers.delete(id);
                props.onCarDisconnect(id);
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
