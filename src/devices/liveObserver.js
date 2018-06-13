const Max4Node = require("max4node");
const { LIGHT_1_ID } = require("../constants");
const max = new Max4Node();
max.bind();

// https://www.youtube.com/watch?v=JatNuVsbsEQv
const liveObserver = (hueApi, lightState) => {
    const promiseStack = [];
    max.observe({
        path: "live_set tracks 1",
        property: "output_meter_level"
    }).on("value", val => {
        if (val > store.state.kickThreshold) {
            const state = lightState
                .create()
                .brightness(100)
                .transition(store.state.flashOnTransition);
            hueApi
                .setLightState(LIGHT_1_ID, state)
                .fail(e => {
                    console.log(e);
                })
                .done();
            hueApi
                .setLightState(
                    LIGHT_1_ID,
                    lightState
                        .create()
                        .brightness(store.state.lowestHueBrightness)
                        .transition(store.state.flashOffTransition)
                )
                .fail(e => {
                    console.log(e);
                })
                .done();
        }
    });
};

module.exports = liveObserver;
