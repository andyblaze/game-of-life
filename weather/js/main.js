import SensorsCollator from "./sensors-collator.js";
import { TempReader, WindReader } from "./sensor-readers.js";
import { TempConversionStrategy, WindConversionStrategy } from "./conversion-strategies.js";
import { ConsoleObserver } from "./observers.js";

const sensorsCollator = new SensorsCollator();
sensorsCollator.addObserver(new ConsoleObserver());

sensorsCollator.registerStrategy('temp', new TempConversionStrategy());
sensorsCollator.registerStrategy('wind', new WindConversionStrategy());

const cfg = { 
  "temp": new TempReader(sensorsCollator),
  "wind": new WindReader(sensorsCollator)
};

$(document).ready(function() {
const host = 'ws://127.0.0.1:8080/sensors-server.php';
    const socket = new WebSocket(host);
    socket.onmessage = function(e) {
        const readings = JSON.parse(e.data);
        for ( const index in readings ) {
          cfg[index].read(readings[index]);
        }
    };
});
