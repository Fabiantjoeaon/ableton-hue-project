const navigator = require("jzz");
const nodeHue = require("node-hue-api");
const pushWrapper = require("push-wrapper");
const _ = require("lodash");
const Store = require("./data/store");

global.store = new Store();
global.navigator = navigator;

const log = msg => console.log(msg);

// nodeHue
//     .nupnpSearch()
//     .then(log)
//     .done();

const { HUE_HOST, HUE_USERNAME } = require("./constants");

const hueApi = new nodeHue.HueApi(HUE_HOST, HUE_USERNAME, 10000);
const lightState = nodeHue.lightState;
const state = lightState.create();

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
