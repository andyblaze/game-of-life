import { Registry } from "./registry.js";
import ObjectFactory from "./object-factory.js";
import HUD from "./hud.js";
import World from "./world.js";

const Balance = {
    outputs: {
        iron: 1,
        coal: 4,
        wood: 4,
        wheat: 2,
        bread: 1,
        power: 1
    }
};

const InitialWorldItems = [
    "power", "bread", "iron", "coal", "wood", "wheat"
];


const factory = new ObjectFactory(Registry, Balance);
const hud = new HUD();
const world = new World();

for ( const item of InitialWorldItems )
    world.add(factory.create(item));

/*world.add(factory.create("power"));
world.add(factory.create("bread"));
world.add(factory.create("iron"));
world.add(factory.create("coal"));
world.add(factory.create("wood"));
world.add(factory.create("wheat"));*/

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
