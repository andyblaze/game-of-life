import GameItem from "./game-item.js";

export default class ResourceAggregator extends GameItem {
    constructor(strat) {
        super(strat);
        this.resources = [strat];
    }
    add(resource) {
        this.resources.push(resource);
    }
    produce(world) {
        console.log("pre", this.result);
        for ( const r of this.resources ) {
            this.result += r.tick(world).amount;
            console.log(this.product, "in", this.result);
        }
        console.log("post", this.result);
    }
    finalise(world) {
        world.deposit({ type: this.product, amount: this.result });
        this.result = 0;
    }
}