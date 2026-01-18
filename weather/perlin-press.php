<?php
require_once('functions.php');
require_once('sim/pressure.php');
require_once('sim/wind.php');
require_once('sim/cloud.php');
require_once('sim/rain.php');
require_once('sim/temp.php');


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

class WeatherGenerator {
    private $sensors;
    public function __construct(SensorArray $sensors) {
        $this->sensors = $sensors;
    }
    public function tick(): string {
        $readings = [];
        foreach ($this->sensors->getAll() as $type => $sensor) {
            // sensor just asks state for value
            //$method = 'get' . ucfirst($type);
            //$actualWeather = $this->state->$method();
            $readings[$type] = $sensor->read($cfg[$type]);
        }
        //error_log($readings['wind']);

        return json_encode($readings);
    }
}

while (true) {
    $pressure->tick();
    $wind->tick();
    $cloud->tick();
    $rain->tick();
    $temp->tick();
    echo $pressure->getCurrent() . "\t" .
    $wind->getSpeed() . "\t" .
    $wind->getDir() . "\t" .
    $cloud->getCurrent() . "\t" .
    $rain->getCurrent() . "\t" .
    $temp->getCurrent() . PHP_EOL;
    sleep(1);
}
