export class IronMining {
    constructor() {
        this.resource = "iron";
    }
    tick(workers) {
        const str = workers.reduce((sum, w) => sum + w.attr("strength"), 0);
        return Math.floor(0.0075 * str);
    }
}
export class CoalMining {
    constructor() {
        this.resource = "coal";
    }
    tick(workers) {
        return 0.5 * workers.length;
    }
}
export class WheatFarming {
    constructor() {
        this.resource = "wheat";
    }
    tick(workers) {
        return 0.75 * workers.length;
    }
}
export class HumanBehaviour {
    constructor() {
        this.resource = "human";
    }
    tick(parent) {
        parent.morale -= 1;
    }
}
