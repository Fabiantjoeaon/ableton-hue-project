const Max4Node = require("max4node");
const _ = require("lodash");
const shifty = require("shifty");
const max = new Max4Node();
max.bind();

// https://www.youtube.com/watch?v=JatNuVsbsEQv
const liveObserver = (hueApi, lightState) => {
    const promiseStack = [];
    max.observe({
        path: "live_set tracks 1",
        property: "output_meter_level"
        // TODO: http://blog.liveschool.net/ableton-live-tutorial-sampling-kicks-george-nicholas/
    }).on("value", val => {
        if (val > store.state.kickThreshold) {
            console.log("KICK");
            // const state = lightState
            //     .create()
            //     .brightness(100)
            //     .transition(store.state.flashOnTransition);
            // hueApi
            //     .setLightState(LIGHT_1_ID, state)
            //     .fail(e => {
            //         console.log(e);
            //     })
            //     .done();
            // hueApi
            //     .setLightState(
            //         LIGHT_1_ID,
            //         lightState
            //             .create()
            //             .brightness(store.state.lowestHueBrightness)
            //             .transition(store.state.flashOffTransition)
            //     )
            //     .fail(e => {
            //         console.log(e);
            //     })
            //     .done();

            // TODO: loop over lightsShouldFlash
            shifty
                .tween({
                    from: {
                        b: store.state.light_1.brightness
                    },
                    to: { b: store.state.light_1.lowestBrightness },
                    duration: store.state.light_1.flashOffTransition,
                    step: ({ b }) => {
                        store.setState("light_1.brightness", b);
                    }
                })
                .then(() => {
                    shifty.tween({
                        from: {
                            b: store.state.light_1.brightness
                        },
                        to: {
                            b: store.state.light_1.highestBrightness
                        },
                        duration: store.state.light_1.flashOnTransition,
                        step: ({ b }) => {
                            store.setState(
                                store.setState("light_1.brightness", b)
                            );
                        }
                    });
                });
            shifty
                .tween({
                    from: {
                        b: store.state.light_2.brightness
                    },
                    to: { b: store.state.light_2.lowestBrightness },
                    duration: store.state.light_2.flashOffTransition,
                    step: ({ b }) => {
                        store.setState("light_2.brightness", b);
                    }
                })
                .then(() => {
                    shifty.tween({
                        from: {
                            b: store.state.light_2.brightness
                        },
                        to: {
                            b: store.state.light_2.highestBrightness
                        },
                        duration: store.state.light_2.flashOnTransition,
                        step: ({ b }) => {
                            store.setState(
                                store.setState("light_2.brightness", b)
                            );
                        }
                    });
                });
        }
    });
};

module.exports = liveObserver;
