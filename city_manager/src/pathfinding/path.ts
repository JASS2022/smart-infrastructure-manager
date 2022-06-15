import { Coordinate, UUID } from "../ws/messages/shared";
var dijkstra = require("./dijkstra.js");
var find_path = dijkstra.find_path;

export function path(start: Coordinate, destination: Coordinate) {
	var graph = {
		w: { r: 1, x: 0, v: 0 },
		r: { s: 1, q: 0, w: 1 },
		s: { n: 1, r: 0 },
		n: { o: 1, i: 1 },
		o: { n: 1 },
		i: { h: 1 },
		h: { c: 1, g: 1 },
		c: { h: 1 },
		g: { l: 1 },
		l: { k: 1, q: 1 },
		k: { l: 1 },
		q: { r: 1 },
	};
    const startCoordinate = mappingCoordinate
    const destinationCoordinate = mappingCoordinates.keys(destination);

}

export const mappingCoordinates: Record<string,Coordinate> = {
	'w': { x: 2, y: 0 },
	'r': { x: 2, y: 1 },
    'h': { x: 2, y: 3 },
    'c': { x: 2, y: 4 },
	"s": { x: 3, y: 1 },
	"n": { x: 3, y: 2 },
	"i": { x: 3, y: 3 },
	"g": { x: 1, y: 3 },
	"l": { x: 1, y: 2 },
	"k": { x: 0, y: 2 },
	"q": { x: 1, y: 1 },
	"o": { x: 4, y: 2 },
};
