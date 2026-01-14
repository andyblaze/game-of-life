class WeatherCollator {
  constructor() {
    this.observers = [];
    this.weather = {};
  }
  addObserver(o) {
    this.observers.push(o);
  }
  update(data) {
    this.weather[data.type] = data;
    this.notify();
    
  }
  notify() {
    for ( let o of this.observers )
      o.update(this.weather);
  }
}

class ConsoleObserver {
  update(weather) {
    console.log(weather);
  }
}

const weatherCollator = new WeatherCollator();
weatherCollator.addObserver(new ConsoleObserver());

class SensorReader {
  constructor(collator) {
    this.collator = collator;
  }
  read(value) {
    console.log(value)
  }
}
class TempReader extends SensorReader {
  read(value) {
    const result = { type:'temp', data: value, unit:'C' };
    this.collator.update(result);
  }
}
class WindReader extends SensorReader {
  read(value) {
    const result = { type:'wind', data: value, unit:'MPH' };
    this.collator.update(result);
  }
}

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
