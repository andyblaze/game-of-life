export default class WeatherCollator {
  constructor() {
    this.observers = [];
    this.readings = {};
    this.strategies = {};
  }
  addObserver(o) {
    this.observers.push(o);
  }
  registerStrategy(sensorType, strategy) {
    this.strategies[sensorType] = strategy;
  }
  update(data) {
    this.readings[data.type] = data;
    const strategy = this.strategies[data.type];
    const converted = strategy ? strategy.convert(data) : data;

    this.readings[data.type] = converted;
    this.notify();
    
  }
  notify() {
    this.observers.forEach(o => o.update(this.readings));
  }
}
