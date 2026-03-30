import ResourceFarm from "./resource-farm.js";

export default class Bakery extends ResourceFarm {
    constructor(type, baseOutput) {
        super(type);
        this.baseOutput = baseOutput;
        this.wood = 0;
        this.wheat = 0;
        this.inputs = {
            wheat: { type: "wheat", amount: 16 },
            wood: { type: "wood", amount: 16 }
        };
        this.output = { type: "bread", amount: 1 };
    }
    consume(world) {
        const ok = Object.entries(this.inputs).every(
            ([type, input]) => world.hasResource(input)
        );

        if ( !ok ) return;

        for (const [type, input] of Object.entries(this.inputs)) {
            this[type] = world.consume(input);
        }
    }
    produce(world) { 
        this.output.amount = 0;
        if ( this.wood > 0 && this.wheat > 0 ) { 
            this.output.amount = this.baseOutput;
            this.result = this.output;
        }
    }
    finalise(world) {
        this.wood = 0;
        this.wheat = 0;
    }
}
