<?php
require_once('functions.php');
require_once('sim/pressure.php');
require_once('sim/wind.php');
require_once('sim/cloud.php');
require_once('sim/rain.php');
require_once('sim/temp.php');
require_once('sensors2.php');

$sensors = new SensorArray([
    'temp'=>new TemperatureSensor(),
    'wind'=>new WindspeedSensor(),
    'wind_dir'=>new WindDirSensor(),
    'cloud'=>new CloudCoverSensor(),
    'pressure'=>new PressureSensor(),
    'rain'=>new RainSensor()
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

class WeatherGenerator {
    private $sensors;
    private $cfg = null;
    public function __construct(SensorArray $sensors, $conf) {
        $this->sensors = $sensors;
        $this->cfg = $conf;
    }
    public function tick(): string {
        $pressure->tick();
        $wind->tick();
        $cloud->tick();
        $rain->tick();
        $temp->tick();
        $readings = [];
        foreach ($this->sensors->getAll() as $type => $sensor) {
            $readings[$type] = $sensor->read($this->cfg[$type]);
        }
        return json_encode($readings, JSON_PRETTY_PRINT) . PHP_EOL;//json_encode($readings);
    }
}

$sim = new WeatherGenerator($sensors, $cfg);


while (true) {
    echo $sim->tick();
    sleep(1);
}
