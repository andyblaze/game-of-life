export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}

export function checkOrientation() {
    const d = (window.innerHeight > window.innerWidth ? "flex" : "none");
    $("#rotate-warning").css("display", d);
}

export function mt_rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
