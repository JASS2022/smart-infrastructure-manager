import {VirtualDuckieManager} from "./duckie_manager";

const destinations = {
    hotel: {x: 1, y: 1},
    pyramids: {x: 3, y: 3},
    giu: {x: 1, y: 3},
}

const main = async () => {
    const simulator = new VirtualDuckieManager({
        delaySecs: 6,
        duckies: [
            {
                src: 0,
                dst: destinations.pyramids,
                name: "duckie1",
                trip: [
                    74, null, null, null, null,
                    0,
                    20,
                ],
            },
            {
                src: 0,
                dst: destinations.pyramids,
                name: "duckie1",
                trip: [
                    74, null, null, null, null,
                    0,
                    20,
                ],
                // initialDelay: 1,
            },
            {
                src: 0,
                dst: destinations.pyramids,
                name: "duckie1",
                trip: [
                    74, null, null, null, null,
                    0,
                    20,
                ],
                // initialDelay: 1,
            },
            {
                src: 0,
                dst: destinations.pyramids,
                name: "duckie1",
                trip: [
                    2, null, null,
                    0,
                    20,
                ],
                // initialDelay: 1,
            },
            {
                src: 0,
                dst: destinations.pyramids,
                name: "duckie1",
                trip: [
                    2, null, null,
                    0,
                    20,
                ],
                initialDelay: 1,
            },
            {
                src: 0,
                dst: destinations.pyramids,
                name: "duckie1",
                trip: [
                    2, null, null,
                    0,
                    20,
                ],
                initialDelay: 2,
            },
        ],
    })
    await simulator.run();
}

main().then(() => process.exit(0))
