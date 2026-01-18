<?php

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
        return $w->getDir();
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
    public function getAll() {
        return $this->sensors;
    }
}