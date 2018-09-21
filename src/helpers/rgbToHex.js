const rgbToHex = (r, g, b) =>
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

const rgbToSeperateHexChannels = (...args) => {
    const hex = rgbToHex(...args).split("");

    return {
        r: parseInt(Number(`0x${hex[0]}${hex[1]}`), 10),
        g: parseInt(Number(`0x${hex[2]}${hex[3]}`), 10),
        b: parseInt(Number(`0x${hex[4]}${hex[5]}`), 10)
    };
};
module.exports = rgbToSeperateHexChannels;
