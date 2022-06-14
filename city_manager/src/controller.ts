import {TrafficInformationSocket} from "./ws/TrafficInformationSocket";
import {DrivePermissionSocket} from "./ws/DrivePermissionSocket";
import {CarCommunicationSocket} from "./ws/CarCommunicationSocket";
import {Coordinate, UUID} from "./ws/messages/shared";
import {CarStatus} from "./ws/messages/CarStatusMessages";

interface DuckieBotState {
    id: UUID
    lastKnownLocation: Coordinate
    status: CarStatus
    speed: "slow" | "fast"
    isInRoundabout: boolean
    lastSeen: Date
}

export class SmartCityController {
    private trafficInformationSocket: TrafficInformationSocket
    private drivePermissionSocket: DrivePermissionSocket
    private carCommunicationSocket: CarCommunicationSocket
    private duckieBots = new Map<UUID, DuckieBotState>()
    private bumpset = new Set<Coordinate>;
    private speedBumps: Coordinate[] = [];

    constructor() {
        this.trafficInformationSocket = new TrafficInformationSocket();
        this.drivePermissionSocket = new DrivePermissionSocket((carId) => {
            this.carCommunicationSocket.sendCarCommand(carId, "enterRoundabout");
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
                    speed: "fast",
                    isInRoundabout: false,
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

                //bump section start

                //slow down on bump detection
                if(this.bumpset.has(newLocation))
                {
                    this.carCommunicationSocket.sendCarCommand(id, "slowDown");
                }

                //speed up after passing bump
                if(!this.bumpset.has(newLocation) && carState.speed == "slow")
                {
                    this.carCommunicationSocket.sendCarCommand(id, "speedUp");
                }
                //bump section end

                this.trafficInformationSocket.broadcastLocationUpdate({
                    id,
                    location: carState.lastKnownLocation,
                    state: "normal", // TODO
                    trip: [], // TODO
                    velocity: carState.status.velocity,
                    batteryLevel: carState.status.batteryLevel,
                    roundabout: null,
                });

                // TODO: move to own function
                const roundaboutEnterings = [{x: 0, y: 2}, {x: 2, y: 0}, {x: 2, y: 4}];
                const isEnteringRoundabout = roundaboutEnterings.map((c) => c.x == newLocation.x && c.y == newLocation.y)
                    .reduce((p, c) => p || c, false);

                if (isEnteringRoundabout) {
                    console.log(`Car ${id} is entering a roundabout`);
                    this.carCommunicationSocket.sendCarCommand(id, "stop");
                    this.drivePermissionSocket.requestRoundaboutPermission(id, newLocation, roundaboutEnterings[0]);
                }

                if (newLocation.x == 3 && newLocation.y == 3) {
                    // exiting roundabout
                    this.carCommunicationSocket.sendCarCommand(id, "exitRoundabout");
                }


            },
            onSpeedBumpDetected: (id, location) => {
                this.bumpset.add(location)
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
