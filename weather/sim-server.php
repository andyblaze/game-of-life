<?php
require_once('functions.php');
require_once('sim/pressure.php');
require_once('sim/wind.php');
require_once('sim/cloud.php');
require_once('sim/rain.php');
require_once('sim/temp.php');
require_once('sim/sensors.php');
require_once('sim/weather-sim.php');
require_once('websocket.php');

$sensors = new SensorArray([
    new PressureSensor(),
    new WindspeedSensor(),
    new WindDirSensor(),
    new CloudCoverSensor(),
    new RainSensor(),
    new TemperatureSensor()
]);

// ---- Simulation ----
$pressure = new Pressure(new Perlin1D());
$wind = new Wind($pressure);
$cloud = new Cloud($pressure, $wind);
$rain = new Rain($pressure, $wind, $cloud);
$temp = new Temperature($pressure, $wind);
$weather = [ 
    'pressure'=>$pressure,
    'wind'=>$wind,
    'wind_dir'=>$wind,
    'cloud'=>$cloud,
    'rain'=>$rain,
    'temp'=>$temp
];

$sim = new WeatherSim($sensors, $weather);

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
