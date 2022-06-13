const controller = require('ws');

export class SmartCityController {

    constructor() {
        const wss = new controller.Server({ port: 8080 })

        wss.on("connection", ws => {
            console.log("new client connected");
            ws.on("message", data => {
                console.log(`Client has sent us: ${data}`)
            });
            ws.on("close", () => {
                console.log("the client has connected");
            });
            ws.onerror = function () {
                console.log("Some Error occurred")
            }
        });
    }

}

