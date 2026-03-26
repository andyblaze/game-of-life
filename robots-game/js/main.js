import { IronMining, CoalMining, WheatFarming, WoodFarming } from "./strategies.js";
import Config from "./newconfig.js";
import ResourceFactory from "./resource-factory.js";
import HUD from "./hud.js";
import DeltaRreport from "./delta-report.js";
import { clamp } from "./functions.js";
import { Observable } from "./util-classes.js";

class ConsumerStrategy {
    constructor(p, r) {
        this.product = p;
        this.resource = r;
        this.result = { type: this.resource, output: this.product };
    }
}

class PowerPlant extends ConsumerStrategy {
    constructor() {
        super(0, "battery");
    }
    tick(farms, consumption) {
        this.product -= consumption;        
        if ( this.product >= 100 ) return this.result;
        let fuel = farms.coalMines.getResource(2);
        if ( fuel > 0 ) 
            this.product += 4;
        else { 
            fuel = farms.woodFarms.getResource(6);
            if ( fuel > 0 ) this.product += 2;
        }  
        this.product = clamp(this.product, 0, 100);
        this.result.output = this.product;
        return this.result;
    }
}

class Bakery extends ConsumerStrategy {
    constructor() {
        super(0, "bread");
    }
    tick(farms, consumers) {
        if ( this.product >= consumers.getCount() ) return this.result;
        const fuel = farms.woodFarms.getResource(16);
        const grain = farms.wheatFarms.getResource(16);
        if ( fuel > 0 && grain > 0 )
            this.product += 16;
        for ( const c of consumers.getAll() ) {
            if ( this.product - 4 > 0 && c.consume() )
                this.product -= 4;
        }
        this.product = clamp(this.product, 0, consumers.getCount());
        this.result.output = this.product;
        return this.result;
    }
}

class RobotFactory extends ConsumerStrategy {
    constructor() {
        super(0, "robots");
    }
    tick(farms, consumptionRate) {
        const fuel = farms.ironMines.getResource(consumptionRate);
        if ( fuel > 0 ) {
            this.product += 1;
        }
        return this.result;
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
    powerPlant: new Consumer(resourceFarms, new PowerPlant(), 2),
    robotFactory: new Consumer(resourceFarms, new RobotFactory(), 40),
    bakery: new Consumer(resourceFarms, new Bakery(), population)
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