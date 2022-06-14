import asyncio
import websockets
import json

with open('./mock.json','rb') as fp:
    mock = json.load(fp)

async def onConnect(ws):
    for ev in mock['events']:
        await asyncio.sleep(1)
        await ws.send(json.dumps(ev))
        print('EVENT SENT : ',ev)
    # mock server


async def main():
    async with websockets.serve(onConnect, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
