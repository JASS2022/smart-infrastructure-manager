import asyncio
import json
from Roundabout import Roundabout
from Geofence import Geofence
import EventControllers
import websockets
import time
from Strategy import VacationStrategy, Strategy


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

CITY_MANAGER_COMMANDS_URI = 'ws://192.168.149.22:8081'
# 'wss://jass22.finkmartin.com'

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
    geofence = Geofence(4)
    strategy = VacationStrategy()
    roundabout = Roundabout([1, 2, 3], [1, 2, 3], geofence, strategy)
    b = EventControllers.CityManagerCommandsEventController(
        CITY_MANAGER_COMMANDS_URI, roundabout)
    await b.network_task


asyncio.run(main())
