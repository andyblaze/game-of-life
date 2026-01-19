<?php

class WeatherSim {
    private $sensors;
    private $weather = null;
    public function __construct(SensorArray $sensors, $weather) {
        $this->sensors = $sensors;
        $this->weather = $weather;
    }
    public function tick(): string {
        foreach( $this->weather as $w )
            $w->tick();
        $readings = [];
        foreach ( $this->sensors->getAll() as $sensor ) {
            $type = $sensor->type();
            $readings[$type] = $sensor->read($this->weather[$type]); 
        }
        return json_encode($readings); 
    }
}
 