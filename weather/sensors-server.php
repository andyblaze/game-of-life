<?php

require_once('sensors.php');
require_once('weather-sim.php');
require_once('websocket.php');

// Usage
$sensors = new SensorArray([
    'temp'=>new TemperatureSensor(),
    'wind'=>new WindspeedSensor(),
    'cloud'=>new CloudCoverSensor(),
    'pressure'=>new PressureSensor(),
    'rain'=>new RainSensor()
]);
 
$address = '127.0.0.1';
$port = 8080;
$running = true;

$server = new WebSocket();
$server->create($address, $port);
$server->handshake();

// Send messages into WebSocket in a loop.
while ($running) {
    sleep(1);
    $readings = $sensors->read();
    $server->write($readings);
}