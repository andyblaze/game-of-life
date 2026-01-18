<?php

class WeatherSim {
    private $sensors;
    private $cfg = null;
    public function __construct(SensorArray $sensors, $conf) {
        $this->sensors = $sensors;
        $this->cfg = $conf;
    }
    public function tick(): string {
        foreach( $this->cfg as $weather )
            $weather->tick();
        $readings = [];
        foreach ($this->sensors->getAll() as $type => $sensor) {
            $readings[$type] = $sensor->read($this->cfg[$type]);
        }
        return json_encode($readings);
    }
}
