export type CarCommand = "start" | "stop" | "slowDown" | "speedUp" | "turnRight" | "turnLeft";

export interface CarCommandMessage {
    type: "command"
    data: CarCommand
}
