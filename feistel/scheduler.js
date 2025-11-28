import { HorizontalTextSlider } from "./animations.js";

class AnimationFactory {
    constructor() {
        this.registry = {};
    }
    register(type, ctor) {
        this.registry[type] = ctor;
    }
    create(canvas, type, data, config) {
        const Ctor = this.registry[type];
        if (!Ctor) throw new Error(`Unknown animation type: ${type}`);
        return new Ctor(canvas, data, config);
    }
}
const animationFactory = new AnimationFactory();
animationFactory.register("textSliderH", HorizontalTextSlider);

const animationConfig = [
  { t: 0,  fired:false, type: "textSliderH", "config": {"speed": -4, "y":80} }//,
  /*{ t: 2,  type: "alphabetMap",  data: visitor.transformed_input },
  { t: 5,  type: "splitBlock",   data: visitor.block_split },
  { t: 7,  type: "xorRound",     data: visitor.round0_xor },
  { t: 9,  type: "swap",         data: visitor.after_swap0 },
  { t: 12, type: "xorRound",     data: visitor.round1_xor },
  ...*/
];

export default class Scheduler {
    constructor(animator, events) {
        this.animator = animator;
        this.events = events;
        //console.log(events);
        this.steps = [
            0
        ];
        this.running = [];
    }
    update(elapsedSeconds) {
        for ( let item of animationConfig ) {
            if ( false === item.fired && elapsedSeconds >= item.t) {
                this.animator.add(animationFactory.create(
                    this.animator.canvas,
                    item.type, 
                    this.events[item.t], 
                    item.config
                ));
                item.fired = true;
            }
        }
    }
}