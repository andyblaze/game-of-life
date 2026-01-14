import SensorsCollator from "./sensors-collator.js";
import { TempReader, WindReader } from "./sensor-readers.js";
import { TempConversionStrategy, WindConversionStrategy } from "./conversion-strategies.js";
import { ConsoleObserver } from "./observers.js";

const sensorsCollator = new SensorsCollator();
sensorsCollator.addObserver(new ConsoleObserver());

const cfg = { 
  "readers": {
    "temp": new TempReader(sensorsCollator),
    "wind": new WindReader(sensorsCollator)
  },
  "converters": {
    "temp": new TempConversionStrategy(),
    "wind": new WindConversionStrategy()
  }
};


const sensorConverters = cfg.converters;
for ( const index in sensorConverters )
  sensorsCollator.registerStrategy(index, sensorConverters[index]);



$(document).ready(function() {
const host = 'ws://127.0.0.1:8080/sensors-server.php';
    const socket = new WebSocket(host);
    const sensorReaders = cfg.readers;
    socket.onmessage = function(e) {
        const readings = JSON.parse(e.data);
        for ( const index in readings ) {
          sensorReaders[index].read(readings[index]);
        }
    };
});
