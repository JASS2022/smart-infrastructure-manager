import {AprilTag, UUID} from "./shared";

export interface CarEnteringMessage {
    type: "carEntering",
    data: {
        carId: UUID,
        entry: AprilTag, // should we change this to coordinates?
        exit: AprilTag,
    }
}

export interface CarExitingMessage {
    type: "carExiting",
    data: {
        carId: UUID,
    }
}

export interface CarGoAroundMessage {
    type: "carGoAround",
    data: {
        carId: UUID,
    }
}


// from roundabout
export interface EnterRoundaboutPermissionMessage {
    type: "carMoveCommand",
    data: {
        carId: UUID,
    }
}
