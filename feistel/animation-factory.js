import { AnimationRegistry } from "./animation-registry.js";

export default class AnimationFactory {
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