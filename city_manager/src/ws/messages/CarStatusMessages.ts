import {AprilTag} from "./shared";

export interface CarLocationUpdateMessage {
    type: "locationUpdate"
    data: {
        aprilTag: AprilTag
    }
}

export interface CarStatus {
    velocity: number
    batteryLevel: number
}

export interface CarStatusUpdate {
    type: "statusUpdate"
    data: CarStatus
}

export interface SpeedBumpDetectedMessage {
    type: "speedBumpDetected"
    data: {
        aprilTag: AprilTag
    }
}
