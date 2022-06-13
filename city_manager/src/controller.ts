import {TrafficInformationSocket} from "./ws/TrafficInformationSocket";
import {DrivePermissionSocket} from "./ws/DrivePermissionSocket";
import {CarCommunicationSocket} from "./ws/CarCommunicationSocket";
import {Coordinate, UUID} from "./ws/messages/shared";
import {CarStatus} from "./ws/messages/CarStatusMessages";

interface DuckieBotState {
    id: UUID
    lastKnownLocation: Coordinate
    status: CarStatus
    lastSeen: Date
}

export class SmartCityController {
    private trafficInformationSocket: TrafficInformationSocket
    private drivePermissionSocket: DrivePermissionSocket
    private carCommunicationSocket: CarCommunicationSocket

    private duckieBots = new Map<UUID, DuckieBotState>()
    private speedBumps: Coordinate[] = [];

    constructor() {
        this.trafficInformationSocket = new TrafficInformationSocket();
        this.drivePermissionSocket = new DrivePermissionSocket((carId) => {
            this.carCommunicationSocket.sendCarCommand(carId, "start");
        });
        this.carCommunicationSocket = new CarCommunicationSocket({
            onCarConnect: (id) => {
                this.duckieBots.set(id, {
                    id,
                    lastKnownLocation: {x: 0, y: 0},
                    status: {
                        velocity: 0,
                        batteryLevel: 0,
                    },
                    lastSeen: new Date(),
                });
            },
            onCarDisconnect: (id) => this.duckieBots.delete(id),
            onLocationUpdate: (id, newLocation) => {
                const carState = this.duckieBots.get(id);
                if (!carState) return;

                carState.lastKnownLocation = newLocation;
                carState.lastSeen = new Date();
                this.duckieBots.set(id, carState);

                this.trafficInformationSocket.broadcastLocationUpdate({
                    id,
                    location: carState.lastKnownLocation,
                    state: "normal", // TODO
                    trip: [], // TODO
                    velocity: carState.status.velocity,
                    batteryLevel: carState.status.batteryLevel,
                    roundabout: null,
                });

                // TODO: check if we enter roundabout
            },
            onSpeedBumpDetected: (id, location) => {
                // TODO
            },
            onStatusUpdate: (id, status) => {
                const carState = this.duckieBots.get(id);
                if (!carState) return;

                carState.status = status
                carState.lastSeen = new Date();
                this.duckieBots.set(id, carState);

                this.trafficInformationSocket.broadcastLocationUpdate({
                    id,
                    location: carState.lastKnownLocation,
                    state: "normal", // TODO
                    trip: [], // TODO
                    velocity: carState.status.velocity,
                    batteryLevel: carState.status.batteryLevel,
                    roundabout: null,
                });
            }
        });
    }
}
