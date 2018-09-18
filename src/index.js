const navigator = require("jzz");
const nodeHue = require("node-hue-api");
const pushWrapper = require("push-wrapper");
const _ = require("lodash");
const axios = require("axios");
const dtls = require("node-dtls-client").dtls;
const rgbToXY = require("./helpers/rgbToXY");
const Store = require("./data/store");
require("./constants");
global.store = new Store();
global.navigator = navigator;

const log = msg => console.log("MSG", msg);

nodeHue
    .nupnpSearch()
    .then(log)
    .done();
axios
    .put(
        `http://${constants.HUE_HOST}/api/${
            constants.STREAMING_USERNAME
        }/groups/${constants.STREAMING_GROUP}`,
        {
            stream: {
                active: true
            }
        }
    )
    .then(res => {
        console.log(res.data);
        const options = {
            type: "udp4",
            address: constants.HUE_HOST,
            port: 2100,
            psk: {},
            timeout: 1000 // in ms, optional, minimum 100, default 1000
            // ciphers: ["TLS_PSK_WITH_AES_128_GCM_SHA256"]
        };
        options.psk[constants.STREAMING_USERNAME] = new Buffer(
            constants.STREAMING_CLIENT_KEY,
            "hex"
        );

        const socket = dtls.createSocket(options);
        socket
            .on("connected", e => {
                //http://cactus.io/resources/toolbox/decimal-binary-octal-hexadecimal-conversion
                setInterval(() => {
                    const {
                        color: { r: r1, g: g1, b: b1 },
                        brightness: brightness1
                    } = store.state.light_1;
                    const {
                        color: { r: r2, g: g2, b: b2 },
                        brightness: brightness2
                    } = store.state.light_2;

                    const { x: x1, y: y1 } = rgbToXY(r1, g1, b1);
                    const { x: x2, y: y2 } = rgbToXY(r2, g2, b2);

                    const message = Buffer.concat([
                        Buffer.from("HueStream", "ascii"),
                        // prettier-ignore
                        Buffer.from([
                            0x01, 0x00, //version 1.0
                            0x07, //sequence number 7
                            0x00, 0x00, //Reserved write 0’s
                            0x01, //color mode XY
                            0x00, // Reserved, write 0’s

                            0x00, 0x00, store.state.light_1.id, // LIGHT 14
                            // X            // Y            // BRIGHTNESS
                            x1.xOne, x1.xTwo, y1.yOne, y1.yTwo, brightness1, brightness1,

                            0x00, 0x00, store.state.light_2.id, // LIGHT 15
                            // X            // Y            // BRIGHTNESS
                            x2.xOne, x2.xTwo, y2.yOne, y2.yTwo, brightness2, brightness2,
                        ])
                    ]);
                    socket.send(message, e => {});
                }, 30);
            })
            .on("error", e => {
                console.log("ERROR", e);
            })
            .on("close", e => {
                console.log("CLOSE", e);
            });
    })
    .catch(console.log);

const hueApi = new nodeHue.HueApi(
    constants.HUE_HOST,
    constants.HUE_USERNAME,
    10000
);
const lightState = nodeHue.lightState;

const liveObserver = require("./devices/liveObserver");
const pushHandler = require("./devices/pushHandler");

push = pushWrapper
    .webMIDIio()
    .then(({ inputPort, outputPort }) => {
        const push = pushWrapper.push();
        inputPort.onmidimessage = event => push.midiFromHardware(event.data);
        push.onMidiToHardware(outputPort.send.bind(outputPort));
        return push;
    })
    .then(pushHandler(hueApi, lightState))
    .catch(err => {
        console.log(err);
        return { inputPort: {}, outputPort: { send: () => {} } };
    });

liveObserver(hueApi, lightState);
