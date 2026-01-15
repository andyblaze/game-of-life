class SensorReader {
  constructor() {
  }
  read(value) {
    console.log(value)
  }
}
export class TempReader extends SensorReader {
  read(value) {
    const result = { type:'temp', data: value, unit:'C' };
    return result;
  }
}
export class WindReader extends SensorReader {
  read(value) {
    const result = { type:'wind', data: value, unit:'mps' };
    return result;
  }
}