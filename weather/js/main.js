import WeatherCollator from "./weather-collator.js";
import { TempReader, WindReader } from "./sensor-readers.js";
import { TempConversionStrategy, WindConversionStrategy } from "./conversion-strategies.js";
import { ConsoleObserver } from "./observers.js";

const weatherCollator = new WeatherCollator();
weatherCollator.addObserver(new ConsoleObserver());

weatherCollator.registerStrategy('temp', new TempConversionStrategy());
weatherCollator.registerStrategy('wind', new WindConversionStrategy());

const cfg = {
  "temp": new TempReader(weatherCollator),
  "wind": new WindReader(weatherCollator)
};

$(document).ready(function() {
const host = 'ws://127.0.0.1:8080/weather.php';
        var socket = new WebSocket(host);
        socket.onmessage = function(e) {
           const data = JSON.parse(e.data);
           for ( const index in data ) {
            cfg[index].read(data[index]);
           }
        };
});
