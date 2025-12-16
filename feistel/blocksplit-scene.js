import EventContext from "./event-context.js";
import LayoutRegistry from "./layout-registry.js";
import Mediator from "./mediator.js";

export default class BlockSplitScene extends Mediator {
    static type = "blocksplitScene";
    constructor(cnvs, data, cfg) {
        super(cnvs);
        const evt = EventContext.byId(cfg.direction, cfg.eventId);     
        const layout = LayoutRegistry.layoutFor(cfg.layout);
        
        for ( const [idx, a] of cfg.actors.entries() ) {
            const blockEvent = this.createBlockEvent(idx, evt, a.eventId);
            a.config.start = this.blockStart(layout, a.eventId);
            this[a.eventId] = this.animationFactory.create(
                a.type, 
                blockEvent,
                a.config
            );
        }
        
        this.block_split_left.start();
        this.active.push(this.block_split_left);
        this.block_split_right.start();
        this.active.push(this.block_split_right);
    }
    createBlockEvent(idx, evt, evtId) {
        return { 
            "type": evtId,  
            "data": {
                "array": idx === 0 ? evt.data.left : evt.data.right,
                "string": idx === 0 ? evt.data.left.join("") : evt.data.right.join("")
            }
        };
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