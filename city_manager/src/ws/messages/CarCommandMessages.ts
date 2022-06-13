import {AprilTag} from "./shared";

export type CarUpdateMessage = CarLocationUpdateMessage | CarStatusUpdate | SpeedBumpDetectedMessage

export interface CarCommandMessage {
    type: "command"
    data: "start" | "stop" | "slowDown" | "speedUp" | "turnRight" | "turnLeft"
}

export interface CarLocationUpdateMessage {
    type: "locationUpdate"
    data: {
        aprilTag: AprilTag
    }
}

export interface CarStatusUpdate {
    type: "statusUpdate"
    data: {
        velocity: number
        batteryLevel: number
    }
}

export interface SpeedBumpDetectedMessage {
    type: "speedBumpDetected"
    data: {
        aprilTag: AprilTag
    }
}
