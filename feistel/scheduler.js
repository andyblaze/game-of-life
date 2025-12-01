import AnimationFactory from "./animation-factory.js";
import { animationConfig } from "./animation-config.js";

const animationFactory = new AnimationFactory(); 

export default class Scheduler {
    constructor(animator, events) {
        this.animator = animator;
        this.events = events;
        animationFactory.init(animator.canvas);
    }
    update(elapsedSeconds) {
        for ( let item of animationConfig ) {
            if ( false === item.fired && elapsedSeconds >= item.t) {
                this.animator.add(animationFactory.create(
                    item.type, 
                    this.events[item.t], 
                    item.config
                ));
                item.fired = true;
            }
        }
    }
}