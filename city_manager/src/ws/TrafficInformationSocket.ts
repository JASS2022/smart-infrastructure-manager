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
import * as uuid from "uuid";

export class TrafficInformationSocket {
	// TODO: add type for subscriber
	private subscribers: Map<UUID, ws.WebSocket> = new Map<UUID, ws.WebSocket>();
	private wss: ws.Server;

	constructor() {
		this.wss = new ws.Server({ port: 8082 });
		this.wss.on("connection", (ws) => {
			const id = uuid.v4();
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
			subscriber.send(JSON.stringify(<LocationUpdateMessage>{
				type: "locationUpdate",
				data,
			}))
		);
	}
}
