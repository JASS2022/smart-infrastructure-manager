export type CarCommand = "start" | "stop" | "slowDown" | "speedUp" | "enterRoundabout" | "exitRoundabout";

export interface CarCommandMessage {
    type: "command"
    data: CarCommand
}
