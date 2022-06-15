export type CarCommand = "start" | "stop" | "slowDown" | "speedUp" | "enterRoundabout" | "exitRoundabout";
export type AprilTag = number | null
export type Coordinate = {x: number, y: number}

export interface CarCommandMessage {
    type: "command"
    data: CarCommand
}

export interface CarLocationUpdateMessage {
    type: "locationUpdate"
    data: {
        aprilTag: AprilTag
    }
}
export interface InitialCarLocationMessage {
    type: "initialCarLocation"
    data: {
        trip: Coordinate[]
    }
}
