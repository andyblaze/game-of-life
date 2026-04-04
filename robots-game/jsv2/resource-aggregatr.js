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
        for ( const r of this.resources ) {
            this.result += r.tick(world).amount;
        }
    }
    finalise(world) {
        world.deposit({ type: this.product, amount: this.result });
        this.result = 0;
    }
}