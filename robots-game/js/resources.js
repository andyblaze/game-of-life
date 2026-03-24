import { mt_rand } from "./functions.js";

class BaseResource {
    constructor(strat, msgsys) {
        this.strategy = strat;
        this.messageSys = msgsys;
        this.msg = { type: "msg", output: "" };
    }    
}
export class FarmedResource extends BaseResource {
    constructor(strat, msgsys) {
        super(strat, msgsys);
        this.resource = strat.resource;
        this.workers = [];
        this.output = 0;

    }
    tick() {
        const result = this.strategy.tick(this.workers);
        this.output += result.output;
        if ( result.event )
            this.msg = this.messageSys.emit(this.resource, true);
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
    constructor(strat, msgsys) {
        super(strat, msgsys);
        this.resource = strat.resource;
        this.intellect = mt_rand(20, 80);
        this.morale = mt_rand(20, 80);
        this.strength = mt_rand(0, 1);
        this.agility = mt_rand(12, 23);
        this.assignedTo = null;
    }
    tick() {
        this.strategy.tick(this);
        this.msg = this.messageSys.emit(this.resource);
    }
    attr(a) {
        return this[a];
    }
}