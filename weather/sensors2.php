<?php

class PressureSensor {
    public function read(Pressure $p): float {
        return $p->getCurrent();
    }
    public function type() {
        return 'pressure';
    }
}

class WindspeedSensor {
    public function read(Wind $w): float {
        return $w->getSpeed();
    }
    public function type() {
        return 'wind';
    }
} 

class WindDirSensor {
    public function read(Wind $w): float {
        return $w->getDir();
    }
    public function type() {
        return 'wind';
    }
}

class CloudCoverSensor {
    public function read(Cloud $c): float {
        return $c->getCurrent();
    }
    public function type() {
        return 'cloud';
    }
}

class RainSensor {
    public function read(Rain $r): float {
        return $r->getCurrent();
    }
    public function type() {
        return 'rain';
    }
}

class TemperatureSensor {
    public function read(Temperature $t): float {
        return $t->getCurrent();
    }
    public function type() {
        return 'temp';
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