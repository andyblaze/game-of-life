class BaseStrategy {
    constructor() {
        this.coolDown = 6000; // ms
        this.lastMessageSent = 0;
    }
    canSend() {
        this.lastMessageSent += 16.666;
        if ( this.lastMessageSent > this.coolDown )
            this.lastMessageSent = 0;
        return this.lastMessageSent === 0;
    }
    total(workers, attr) {
        return workers.reduce((sum, w) => sum + w.attr(attr), 0);
    }
}
export class IronMining extends BaseStrategy {
    constructor() {
        super();
        this.resource = "iron";
    }
    tick(workers) {
        const str = this.total(workers, "strength");
        return { 
            output: (0.0075 * str), 
            event: (this.canSend() && this.total(workers, "morale") < 20) 
        };
    }
}
export class CoalMining extends BaseStrategy {
    constructor() {
        super();
        this.resource = "coal";
    }
    tick(workers) {
        return { output: (0.025 * workers.length * this.total(workers, "morale")), event: false };
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
        parent.morale -= 0.1;
    }
}
