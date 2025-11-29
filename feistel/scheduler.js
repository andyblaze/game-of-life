import { HorizontalTextSlider, VerticalTextSlider } from "./animations.js";

const AnimationRegistry = {
    [HorizontalTextSlider.type]: HorizontalTextSlider,
    [VerticalTextSlider.type]:VerticalTextSlider
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
  { t: 0, fired:false, type: "textSliderH", "config": {"speed": -4, "y":80} },
  { t: 1, fired:false, type: "textSliderV", "config": {"speed": 4, "x": 20, "y":40} }//,
  /*{ t: 5,  type: "splitBlock",   data: visitor.block_split }/*,
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