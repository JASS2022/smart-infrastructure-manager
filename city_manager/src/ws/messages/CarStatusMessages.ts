import {AprilTag} from "./shared";

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
