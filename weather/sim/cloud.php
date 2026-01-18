<?php

class Cloud {
    private $pressure;
    private $wind;
    private $cloud = 40;

    public function __construct(Pressure $p, Wind $w) {
        $this->pressure = $p;
        $this->wind = $w;
    }

    public function tick(): void { 
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
    }  
    public function getCurrent() {
        return $this->cloud;
    }     
}
