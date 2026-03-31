import { Registry } from "./registry.js";
import ObjectFactory from "./object-factory.js";
import HUD from "./hud.js";
import World from "./world.js";
import GameItem from "./game-item.js";
import Tickable from "./tickable.js";

const Balance = {
    outputs: {
        iron: 1,
        coal: 4,
        wood: 6,
        wheat: 3,
        bread: 8,
        power: 1
    }
};

const InitialWorldItems = [
    "power", "bread", "iron", "coal", "wood", "wheat"
];

class Human {
    constructor() {
        this.hunger = 0;
        this.morale = 50;
        this.hungerRate = 0.8 + Math.random() * 0.4;
    }

    tick(world) {
        this.hunger += this.hungerRate;

        if (this.hunger > 50) {
            const eaten = world.consume({ type: "bread", amount: 1 });
            console.log("bread", eaten);

            if (eaten) {
                this.hunger -= 10;
                this.morale += 1;
            } else {
                this.morale -= 1;
            }
        }
    }
}

class Robot {
    constructor() {
        this.power = 100;
        this.powerUsage = 0.8 + Math.random() * 0.4;
    }
    tick(world) {
        this.power -= this.powerUsage;
        if ( this.power < 50 ) {
            const pwr = world.consume({ type: "power", amount: 1 });
            console.log("power", pwr);    
            if ( pwr )
                this.power += 2;        
        }
    }
}

class HumanPopulation extends Tickable {
    constructor(n) {
        super();
        this.pop = Array.from({ length: n }, () => new Human());
    }

    tick(world) {
        for (const human of this.pop) {
            human.tick(world);
        }
    }
    getMorale() {
        return this.pop.reduce((a, h) => a + h.morale, 0) / this.pop.length;
    }
    getCount() {
        return this.pop.length;
    }
}

class RobotPopulation extends Tickable {
    constructor(n) {
        super();
        this.pop = Array.from({ length: n }, () => new Robot());
    }
    getCount() {
        return this.pop.length;
    }
    tick(world) {
        for (const robot of this.pop) {
            robot.tick(world);
        }
        console.log(this.pop.reduce((a, r) => a + r.power, 0) / this.pop.length);
    }
}


const factory = new ObjectFactory(Registry, Balance);
const hud = new HUD();
const world = new World();

for ( const item of InitialWorldItems ) {
    world.add(factory.create(item));
}
world.populate("humans", new HumanPopulation(6));
world.populate("robots", new RobotPopulation(4));
world.addObserver(hud);

let lastTime = 0;
let accumulator = 0;
const TICK_RATE = 1000; // ms per game tick  

function loop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;
    //DeltaRreport.log(timestamp);

    // run game logic at fixed intervals
    while ( accumulator >= TICK_RATE ) {
        world.tick();
        accumulator -= TICK_RATE;        
    }
    // render would go here (canvas updates etc) at 60 fps
    requestAnimationFrame(loop);
}

loop(performance.now());
