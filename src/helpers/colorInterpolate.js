/**
 * @module  color-interpolate
 * Pick color from palette by index
 */

const parse = require("color-parse");
const hsl = require("color-space/hsl");
const lerp = require("lerp");
const clamp = require("mumath/clamp");

module.exports = interpolate;

function interpolate(palette) {
    palette = palette.map(c => {
        c = parse(c);
        if (c.space != "rgb") {
            if (c.space != "hsl") throw `${c.space} space is not supported.`;
            c.values = hsl.rgb(c.values);
        }
        c.values.push(c.alpha);
        return c.values;
    });

    return (t, mix = lerp) => {
        t = clamp(t, 0, 1);

        let idx = (palette.length - 1) * t,
            lIdx = Math.floor(idx),
            rIdx = Math.ceil(idx);

        t = idx - lIdx;

        let lColor = palette[lIdx],
            rColor = palette[rIdx];

        let result = lColor.map((v, i) => {
            v = mix(v, rColor[i], t);
            if (i < 3) v = Math.round(v);
            return v;
        });

        return {
            r: result[0],
            g: result[1],
            b: result[2]
        };
    };
}
