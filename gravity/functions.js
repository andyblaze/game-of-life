export function mt_rand(min, max) {
    // Swap if parameters are reversed
    if (max < min) [min, max] = [max, min];

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mt_rand_excluding_gap(min1, max1, min2, max2) {
    // choose which range (50/50)
    if (Math.random() < 0.5) {
        return Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    } else {
        return Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Circular lerp for hue (0..360)
function lerpHue(h1, h2, t) {
    let d = h2 - h1;

    // Wrap shortest direction
    if (d > 180) d -= 360;
    if (d < -180) d += 360;

    return (h1 + d * t + 360) % 360;
}

// Lerp entire HSL color
export function lerpHSL(c1, c2, t) {
    return {
        h: lerpHue(c1.h, c2.h, t),
        s: lerp(c1.s, c2.s, t),
        l: lerp(c1.l, c2.l, t)
    };
}