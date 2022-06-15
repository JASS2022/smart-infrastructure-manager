import {TrafficInformationSocket} from "./ws/TrafficInformationSocket";
import {DrivePermissionSocket} from "./ws/DrivePermissionSocket";
import {CarCommunicationSocket} from "./ws/CarCommunicationSocket";
import {Coordinate, Locator, LocatorCoordinates, tripVarriations, UUID} from "./ws/messages/shared";
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
                console.log(`new car connected: ${id}`);
                this.duckieBots.set(id, {
                    id,
                    trip: trip,
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
                console.log("Got location update:", newLocation)

                const carState = this.duckieBots.get(id);

                if (!carState) {
                    console.error(`Unknown car state for car ${id}`);
                    return;
                }

                carState.lastKnownLocation = newLocation;
                carState.lastSeen = new Date();
                this.duckieBots.set(id, carState);

                const dest = carState.trip[carState.trip.length -1];
                const initial = carState.lastKnownLocation;
                for(let i = 0; i < tripVarriations.length; i++) {
                    if (tripVarriations[i][tripVarriations[i].length -3]?.x === dest?.x && tripVarriations[i][tripVarriations[i].length -3]?.y === dest?.y){
                        console.log("destination")
                        console.log(dest)
                        console.log("initial")
                        console.log(initial)
                        if((tripVarriations[i][tripVarriations[i].length -3]?.x === dest?.x && tripVarriations[i][tripVarriations[i].length -3]?.y === dest?.y) && (tripVarriations[i][0]?.x == initial?.x && tripVarriations[i][0]?.y == initial?.y )){
                            console.log("finally populating the trip array")
                            carState.trip = tripVarriations[i];
                        }
                    }
                }


                //bump section start


                if (this.bumpSet.has(newLocation)) {   //slow down on bump detection
                    this.carCommunicationSocket.sendCarCommand(id, "slowDown");
                }


                if (!this.bumpSet.has(newLocation) && carState.speed == "slow") {
                    //speed up after passing bump
                    this.carCommunicationSocket.sendCarCommand(id, "speedUp");
                }
                //bump section end

                this.trafficInformationSocket.broadcastLocationUpdate({
                    id,
                    location: carState.lastKnownLocation,
                    state: "normal", // TODO
                    trip: carState.trip,
                    velocity: carState.status.velocity,
                    batteryLevel: carState.status.batteryLevel,
                    roundabout: null,
                });

                // TODO: move to own function
                const roundaboutEnterings = [
                    LocatorCoordinates[Locator["Pyramids Enter"]],
                    LocatorCoordinates[Locator["Hotel Enter"]],
                    LocatorCoordinates[Locator["GIU Enter"]],
                ];
                const isEnteringRoundabout = roundaboutEnterings.map((c) => c.x == newLocation.x && c.y == newLocation.y)
                    .reduce((p, c) => p || c, false);
                console.log("Entering roundabout:", isEnteringRoundabout)

                if (isEnteringRoundabout) {
                    console.log(`Car ${id} is entering a roundabout`);
                    this.carCommunicationSocket.sendCarCommand(id, "stop");
                    this.drivePermissionSocket.requestRoundaboutPermission(id, newLocation, roundaboutEnterings[0]);
                }
                // get trip array from car, which includes only one element: then destination and compare with actual destination x and y coordinates
                const tripStops = carState.trip.length;
                if (newLocation.x == carState.trip[tripStops - 3].x && newLocation.y == carState.trip[tripStops - 3].y) {
                    // exiting roundabout
                    this.carCommunicationSocket.sendCarCommand(id, "exitRoundabout");
                    this.drivePermissionSocket.sendCarExitingMessage(id);
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
