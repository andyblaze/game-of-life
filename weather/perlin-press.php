<?php
require_once('perlin.php');
require_once('functions.php');

class Pressure {
    private $perlin = null;
    private $buffer = [];
    private $bufferSz = 5;
    private $time = 0;
    public function __construct(Perlin1D $p) {
        $this->perlin = $p;
    }
    public function tick() { 
        // scale and shift Perlin output into pressure range
        $noise = $this->perlin->noise($this->time * 0.05); // adjust speed
        $noise = ($noise + 1) / 2;           // convert -1..1 to 0..1
        $pressure = 970 + ($noise * (1030 - 970));
        $pressure = clamp(round($pressure), 970, 1030);
        array_unshift($this->buffer, $pressure);
        if ( count($this->buffer) > $this->bufferSz )
            array_pop($this->buffer);
        $this->time += 1;
        return $pressure . ' ' . implode(',', $this->buffer) . PHP_EOL;
    }
}

class Wind {
    private $pressure = null;
    private $buffer = [];
    private $bufferSz = 5;
    public function __construct(Pressure $p) {
        $this->pressure = $p; 
    }
    public function tick() {

    }
}

// ---- Simulation ----
$pressure = new Pressure(new Perlin1D());
$wind = new Wind($pressure);

while (true) {
    echo $pressure->tick();
    sleep(1);
}
