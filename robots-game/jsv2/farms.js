import ResourceFarm from "./resource-farm.js";

export class IronMine extends ResourceFarm {
   constructor(type) {
        super(type);
    }
    produce(world) {
        this.result.amount = 1;
    }
}
export class CoalMine extends ResourceFarm {
    constructor(type) {
        super(type);
    }
    produce(world) {
         this.result.amount = 2;
    }
}
export class WoodFarm extends ResourceFarm {
    constructor(type) {
        super(type);
    }
    produce(world) {
         this.result.amount = 2;
    }
}
export class WheatFarm extends ResourceFarm {
    constructor(type) {
        super(type);
    }
    produce(world) {
         this.result.amount = 2;
    }
}
