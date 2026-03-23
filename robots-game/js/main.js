import { mt_rand, byId } from "./functions.js";
import { IronMining, CoalMining, WheatFarming, HumanBehaviour } from "./strategies.js";
import { FarmedResource, Human } from "./resources.js";
import Config from "./newconfig.js";
import ResourceAggregator from "./resource-aggregator.js";
import Population from "./population.js";
import HUD from "./hud.js";


const population = new Population();
for ( let i = 0; i < 12; i++ )
    population.add(new Human(new HumanBehaviour()));

const config = new Config();

function createResource(type) { //  factory function, will be a class later
    const res = new FarmedResource(type);
    const agg = new ResourceAggregator(config);
    agg.add(res);
    return agg;
}
const hud = new HUD();


const ironMines = createResource(new IronMining); 
const coalMines = createResource(new CoalMining()); 
const wheatFarms = createResource(new WheatFarming()); 

ironMines.assignWorkers(0, 3, population);
coalMines.assignWorkers(0, 1, population);
wheatFarms.assignWorkers(0, 2, population);

ironMines.addObserver(hud);
coalMines.addObserver(hud);
wheatFarms.addObserver(hud);
population.addObserver(hud);

function loop(timestamp) {
    ironMines.tick();
    coalMines.tick();
    wheatFarms.tick();
    population.tick();
    requestAnimationFrame(loop);
}

loop(performance.now());