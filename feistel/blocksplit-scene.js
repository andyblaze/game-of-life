import TextMover from "./textmover.js";
import EventContext from "./event-context.js";
import Mediator from "./mediator.js";

export default class BlockSplitScene extends Mediator {
    static type = "blocksplitScene";
    constructor(cnvs, data, cfg) {
        super(cnvs);
        const evt = EventContext.byId(cfg.direction, cfg.eventId);
        const keys = Object.keys(evt.data);
        console.log(evt.type, keys);
        for ( let a of cfg.actors ) {
            this[a.eventId] = this.animationFactory.create(
                a.type, 
                EventContext.byId(cfg.direction, a.eventId),
                a.config
            );
        }
        this.block_split.start();
        this.active.push(this.block_split);
    }
    isComplete() {
        this.animationDone = this.block_split.isComplete();
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