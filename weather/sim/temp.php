<?php

class Temperature {
    private $pressure;
    private $wind;
    private $temp = 0;
    private $baseTemp = 12; // Cornwall-ish baseline

    public function __construct(Pressure $p, Wind $w) {
        $this->pressure = $p;
        $this->wind = $w;
    }

    public function tick(): void {
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

        $this->temp = $this->baseTemp + $pressureEffect + $trendEffect + $windEffect + $windSpeedEffect + $noise;
    }
    public function getCurrent() {
        return round($this->temp);
    }
}
