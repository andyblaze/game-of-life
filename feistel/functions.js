
export function byId(id) {
    return document.getElementById(id);
}

export function addEvent(item, e, handler) {
    byId(item).addEventListener(e, handler);
}
