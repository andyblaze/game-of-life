<?php

class Wind {
    private $pressure;
    private $dir;
    private $speed = 0;
    private $minSpeed = 0;
    private $maxSpeed = 50;
    private $gust = 0;
    private $buffer = [];
    private $bufferSz = 5;

    public function __construct(Pressure $p) {
        $this->pressure = $p;
        $this->dir = 225; // initial direction
    }

    public function tick(): void { 
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
        $this->gust = $this->speed;
        $gustChance = min(80, $this->speed * 3); // %
        if (rand(0, 100) < $gustChance) {
            $this->gust += rand(
                1,
                max(2, intdiv($this->speed, 2))
            );
        }
        $this->gust = clamp(
            $this->gust,
            $this->speed,
            $this->maxSpeed + 10
        );

        array_unshift($this->buffer, $this->dir);
        if (count($this->buffer) > $this->bufferSz)
            array_pop($this->buffer);

    }
    public function getSpeed() {
        return $this->speed;
    }
    public function getDir() {
        return $this->dir;
    }
}