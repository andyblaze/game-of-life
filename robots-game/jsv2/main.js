import { Registry } from "./registry.js";
import ObjectFactory from "./object-factory.js";
import HUD from "./hud.js";
import World from "./world.js";
import { RobotPopulation, HumanPopulation } from "./populations.js";
const Balance = {
    outputs: {
        iron: 1,
        coal: 4,
        wood: 6,
        wheat: 3,
        bread: 6,
        power: 2
    },
    inputs: {
        bread: {
            wheat: { type: "wheat", amount: 16 },
            wood: { type: "wood", amount: 16 }
        },
        power: {
            coal: { type: "coal", amount: 8 },
            wood: { type: "wood", amount: 12 },
            wheat: { type: "wheat", amount: 32 }
        }
    }
};

const InitialWorldItems = [
    "power", "bread", "iron", "coal", "wood", "wheat"
];

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
