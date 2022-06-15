import asyncio
import json
import time


from websockets import client, ConnectionClosed


class EventController:
    def __init__(self, uri, roundabout):
        self.ws_uri = uri
        self.ws = None
        self.event_handlers_lookup_table = {}
        self.max_connection_retries = 10
        self.network_task = asyncio.create_task(self.event_task(roundabout))

    async def event_task(self, roundabout):
        for _ in range(self.max_connection_retries):
            try:
                self.ws = await client.connect(self.ws_uri)
                print(f"[EVENT CONTROLLER] connected to {self.ws_uri}")

                while True:
                    payload = json.loads(await self.ws.recv())
                    _type = payload['type']
                    data = payload['data']
                    await self.event_handlers_lookup_table[_type](data)

                    # print("HELOOOOOOOOO")
                    # if (time.time() - start_time >= 2):
                    #     scheduled_cars = roundabout.manage_roundabout()
                    #     for car in scheduled_cars:
                    #         print("Scheduled")
                    #         print(car.id)

                    #     # send_move_command(car.id)
                    #     start_time = time.time()

            except ConnectionClosed as e:
                print('exiting')
            # except KeyError as e:
            #     print('error : bad payload : ', e)
            # except Exception as e:
            #     print('unknown error : ', e)
            finally:
                if self.ws:
                    await self.ws.close()
                print(
                    f"[EVENT CONTROLLER] retrying connection to {self.ws_uri}")
            await asyncio.sleep(2)


class CityManagerCommandsEventController(EventController):

    def __init__(self, city_manager_commands_uri, roundabout):
        self.roundabout = roundabout
        EventController.__init__(self, city_manager_commands_uri, roundabout)

        self.event_handlers_lookup_table = {
            'carEntering': self.handle_car_entering,
            'carExiting': self.handle_car_exiting,
            'carUpdate': self.handle_car_update,
            'carGoAround': self.handle_car_go_around,
        }

        self.running_scheduler_task = asyncio.create_task(
            self.scheduler_task())

    location_map = {
        tuple([2, 4]): 96,
        tuple([3, 3]): 20,
        tuple([2, 0]): 2,
        tuple([1, 1]): 7,
        tuple([0, 2]): 74,
        tuple([1, 3]): 6,
        tuple([3, 2]): 0,
    }

    scheduling_map = {
        96: 3,
        20: 3,
        2: 1,
        7: 1,
        74: 2,
        6: 2,
        0: 0
    }

    async def scheduler_task(self):
        while True:
            await asyncio.sleep(2)
            scheduled_cars = self.roundabout.manage_roundabout()
            for car in scheduled_cars:
                await self.send_move_command(car.id)

    async def handle_car_entering(self, data):
        print("CAR ENTERING")
        print(data["carId"])
        data_modified = self.map_location_data(data)
        print("CAR HEY")
        print(data_modified)
        self.roundabout.enter(data_modified)
        # roundabout_manager.enter_geofence(data)

    async def handle_car_exiting(self, data):
        print("CAR EXITING")
        print(data["carId"])
        self.roundabout.exit(data["carId"])

    async def handle_car_update(self, data):
        print("CAR UPDATE")

    async def handle_car_go_around(self, data):
        print("CAR GO AROUND")

    async def send_move_command(self, car_id):
        print("MOVE CAR")
        print(car_id)
        move_command = {
            "type": "carMoveCommand",
            "data": {
                "carId": car_id,
            }
        }
        await self.ws.send(json.dumps(move_command))

    def map_location_data(self, data):
        location_entry = tuple(
            [data["entry"]["x"], data["entry"]["y"]])
        location_exit = tuple([data["exit"]["x"], data["exit"]["y"]])

        modified_data = {
            "carId": data["carId"],
            "entry": self.scheduling_map[self.location_map[location_entry]],
            "exit": self.scheduling_map[self.location_map[location_exit]]
        }
        return modified_data


class CityManagerLocationEventController(EventController):

    def __init__(self, city_manager_commands_uri, roundabout):

        self.roundabout = roundabout
        EventController.__init__(self, city_manager_commands_uri, roundabout)

        self.event_handlers_lookup_table = {
            'locationUpdate': self.handle_location_update,
        }

    async def handle_location_update(self, data):
        print("CAR LOCATION UPDATE")
        print(data)
