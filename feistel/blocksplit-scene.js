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
        const blockEvents = [
            {   "type": "",  
                "data": { "array": evt.data.left,  "string": evt.data.left.join("") }
            },
            {   "type": "", 
                "data": { "array": evt.data.right, "string": evt.data.right.join("") }
            }
        ];
        
        const layout = LayoutRegistry.layoutFor(cfg.layout);
        for ( const [idx, a] of cfg.actors.entries() ) {
            blockEvents[idx].type = a.eventId;
            a.config.start = this.blockStart(layout, a.eventId);
            this[a.eventId] = this.animationFactory.create(
                a.type, 
                blockEvents[idx],
                a.config
            );
        }
        this.block_split_left.start();
        this.active.push(this.block_split_left);
        this.block_split_right.start();
        this.active.push(this.block_split_right);
    }
    blockStart(layout, evtId) {
        return (
            evtId === "block_split_left" ? 
            {"x": layout.x, "y": layout.y} : 
            {"x": Math.floor(layout.w / 2) + layout.x, "y": layout.y}
        );
    }
    isComplete() {
        this.animationDone = this.block_split_right.isComplete();
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