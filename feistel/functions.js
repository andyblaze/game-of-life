
export function byId(id) {
    return document.getElementById(id);
}

export function addEvent(item, e, handler) {
    byId(item).addEventListener(e, handler);
}

export function isString(x) {
    return typeof x === "string" || x instanceof String;
}

export function isNumeric(x) {
    return (typeof x === "number" || typeof x === "string") &&
           x !== "" &&
           !isNaN(x) &&
           isFinite(x);
}

export function isArray(x) {
    return Array.isArray(x);
}

export function isObject(x) {
    return (
        x !== null &&
        typeof x === "object" &&
        !Array.isArray(x)
    );
}

export function to5Bit(n) {
    return n.toString(2).padStart(5, "0");
}

export function to8Bit(n) {
    return n.toString(2).padStart(8, "0");
}

export function from5Bit(bin) {
    return parseInt(bin, 2);
}