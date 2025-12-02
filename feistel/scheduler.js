import AnimationFactory from "./animation-factory.js";
import { animationConfig } from "./animation-config.js";
import EventContext from "./event-context.js";

const animationFactory = new AnimationFactory(); 

export default class Scheduler {
    constructor(animator) {
        this.animator = animator;
        this.events = EventContext.getEvents("encrypt");
        animationFactory.init(animator.canvas);
    }
    update(elapsedSeconds) {
        for ( let item of animationConfig ) {
            if ( false === item.fired && elapsedSeconds >= item.time) {
                this.animator.add(animationFactory.create(
                    item.type, 
                    this.events[item.time], 
                    item.config
                ));
                item.fired = true;
            }
        }
    }
}