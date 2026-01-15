export function mt_rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function makeTimestamp() {
  const d = new Date();

  const pad = n => String(n).padStart(2, '0');

  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}

export function randomUniform(min, max) {
    return min + Math.random() * (max - min);
}

// Box–Muller transform
export function randomNormal(mean = 0, stddev = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stddev;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function normalisedScore(position, fieldLength) {
  return 1 - (position - 1) / (fieldLength - 1);
}
