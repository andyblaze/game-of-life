class BaseStrategy {
    constructor() {
        this.coolDown = 6000; // ms
        this.lastMessageSent = 0;
    }
    canSend() { return true;
        this.lastMessageSent += 16.666;
        if ( this.lastMessageSent > this.coolDown )
            this.lastMessageSent = 0;
        return this.lastMessageSent === 0;
    }
    total(workers, attr) {
        return workers.reduce((sum, w) => sum + w.attr(attr), 0);
    }
    avg(workers, attr) {
        return this.total(workers, attr) / workers.length;
    }
}
export class IronMining extends BaseStrategy {
    constructor() {
        super();
        this.resource = "iron";
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
        super();
        this.resource = "coal";
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
        super();
        this.resource = "wheat";
    }
    tick(workers) {
        const int = this.total(workers, "intellect");
        return { output: (0.0015 * int), event: false };
    }
}
export class WoodFarming extends BaseStrategy {
    constructor() {
        super();
        this.resource = "wood";
    }
    tick(workers) {
        const agi = this.total(workers, "agility");
        return { output: (0.0075 * agi), event: false };
    }
}
export class HumanBehaviour extends BaseStrategy {
    constructor() {
        super();
        this.resource = "human";
    }
    tick(parent) {
        parent.hunger += 1;
        if ( parent.hunger > 80 )
            parent.morale -= 1;
    }
}
