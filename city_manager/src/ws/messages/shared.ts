export interface Coordinate {
    x: number
    y: number
}

export type UUID = string;

export type AprilTag = number;

const Locator = {
    96: "Pyramids Enter",
    20: "Pyramids Exit",
    2: "Hotel Enter",
    7: "Hotel Exit",
    74: "GIU Enter",
    6: "GIU Exit",
    0: "Speed Bump"
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
