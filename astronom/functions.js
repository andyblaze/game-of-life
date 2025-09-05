
export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}

export function Point(x, y) {
    return {"x": x, "y": y};
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)), // R
    Math.round(lerp(c1[1], c2[1], t)), // G
    Math.round(lerp(c1[2], c2[2], t)), // B
    lerp(c1[3], c2[3], t)              // A
  ];
}

export function skyHeight(canvasHeight, imgHeight = 1080, cutoffPx = 712) {
    return canvasHeight * (cutoffPx / imgHeight);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
