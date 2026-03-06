import { lerpHSLAColor, HSLAString } from "./functions.js";

class ColorOverLife {
    constructor(start, end, alpha) {
        this.start = { ...start, a: alpha };
        this.end   = { ...end,   a: alpha };
    }

    update(dt) {
        const c = lerpHSLAColor(this.start, this.end, dt);
        console.log(c, dt);
        return c;
    }
}


export default class Renderer {
    constructor(cfg) { 
        //this.cr = new ColorOverLife(cfg.color_start, cfg.color_end, cfg.alpha);
        this.cfg = cfg;
        this.prev = null;
        this.cfg.ctx.lineWidth = 0.5;          // thin lines for dense patterns
        this.color = cfg.color_start;                     // starting hue
        //this.alpha = cfg.alpha;                      // low alpha to prevent mud
        //this.hueStep = 0.5;                    // hue change per segment
    }

    draw(px, py, dt) {
        if (this.prev) {
            //this.color = this.cr.update(dt);
            const ctx = this.cfg.ctx;

            ctx.beginPath();
            ctx.moveTo(this.prev.x, this.prev.y);
            ctx.lineTo(px, py);

            // HSL rainbow stroke
            ctx.strokeStyle = HSLAString(this.color);
            ctx.stroke();

            // Increment hue for next segment
            //this.baseHue += this.hueStep;
            //if (this.baseHue >= 360) this.baseHue -= 360;
        }
        this.prev = { x: px, y: py };
    }

    reset() {
        this.prev = null;
        this.baseHue = 0;
    }
}
/*class Renderer {
    constructor(cfg) {
        this.cfg = cfg;
        this.prev = null;
        this.cfg.ctx.lineWidth = 0.5;
        this.cfg.ctx.strokeStyle = "#ff0000";
    }
    draw(px, py) {
        if ( this.prev ) {
            this.cfg.ctx.beginPath();
            this.cfg.ctx.moveTo(this.prev.x, this.prev.y);
            this.cfg.ctx.lineTo(px, py);
            this.cfg.ctx.stroke();
        }
        this.prev = { x: px, y: py };
    }
    reset() {
        this.prev = null;
    }
}*/
