import {TrafficInformationSocket} from "./ws/TrafficInformationSocket";
import {DrivePermissionSocket} from "./ws/DrivePermissionSocket";
import {CarCommunicationSocket} from "./ws/CarCommunicationSocket";
import {Coordinate, Locator, LocatorCoordinates, UUID} from "./ws/messages/shared";
import {CarStatus} from "./ws/messages/CarStatusMessages";

interface DuckieBotState {
    id: UUID
    lastKnownLocation: Coordinate
    trip: Coordinate[]
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
    private bumpSet = new Set<Coordinate>();

    constructor() {
        this.trafficInformationSocket = new TrafficInformationSocket();
        this.drivePermissionSocket = new DrivePermissionSocket((carId) => {
            this.carCommunicationSocket.sendCarCommand(carId, "enterRoundabout");
        });
        this.carCommunicationSocket = new CarCommunicationSocket({
            onCarConnect: (id, trip) => {
                this.duckieBots.set(id, {
                    id,
                    trip:trip,
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

                
                if(this.bumpSet.has(newLocation))
                {   //slow down on bump detection
                    this.carCommunicationSocket.sendCarCommand(id, "slowDown");
                }

                
                if(!this.bumpSet.has(newLocation) && carState.speed == "slow")
                {
                    //speed up after passing bump
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
                const roundaboutEnterings = [ LocatorCoordinates[Locator["Pyramids Enter"]], LocatorCoordinates[Locator["Hotel Enter"]],LocatorCoordinates[Locator["GIU Enter"]]];
                const isEnteringRoundabout = roundaboutEnterings.map((c) => c.x == newLocation.x && c.y == newLocation.y)
                    .reduce((p, c) => p || c, false);

                if (isEnteringRoundabout) {
                    console.log(`Car ${id} is entering a roundabout`);
                    this.carCommunicationSocket.sendCarCommand(id, "stop");
                    this.drivePermissionSocket.requestRoundaboutPermission(id, newLocation, roundaboutEnterings[0]);
                }
                // get trip array from car, which includes only one element: then destination and compare with actual destination x and y coordinates
                 const tripStops = carState.trip.length
                if (newLocation.x == carState.trip[tripStops - 1].x  && newLocation.y == carState.trip[tripStops - 1].y ) {
                    // exiting roundabout
                    this.carCommunicationSocket.sendCarCommand(id, "exitRoundabout");
                }

            },
            onSpeedBumpDetected: (id, location) => {
                this.bumpSet.add(location)
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
