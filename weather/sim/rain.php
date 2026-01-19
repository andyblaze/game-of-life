<?php

class Rain {
    private $pressure;
    private $wind;
    private $cloud;
    private $rain = 0;

    public function __construct(Pressure $p, Wind $w, Cloud $c) {
        $this->pressure = $p;
        $this->wind = $w;
        $this->cloud = $c;
    }
    public function intensityToMmPerHour(int $intensity): int {
        $maxMmPerHour = 50;

        $normalized = $intensity / 100;

        $tuner1 = 2.0;
        // softer curve
        $rate = pow($normalized, $tuner1) * $maxMmPerHour;

        $tuner2 = 0.5;
        // floor for non-zero intensity
        if ($intensity > 0 && $rate < $tuner2) {
            $rate = $tuner2;
        }

        return round($rate);
    }

    public function tick(): void { 
        $pressure = $this->pressure->getCurrent();
        $trend = $this->pressure->trend();
        $windSpeed = $this->wind->getSpeed();
        $cloud = $this->cloud->getCurrent();

        // base chance based on cloud
        $chance = 0;
        if ($cloud > 50) $chance += ($cloud - 50);
        if ($trend < -2) $chance += 15;
        if ($windSpeed > 15) $chance += 10;

        // If it's already raining, keep it raining more easily
        if ($this->rain > 0) $chance += 10;

        if (rand(0, 100) < $chance) {
            // rain builds
            $this->rain += rand(5, 10);

            // extra kick if stormy
            if ($pressure < 990 && $cloud > 90) {
                $this->rain += rand(10, 30);
            }
        } else {
            // rain decays
            $this->rain -= rand(12, 24);
        }

        $this->rain = clamp($this->rain, 0, 100);
    }
    public function getCurrent() {
        return $this->intensityToMmPerHour($this->rain);
    }
} 
