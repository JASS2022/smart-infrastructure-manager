import asyncio
from websockets import client,ConnectionClosed
import json
from Roundabout_manager import Roundabout_manager
from Roundabout import Roundabout
from Geofence import Geofence

# receive from CityManager


def city_manager_events_controller(roundabout_manager, city_manager_ws):

    async def handle_car_entering(data):
        print("CAR ENTERING")
        #roundabout_manager.enter_geofence(data)
        print(data)

    async def handle_car_exiting(data):
        print("CAR EXITING")
        #roundabout_manager.exit(data["carId"])
        print(data)

    async def handle_car_update(data):
        print("CAR UPDATE")
        print(data)

    async def handle_car_go_around(data):
        print("CAR GO AROUND")
        print(data)

    async def handle_car_location_update(data):
        print("CAR LOCATION UPDATE")
        print(data)

    event_handlers_lookup_table = {
        'carEntering': handle_car_entering,
        'carExiting': handle_car_exiting,
        'carUpdate': handle_car_update,
        'carGoAround': handle_car_go_around,
        'locationUpdate':handle_car_location_update
    }

    return event_handlers_lookup_table


async def main():

    def get_view_info():
        roundabout_statistics = {
            "type": "roundaboutStatistics",
            "data": {
                "waitingCars":  self.roundabout_manager.geofence.wait_queue,
                "inRoundaboutCars": self.roundabout_manager.roundabout.inroundabout_queue,
                "maxCapacityRoundabout": self.roundabout_manager.roundabout.maxCapacity,
            }
        }

        return roundabout_statistics

    city_manager_ws = None
    try:
        city_manager_ws = await client.connect("ws://localhost:8765")
        roundabout = Roundabout([1.1, 2.1, 3.1, 4.1], [1.2, 2.2, 3.2, 4.2])
        roundabout_manager = Roundabout_manager(
            roundabout, Geofence(roundabout), None)
        event_handlers_lookup_table = city_manager_events_controller(
            roundabout_manager, city_manager_ws)
        while True:
            # simply wait forever until the connection is closed
            payload = json.loads(await city_manager_ws.recv())
            data = payload['data']
            asyncio.create_task(event_handlers_lookup_table[payload['type']](data))

    except ConnectionClosed as e:
        print('exiting')
    except KeyError as e:
        print('error : bad payload : ',e)
    except Exception as e:
        print('unknown error : ',e)
    finally:
        if city_manager_ws:
            await city_manager_ws.close()

# send to CityManager


def send_move_command(car):
    move_command = {
        "type": "carMoveCommand",
        "data": {
                "carId": car.id,
        }

    }

# send to View




asyncio.run(main())
