class BaseStrategy {
    constructor(r) {
        this.resource = r;
    }
    total(workers, attr) {
        return workers.reduce((sum, w) => sum + w.attr(attr), 0);
    }
    avg(workers, attr) {
        return this.total(workers, attr) / workers.length;
    }
    resourceName() {
        return this.resource;
    }
}
export class IronMining extends BaseStrategy {
    constructor() {
        super("iron");
    }
    tick(workers) {
        return { 
            output: (0.0075 * this.total(workers, "strength")), 
            event: (this.avg(workers, "morale") < 50) 
        };
    }
}
export class CoalMining extends BaseStrategy {
    constructor() { 
        super("coal");
    }
    tick(workers) {
        return { 
            output: (0.025 * workers.length),// * this.avg(workers, "morale")), 
            event: false 
        };
    }
}
export class WheatFarming extends BaseStrategy {
    constructor() {
        super("wheat");
    }
    tick(workers) {
        return { 
            output: (0.0015 * this.avg(workers, "intellect")), 
            event: false 
        };
    }
}
export class WoodFarming extends BaseStrategy {
    constructor() {
        super("wood");
    }
    tick(workers) {
        return { 
            output: (0.0075 * this.avg(workers, "agility")), 
            event: false 
        };
    }
}
export class HumanBehaviour extends BaseStrategy {
    constructor() {
        super("human");
    }
    tick(parent) {
        parent.hunger += 1;
        if ( parent.hunger > 80 )
            parent.morale -= 1;
    }
}
