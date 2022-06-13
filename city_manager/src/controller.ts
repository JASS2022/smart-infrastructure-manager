import { TrafficInformationSocket } from "./ws/TrafficInformationSocket";

export class SmartCityController {
    private trafficInformationSocket: TrafficInformationSocket

    constructor() {
        this.trafficInformationSocket = new TrafficInformationSocket();
        // other sockets
    }

}

