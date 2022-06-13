import {Coordinate, UUID} from "./shared";

export interface TrafficInformationMessage {
    type: "duckieUpdate" | "duckieList" | "roundaboutList"
    data: any
}

export interface LocationUpdateMessage extends TrafficInformationMessage {
    type: "duckieUpdate"
    data: LocationUpdate
}

export interface DuckieBotsMessage extends TrafficInformationMessage {
    type: "duckieList"
    data: DuckieBot[]
}

export interface RoundaboutsMessage extends TrafficInformationMessage {
    type: "roundaboutList"
    data: Roundabout[]
}

// TrafficInformation
export interface LocationUpdate {
    id: UUID
    location: Coordinate
    trip: Coordinate[]
    state: "normal" | "autonomous" | "waiting"
    velocity?: number
    batteryLevel?: number
    roundabout?: UUID // roundabout the car is in
}

export interface DuckieBot {
    id: UUID
    name: string
    picture: string
    lastSeen: Date
}

export interface Roundabout {
    id: UUID
    address: string
    location: {
        upperLeft: Coordinate
        lowerRight: Coordinate
    }
}
