export interface CarCommandMessage {
    type: "command"
    data: "start" | "stop" | "slowDown" | "speedUp" | "turnRight" | "turnLeft"
}
