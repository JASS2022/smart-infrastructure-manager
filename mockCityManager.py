import asyncio
import websockets
import json


async def onConnect(ws):
    # mock server
    await ws.send(json.dumps({'type': 'carEntering', 'data': {
        "carId": "1122",
        "entry": "1",
        "exit": "2",
    }}))
    await asyncio.sleep(1)

    await ws.send(json.dumps({'type': 'carEntering', 'data': {
        "carId": "1234",
        "entry": "2",
        "exit": "3",
    }}))
    await asyncio.sleep(1)

    await ws.send(json.dumps({'type': 'carEntering', 'data': {
        "carId": "54645",
        "entry": "3",
        "exit": "2",
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
