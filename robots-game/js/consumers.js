import { clamp } from "./functions.js";
import { Observable } from "./util-classes.js";

class ConsumerStrategy {
    constructor(p, r) {
        this.product = p;
        this.resource = r;
        this.result = { type: this.resource, output: this.product };
    }
    ontick(farms, consumption) {
        this.consume(consumption);
        this.produce(farms);
        this.finalise(consumption);
    }
}

export class PowerPlant extends ConsumerStrategy {
    constructor() {
        super(0, "battery");
    }
    consume(consumption) {
        this.product -= consumption;  
    }
    produce(farms) {
        let fuel = farms.coalMines.getResource(2);
        if ( fuel > 0 ) 
            this.product += 4;
        else { 
            fuel = farms.woodFarms.getResource(6);
            if ( fuel > 0 ) 
                this.product += 2;
        } 
    }
    finalise() {
        this.product = clamp(this.product, 0, 100);
        this.result.output = this.product;
    }
    tick(farms, consumption) {
        if ( this.product >= 100 ) return this.result;
        this.ontick(farms, consumption);                      
        return this.result;
    }
}

export class Bakery extends ConsumerStrategy {
    constructor() {
        super(0, "bread");
    }
    consume(consumers) {
        for ( const c of consumers.getAll() ) {
            if ( this.product - 4 > 0 && c.consume() )
                this.product -= 4;
        }
    }
    produce(farms) {
        const fuel = farms.woodFarms.getResource(16);
        const grain = farms.wheatFarms.getResource(16);
        if ( fuel > 0 && grain > 0 )
            this.product += 16;
    }
    finalise(consumers) {
        this.product = clamp(this.product, 0, consumers.getCount());
        this.result.output = this.product;
    }
    tick(farms, consumers) {
        if ( this.product >= consumers.getCount() ) return this.result;
        this.ontick(farms, consumers);        
        return this.result;
    }
}

export class RobotFactory extends ConsumerStrategy {
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

export class Consumer extends Observable {
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