import * as ws from "ws";
import {
	DuckieBot,
	DuckieBotsMessage,
	LocationUpdate,
	LocationUpdateMessage,
	Roundabout,
	TrafficInformationMessage,
} from "./messages/TrafficInformationMessages";
import { Coordinate, UUID } from "./messages/shared";

export class TrafficInformationSocket {
	// TODO: add type for subscriber
	private subscribers: Map<number, any>;
	private nextId = 0;
	private wss: ws.Server;

	constructor() {
		this.wss = new ws.Server({ port: 8080 });
		this.wss.on("connection", (ws) => {
			const id = this.nextId++;
			this.subscribers.set(id, ws);
			ws.on("close", () => this.subscribers.delete(id));
			ws.onerror = () => this.subscribers.delete(id);
		});
	}

	broadcastLocationUpdate(
		trafficInfo: {
			id: UUID,
			location: Coordinate,
			state: "normal" | "autonomous" | "waiting",
			trip: Coordinate[],
			velocity?: number,
			batteryLevel?: number,
			roundabout?: string
		}
	) {
		const data: LocationUpdate = {
			id: trafficInfo.id,
			location: trafficInfo.location,
			trip: trafficInfo.trip,
			state: trafficInfo.state,
			velocity: trafficInfo.velocity,
			batteryLevel: trafficInfo.batteryLevel,
			roundabout: trafficInfo.roundabout,
		};
		this.subscribers.forEach((subscriber) =>
			subscriber.send(JSON.stringify(data))
		);
	}
	broadcastDuckieBotMessageUpdate(
		id: string,
		name: string,
		picture: string,
		lastSeen: string
	) {
		const data: DuckieBot = {
			id: id,
			name: name,
			picture: picture,
			lastSeen: lastSeen,
		};
		this.subscribers.forEach((subscriber) =>
			subscriber.send(JSON.stringify(data))
		);
	}
	broadcastRoundaboutsMessageUpdate(
		id: string,
		address: string,
		x_up: number,
		x_low: number,
		y_up: number,
		y_low: number
	) {
		const data: Roundabout = {
			id: id,
			address: address,
			location: {
				upperLeft: { x: x_up, y: y_up },
				lowerRight: { x: x_low, y: y_low },
			},
		};
		this.subscribers.forEach((subscriber) =>
			subscriber.send(JSON.stringify(data))
		);
	}
}
