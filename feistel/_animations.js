import { isString, isNumeric } from "./functions.js";

class Animation {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
    }
    run(dt) {
        console.error("Must override BaseAnimation.run()");
    }
    to60Fps(s, dt) {
        return s * (dt / 16.67); // normalize to 60fps baseline
    }
}
export class TextSlider extends Animation {
    static type = "textSlider";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        this.msg = event.data;
        this.axis = cfg.axis || "horizontal"; // "horizontal" or "vertical"
        this.speed = cfg.speed;     // sign determines direction
        this.textSz = this.measureText(this.msg);// = Math.floor(this.ctx.measureText(this.msg).width);
        this.setFixed(cfg);
        // Measure width
        // Target centered position
        this.target = this.setTarget(cfg); //Math.floor((this.canvas.width - this.textSz.width) / 2);
        // Decide WHERE to start based on direction
        this.setPosition();
    }
    setFixed(cfg) {
        if ( cfg.x === "mid" ) {
            this.fixed = Math.floor((this.canvas.width - this.textSz.width) / 2);
            return;
        }
        this.fixed = (this.axis === "horizontal" ? cfg.y : cfg.x);
    }
    setPosition() {
        const begin = (this.axis === "horizontal" 
            ? {"size": this.textSz.width, "max": this.canvas.width} //start off-screen left / right
            : {"size": this.textSz.height, "max": this.canvas.height} // start off-screen top/ bottom
        );
        this.position = (this.speed > 0)
            ? 0 - begin.size    // left / top
            : begin.max // right / bottom
    }
    setTarget(cfg) {
        const defaultTrgt = (this.axis === "horizontal"
            ? Math.floor((this.canvas.width - this.textSz.width) / 2)
            : Math.floor((this.canvas.height - this.textSz.height) / 2)
        );
        if  ( ! cfg.stopAt ) 
            return defaultTrgt;

        if ( isNumeric(cfg.stopAt) )
            return parseInt(cfg.stopAt);
        
        const allowed = {
            "left": 0, "top": 0, 
            "mid": defaultTrgt, 
            "bottom": (this.canvas.height - this.textSz.height), 
            "right": (this.canvas.width - this.textSz.width)
        };
        if ( allowed.hasOwnProperty(cfg.stopAt) )
            return allowed[cfg.stopAt];

            return defaultTrgt;
    }
    measureText(txt) {
        const w = Math.floor(this.ctx.measureText(this.msg).width);
        // Measure text height – canvas can't do exact height,
        // but this is a common practical approximation.
        const metrics = this.ctx.measureText(this.msg);
        const h = Math.floor(
            metrics.actualBoundingBoxAscent + 
            metrics.actualBoundingBoxDescent
        );
        return { width: w, height: h};
    }
    draw(x, y) {
        if ( this.axis === "vertical" )
            [x, y] = [y, x];
        this.ctx.fillText(this.msg, x, y);
    }
    run(dt) {
        // Stop at target
        const reached = 
            (this.speed > 0 && this.position >= this.target) ||
            (this.speed < 0 && this.position <= this.target);
        // If done, return early
        if ( reached ) {
            this.position = this.target;
            this.draw(this.position, this.fixed);
            return;
        }
        this.draw(this.position, this.fixed);
        // Move toward target
        const step = this.to60Fps(this.speed, dt);
        this.position += step;
    }
}
