export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
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
