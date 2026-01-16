import { makeTimestamp } from "./functions.js";

export default class SensorReadersArray {
  constructor(sensors, collator) {
    this.sensors = sensors;
    this.collator = collator;
    this.sensorData = [];
  }
  read(e) {
    this.sensorData = [];
    const readings = JSON.parse(e.data); console.log(readings);
    for ( const type in readings ) {
      const data = this.sensors[type].read(readings[type]);
      data["timestamp"] = makeTimestamp();
      this.sensorData.push(data);
    }
    this.collator.update(this.sensorData);
  }
}