export function scaleX(x) {
  return (x / 1920) * window.innerWidth;
}

export function scaleY(y) {
  return (y / 1080) * window.innerHeight;
}
// Simple pseudo-perlin
export function perlin(x, y){
    return (Math.sin(x*12.9898 + y*78.233) * 43758.5453 % 1 + 1) % 1;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function randomFrom(arr) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}