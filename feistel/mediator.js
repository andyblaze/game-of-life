import Animation from "./animation.js";
import AnimationFactory from "./animation-factory.js";

export default class Mediator extends Animation {
    constructor(cnvs, data, cfg) {
        super(cnvs);
        this.active = [];
        this.animationFactory = new AnimationFactory();
        this.animationFactory.init(this.canvas);
    }
}