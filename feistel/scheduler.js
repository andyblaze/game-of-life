import { TextSlider } from "./animations.js";

const AnimationRegistry = {
    [TextSlider.type]: TextSlider//,
    //[VerticalTextSlider.type]:VerticalTextSlider
    //[FadeIn.type]: FadeIn
};

class AnimationFactory {
    constructor() {
        this.registry = {};
        this.canvas = null;
    }
    init(c) {
        this.canvas = c;
    }
    create(type, data, config) {
        const A = AnimationRegistry[type];
        if ( ! A ) 
            throw new Error(`Unknown animation type: ${type}`);
        return new A(this.canvas, data, config);
    }
}
const animationFactory = new AnimationFactory(); 

const animationConfig = [
  { t: 0, fired:false, type: "textSlider", "config": {"speed": 1, "x": "mid", "stopAt":20, "axis": "vertical"} },
  { t: 1, fired:false, type: "textSlider", "config": {"speed": 1, "x": "mid", "stopAt":40, "axis": "vertical"} },
  { t: 2, fired:false, type: "textSlider", "config": {"speed": -4, "y":80} },
  { t: 3, fired:false, type: "textSlider", "config": {"speed": 4, "y":100} } /*,
  { t: 7,  type: "xorRound",     data: visitor.round0_xor },
  { t: 9,  type: "swap",         data: visitor.after_swap0 },
  { t: 12, type: "xorRound",     data: visitor.round1_xor },
  ...*/
];

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