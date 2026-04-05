import { Registry } from "./registry.js";
import { GameBalance } from "./game-balance.js";
import Config from "./config.js";
import ObjectFactory from "./object-factory.js";
import MessageSystem from "./message-system.js";
import HUD from "./hud.js";
import World from "./world.js";
import DeltaRreport from "./delta-report.js";
import { byQsArray } from "./functions.js";

class BuildingSystem { 
    constructor(w, f) {
        this.world = w;
        this.factory = f;
    }
    buildFarm(e) {
        const type = e.currentTarget.dataset.type;
        this.world.addToAggregator(this.factory.createFarm(type));
        const evt = { type: "state-change", source: "builder", state: `new ${type} building` };
        world.emitEvent(evt);
    }
}

const config = new Config();
const factory = new ObjectFactory(Registry, GameBalance);
const hud = new HUD();
const msgSystem = new MessageSystem();
msgSystem.addObserver(hud);
const world = new World(msgSystem);
const buildings = new BuildingSystem(world, factory);

for ( const item of config.initialWorldItems ) {
    world.add(factory.create(item));
}

world.populate("humans", factory.createPopulation("humans", config.initialHumanPop));
world.populate("robots", factory.createPopulation("robots", config.initialRobotPop));
world.addObserver(hud);

byQsArray(".farm-btn").forEach(btn => {
    btn.addEventListener("click", (e) => buildings.buildFarm(e));
});

let lastTime = 0;
let accumulator = 0;
const TICK_RATE = 1000; // ms per game tick  

function loop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;
    DeltaRreport.log(timestamp);

    // run game logic at fixed intervals
    while ( accumulator >= TICK_RATE ) {
        world.tick();
        msgSystem.flush();
        accumulator -= TICK_RATE;        
    }
    // render would go here (canvas updates etc) at 60 fps
    requestAnimationFrame(loop);
}

loop(performance.now());
