import ResourceFarm from "./resource-farm.js";

export class IronMine extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type, tile, baseOutput);
        this.actor.color = "#585151"
    }
    produce(world) {
        this.result.amount = this.baseOutput;
    }
}
export class CoalMine extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type, tile, baseOutput);
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
export class WoodFarm extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type, tile, baseOutput);
        this.actor.color = "#3bec61"
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
export class WheatFarm extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type, tile, baseOutput);
        this.actor.color = "#abbe7e"
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
