import { Registry } from "./registry.js";
import ObjectFactory from "./object-factory.js";
import HUD from "./hud.js";
import World from "./world.js";

const factory = new ObjectFactory(Registry);
const hud = new HUD();
const world = new World();

world.add(factory.create("power"));
world.add(factory.create("bread"));
world.add(factory.create("iron"));
world.add(factory.create("coal"));
world.add(factory.create("wood"));
world.add(factory.create("wheat"));

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
