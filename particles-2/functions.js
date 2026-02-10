export function byId(id) {
    return document.getElementById(id);
}

export function byQs(selector, parent = document) { 
    return parent.querySelector(selector); 
}
export function byQsArray(selector, parent = document) { 
    return Array.from(parent.querySelectorAll(selector)); 
}

export function mt_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mt_randf(min, max) {
    return Math.random() * (max - min) + min;
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function randHSLA(hRange, sRange, lRange, aRange) {
    const h = mt_randf(hRange[0], hRange[1]);
    const s = mt_randf(sRange[0], sRange[1]);
    const l = mt_randf(lRange[0], lRange[1]);
    const a = mt_randf(aRange[0], aRange[1]);
    return `hsla(${h},${s}%,${l}%,${a})`;
}

export function lerpHSLAColor(c1, c2, t) {
    return {
        h: lerp(c1.h, c2.h, t),
        s: lerp(c1.s, c2.s, t),
        l: lerp(c1.l, c2.l, t),
        a: lerp(c1.a, c2.a, t)
    };
}

export function HSLAString(c) {
    return `hsla(${c.h},${c.s}%,${c.l}%,${c.a})`;
}
