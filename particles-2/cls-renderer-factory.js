import CircleRenderer from "./cls-circle-renderer.js";
import GradientRenderer from "./cls-gradient-renderer.js";
import { RendererRegistry } from "./cls-renderer-registry.js";

export default class RendererFactory {
    constructor(ctrl) {
        this.ctrl = ctrl;
    }
    create(type) {
        const A = RendererRegistry[type];
        if ( ! A ) 
            throw new Error(`Unknown animation type: ${type}`);
        return new A();
    }
    init() {
        return this.change();
    }
    change() {
        return this.create(this.ctrl.value);
    }
}