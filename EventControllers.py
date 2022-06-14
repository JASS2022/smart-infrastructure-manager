import asyncio
import json

from websockets import client,ConnectionClosed

class EventController:
    def __init__(self,uri):
        self.ws_uri = uri
        self.ws = None
        self.event_handlers_lookup_table = {}
        self.max_connection_retries = 10
        self.network_task = asyncio.create_task(self.event_task())




    async def event_task(self):
        for _ in range(self.max_connection_retries):
            try:
                self.ws = await client.connect(self.ws_uri)

                while True:
                    payload = json.loads(await self.ws.recv())
                    _type = payload['type']
                    data = payload['data']
                    await self.event_handlers_lookup_table[_type](data)

            except ConnectionClosed as e:
                print('exiting')
            except KeyError as e:
                print('error : bad payload : ',e)
            except Exception as e:
                print('unknown error : ',e)
            finally:
                if self.ws:
                    await self.ws.close()
            print(f"retrying connection to {self.ws_uri}")
            await asyncio.sleep(2)



class CityManagerCommandsEventController(EventController):

    def __init__(city_manager_commands_uri,roundabout_manager):
        self.roundabout_manager = roundabout_manager
        EventController.__init__(self,city_manager_commands_uri)

        self.event_handlers_lookup_table = {
            'carEntering': self.handle_car_entering,
            'carExiting': self.handle_car_exiting,
            'carUpdate': self.handle_car_update,
            'carGoAround': self.handle_car_go_around,
        }


    async def handle_car_entering(self,data):
        print("CAR ENTERING")
        #roundabout_manager.enter_geofence(data)
        print(data)

    async def handle_car_exiting(self,data):
        print("CAR EXITING")
        #roundabout_manager.exit(data["carId"])
        print(data)

    async def handle_car_update(self,data):
        print("CAR UPDATE")
        print(data)

    async def handle_car_go_around(self,data):
        print("CAR GO AROUND")
        print(data)



class CityManagerLocationEventController(EventController):

    def __init__(self,city_manager_commands_uri,roundabout_manager):

        self.roundabout_manager = roundabout_manager
        EventController.__init__(self,city_manager_commands_uri)

        self.event_handlers_lookup_table = {
            'locationUpdate': self.handle_location_update,
        }


    async def handle_location_update(self,data):
        print("CAR LOCATION UPDATE")
        print(data)







