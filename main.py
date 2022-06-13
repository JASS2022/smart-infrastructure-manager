
import asyncio
import websockets
import json
from Roundabout_manager import Roundabout_manager
from Roundabout import Roundabout
from Geofence import Geofence


def city_manager_events_controller(roundabout_manager, city_manager_ws):

    async def handle_car_entering(payload):
        print("CAR ENTERING")
        roundabout_manager.register_car(payload)
        print(payload)

    async def handle_car_exiting(payload):
        print("CAR EXITING")
        roundabout_manager.exit(payload["carId"])
        print(payload)

    async def handle_car_update(payload):
        print("CAR UPDATE")
        print(payload)

    async def handle_car_go_around(payload):
        print("CAR GO AROUND")
        print(payload)

    event_handlers_lookup_table = {
        'carEntering': handle_car_entering,
        'carExiting': handle_car_exiting,
        'carUpdate': handle_car_update,
        'carGoAround': handle_car_go_around
    }

    return event_handlers_lookup_table


async def main():
    try:
        city_manager_ws = websockets.connect("ws://localhost:8765")
        roundabout = Roundabout([1.1, 2.1, 3.1, 4.1], [1.2, 2.2, 3.2, 4.2])
        roundabout_manager = Roundabout_manager(
            roundabout, Geofence(roundabout), None)
        event_handlers_lookup_table = city_manager_events_controller(
            roundabout_manager, city_manager_ws)
        while True:
            # simply wait forever until the connection is closed
            payload = json.loads(await city_manager_ws.recv())
            event_handlers_lookup_table[payload['type']](payload)

    except websockets.ConnectionClosed as e:
        print('exiting')


def get_view_info(self):
    roundabout_statistics = {
        "type": "roundaboutStatistics",
        "data": {
            "waitingCars":  self.roundabout_manager.geofence.wait_queue,
            "inRoundaboutCars": self.roundabout_manager.roundabout.inroundabout_queue,
            "maxCapacityRoundabout": self.roundabout_manager.roundabout.maxCapacity,
        }
    }
    return roundabout_statistics


asyncio.run(main())
