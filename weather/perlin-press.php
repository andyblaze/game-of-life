<?php
require_once('functions.php');
require_once('sim/pressure.php');
require_once('sim/wind.php');
require_once('sim/cloud.php');
require_once('sim/rain.php');
require_once('sim/temp.php');
require_once('sensors2.php');
require_once('sim/weather-sim.php');

$sensors = new SensorArray([
    'pressure'=>new PressureSensor(),
    'wind'=>new WindspeedSensor(),
    'wind_dir'=>new WindDirSensor(),
    'cloud'=>new CloudCoverSensor(),
    'rain'=>new RainSensor(),
    'temp'=>new TemperatureSensor()
]);

// ---- Simulation ----
$pressure = new Pressure(new Perlin1D());
$wind = new Wind($pressure);
$cloud = new Cloud($pressure, $wind);
$rain = new Rain($pressure, $wind, $cloud);
$temp = new Temperature($pressure, $wind);


$cfg = [
    'pressure'=>$pressure,
    'wind'=>$wind,
    'wind_dir'=>$wind,
    'cloud'=>$cloud,
    'rain'=>$rain,
    'temp'=>$temp
];

$sim = new WeatherSim($sensors, $cfg);


while (true) {
    $readings = $sim->tick();
    echo $readings;
    sleep(1);
}
