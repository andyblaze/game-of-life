import AnimationFactory from "./animation-factory.js";
import { animationConfig } from "./animation-config.js";

const animationFactory = new AnimationFactory(); 

export default class Scheduler {
    constructor(animator) {
        this.animator = animator;
        animationFactory.init(animator.canvas);
        this.currentIndex = 0;
    }
    start() {
        const scene = animationConfig[this.currentIndex];
        this.load(scene);
    }
    load(scene) {
        this.animator.add(animationFactory.create(
            scene.type, 
            null,
            scene.config
        ));
    }
    update() { if ( this.currentIndex >= animationConfig.length ) return; console.log(this.currentIndex);
        if ( this.animator.isSceneComplete() ) {
            this.currentIndex++;
            if ( this.currentIndex < animationConfig.length ) {
                const scene = animationConfig[this.currentIndex];
                this.load(scene);
            }
        }
    }
}