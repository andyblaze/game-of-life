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
    const result = { type:'wind', data: value, unit:'MPS' };
    return result;
  }
}

export class CloudCoverReader extends SensorReader {
  read(value) {
    const result = { type:'cloud', data: value, unit:'PC' };
    return result;
  }
}

export class PressureReader extends SensorReader {
  read(value) {
    const result = { type:'press', data: value, unit:'MB' };
    return result;
  }
}
