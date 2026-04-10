import ResourceFarm from "./resource-farm.js";

export class IronMine extends ResourceFarm {
   constructor(type, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
    }
    produce(world) {
        this.result.amount = this.baseOutput;
    }
}
export class CoalMine extends ResourceFarm {
    constructor(type, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
export class WoodFarm extends ResourceFarm {
    constructor(type, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
export class WheatFarm extends ResourceFarm {
    constructor(type, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
