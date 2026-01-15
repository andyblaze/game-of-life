export default class SensorReadersArray {
  constructor(sensors, collator) {
    this.sensors = sensors;
    this.collator = collator;
    this.sensorData = [];
  }
  read(e) {
    this.sensorData = [];
    const readings = JSON.parse(e.data);
    for ( const type in readings ) {
      const data = this.sensors[type].read(readings[type]);
      this.sensorData.push(data);//[data.type] = data;
    }
    this.collator.update(this.sensorData);
  }
}