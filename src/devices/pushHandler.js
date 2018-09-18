const times = require("lodash/times");
const throttle = require("lodash/throttle");

const shifty = require("shifty");
const _ = require("lodash");
const { PUSH_ROWS, PUSH_COLS } = require("../constants");
const colors = require("../colorFunctionality");
const rgbToSeperateHexChannels = require("../helpers/rgbToHex");
const emitter = require("../data/emitter");
const randomFloatInRange = require("../helpers/randomFloatInRange");

const pushHandler = (hueApi, lightState) => push => {
    const {
        gridCol,
        channelKnobs,
        lcdSegmentsCol,
        clearLCD,
        gridSelectButtons,
        channelSelectButtons
    } = push;
    clearLCD();

    const resetLCD = handleLCD(channelKnobs(), lcdSegmentsCol);
    resetLCD();

    handleGridSelect(gridSelectButtons(), resetLCD);
    handleChannelSelect(channelSelectButtons(), resetLCD);

    handleGrid(hueApi, lightState, gridCol);

    // maybe settimeout to handle lcd values?
};

const handleGrid = (hueApi, lightState, gridCol) => {
    times(PUSH_COLS, col => {
        times(PUSH_ROWS, row => {
            const cell = gridCol(col)[row];
            const color = colors[col][row];

            cell.ledRGB(color.r, color.g, color.b);
            cell.onPressed(
                throttle(velocity => {
                    store.state.activeLights.forEach(light => {
                        shifty.tween({
                            from: store.state[`light_${light}`].color,
                            to: color,
                            duration:
                                store.state[`light_${light}`]
                                    .colorSwitchTransition,
                            step: s => {
                                store.setState(
                                    `light_${light}.color`,
                                    rgbToSeperateHexChannels(s.r, s.g, s.b)
                                );
                            }
                        });
                    });
                }),
                1000
            );
        });
    });
};

/**
 * Handles the full bottom row
 * of select buttons
 * @param {*} gridSelect
 */
const handleGridSelect = (gridSelect, resetLCD) => {
    // LEFT LIGHT
    gridSelect[0].ledRGB(0, 255, 0);
    gridSelect[0].onPressed(() => {
        handleLightActiveToggle(1)
            ? gridSelect[0].ledRGB(0, 255, 0)
            : gridSelect[0].ledOff();
    });

    // RIGHT LIGHT
    gridSelect[1].ledRGB(0, 255, 0);
    gridSelect[1].onPressed(() => {
        handleLightActiveToggle(2)
            ? gridSelect[1].ledRGB(0, 255, 0)
            : gridSelect[1].ledOff();
    });

    // REGENERATE RANDOM COLORS FUNCTIONALITY
    gridSelect[6].ledOn(96);
    gridSelect[6].onPressed(() => {
        //TODO: Generate random colors again, should save all colors in different grid
    });

    // RESET ALL PARAMETERS (DEFAULT STATE)
    gridSelect[7].ledOn(80);
    gridSelect[7].onPressed(() => {
        //TODO: Update all parameters etc.
        store.initDefaultState();
        console.log(store.state.light_1.lowestBrightness);
        resetLCD();
    });

    // gridSelect[1].ledRGB(0, 255, 0);
};

const handleChannelSelect = (channelSelect, resetLCD) => {
    channelSelect[0].ledOn();
    channelSelect[0].onPressed(() => {
        store.setState({});
    });

    channelSelect[1].ledOn();
    channelSelect[1].onPressed(() => {
        store.setState({});
    });
};

/**
 * Handles the toggeling of selected active lights
 * (the green buttons)
 * @param {*} id
 */
const handleLightActiveToggle = id => {
    let newActiveLights;
    const currentState = store.state.activeLights;
    const includesLight = currentState.includes(id);

    newActiveLights = includesLight
        ? currentState.filter(l => l !== id)
        : [...currentState, id];

    store.setState("activeLights", newActiveLights);

    return !includesLight;
};

/**
 * Handles LCD display for each parameter
 * @param {*} knobs
 * @param {*} lcdSegmentsCol
 */
const handleLCD = (knobs, lcdSegmentsCol) => () => {
    console.log("CALLED");
    // COLOR SWITCH TRANSITION
    for (const lcd of store.state.lcdState) {
        colLcd = lcdSegmentsCol(lcd.id);
        colLcd[3].display(lcd.topText);
        colLcd[2].display(lcd.bottomText);
        assignKnobValueModifier(
            knobs[lcd.id],
            colLcd,
            lcd.id,
            lcd.key,
            lcd.incrementer,
            lcd.multipleLights
        );
    }
};

/**
 * Assigns possible state modifications
 * to the knobs on top
 * @param {*} knob
 * @param {*} colLcd
 * @param {*} id
 * @param {*} path
 * @param {*} incrementer
 * @param {*} multipleLights
 */
const assignKnobValueModifier = (
    knob,
    colLcd,
    id,
    path,
    incrementer,
    multipleLights
) => {
    // TODO: move to set for each light
    colLcd[1].display(_.get(store.state, `light_1.${path}`));
    colLcd[0].display(_.get(store.state, `light_2.${path}`));
    if (multipleLights) {
        knob.onTurned(i => {
            store.state.activeLights.forEach(light => {
                const fullPath = `light_${light}.${path}`;
                // HINT: only goes one level deep
                let val = _.get(store.state, fullPath);
                const newVal = (val += i * incrementer);
                store.setState(fullPath, newVal);
                if (light == 1) {
                    colLcd[1].display(_.get(store.state, fullPath));
                }

                if (light == 2) {
                    colLcd[0].display(_.get(store.state, fullPath));
                }
            });
        });
    } else {
        let val = _.get(store.state, path);
        colLcd[1].display(val);
        knob.onTurned(i => {
            store.setState(path, (val += i * incrementer));
            colLcd[1].display(_.get(store.state, path));
        });
    }
};
module.exports = pushHandler;
