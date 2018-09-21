const randomFloatInRange = require("../helpers/randomFloatInRange");

const lightState = {
    // LIGHT 1
    light_1: {
        id: 15,
        color: {
            r: randomFloatInRange(0, 255),
            g: randomFloatInRange(0, 255),
            b: randomFloatInRange(0, 255)
        },
        brightness: 255,
        colorSwitchTransition: 300,
        flashOnTransition: 100,
        flashOffTransition: 100,
        lowestBrightness: 50,
        highestBrightness: 255
    },

    // LIGHT 2
    light_2: {
        id: 14,
        color: {
            r: randomFloatInRange(0, 255),
            g: randomFloatInRange(0, 255),
            b: randomFloatInRange(0, 255)
        },
        brightness: 255,
        colorSwitchTransition: 300,
        flashOnTransition: 100,
        flashOffTransition: 100,
        lowestBrightness: 50,
        highestBrightness: 255
    },
    activeLights: [1, 2],
    kickThreshold: 0.72
};

const lcdState = [
    {
        id: 0,
        topText: "COLOR",
        bottomText: "TRANSITION",
        key: "colorSwitchTransition",
        incrementer: 100,
        multipleLights: true
    },
    {
        id: 1,
        topText: "FLASHON",
        bottomText: "TRANSITION",
        key: "flashOnTransition",
        incrementer: 2,
        multipleLights: true
    },
    {
        id: 2,
        topText: "FLASHOFF",
        bottomText: "TRANSITION",
        key: "flashOffTransition",
        incrementer: 2,
        multipleLights: true
    },
    {
        id: 3,
        topText: "LOWEST",
        bottomText: "BRIGHTNESS",
        key: "lowestBrightness",
        incrementer: 1,
        multipleLights: true
    },
    {
        id: 4,
        topText: "HIGHEST",
        bottomText: "BRIGHTNESS",
        key: "highestBrightness",
        incrementer: 1,
        multipleLights: true
    },
    {
        id: 5,
        topText: "KICK",
        bottomText: "THRESHOLD",
        key: "kickThreshold",
        incrementer: 0.001,
        multipleLights: false
    },
    {
        id: 6,
        topText: "DEFAULT",
        bottomText: "BRIGHTNESS",
        key: "brightness",
        incrementer: 1,
        multipleLights: true
    }
];

module.exports = { ...lightState, lcdState };
