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
            {   "name": evt.type + "_" + left,  
                "data": { "array": evt.data.left,  "string": evt.data.left.join("") }
            },
            {   "name": evt.type + "_" + right, 
                "data": { "array": evt.data.right, "string": evt.data.right.join("") }
            }
        ];
        
        const layout = LayoutRegistry.layoutFor(cfg.layout);
        cfg.actors[0].config.start = {"x": layout.x, "y": layout.y};
        cfg.actors[1].config.start = {"x": this.calcRightBlockX(layout), "y": layout.y};
        cfg.actors[0].config.speed = cfg.speed;
        cfg.actors[1].config.speed = cfg.speed;
        //console.log(cfg.actors);
        //const actor1 = { "type": evt.type + "_" + left,  "data": evt.data.right };
        //const actor2 = { "type": evt.type + "_" + right, "data": evt.data.left };
        for ( const [idx, a] of cfg.actors.entries() ) {
            this[fakeEvts[idx].name] = this.animationFactory.create(
                a.type, 
                fakeEvts[idx],
                a.config
            );
        }
        this.block_split_left.start();
        this.active.push(this.block_split_left);
        this.block_split_right.start();
        this.active.push(this.block_split_right);
    }
    calcRightBlockX(layout) {
        return Math.floor(layout.w / 2) + layout.x;
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