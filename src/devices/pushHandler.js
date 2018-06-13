const times = require("lodash/times");
const throttle = require("lodash/throttle");
const { PUSH_ROWS, PUSH_COLS, LIGHT_1_ID } = require("../constants");
const colors = require("../colorFunctionality");

const pushHandler = (hueApi, lightState) => push => {
    const { gridCol, channelKnobs, lcdSegmentsCol, clearLCD } = push;
    clearLCD();

    handleLCD(channelKnobs(), lcdSegmentsCol);

    handleGrid(hueApi, lightState, gridCol);
};

const handleGrid = (hueApi, lightState, gridCol) => {
    times(PUSH_COLS, col => {
        times(PUSH_ROWS, row => {
            const cell = gridCol(col)[row];
            const color = colors[col][row];

            cell.ledRGB(color.r, color.g, color.b);
            cell.onPressed(
                throttle(velocity => {
                    const state = lightState
                        .create()
                        .on()
                        .rgb(color.r, color.g, color.b)
                        .transition(store.state.colorSwitchTransition)
                        .brightness(255);

                    hueApi
                        .setLightState(LIGHT_1_ID, state)
                        .fail(e => {
                            console.log(e);
                        })
                        .done();
                }),
                1000
            );
        });
    });
};

const handleLCD = (knobs, lcdSegmentsCol) => {
    // COLOR SWITCH TRANSITION
    const firstLCDCol = lcdSegmentsCol(0);
    firstLCDCol[3].display("COLOR");
    firstLCDCol[2].display("TRANSITION");
    assignKnobValueModifier(
        knobs[0],
        firstLCDCol[0],
        "colorSwitchTransition",
        10
    );

    const secondLCDCol = lcdSegmentsCol(1);
    secondLCDCol[3].display("FLASHON");
    secondLCDCol[2].display("TRANSITION");
    assignKnobValueModifier(knobs[1], secondLCDCol[0], "flashOnTransition", 2);

    const thirdLCDCol = lcdSegmentsCol(2);
    thirdLCDCol[3].display("FLASHOFF");
    thirdLCDCol[2].display("TRANSITION");
    assignKnobValueModifier(knobs[2], thirdLCDCol[0], "flashOffTransition", 2);

    const fifthLCDCol = lcdSegmentsCol(4);
    fifthLCDCol[3].display("KICK");
    fifthLCDCol[2].display("THRESHOLD");
    assignKnobValueModifier(knobs[4], fifthLCDCol[0], "kickThreshold", 0.001);

    const sixthLCDCol = lcdSegmentsCol(5);
    sixthLCDCol[3].display("HUE");
    sixthLCDCol[2].display("BRIGHTNESS");
    sixthLCDCol[1].display("LOW");
    assignKnobValueModifier(
        knobs[5],
        sixthLCDCol[0],
        "lowestHueBrightness",
        0.5
    );
};

const assignKnobValueModifier = (knob, lcd, val, incrementer) => {
    lcd.display(store.state[val]);
    knob.onTurned(i => {
        store.setState(val, (store.state[val] += i * incrementer));
        lcd.display(store.state[val]);
    });
};
module.exports = pushHandler;
