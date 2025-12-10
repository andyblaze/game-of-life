import TextMover from "./textmover.js";
import EventContext from "./event-context.js";
import LayoutRegistry from "./layout-registry.js";
import Mediator from "./mediator.js";

export default class BlockSplitScene extends Mediator {
    static type = "blocksplitScene";
    constructor(cnvs, data, cfg) {
        super(cnvs);
        const evt = EventContext.byId(cfg.direction, cfg.eventId);
        const [left, right] = Object.keys(evt.data);
        const layout = LayoutRegistry.layoutFor(cfg.layout);
        console.log(layout);
        const actor1 = evt.type + "_" + left;
        const actor2 = evt.type + "_" + right;
        /*for ( let a of cfg.actors ) {
            this[a.eventId] = this.animationFactory.create(
                a.type, 
                EventContext.byId(cfg.direction, a.eventId),
                a.config
            );
        }
        this.block_split_left.start();
        this.active.push(this.block_split_left);
        this.block_split_right.start();
        this.active.push(this.block_split_right);*/
    }
    isComplete() {
        this.animationDone = false;//this.block_split.isComplete();
    }
    // animation frame driver
    run(dt, elapsedTime) {
        if ( this.isComplete() ) {
            this.onComplete();
            return
        }
        for (const anim of this.active) {
            anim.run(dt, elapsedTime);
        }
    }
}