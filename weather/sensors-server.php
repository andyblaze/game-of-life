<?php

require_once('sensors.php');
require_once('weather-sim.php');
require_once('websocket.php');

// Usage
$sensors = new SensorArray([
    'temp'=>new TemperatureSensor(),
    'wind'=>new WindspeedSensor(),
    'wind_dir'=>new WindDirSensor(),
    'cloud'=>new CloudCoverSensor(),
    'pressure'=>new PressureSensor(),
    'rain'=>new RainSensor()
]);

$sim = new WeatherGenerator($sensors);
 
$address = '127.0.0.1';
$port = 8080;
$running = true;

$server = new WebSocket();
$server->create($address, $port);
$server->handshake();

while ($running) {
    sleep(1);
    $readings = $sim->tick(); 
    $server->write($readings);
}