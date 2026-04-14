import Tickable from "../base-classes/tickable.js";
import Actor from "../units/actor.js";

export default class ResourceFarm extends Tickable {
    type = "";
    constructor(type, tile, baseOutput, inputs={}) {
        super();
        this.type = type;
        this.result.type = type;
        this.baseOutput = baseOutput;
        tile.setBuilding(type);
        this.tile = tile;
        this.actor = new Actor(tile, "#000");
        this.product = this.type;
        this.output = { type: this.type, amount: 0 };
    }
    tick(world) {
        this.ontick(world);
        return this.result;
    }

}