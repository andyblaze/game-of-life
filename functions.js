import config from "./config.js";

export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Point(x, y) {
    return {"x": x, "y": y};
}

export function getRandomChar(charPool, allowSpace=true) {
    if ( allowSpace === false ) {
        const idx = charPool.indexOf(" ");
        const i = mt_rand(0, charPool.length - idx);
        return charPool[i];
    }
    const i = mt_rand(0, charPool.length - 1);
    return charPool[i];
}
export function getRandomChars(charPool, num) {
    let chars = [];
    chars[0] = getRandomChar(charPool, false);
    chars[1] = getRandomChar(charPool, false);
    chars[2] = getRandomChar(charPool, false);
    
    const end = Array.from({ length: num - 3 }, () =>
        charPool[mt_rand(0, charPool.length - 1)]
    );
    return chars.concat(end);
}