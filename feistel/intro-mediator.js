//import Underliner from "./underliner.js";
import TextSlider from "./textslider.js";
import Animation from "./animation.js";
import EventContext from "./event-context.js";
import AnimationFactory from "./animation-factory.js";

export default class IntroMediator extends Animation {
    static type = "introMediator";
    constructor(cnvs, data, cfg) {
        super(cnvs);
        this.active = [];
        this.animationFactory = new AnimationFactory();
        this.animationFactory.init(this.canvas);
        for ( let a of cfg.actors ) {
            this[a.eventId] = this.animationFactory.create(
                a.type, 
                EventContext.byId(cfg.direction, a.eventId),
                a.config
            );
        }
        this.alphabet.start();
        this.active.push(this.alphabet);
        this.alphabet.onComplete = () => {
            this.indices.start();
            this.active.push(this.indices);
        };
         this.indices.onComplete = () => {
            this.plaintext.start();
            this.active.push(this.plaintext);
        };
    }
    isComplete() {
        this.done = (this.alphabet.isComplete()
            && this.indices.isComplete()
            && this.plaintext.isComplete());
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