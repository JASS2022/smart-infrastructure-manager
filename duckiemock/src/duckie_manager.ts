import * as ws from "ws";
import {VDuckie} from "./vduckie";
import {AprilTag, Coordinate} from "./ws/messages";

export class VirtualDuckieManager {
    private duckies: VDuckie[]
    private readonly delaySeconds: number

    constructor(props: {
        delaySecs: number,
        duckies: {
            src: AprilTag,
            dst: Coordinate
            name: string
            trip: AprilTag[]
            initialDelay?: number
        }[]
    }) {
        this.delaySeconds = props.delaySecs
        this.duckies = props.duckies.map((duckie) => new VDuckie({
            socket: new ws.WebSocket("ws://localhost:8080"),
            // socket: new ws.WebSocket("ws://192.168.8.127:8080"),
            destination: duckie.dst,
            remainingTrip: duckie.trip.reverse(),
            currentState: "initializing",
            id: duckie.name,
            initialDelay: duckie.initialDelay ?? 0
        }))
    }

    public async run() {
        while (this.duckies.length > 0) {
            this.duckies.forEach((duckie) => duckie.onAction());

            this.duckies = this.duckies.filter((duckie) => !duckie.hasFinishedTrip);
            console.log(`ran simulation with ${this.duckies.length} duckies`);

            await this.delay(this.delaySeconds);
        }
    }

    private delay(seconds: number): Promise<unknown> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000))
    }
}
