import asyncio
import websockets
import json


async def onConnect(ws):
    # mock server
    await ws.send(json.dumps({'type': 'carEntering', 'data': {
        "carId": "1122",
        "entry": {"x": 2, "y": 4},
        "exit": {"x": 3, "y": 3},
    }}))
    await asyncio.sleep(1)

    await ws.send(json.dumps({'type': 'carEntering', 'data': {
        "carId": "1234",
        "entry": {"x": 3, "y": 3},
        "exit": {"x": 2, "y": 4},
    }}))
    await asyncio.sleep(1)

    await ws.send(json.dumps({'type': 'carEntering', 'data': {
        "carId": "54645",
        "entry":  {"x": 2, "y": 0},
        "exit": {"x": 1, "y": 1},
    }}))
    await asyncio.sleep(1)

    print('carEntering event sent')

    await asyncio.sleep(1)
    await ws.send(json.dumps({'type': 'carExiting', 'data': {"carId": "1122", }}))
    print('carExiting event sent')
    await asyncio.sleep(1)


async def main():
    async with websockets.serve(onConnect, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
