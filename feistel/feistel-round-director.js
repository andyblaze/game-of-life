import TextRenderer from "./text-renderer.js";
import EventContext from "./event-context.js";
import Mediator from "./mediator.js";

export default class FeistelRoundDirector extends Mediator {
    static type = "feistelRoundDirector";
    constructor(cnvs, data, cfg) {
        super(cnvs); 
        for ( let a of cfg.actors ) { //console.log(cfg.direction, a.eventId);
            this[a.eventId] = this.animationFactory.create(
                a.type, 
                EventContext.byId(cfg.direction, a.eventId),
                a.config
            );
        }
        //this.get_order.setMsg(this.get_order.getMsg(), "Round: ");
        this.round_order.start();
        this.active.push(this.round_order);
    }
    isComplete() {
        this.animationDone = (this.round_order.isComplete());
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