class SensorReader {
  constructor(collator) {
    this.collator = collator;
  }
  read(value) {
    console.log(value)
  }
}
export class TempReader extends SensorReader {
  read(value) {
    const result = { type:'temp', data: value, unit:'C' };
    this.collator.update(result);
  }
}
export class WindReader extends SensorReader {
  read(value) {
    const result = { type:'wind', data: value, unit:'mps' };
    this.collator.update(result);
  }
}