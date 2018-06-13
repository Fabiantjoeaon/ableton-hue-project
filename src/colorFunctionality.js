const times = require("lodash/times");
const randomFloatInRange = require("./helpers/randomFloatInRange");
const { PUSH_ROWS, PUSH_COLS } = require("./constants");

const colors = [];

times(PUSH_COLS, col => {
    colors[col] = [];
    times(PUSH_ROWS, row => {
        colors[col][row] = {
            r: randomFloatInRange(0, 255),
            g: randomFloatInRange(0, 255),
            b: randomFloatInRange(0, 255)
        };
    });
});

module.exports = colors;
