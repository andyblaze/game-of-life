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
        const fakeEvts = [
            {"name": evt.type + "_" + left,  "data": { "array": evt.data.left,  "string": evt.data.left.join("") }},
            {"name": evt.type + "_" + right, "data": { "array": evt.data.right, "string": evt.data.right.join("") }}
        ];
        
        const layout = LayoutRegistry.layoutFor(cfg.layout);
        cfg.start1 = {"x": layout.x, "y": layout.y};
        cfg.start2 = {"x": Math.floor(layout.x / 2), "y": layout.y};
        console.log(fakeEvts, cfg.layout, layout);
        const actor1 = { "type": evt.type + "_" + left,  "data": evt.data.right };
        const actor2 = { "type": evt.type + "_" + right, "data": evt.data.left };
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