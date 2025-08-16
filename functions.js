import config from "./config.js";

export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Point(x, y) {
    return {"x": x, "y": y};
}

export function getRandomChar(allowSpace=true) {
    if ( allowSpace === false ) {
        const idx = config.charPool.indexOf(" ");
        const i = mt_rand(0, config.charPool.length - idx);
        return config.charPool[i];
    }
    const i = mt_rand(0, config.charPool.length - 1);
    return config.charPool[i];
}
export function getRandomChars(num) {
    let chars = [];
    chars[0] = getRandomChar(false);
    chars[1] = getRandomChar(false);
    chars[2] = getRandomChar(false);
    
    const end = Array.from({ length: num - 3 }, () =>
        config.charPool[mt_rand(0, config.charPool.length - 1)]
    );
    return chars.concat(end);
}