<?php

/*class Sensor {
    public function __construct() {}
    // Generates a new reading (to be overridden)
    public function read($weather) {
        // Base version returns nothing meaningful
        return 0;
    }
}*/

/*interface Sensor {
    public function read(WeatherState $state): float;
}*/

class TemperatureSensor {
    public function read(Temperature $t): float {
        return $t->getCurrent();
    }
}

class WindspeedSensor {
    public function read(Wind $w): float {
        return $w->getSpeed();
    }
} 

class WindDirSensor {
    public function read(Wind $w): float {
        return $w->geDir();
    }
}

class CloudCoverSensor {
    public function read(Cloud $c): float {
        return $c->getCurrent();
    }
}

class PressureSensor {
    public function read(Pressure $p): float {
        return $p->getCurrent();
    }
}

class RainSensor {
    public function read(Rain $r): float {
        return $r->getCurrent();
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