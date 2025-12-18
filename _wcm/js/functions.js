export function byId(id) {
    return document.getElementById(id);
}

export function byQuery(q) {
    return document.querySelector(q);
}

export function wndEvent(evt, handler) {
    window.addEventListener(evt, handler);
}

export function addEvent(to, evt, handler) {
    to.addEventListener(evt, handler);
}

export function checkOrientation() {
    const warning = byId("rotate-warning");
    const sd = (window.innerHeight > window.innerWidth ? "flex" : "none");
    warning.style.display = sd;
}

export function mt_rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
