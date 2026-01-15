export default class SensorsCollator {
  constructor() {
    this.observers = [];
    this.readings = {};
    this.strategies = {};
  }
  addObserver(o) {
    this.observers.push(o);
  }
  setStrategies(strategies) {
    this.strategies = strategies;
  }
  update(readings) {  
    for ( const data of readings ) {
      this.readings[data.type] = data;
      const strategy = this.strategies[data.type];
      const converted = strategy.convert(data); console.log(converted);
      this.readings[data.type] = converted;
    }
    this.notify();
    
  }
  notify() {
    this.observers.forEach(o => o.update(this.readings));
  }
}
