export class IronMining {
    constructor() {
        this.resource = "iron";
    }
    tick(workers) {
        let str = 0;
        for ( const w of workers )
            str += w.attr("strength");
        return 0.1 * str;
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
