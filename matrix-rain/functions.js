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
    const initialNum = (charPool.length < 6 ? 1 : (charPool.length > 9 ? 3 : 2));
    let chars = [];
    for ( let i = 0; i < initialNum; i++ )
        chars[i] = getRandomChar(charPool, false);
    
    const end = Array.from({ length: num - initialNum }, () =>
        charPool[mt_rand(0, charPool.length - 1)]
    );
    return chars.concat(end);
}

export function generateId() {
    const now = Date.now(); // ms precision
    const rand = mt_rand(1000000, 9999999);
    return (now.toString(36) + rand.toString(36));
}