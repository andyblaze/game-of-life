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
        return $pressure;
    }

    public function trend(): int {
        if (count($this->buffer) < 2) return 0;
        return $this->buffer[0] - $this->buffer[count($this->buffer) - 1];
    }
}

class Wind {
    private $pressure;
    private $dir;
    private $speed = 0;
    private $minSpeed = 0;
    private $maxSpeed = 30;
    private $buffer = [];
    private $bufferSz = 5;

    public function __construct(Pressure $p) {
        $this->pressure = $p;
        $this->dir = 225; // initial direction
    }

    public function tick() {
        $trend = $this->pressure->trend();
        /* ------------- direction ----------- */
        // base drift
        $drift = rand(-5, 5);

        if ($trend < -3) {
            // pressure falling → backing W-> SW -> S -> SE)
            $drift -= rand(3, 10);
        } elseif ($trend > 3) {
            // pressure rising → veering
            $drift += rand(3, 10);
        }

        $this->dir = ($this->dir + $drift) % 360;
        if ($this->dir < 0) $this->dir += 360;

        /* ------------- speed ---------------- */
        if ($trend < -2) {
            $this->speed += rand(1, 3);
        }
        elseif ($trend > 2) {
            $this->speed -= rand(1, 2);
        }
        else {
            $this->speed += rand(-1, 1);
        }
        $this->speed = clamp($this->speed, $this->minSpeed, $this->maxSpeed);

        array_unshift($this->buffer, $this->dir);
        if (count($this->buffer) > $this->bufferSz)
            array_pop($this->buffer);

        return [$this->dir, $this->speed];
    }
}


// ---- Simulation ----
$pressure = new Pressure(new Perlin1D());
$wind = new Wind($pressure);

while (true) {
    echo $pressure->tick();
    echo ' , ' . implode(' , ', $wind->tick()) . PHP_EOL;
    sleep(1);
}
