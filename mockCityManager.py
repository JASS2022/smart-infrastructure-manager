import asyncio
import websockets
import json


async def onConnect(ws):
    # mock server
    await ws.send(json.dumps({'type': 'carEntering','data':{}}))
    print('carEntering event sent')
    await asyncio.sleep(1)
    await ws.send(json.dumps({'type': 'carExiting','data':{}}))
    print('carExiting event sent')
    await asyncio.sleep(1)
    await ws.send(json.dumps({'type': 'carUpdate','data':{}}))
    print('carUpdate event sent')
    await asyncio.sleep(1)
    await ws.send(json.dumps({'type': 'carGoAround','data':{}}))
    print('carGoAround event sent')
    print('connection will be closed')
    await asyncio.sleep(1)


async def main():
    async with websockets.serve(onConnect, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
