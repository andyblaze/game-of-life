
export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Point(x, y) {
    return {"x": x, "y": y};
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function generateId() {
    const now = Date.now(); // ms precision
    const rand = mt_rand(1000000, 9999999);
    return (now.toString(36) + rand.toString(36));
}