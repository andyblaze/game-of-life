<?php

/*class Sensor {
    public function __construct() {}
    // Generates a new reading (to be overridden)
    public function read($weather) {
        // Base version returns nothing meaningful
        return 0;
    }
}*/

interface Sensor {
    public function read(WeatherState $state): float;
}

class TemperatureSensor implements Sensor {
    public function read(WeatherState $state): float {
        return $state->getTemp();
    }
}

class WindspeedSensor implements Sensor {
    public function read(WeatherState $state): float {
        return $state->getWind();
    }
} 

class WindDirSensor implements Sensor {
    public function read(WeatherState $state): float {
        return $state->getWindDir();
    }
}

class CloudCoverSensor implements Sensor {
    public function read(WeatherState $state): float {
        return $state->getCloud();
    }
}

class PressureSensor implements Sensor {
    public function read(WeatherState $state): float {
        return $state->getPressure();
    }
}

class RainSensor implements Sensor {
    public function read(WeatherState $state): float {
        return $state->getRain();
    }
}

class SensorArray {
    private $sensors = [];
    public function __construct(array $sensors) {
        $this->sensors = $sensors;
    }
    public function read():string {
        $result = [];
        foreach ( $this->sensors as $label=>$s ) {
            $result[$label] = $s->read(); 
        }
        return json_encode($result);
    }
    public function getAll() {
        return $this->sensors;
    }
}