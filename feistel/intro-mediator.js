//import Underliner from "./underliner.js";
import TextSlider from "./textslider.js";
import Animation from "./animation.js";
import EventContext from "./event-context.js";
import AnimationFactory from "./animation-factory.js";

//const animationFactory = new AnimationFactory();

export default class IntroMediator extends Animation {
    static type = "iMediator";
    constructor(cnvs) {
        super(cnvs);
        this.active = [];
        this.animationFactory = new AnimationFactory();
        this.animationFactory.init(this.canvas);
        this.alphabet = this.animationFactory.create(
            TextSlider.type, 
            EventContext.byId("encrypt", "alphabet"), 
            {"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"}
        );
        this.indices = this.animationFactory.create(
            TextSlider.type, 
            EventContext.byId("encrypt", "indices"), 
            {"speed": 1, "x": "mid", "endAt":88, "axis": "vertical"}
        );
        this.plaintext = this.animationFactory.create(
            TextSlider.type, 
            EventContext.byId("encrypt", "plaintext"), 
            {"speed": -4, "y":20}
        );
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
        //this.plaintext = new TextSlider(cnvs, EventContext.byId("encrypt", "plaintext"), {"speed": -4, "y":20});
        //this.alphabet = new TextSlider(cnvs, EventContext.byId("encrypt", "alphabet"), {"speed": 1, "x": "mid", "endAt":60, "axis": "vertical"});
        //this.indices = new TextSlider(cnvs, EventContext.byId("encrypt", "indices"), {"speed": 1, "x": "mid", "endAt":88, "axis": "vertical"});
    }
    isComplete() {
        return (this.plaintext.isComplete()
            && this.alphabet.isComplete()
            && this.indices.isComplete());
    }

    // animation frame driver
    run(dt, elapsedTime) {
        for (const anim of this.active) {
            anim.run(dt, elapsedTime);
        }
        /*this.alphabet.run(dt, elapsedTime);
        if ( this.alphabet.isComplete() )
            this.indices.run(dt, elapsedTime);
        if ( this.indices.isComplete() )
            this.plaintext.run(dt, elapsedTime);*/
    }
}