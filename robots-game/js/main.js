import { IronMining, CoalMining, WheatFarming, HumanBehaviour } from "./strategies.js";
import { Human } from "./resources.js";
import Config from "./newconfig.js";
import ResourceFactory from "./resource-factory.js";
import Population from "./population.js";
import HUD from "./hud.js";


const population = new Population();
population.add(12);
//for ( let i = 0; i < 12; i++ )
    //population.add(new Human(new HumanBehaviour()));

const config = new Config();

const factory = new ResourceFactory();
const hud = new HUD();

const ironMines = factory.createAggregator(new IronMining(), config); 
const coalMines = factory.createAggregator(new CoalMining(), config); 
const wheatFarms = factory.createAggregator(new WheatFarming(), config); 

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