import ResourceFarm from "./resource-farm.js";
import Actor from "../units/actor.js";

export class IronMine extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
        this.tile = tile;
        this.actor = new Actor(tile, 48, "#000");
    }
    produce(world) {
        this.result.amount = this.baseOutput;
    }
}
export class CoalMine extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
        this.tile = tile;
        this.actor = new Actor(tile, 48, "#000");
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
export class WoodFarm extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
        this.tile = tile;
        this.actor = new Actor(tile, 48, "#000");
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
export class WheatFarm extends ResourceFarm {
   constructor(type, tile, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
        this.tile = tile;
        this.actor = new Actor(tile, 48, "#000");
    }
    produce(world) {
         this.result.amount = this.baseOutput;
    }
}
