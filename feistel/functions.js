
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