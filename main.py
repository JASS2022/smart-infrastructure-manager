import asyncio
import websockets
import json
import Roundabout_manager



def city_manager_events_controller(roundabout_manager,city_manager_ws):

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
        event_handlers_lookup_table = city_manager_events_controller(None,city_manager_ws)
        while True:
            # simply wait forever until the connection is closed
            payload = json.loads(await city_manager_ws.recv())
            event_handlers_lookup_table[payload['type']](payload)

    except websockets.ConnectionClosed as e:
        print('exiting')


asyncio.run(main())
