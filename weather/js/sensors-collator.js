import { SeaStateClassifier, VisibilityClassifier } from "./classifiers.js";

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
      const converted = strategy.convert(data);
      this.readings[data.type] = converted;
      this.readings["sea_state"] = SeaStateClassifier.classify();
      this.readings["visibility"] = VisibilityClassifier.classify();
    }
    this.notify();
    
  }
  notify() {
    this.observers.forEach(o => o.update(this.readings));
  }
}
