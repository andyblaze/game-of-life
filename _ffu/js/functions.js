export function randomOutside(min, max) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    return sign * (min + Math.random() * (max - min));
}

export function mt_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mt_randf(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}