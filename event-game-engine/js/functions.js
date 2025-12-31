export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}

export function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    $("#rotate-warning").css("display", isPortrait ? "flex" : "none");
}

export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function mt_rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function lerpColor(c1, c2, t) {
    return {
        h: lerp(c1.h, c2.h, t),
        s: lerp(c1.s, c2.s, t),
        l: lerp(c1.l, c2.l, t),
        a: lerp(c1.a, c2.a, t)
    };
}

export function clampMagnitude(x, y, max) {
    const mag = Math.hypot(x, y);
    if (mag === 0 || mag <= max) return { x, y };
    const s = max / mag;
    return { x: x * s, y: y * s };
}

export function normalize(x, y) {
    const mag = Math.hypot(x, y);
    if (mag === 0) return { x: 0, y: 0 };
    return { x: x / mag, y: y / mag };
}

export function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}
