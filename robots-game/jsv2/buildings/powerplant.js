import ResourceFarm from "./resource-farm.js";
import Actor from "../units/actor.js";

export default class PowerPlant extends ResourceFarm {
    constructor(type, tile, baseOutput, inputs) {
        super(type);
        this.tile = tile;
        this.actor = new Actor(tile, 48, "#000");
        this.baseOutput = baseOutput;
        this.wood = 0;
        this.coal = 0;
        this.wheat = 0;
        this.inputs = inputs;
        this.output = { type: "power", amount: 1 };
    }
    consume(world) {
        world.consume({ type: "power", amount: 1 });

        if ( world.hasResource({ type: "power", amount: 100 }) ) return;

        // burn excess wheat as first preference 
        if ( world.hasResource({ type: "wheat", amount: 100 }) ) {
            this.wheat = world.consume(this.inputs.wheat);
            return;
        }

        this.coal = world.consume(this.inputs.coal);
        if ( this.coal > 0 ) return;

        this.wood = world.consume(this.inputs.wood);
    }
    produce(world) { 
        this.output.amount = 0;
        if ( this.wood > 0 || this.coal > 0 || this.wheat > 0 ) { 
            this.output.amount = this.baseOutput * (this.wood / 6) + (this.coal / 2) + (this.wheat / 32); 
            this.result = this.output;
        }
    }
    finalise(world) {
        this.wood = 0;
        this.coal = 0;
        this.wheat = 0;
    }
}