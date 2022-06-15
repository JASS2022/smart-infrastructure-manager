import {
    AprilTag,
    CarCommandMessage,
    CarLocationUpdateMessage,
    Coordinate,
    InitialCarLocationMessage
} from "./ws/messages";

import * as ws from "ws";

export interface VDuckieProps {
    currentLocation?: AprilTag
    remainingTrip: AprilTag[]
    destination: Coordinate
    socket: ws.WebSocket
    currentState: "initializing" | "driving" | "stopped" | "slow"
    id: string
    initialDelay: number
}

export class VDuckie {
    private props: VDuckieProps
    public hasFinishedTrip: boolean
    constructor(props: VDuckieProps) {
        this.props = props
        props.socket.on("open", () => {
            console.log("opened")
            props.socket.onmessage = (msg) => this.handleMessage(JSON.parse(msg.data.toString()));
        })
    }

    private handleMessage(message: any) {
        console.log("Received message", message);
        if (message.type === "command") {
            const command = message as CarCommandMessage;

            switch (command.data) {
                case "start":
                case "speedUp":
                case "enterRoundabout":
                case "exitRoundabout":
                    this.props.currentState = "driving";
                    break
                case "slowDown":
                    this.props.currentState = "slow";
                    break
                case "stop":
                    this.props.currentState = "stopped";
                    break
            }
        }
    }

    public onAction() {
        if (this.hasFinishedTrip) return;
        if (this.props.socket.readyState !== ws.OPEN) return;

        switch (this.props.currentState) {
            case "initializing":
                if (this.props.initialDelay > 0) {
                    this.props.initialDelay--;
                    break
                }

                this.props.currentState = "driving"
                this.sendMessage(<InitialCarLocationMessage>{
                    type: "initialCarLocation",
                    data: {
                        trip: [this.props.destination]
                    },
                })
                break
            case "driving":
            case "slow":
                if (this.props.remainingTrip.length == 0) {
                    this.hasFinishedTrip = true;
                    return;
                }
                const nextLocation = this.props.remainingTrip.pop()
                if (nextLocation != null) {
                    this.props.currentLocation = nextLocation
                    this.sendMessage(<CarLocationUpdateMessage>{
                        type: "locationUpdate",
                        data: {
                            aprilTag: this.props.currentLocation,
                        },
                    })
                }
                break
            case "stopped":
                // do nothing
        }
    }

    private sendMessage(msg: unknown) {
        const json = JSON.stringify(msg)
        console.log("Sending message:", json)
        this.props.socket.send(json)
    }
}
