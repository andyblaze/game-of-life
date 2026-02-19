import CircleRenderer from "./cls-circle-renderer.js";
import GradientRenderer from "./cls-gradient-renderer.js";
import VelocityLineRenderer from "./cls-velocity-line-renderer.js";
import ArcRenderer from "./cls-arc-renderer.js";
import TriangleRenderer from "./cls-triangle-renderer.js";
import { RendererRegistry } from "./cls-renderer-registry.js";

export default class RendererFactory {
    constructor(ctrl) {
        this.ctrl = ctrl;
    }
    create(type) {
        const A = RendererRegistry[type];
        if ( ! A ) 
            throw new Error(`Unknown renderer type: ${type}`);
        return new A();
    }
    init() {
        return this.change();
    }
    change() {
        return this.create(this.ctrl.value);
    }
}