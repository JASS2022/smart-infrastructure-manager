export interface Coordinate {
    x: number
    y: number
}

export type UUID = string;

export type AprilTag = number;

export const Locator = {
    "Pyramids Enter":96,
    "Pyramids Exit":20,
    "Hotel Enter":2,
    "Hotel Exit":7,
    "GIU Enter":74,
    "GIU Exit":6,
    "Speed Bump":0
}

export const LocatorCoordinates: Record<number, Coordinate> = {
    96: {x: 2, y: 4},
    20: {x: 3, y: 3},
    2: {x: 2, y: 0},
    7: {x: 1, y: 1},
    74: {x: 0, y: 2},
    6: {x: 1, y: 3},
    0: {x: 3, y: 2},
}
