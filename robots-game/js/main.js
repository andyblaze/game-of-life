import { IronMining, CoalMining, WheatFarming, WoodFarming } from "./strategies.js";
import Config from "./newconfig.js";
import ResourceFactory from "./resource-factory.js";
import HUD from "./hud.js";

const config = new Config();

const factory = new ResourceFactory(config);

const population = factory.createPopulation();
population.add(12);

const hud = new HUD();

const resourceFarms = {
    ironMines: factory.createAggregator(new IronMining()),
    coalMines:  factory.createAggregator(new CoalMining()), 
    wheatFarms: factory.createAggregator(new WheatFarming()), 
    woodFarms: factory.createAggregator(new WoodFarming())
};

//  sim user interaction to assign workers
resourceFarms.ironMines.assignWorkers(0, 2, population);
resourceFarms.coalMines.assignWorkers(0, 1, population);
resourceFarms.wheatFarms.assignWorkers(0, 2, population);
resourceFarms.woodFarms.assignWorkers(0, 2, population);

for ( const [idx, farm] of Object.entries(resourceFarms) ) {
    farm.addObserver(hud);
}
population.addObserver(hud);

let lastTime = 0;
let accumulator = 0;
const TICK_RATE = 1000; // ms per game tick 

function loop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;

    // run game logic at fixed intervals
    while ( accumulator >= TICK_RATE ) {
        for (const [key, farm] of Object.entries(resourceFarms)) {
            farm.tick();
        }
        population.tick();
        accumulator -= TICK_RATE;
    }
    // render would go here (canvas updates etc) at 60 fps
    requestAnimationFrame(loop);
}

loop(performance.now());