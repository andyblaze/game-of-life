<?php

class Sensor {
    public function __construct() {}
    // Generates a new reading (to be overridden)
    public function read(): int {
        // Base version returns nothing meaningful
        return 0;
    }
}

class TemperatureSensor extends Sensor {
    public function read(): int {
        return mt_rand(-10, 30);
    }
}

class WindspeedSensor extends Sensor {
    public function read(): int {
        return round(mt_rand(1, 30) / 0.44704);
    }
}

class CloudCoverSensor extends Sensor {
    public function read(): int {
        return mt_rand(0, 100);
    }
}

class PressureSensor extends Sensor {
    public function read(): int {
        return mt_rand(970, 1030);
    }
}

class RainSensor extends Sensor {
    public function read(): int {
        return mt_rand(0, 10);
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
}