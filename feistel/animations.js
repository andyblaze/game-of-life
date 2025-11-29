import { isString, isNumeric } from "./functions.js";

class Animation {
    constructor(cnvs) {
        this.canvas = cnvs;
        this.ctx = cnvs.getContext("2d");
    }
    run(dt) {
        console.error("Must override BaseAnimation.run()");
    }
    normTo60Fps(s, dt) {
        return s * (dt / 16.67); // normalize to 60fps baseline
    }
}
export class HorizontalTextSlider extends Animation {
    static type = "textSliderH";
    constructor(cnvs, event, cfg) {
        super(cnvs);
        this.msg = event.data;
        this.axis = cfg.axis || "horizontal"; // "horizontal" or "vertical"
        this.speed = cfg.speed;     // sign determines direction
        this.y = cfg.y;
        // Measure width
        this.textSz = this.measureText(this.msg);// = Math.floor(this.ctx.measureText(this.msg).width);
        // Target centered position
        this.targetX = this.setTarget(cfg); //Math.floor((this.canvas.width - this.textSz.width) / 2);
        // Decide WHERE to start based on direction
        this.position = (this.speed > 0)
            ? 0 - this.textSz.width     // start off-screen left
            : this.canvas.width;        // start off-screen right
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
    draw() {
        this.ctx.fillText(this.msg, this.position, this.y);
    }
    run(dt) {
        // Stop at target
        const reached = 
            (this.speed > 0 && this.position >= this.targetX) ||
            (this.speed < 0 && this.position <= this.targetX);
        if ( reached ) {
            this.position = this.targetX;
            this.draw();
            return;
        }
        // Draw
        this.draw();
        // If done, return early
        //if (this.position === this.targetX) return;
        // Move toward target
        const step = this.normTo60Fps(this.speed, dt);
        this.position += step;
    }
}
export class VerticalTextSlider extends Animation {
    static type = "textSliderV";

    constructor(cnvs, event, cfg) {
        super(cnvs);

        this.msg = event.data;
        this.speed = cfg.speed;   // sign determines direction
        this.x = cfg.x;

        // Measure text height – canvas can't do exact height,
        // but this is a common practical approximation.
        const metrics = this.ctx.measureText(this.msg);
        this.textHeight = Math.floor(
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        );

        // Target centered position vertically
        this.targetY = Math.floor((this.canvas.height - this.textHeight) / 2);

        // Decide WHERE to start based on direction
        this.y = (this.speed > 0)
            ? 0 - this.textHeight     // start off-screen top
            : this.canvas.height;     // start off-screen bottom
    }

    run(dt) {
        // Stop at target
        if ((this.speed > 0 && this.y >= this.targetY) ||
            (this.speed < 0 && this.y <= this.targetY)) {
            this.y = this.targetY;
        }

        // Draw
        this.ctx.fillText(this.msg, this.x, this.y);

        // If done, return early
        if (this.y === this.targetY) return;

        // Move toward target using dt-normalized step
        const step = this.normTo60Fps(this.speed, dt);
        this.y += step;
    }
}