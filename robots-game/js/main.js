import { IronMining, CoalMining, WheatFarming, WoodFarming } from "./strategies.js";
import Config from "./newconfig.js";
import ResourceFactory from "./resource-factory.js";
import HUD from "./hud.js";
import DeltaRreport from "./delta-report.js";
import { clamp } from "./functions.js";
import { Observable } from "./util-classes.js";

class Furnace {
    constructor() {
        this.power = 0;
        this.resource = "battery";
    }
    tick(farms, consumption) {
        this.power -= consumption;        
        if ( this.power >= 100 ) return;
        let fuel = farms.coalMines.getResource(2);
        if ( fuel > 0 ) 
            this.power += 4;
        else { 
            fuel = farms.woodFarms.getResource(6);
            if ( fuel > 0 ) this.power += 2;
        }  
        this.power = clamp(this.power, 0, 100);
        return { type: this.resource, output: this.power };
    }
}

class Bakery {
    constructor() {
        this.bread = 0;
        this.resource = "bread";
    }
    tick(farms, consumption) {
        this.bread -= consumption;
        if ( this.bread >= 100 ) return;
        let fuel = farms.wheatFarms.getResource(16);
        if ( fuel > 0 )
            this.bread += 16;
        this.bread = clamp(this.bread, 0, Infinity);
        return { type: this.resource, output: this.bread };
    }
}

class Consumer extends Observable {
    constructor(farms, strat, cr) {
        super();
        this.strategy = strat;
        this.farms = farms;
        this.consumptionRate = cr;
    }
    tick() {
        const data = this.strategy.tick(this.farms, this.consumptionRate);
        this.notify([data]);      
    }
}

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

const furnace = new Consumer(resourceFarms, new Furnace(), 2);
furnace.addObserver(hud);

const bakery = new Consumer(resourceFarms, new Bakery(), population.getCount());
bakery.addObserver(hud);

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
        population.tick(); 
        furnace.tick();
        bakery.tick();
        accumulator -= TICK_RATE;        
    }
    // render would go here (canvas updates etc) at 60 fps
    requestAnimationFrame(loop);
}

loop(performance.now());