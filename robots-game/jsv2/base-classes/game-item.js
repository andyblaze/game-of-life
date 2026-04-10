import Tickable from "./tickable.js";

export default class GameItem extends Tickable {
    constructor(strat) {
        super();
        this.strategy = strat;
        this.product = strat.product;
        this.result = 0;
    }
    produce(world) {
        this.result = this.strategy.tick(world);
    }
    finalise(world) {
        world.deposit(this.result);
    }
    tick(world) {
        this.ontick(world);        
    }
}
