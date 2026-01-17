<?php
// Simple Perlin implementation (1D)
class Perlin1D {
    private $seed;

    public function __construct($seed = null) {
        $this->seed = $seed ?? time();
    }

    private function fade($t) {
        return $t * $t * $t * ($t * ($t * 6 - 15) + 10);
    }

    private function lerp($a, $b, $t) {
        return $a + $t * ($b - $a);
    }

    private function grad($hash, $x) {
        $h = $hash & 15;
        $grad = 1 + ($h & 7);   // Gradient value 1-8
        if (($h & 8) != 0) $grad = -$grad;
        return ($grad * $x);
    }

    private function perm($i) {
        // pseudo-random permutation based on seed
        $i = ($i + $this->seed) & 255;
        return ($i * 34 + 1) % 256;
    }

    public function noise($x) {
        $xi = (int)floor($x) & 255;
        $xf = $x - floor($x);

        $u = $this->fade($xf);

        $a = $this->perm($xi);
        $b = $this->perm($xi + 1);

        $gradA = $this->grad($a, $xf);
        $gradB = $this->grad($b, $xf - 1);

        return $this->lerp($gradA, $gradB, $u);
    }
}

function clamp(float $value, float $min, float $max): float {
    return max($min, min($max, $value));
}

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
        $this->buffer[] = $pressure;
        if ( count($this->buffer) > $this->bufferSz )
            array_shift($this->buffer);
        $this->time += 1;
        return clamp(round($pressure), 970, 1030) . ' ' . implode(',', $this->buffer) . PHP_EOL;
    }
}

// ---- Simulation ----
$pressure = new Pressure(new Perlin1D());


while (true) {
    echo $pressure->tick();
    sleep(1);
}
