import asyncio
import websockets
import json


def event_controller(carClass):

    def handle_car_entering(payload):
        print("CAR ENTERING")
        print(payload)

    def handle_car_exiting(payload):
        print("CAR EXITING")
        print(payload)

    def handle_car_update(payload):
        print("CAR UPDATE")
        print(payload)

    def handle_car_go_around(payload):
        print("CAR GO AROUND")
        print(payload)



    event_handlers_lookup_table = {
            'carEntering' : handle_car_entering,
            'carExiting' : handle_car_exiting,
            'carUpdate' : handle_car_update,
            'carGoAround' : handle_car_go_around
            }

    return event_handlers_lookup_table

async def message_event_loop(event_handlers_lookup_table):
    async with websockets.connect("ws://localhost:8765") as websocket:
        while True:
            try:
                #simply wait forever until the connection is closed
                payload = json.loads(await websocket.recv())
                event_handlers_lookup_table[payload['type']](payload)
            except websockets.ConnectionClosed as e:
                print('exiting')
                break


asyncio.run(message_event_loop(event_controller(None)))
