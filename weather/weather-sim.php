<?php 

abstract class WeatherState {
    abstract public function getTemp(): float;
    abstract public function getWind(): float;
    abstract public function getCloud(): float;
    abstract public function getPressure(): float;
    abstract public function getRain(): float;

    // optional: return next state
    public function nextState(): WeatherState {
        return $this; // default: stay in this state
    }
}

class CalmState extends WeatherState {
    public function getTemp(): float {
        return 15 + rand(-2, 2);
    }
    public function getWind(): float {
        return 2 + rand(0, 3);
    }
    public function getCloud(): float {
        return rand(0, 20);
    }
    public function getPressure(): float {
        return 1015 + rand(-5, 5);
    }
    public function getRain(): float {
        return 0; // calm, no rain
    }

    public function nextState(): WeatherState {
        // tiny probability of storm
        return (rand(0, 100) < 5) ? new StormState() : $this;
    }
}

class StormState extends WeatherState {
    public function getTemp(): float {
        return 10 + rand(-2, 2);
    }
    public function getWind(): float {
        return 15 + rand(0, 10);
    }
    public function getCloud(): float {
        return rand(80, 100);
    }
    public function getPressure(): float {
        return 980 + rand(-10, 5);
    }
    public function getRain(): float {
        return rand(2, 10);
    }

    public function nextState(): WeatherState {
        // 20% chance to calm
        return (rand(0, 100) < 20) ? new CalmState() : $this;
    }
}

class WeatherGenerator {
    private $sensors;
    private $state;

    public function __construct(SensorArray $sensors) {
        $this->sensors = $sensors;
        $this->state = new CalmState(); // start point
    }

    public function tick(): array {
        $this->state = $this->state->nextState(); // maybe change state

        $readings = [];
        foreach ($this->sensors->getAll() as $type => $sensor) {
            // sensor just asks state for value
            $method = 'get' . ucfirst($type);
            $readings[$type] = $this->state->$method();
        }

        return $readings;
    }
}
