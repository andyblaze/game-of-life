import LayoutRegistry from "./layout-registry.js";

export default class Animation {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
        this.layoutRegistered = false;
    }
    run(dt, elapsedTime) {
        console.error("Must override BaseAnimation.run()");
    }
    to60Fps(s, dt) {
        return s * (dt / 16.67); // normalize to 60fps baseline
    }
    measureText(txt) {
        //const w = Math.floor(this.ctx.measureText(txt).width);
        // Measure text height – canvas can't do exact height,
        // but this is a common practical approximation.
        const metrics = this.ctx.measureText(txt);
        const h = Math.floor(
            metrics.actualBoundingBoxAscent + 
            metrics.actualBoundingBoxDescent
        );
        return { width: Math.floor(metrics.width), height: h};
    }
    registerLayout() {
        if ( this.layoutRegistered === true ) return;
        LayoutRegistry.register(this.event.type, this.getBoundingRect());
        this.layoutRegistered = true;
    }
}