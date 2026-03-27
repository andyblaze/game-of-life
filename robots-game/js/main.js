import { IronMining, CoalMining, WheatFarming, WoodFarming } from "./strategies.js";
import Config from "./newconfig.js";
import ResourceFactory from "./resource-factory.js";
import HUD from "./hud.js";
import DeltaRreport from "./delta-report.js";
import { Bakery, RobotFactory, PowerPlant } from "./consumers.js";

class Economy {
    constructor(cfg) {
        this.cfg = cfg;
        this.items = {};
        this.stocks = {};
    }
    add(item) {
        const key = item.resourceName();
        this.items[key] = item;
        this.stocks[key] = 0;
    }
    tick() {
        for ( const [key, item] of Object.entries(this.items) ) {
            item.tick();
        }
    } 
    deposit(key, n) {
        this.stocks[key] += n;
    }
    consume(key, n) {
        this.stocks[key] -= n;
    }
    getResources(key, n) {
        if ( !(key in this.stocks) ) {
            console.error(key + " is invalid.  Typo?");
            return 0;
        }
        const stock = this.stocks[key];
        if ( stock - n < 0 ) return 0;
        stock -= n;
        return n;
    }
}

const config = new Config();

const economy = new Economy(config);
//economy.add()

const factory = new ResourceFactory(config, economy);

const population = factory.createPopulation();
population.add(24);

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

const consumers = {
    powerPlant: factory.createConsumer(economy, new PowerPlant(), 2),
    robotFactory: factory.createConsumer(economy, new RobotFactory(), 40),
    bakery: factory.createConsumer(economy, new Bakery(), population)
};
for ( const [idx, consumer] of Object.entries(consumers) ) {
    consumer.addObserver(hud);
}

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
        for (const [key, farm] of Object.entries(resourceFarms)) {
            farm.tick();
        }
        for (const [key, consumer] of Object.entries(consumers)) {
            consumer.tick();
        }
        population.tick(); 
        accumulator -= TICK_RATE;        
    }
    // render would go here (canvas updates etc) at 60 fps
    requestAnimationFrame(loop);
}

loop(performance.now());