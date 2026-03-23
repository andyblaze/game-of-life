import { mt_rand } from "./functions.js";

class BaseResource {
    constructor(s) {
        this.strategy = s;
    }    
}
export class FarmedResource extends BaseResource {
    constructor(s) {
        super(s);
        this.resource = s.resource;
        this.workers = [];
        this.output = 0;

    }
    tick() {
        this.output += this.strategy.tick(this.workers);
    }
    assignWorkers(n, population) {
        const workers = population.getAvailable(n);
        for ( const w of workers ) {
            w.assignedTo = this;
        }
        this.workers = workers;
    }
}

export class Human extends BaseResource {
    constructor(s) {
        super(s);
        this.int = mt_rand(20, 80);
        this.morale = mt_rand(20, 80);
        this.strength = mt_rand(20, 80);
        this.assignedTo = null;
    }
    tick() {
        this.strategy.tick(this);
    }
    attr(a) {
        return this[a];
    }
}