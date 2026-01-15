import SensorsCollator from "./sensors-collator.js";
import { ConsoleObserver } from "./observers.js";
import SensorReadersArray from "./sensor-readers-array.js";
import { config } from "./config.js";

$(document).ready(function() {
    const sensorsCollator = new SensorsCollator();

    const sensorReaders = new SensorReadersArray(config.readers, sensorsCollator);

    sensorsCollator.setStrategies(config.converters);
    //sensorsCollator.addObserver(new ConsoleObserver());

    const host = 'ws://127.0.0.1:8080/sensors-server.php';
    const socket = new WebSocket(host);
    socket.onmessage = sensorReaders.read.bind(sensorReaders);
});
