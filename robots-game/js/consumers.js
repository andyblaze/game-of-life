import { clamp } from "./functions.js";
import { Observable } from "./util-classes.js";

class ConsumerStrategy {
    constructor(p, r) {
        this.product = p;
        this.resource = r;
        this.result = { type: this.resource, output: this.product };
    }
    ontick(economy, consumption) {
        this.consume(consumption);
        this.produce(economy);
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
    produce(economy) {
        let fuel = economy.getResources("coal", 2);
        if ( fuel > 0 ) 
            this.product += 4;
        else { 
            fuel = economy.getResources("wood", 6);
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
    produce(economy) {
        const fuel = economy.getResources("wood", 16);
        const grain = economy.getResources("wheat", 16);
        if ( fuel > 0 && grain > 0 )
            this.product += 16;
    }
    finalise(consumers) {
        this.product = clamp(this.product, 0, consumers.getCount());
        this.result.output = this.product;
    }
    tick(economy, consumers) {
        if ( this.product >= consumers.getCount() ) return this.result;
        this.ontick(economy, consumers);        
        return this.result;
    }
}

export class RobotFactory extends ConsumerStrategy {
    constructor() {
        super(0, "robots");
    }
    tick(economy, consumptionRate) {
        const fuel = economy.getResources("iron", consumptionRate);
        if ( fuel > 0 ) {
            this.product += 1;
        }
        return this.result;
    }
}

export class Consumer extends Observable {
    constructor(economy, strat, cr) {
        super();
        this.strategy = strat;
        this.economy = economy;
        this.consumptionRate = cr;
    }
    tick() {
        const data = this.strategy.tick(this.economy, this.consumptionRate);
        this.notify([data]);      
    }
}