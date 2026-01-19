
export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function distance(a, b, squared=false) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = dx * dx + dy * dy;

    if (squared) {
        // no sqrt, cheaper
        return { dx, dy, dist };
    } else {
        return { dx, dy, dist: Math.sqrt(dist) };
    }
}

export function generateId() {
    const now = Date.now(); // ms precision
    const rand = mt_rand(1000000, 9999999);
    return (now.toString(36) + rand.toString(36));
}