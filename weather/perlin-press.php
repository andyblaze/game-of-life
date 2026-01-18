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

    public function getCurrent() {
        return $this->buffer[0];
    }
}

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

        return [$this->dir, $this->speed, $this->gust];
    }
    public function getSpeed() {
        return $this->speed;
    }
    public function getDir() {
        return $this->dir;
    }
}

class Cloud {
    private $pressure;
    private $wind;
    private $cloud = 40;

    public function __construct(Pressure $p, Wind $w) {
        $this->pressure = $p;
        $this->wind = $w;
    }

    public function tick(): int {
        $pressure = $this->pressure->getCurrent();
        $trend = $this->pressure->trend();
        $windSpeed = $this->wind->getSpeed();

        // -------------------------
        // DECAY (clearing)
        // -------------------------
        if ($trend > 2 && $windSpeed > 10) {
            // strong wind + rising pressure clears fast
            $this->cloud -= rand(13, 16);
        } elseif ($trend > 2) {
            // rising pressure clears slowly
            $this->cloud -= rand(1, 3);
        } elseif ($pressure > 1015 && $windSpeed < 5) {
            // high pressure + calm tends to clear
            $this->cloud -= rand(1, 2);
        }

        // -------------------------
        // BUILD (cloud forming)
        // -------------------------
        if ($pressure < 1005) {
            // low pressure builds cloud
            $this->cloud += rand(4, 8);
        }

        if ($trend < -2) {
            // falling pressure builds cloud
            $this->cloud += rand(1, 4);
        }

        if ($windSpeed > 12) {
            // strong wind can increase cloudiness
            $this->cloud += rand(0, 2);
        }

        // small random drift
        $this->cloud += rand(-1, 1);

        // clamp
        $this->cloud = clamp($this->cloud, 0, 100);

        return round($this->cloud);
    }  
    public function getCurrent() {
        return $this->cloud;
    }     
}

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

    public function tick(): int {
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
        return $this->intensityToMmPerHour($this->rain);
    }
}

class Temperature {
    private $pressure;
    private $wind;

    private $baseTemp = 12; // Cornwall-ish baseline

    public function __construct(Pressure $p, Wind $w) {
        $this->pressure = $p;
        $this->wind = $w;
    }

    public function tick(): int {
        $pressure = $this->pressure->getCurrent();
        $trend = $this->pressure->trend();
        $windDir = $this->wind->getDir();
        $windSpeed = $this->wind->getSpeed();

        // 1) Pressure effect (higher pressure → warmer)
        $pressureEffect = ($pressure - 1000) * 0.03;
        if ( $pressure > 1020 )
            $pressureEffect += rand(1,3);

        // 2) Trend effect (falling pressure → cooler)
        $trendEffect = ($trend < 0) ? $trend * 0.2 : $trend * 0.1;

        // 3) Wind direction effect
        $windEffect = 0;
        if ($windDir >= 180 && $windDir <= 300) {
            $windEffect += 1.5;  // SW/W = warmer
        } elseif ($windDir >= 0 && $windDir <= 90) {
            $windEffect -= 1.5;  // NE/N = cooler
        }

        // 4) Wind speed effect (strong wind slightly cools)
        $windSpeedEffect = -($windSpeed * 0.02);

        // 5) Random noise
        $noise = rand(-1, 1);

        $temp = $this->baseTemp + $pressureEffect + $trendEffect + $windEffect + $windSpeedEffect + $noise;

        return round($temp);
    }
}

// ---- Simulation ----
$pressure = new Pressure(new Perlin1D());
$wind = new Wind($pressure);
$cloud = new Cloud($pressure, $wind);
$rain = new Rain($pressure, $wind, $cloud);
$temp = new Temperature($pressure, $wind);

while (true) {
    echo $pressure->tick();
    echo "\t" . implode("\t", $wind->tick()) . "\t" . $cloud->tick() . "\t" . 
    $rain->tick() . "\t" . $temp->tick() . PHP_EOL;
    sleep(1);
}
