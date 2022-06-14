import asyncio
import json
from Roundabout_manager import Roundabout_manager
from Roundabout import Roundabout
from Geofence import Geofence
import EventControllers
import websockets

# receive from CityManager




    # def get_view_info():
    #     roundabout_statistics = {
    #         "type": "roundaboutStatistics",
    #         "data": {
    #             "waitingCars":  self.roundabout_manager.geofence.wait_queue,
    #             "inRoundaboutCars": self.roundabout_manager.roundabout.inroundabout_queue,
    #             "maxCapacityRoundabout": self.roundabout_manager.roundabout.maxCapacity,
    #         }
    #     }

    #    return roundabout_statistics


# send to CityManager


# def send_move_command(car):
#     move_command = {
#         "type": "carMoveCommand",
#         "data": {
#                 "carId": car.id,
#         }

#     }

CITY_MANAGER_COMMANDS_URI = 'wss://jass22.finkmartin.com'

# async def main():
#     try:
#         ws = await websockets.client.connect(CITY_MANAGER_COMMANDS_URI)
#         print('waiting for msg')
#         await ws.send(json.dumps({'msg':'hello, city manager'}))
#         print('sent')
#     except Exception as e:
#         print('unknown exception')
#         print(e)

async def main():

        
    roundabout = Roundabout([1.1, 2.1, 3.1, 4.1], [1.2, 2.2, 3.2, 4.2])
    roundabout_manager = Roundabout_manager( roundabout, Geofence(roundabout), None)
    #a = EventControllers.CityManagerLocationEventController('wss://localhost:8765',roundabout_manager)
    b = EventControllers.CityManagerCommandsEventController(CITY_MANAGER_COMMANDS_URI,roundabout_manager)
    await b.network_task

asyncio.run(main())



