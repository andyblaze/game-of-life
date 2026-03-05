import CircleRenderer from "./circle-renderer.js";
import GradientRenderer from "./gradient-renderer.js";
import VelocityLineRenderer from "./velocity-line-renderer.js";
import ArcRenderer from "./arc-renderer.js";
import TriangleRenderer from "./triangle-renderer.js";
import MorphingEllipseRenderer from "./ellipse-renderer.js";
import ConnectionsRenderer from "./connections-renderer.js";
import RadialBurstRenderer from "./radialburst-renderer.js";
import LineRenderer from "./line-dot-renderer.js";
import PetalRenderer from "./petal-renderer.js";
import { RendererRegistry } from "./renderer-registry.js";

export default class RendererFactory {
    constructor(ctrl) {
        this.ctrl = ctrl;
    }
    create(type) {
        const A = RendererRegistry[type];
        if ( ! A ) 
            throw new Error(`Unknown renderer type: ${type}`);
        return new A(this.cfg);
    }
    init(cfg) {
        this.cfg = cfg; 
        return this.change();
    }
    change() {
        return this.create(this.ctrl.value);
    }
}